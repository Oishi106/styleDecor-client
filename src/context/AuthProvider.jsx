import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import app, { auth, googleProvider, facebookProvider, firebaseReady } from '../lib/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup, signOut } from 'firebase/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (firebaseReady && auth) {
      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u)
        setLoading(false)
      })
      return () => unsub()
    }
    // Mock mode: no Firebase, finish loading immediately
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    setError(null)
    try {
      if (firebaseReady && auth) {
        const result = await signInWithEmailAndPassword(auth, email, password)
        setUser(result.user)
        return result
      }
      // Mock login: accept anything and set a fake user
      const mockUser = { uid: 'mock-' + Math.random().toString(36).slice(2), email, displayName: 'User', providerData: [{ providerId: 'password' }] }
      setUser(mockUser)
      return { user: mockUser }
    } catch (err) {
      setError(err.message || 'Login failed')
      throw err
    }
  }

  const register = async (name, email, password, photoDataUrl) => {
    setError(null)
    try {
      if (firebaseReady && auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        if (name || photoDataUrl) {
          await updateProfile(cred.user, {
            displayName: name || 'User',
            photoURL: photoDataUrl || null,
          })
          // Refresh to get updated profile
          await cred.user.reload()
        }
        setUser(cred.user)
        return cred.user
      }
      // Mock register
      const mockUser = {
        uid: 'mock-' + Math.random().toString(36).slice(2),
        email,
        displayName: name || 'User',
        photoURL: photoDataUrl || null,
        providerData: [{ providerId: 'password' }],
      }
      setUser(mockUser)
      return mockUser
    } catch (err) {
      setError(err.message || 'Registration failed')
      throw err
    }
  }

  const loginWithGoogle = async () => {
    setError(null)
    try {
      if (firebaseReady && auth && googleProvider) {
        const result = await signInWithPopup(auth, googleProvider)
        setUser(result.user)
        return result
      }
      // Mock mode: Create demo Google user
      const mockGoogleUser = {
        uid: 'mock-google-' + Math.random().toString(36).slice(2),
        email: 'demo.google@styledecor.com',
        displayName: 'Google Demo User',
        photoURL: 'https://via.placeholder.com/150',
        providerData: [{ providerId: 'google.com' }],
      }
      setUser(mockGoogleUser)
      return { user: mockGoogleUser }
    } catch (err) {
      setError(err.message || 'Google login failed')
      throw err
    }
  }

  const loginWithFacebook = async () => {
    setError(null)
    try {
      if (firebaseReady && auth && facebookProvider) {
        const result = await signInWithPopup(auth, facebookProvider)
        setUser(result.user)
        return result
      }
      // Mock mode: Create demo Facebook user
      const mockFBUser = {
        uid: 'mock-fb-' + Math.random().toString(36).slice(2),
        email: 'demo.facebook@styledecor.com',
        displayName: 'Facebook Demo User',
        photoURL: 'https://via.placeholder.com/150',
        providerData: [{ providerId: 'facebook.com' }],
      }
      setUser(mockFBUser)
      return { user: mockFBUser }
    } catch (err) {
      setError(err.message || 'Facebook login failed')
      throw err
    }
  }

  const logout = () => {
    setError(null)
    if (firebaseReady && auth) return signOut(auth)
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, loading, error, setError, login, register, loginWithGoogle, loginWithFacebook, logout, isMockAuth: !firebaseReady }),
    [user, loading, error]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
