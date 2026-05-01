import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { loginRequest, registerRequest } from '../api/authApi'

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
  login: async () => {
    throw missingProviderError()
  },
  logout: async () => {},
  register: async () => {
    throw missingProviderError()
  },
  loginWithGoogle: async () => {
    throw new Error('Google login is not configured in this client.')
  },
  loginWithFacebook: async () => {
    throw new Error('Facebook login is not configured in this client.')
  },
  refreshMe: async () => null,
  isMockAuth: false,
}

const AuthContext = createContext(defaultAuthValue)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
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

  const clearAuth = () => {
    setUser(null)
    setRole(null)
    setToken(null)
    setError(null)
    clearStoredAuth()
  }

  const refreshMe = async (overrideToken) => {
    const activeToken = overrideToken || getStoredToken()
    if (!activeToken) return null

    const response = await axiosInstance.get('/auth/me', {
      headers: { Authorization: `Bearer ${activeToken}` },
    })

    const normalizedUser = normalizeMePayload(response?.data)
    if (!normalizedUser) return null

    setUser(normalizedUser)
    const normalizedRole = normalizeRole(normalizedUser?.role)
    setRole(normalizedRole)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(normalizedUser))
      if (normalizedRole) window.localStorage.setItem(STORAGE_KEYS.role, normalizedRole)
    }
    return normalizedUser
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onUnauthorized = () => {
      clearAuth()
      setLoading(false)
    }
    window.addEventListener('auth:unauthorized', onUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized)
  }, [])

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
    return () => {
      cancelled = true
    }
  }, [])

  const login = async (email, password) => {
    setError(null)
    const loginRes = await loginRequest(email, password)
    const jwt = loginRes?.token || loginRes?.accessToken || loginRes?.jwt
    if (!jwt) {
      throw new Error('Login failed: token missing')
    }
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
  }

  const register = async (name, email, password, photoUrl) => {
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
  }

  const logout = async () => {
    clearAuth()
  }

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
      loginWithGoogle: defaultAuthValue.loginWithGoogle,
      loginWithFacebook: defaultAuthValue.loginWithFacebook,
      refreshMe,
      isMockAuth: false,
    }),
    [user, role, token, loading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export default AuthProvider;