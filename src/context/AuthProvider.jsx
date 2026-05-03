import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { loginRequest, registerRequest } from '../api/authApi'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider, facebookProvider } from '../firebase/firebase.config'

const STORAGE_KEYS = {
  token: 'token',
  role: 'role',
  user: 'user',
}

const safeJsonParse = (value) => {
  if (!value) return null
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

const getStoredToken = () => {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(STORAGE_KEYS.token)
}

const clearStoredAuth = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEYS.token)
  window.localStorage.removeItem(STORAGE_KEYS.role)
  window.localStorage.removeItem(STORAGE_KEYS.user)
}

const normalizeRole = (value) => (value ? String(value).toLowerCase() : null)

const decodeJwtPayload = (jwt) => {
  if (!jwt || typeof jwt !== 'string') return null
  const parts = jwt.split('.')
  if (parts.length < 2) return null
  try {
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = atob(padded)
    return JSON.parse(json)
  } catch {
    return null
  }
}

const deriveUserFromToken = (jwt, fallbackEmail) => {
  const payload = decodeJwtPayload(jwt)
  const email = payload?.email || payload?.user?.email || payload?.sub || fallbackEmail || null
  const role = normalizeRole(payload?.role || payload?.user?.role || payload?.userRole)
  if (!email && !role) return null
  return {
    email,
    ...(role ? { role } : {}),
  }
}

const normalizeMePayload = (payload) => {
  const me = payload?.user ?? payload?.me ?? payload ?? null
  if (!me || typeof me !== 'object') return null
  const role = normalizeRole(me?.role)
  return role ? { ...me, role } : me
}

const missingProviderError = () => new Error('AuthProvider is not mounted')

const defaultAuthValue = {
  user: null,
  role: null,
  token: null,
  loading: false,
  error: null,
  setError: () => {},
  setUser: () => {},
  setToken: () => {},
  login: async () => { throw missingProviderError() },
  logout: async () => {},
  register: async () => { throw missingProviderError() },
  loginWithGoogle: async () => { throw new Error('Google login is not configured in this client.') },
  loginWithFacebook: async () => { throw new Error('Facebook login is not configured in this client.') },
  refreshMe: async () => null,
  isMockAuth: false,
}

const AuthContext = createContext(defaultAuthValue)

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    if (typeof window === 'undefined') return null
    return safeJsonParse(window.localStorage.getItem(STORAGE_KEYS.user))
  })
  const [role, setRole] = useState(() => {
    if (typeof window === 'undefined') return null
    return normalizeRole(window.localStorage.getItem(STORAGE_KEYS.role))
  })
  const [token, setToken] = useState(() => getStoredToken())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const setUser = useCallback((nextUser) => {
    setUserState(nextUser)
    if (typeof window === 'undefined') return
    if (nextUser) {
      window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser))
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.user)
      window.localStorage.removeItem(STORAGE_KEYS.role)
    }
  }, [])

  const clearAuth = useCallback(() => {
    setUser(null)
    setRole(null)
    setToken(null)
    setError(null)
    clearStoredAuth()
  }, [setUser])

  const refreshMe = useCallback(async (overrideToken) => {
    const activeToken = overrideToken || getStoredToken()
    if (!activeToken) return null

    const response = await axiosInstance.get('/auth/me', {
      headers: { Authorization: `Bearer ${activeToken}` },
    })

    const normalizedUser = normalizeMePayload(response?.data)
    if (!normalizedUser) return null

    const storedUser = typeof window !== 'undefined'
      ? safeJsonParse(window.localStorage.getItem(STORAGE_KEYS.user))
      : null

    const mergedUser = storedUser ? {
      ...normalizedUser,
      name: storedUser?.name || normalizedUser?.name,
      displayName: storedUser?.displayName || normalizedUser?.displayName,
      fullName: storedUser?.fullName || normalizedUser?.fullName,
      photoURL: storedUser?.photoURL || normalizedUser?.photoURL,
      photoUrl: storedUser?.photoUrl || normalizedUser?.photoUrl,
      avatarUrl: storedUser?.avatarUrl || normalizedUser?.avatarUrl,
    } : normalizedUser

    setUser(mergedUser)
    const normalizedRole = normalizeRole(normalizedUser?.role)
    setRole(normalizedRole)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(mergedUser))
      if (normalizedRole) window.localStorage.setItem(STORAGE_KEYS.role, normalizedRole)
    }
    return mergedUser
  }, [setUser])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onUnauthorized = () => {
      clearAuth()
      setLoading(false)
    }
    window.addEventListener('auth:unauthorized', onUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized)
  }, [clearAuth])

  useEffect(() => {
    let cancelled = false
    const bootstrap = async () => {
      setLoading(true)
      setError(null)
      const storedToken = getStoredToken()
      if (!storedToken) {
        if (!cancelled) setLoading(false)
        return
      }

      try {
        await refreshMe(storedToken)
      } catch (err) {
        const status = err?.response?.status
        if (status === 401 || status === 403) {
          clearAuth()
        } else {
          const derived = deriveUserFromToken(storedToken)
          if (derived) {
            setUser(derived)
            setRole(normalizeRole(derived.role))
          } else {
            setUser(null)
            setRole(null)
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    bootstrap()
    return () => { cancelled = true }
  }, [clearAuth, refreshMe, setUser])

  const login = useCallback(async (email, password) => {
    setError(null)
    const loginRes = await loginRequest(email, password)
    const jwt = loginRes?.token || loginRes?.accessToken || loginRes?.jwt
    if (!jwt) throw new Error('Login failed: token missing')

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.token, jwt)
    }
    setToken(jwt)

    try {
      await refreshMe(jwt)
    } catch (err) {
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        clearAuth()
        throw err
      }
      const derived = deriveUserFromToken(jwt, email)
      if (derived) {
        setUser(derived)
        setRole(normalizeRole(derived.role))
      }
    }
    return loginRes
  }, [refreshMe, clearAuth, setUser])

  const register = useCallback(async (name, email, password, photoUrl) => {
    setError(null)
    const res = await registerRequest({ name, email, password, photoUrl })
    const jwt = res?.token || res?.accessToken || res?.jwt
    if (jwt) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEYS.token, jwt)
      }
      setToken(jwt)
      try {
        await refreshMe(jwt)
      } catch (err) {
        console.warn('Register succeeded but /auth/me failed', err)
      }
    }
    return res
  }, [refreshMe])

  const logout = useCallback(async () => {
    try {
      await signOut(auth)
    } catch {
      // Firebase signout error হলেও local auth clear করো
    }
    clearAuth()
  }, [clearAuth])

  // ✅ FIXED: Google login এখন Backend থেকে JWT নেয়
  const loginWithGoogle = useCallback(async () => {
    setError(null)
    const result = await signInWithPopup(auth, googleProvider)
    const firebaseUser = result?.user
    if (!firebaseUser) throw new Error('Google login failed')

    try {
      // Step 1: Backend থেকে JWT নাও
      const res = await axiosInstance.post('/auth/jwt', {
        email: firebaseUser.email,
      })
      const jwt = res?.data?.token

      if (jwt) {
        // Step 2: Token save করো
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEYS.token, jwt)
        }
        setToken(jwt)

        // Step 3: /auth/me দিয়ে user ও role set করো
        try {
          await refreshMe(jwt)
        } catch {
          // /auth/me fail করলে token থেকে derive করো
          const derived = deriveUserFromToken(jwt, firebaseUser.email)
          if (derived) {
            setUser(derived)
            setRole(normalizeRole(derived.role))
          }
        }
      } else {
        // JWT না পেলে fallback (token ছাড়া)
        _setGoogleFallbackUser(firebaseUser)
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        // Backend এ user নেই → আগে register করো, তারপর JWT নাও
        try {
          await axiosInstance.post('/users', {
            name: firebaseUser.displayName || '',
            email: firebaseUser.email,
            photoUrl: firebaseUser.photoURL || '',
            role: 'user',
          })

          const res2 = await axiosInstance.post('/auth/jwt', {
            email: firebaseUser.email,
          })
          const jwt2 = res2?.data?.token

          if (jwt2) {
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(STORAGE_KEYS.token, jwt2)
            }
            setToken(jwt2)
            try {
              await refreshMe(jwt2)
            } catch {
              const derived = deriveUserFromToken(jwt2, firebaseUser.email)
              if (derived) {
                setUser(derived)
                setRole(normalizeRole(derived.role))
              }
            }
          } else {
            _setGoogleFallbackUser(firebaseUser)
          }
        } catch {
          // Register বা JWT সব fail করলে fallback
          _setGoogleFallbackUser(firebaseUser)
        }
      } else {
        // অন্য error এ fallback
        _setGoogleFallbackUser(firebaseUser)
      }
    }

    return result

    function _setGoogleFallbackUser(fbUser) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEYS.token)
        window.localStorage.setItem(STORAGE_KEYS.role, 'user')
      }
      setToken(null)
      setRole('user')
      setUser({
        uid: fbUser.uid,
        email: fbUser.email || '',
        name: fbUser.displayName || '',
        photoUrl: fbUser.photoURL || '',
        role: 'user',
        provider: 'google',
      })
    }
  }, [setUser, refreshMe])

  // ✅ FIXED: Facebook login এও একই pattern
  const loginWithFacebook = useCallback(async () => {
    setError(null)
    const result = await signInWithPopup(auth, facebookProvider)
    const firebaseUser = result?.user
    if (!firebaseUser) throw new Error('Facebook login failed')

    try {
      const res = await axiosInstance.post('/auth/jwt', {
        email: firebaseUser.email,
      })
      const jwt = res?.data?.token

      if (jwt) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEYS.token, jwt)
        }
        setToken(jwt)
        try {
          await refreshMe(jwt)
        } catch {
          const derived = deriveUserFromToken(jwt, firebaseUser.email)
          if (derived) {
            setUser(derived)
            setRole(normalizeRole(derived.role))
          }
        }
      } else {
        _setFacebookFallbackUser(firebaseUser)
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        try {
          await axiosInstance.post('/users', {
            name: firebaseUser.displayName || '',
            email: firebaseUser.email,
            photoUrl: firebaseUser.photoURL || '',
            role: 'user',
          })
          const res2 = await axiosInstance.post('/auth/jwt', {
            email: firebaseUser.email,
          })
          const jwt2 = res2?.data?.token
          if (jwt2) {
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(STORAGE_KEYS.token, jwt2)
            }
            setToken(jwt2)
            try {
              await refreshMe(jwt2)
            } catch {
              const derived = deriveUserFromToken(jwt2, firebaseUser.email)
              if (derived) {
                setUser(derived)
                setRole(normalizeRole(derived.role))
              }
            }
          } else {
            _setFacebookFallbackUser(firebaseUser)
          }
        } catch {
          _setFacebookFallbackUser(firebaseUser)
        }
      } else {
        _setFacebookFallbackUser(firebaseUser)
      }
    }

    return result

    function _setFacebookFallbackUser(fbUser) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEYS.token)
        window.localStorage.setItem(STORAGE_KEYS.role, 'user')
      }
      setToken(null)
      setRole('user')
      setUser({
        uid: fbUser.uid,
        email: fbUser.email || '',
        name: fbUser.displayName || '',
        photoUrl: fbUser.photoURL || '',
        role: 'user',
        provider: 'facebook',
      })
    }
  }, [setUser, refreshMe])

  const value = useMemo(
    () => ({
      user,
      role,
      token,
      loading,
      error,
      setError,
      setUser,
      setToken,
      login,
      logout,
      register,
      loginWithGoogle,
      loginWithFacebook,
      refreshMe,
      isMockAuth: false,
    }),
    [user, role, token, loading, error, login, logout, register, loginWithGoogle, loginWithFacebook, refreshMe, setUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export default AuthProvider