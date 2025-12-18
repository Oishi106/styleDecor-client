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
    if (firebaseReady && auth) {
      return signInWithEmailAndPassword(auth, email, password)
    }
    // Mock login: accept anything and set a fake user
    const mockUser = { uid: 'mock-' + Math.random().toString(36).slice(2), email, providerData: [{ providerId: 'password' }] }
    setUser(mockUser)
    return mockUser
  }

  const register = async (name, email, password, photoDataUrl) => {
    setError(null)
    if (firebaseReady && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (name || photoDataUrl) {
        await updateProfile(cred.user, {
          displayName: name || null,
          photoURL: photoDataUrl || null,
        })
      }
      // Ensure context user is updated with latest profile
      setUser({ ...auth.currentUser })
      return cred.user
    }
    // Mock register
    const mockUser = {
      uid: 'mock-' + Math.random().toString(36).slice(2),
      email,
      displayName: name || 'Mock User',
      photoURL: photoDataUrl || null,
      providerData: [{ providerId: 'password' }],
    }
    setUser(mockUser)
    return mockUser
  }

  const loginWithGoogle = async () => {
    setError(null)
    if (firebaseReady && auth && googleProvider) {
      return signInWithPopup(auth, googleProvider)
    }
    throw new Error('Google login requires Firebase configuration')
  }

  const loginWithFacebook = async () => {
    setError(null)
    if (firebaseReady && auth && facebookProvider) {
      return signInWithPopup(auth, facebookProvider)
    }
    const mockUser = { uid: 'mock-' + Math.random().toString(36).slice(2), email: 'mock.fb@example.com', displayName: 'Mock Facebook User', providerData: [{ providerId: 'facebook.com' }] }
    setUser(mockUser)
    return mockUser
  }

  const logout = () => {
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
