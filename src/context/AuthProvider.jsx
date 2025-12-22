import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { loginRequest } from '../api/authApi'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('token') : null))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const role = user?.role ? String(user.role).toLowerCase() : null

  const clearAuth = () => {
    setUser(null)
    setToken(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  const refreshMe = async () => {
    if (!localStorage.getItem('token')) return null
    const res = await axiosInstance.get('/users/me')
  const me = res?.data?.user ?? res?.data ?? null
  if (!me) {
    setUser(null)
    return null
  }
  const normalizedRole = me?.role ? String(me.role).toLowerCase() : null
  const normalizedUser = normalizedRole ? { ...me, role: normalizedRole } : me
  setUser(normalizedUser)
  return normalizedUser
  }

  // Load user from persisted token
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        await refreshMe()
      } catch (err) {
        console.error('Failed to load user from token', err)
        clearAuth()
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [token])

  const login = async (email, password) => {
    setError(null)
    try {
      const loginRes = await loginRequest(email, password)
      const jwt = loginRes?.token || loginRes?.accessToken || loginRes?.jwt
      if (!jwt) throw new Error('Login failed: token missing')
      localStorage.setItem('token', jwt)
      setToken(jwt)
      await refreshMe()
      return loginRes
    } catch (err) {
      setError(err.message || 'Login failed')
      throw err
    }
  }

  const logout = async () => {
    setError(null)
    clearAuth()
  }

  const value = useMemo(
    () => ({ user, role, token, loading, error, setError, setUser, setToken, login, logout, refreshMe }),
    [user, role, token, loading, error]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
