import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaUser, FaPhone, FaLink, FaInfoCircle } from 'react-icons/fa'
import { loginRequest, registerRequest, applyDecoratorRequest } from '../api/authApi'

const TABS = ['admin', 'user', 'decorator']

const initialForms = {
  admin: { email: '', password: '' },
  userLogin: { email: '', password: '' },
  userRegister: { name: '', email: '', password: '' },
  decoratorLogin: { email: '', password: '' },
  decoratorApply: { name: '', email: '', phone: '', experience: '', portfolio: '', bio: '' }
}

const Auth = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('admin')
  const [isUserRegister, setIsUserRegister] = useState(false)
  const [isDecoratorApply, setIsDecoratorApply] = useState(false)
  const [forms, setForms] = useState(initialForms)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // reset form and mode when tab changes
  useEffect(() => {
    setForms(initialForms)
    setError('')
    setIsUserRegister(false)
    setIsDecoratorApply(false)
  }, [activeTab])

  const handleChange = (formKey, field, value) => {
    setForms((prev) => ({
      ...prev,
      [formKey]: {
        ...prev[formKey],
        [field]: value
      }
    }))
    setError('')
  }

  const saveAuth = (data) => {
    const { token, role, user } = data || {}
    if (token) localStorage.setItem('authToken', token)
    if (role) localStorage.setItem('role', role)
    if (user) localStorage.setItem('user', JSON.stringify(user))
  }

  const redirectByRole = (role) => {
    if (role === 'admin') return navigate('/admin/dashboard', { replace: true })
    if (role === 'decorator') return navigate('/decorator/dashboard', { replace: true })
    return navigate('/dashboard', { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (activeTab === 'admin') {
        const { email, password } = forms.admin
        if (!email || !password) throw new Error('Email and password are required')
        const res = await loginRequest(email, password)
        saveAuth(res)
        redirectByRole(res.role || 'admin')
        return
      }

      if (activeTab === 'user') {
        if (isUserRegister) {
          const { name, email, password } = forms.userRegister
          if (!name || !email || !password) throw new Error('All fields are required')
          await registerRequest({ name, email, password })
          const loginRes = await loginRequest(email, password)
          saveAuth(loginRes)
          redirectByRole(loginRes.role || 'user')
        } else {
          const { email, password } = forms.userLogin
          if (!email || !password) throw new Error('Email and password are required')
          const res = await loginRequest(email, password)
          saveAuth(res)
          redirectByRole(res.role || 'user')
        }
        return
      }

      if (activeTab === 'decorator') {
        if (isDecoratorApply) {
          const { name, email, phone, experience, portfolio, bio } = forms.decoratorApply
          if (!name || !email || !phone || !experience || !bio) throw new Error('Please fill all required fields')
          await applyDecoratorRequest({
            name,
            email,
            phone,
            experience,
            portfolio,
            bio
          })
          setError('Application submitted. We will review and get back to you.')
          setIsDecoratorApply(false)
        } else {
          const { email, password } = forms.decoratorLogin
          if (!email || !password) throw new Error('Email and password are required')
          const res = await loginRequest(email, password)
          saveAuth(res)
          redirectByRole(res.role || 'decorator')
        }
        return
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Something went wrong'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const currentFormKey = useMemo(() => {
    if (activeTab === 'admin') return 'admin'
    if (activeTab === 'user') return isUserRegister ? 'userRegister' : 'userLogin'
    return isDecoratorApply ? 'decoratorApply' : 'decoratorLogin'
  }, [activeTab, isUserRegister, isDecoratorApply])

  const renderFields = () => {
    const form = forms[currentFormKey]
    const inputClass = 'input input-bordered bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all'

    if (currentFormKey === 'admin' || currentFormKey === 'userLogin' || currentFormKey === 'decoratorLogin') {
      return (
        <>
          <label className="form-control w-full">
            <span className="label-text font-semibold flex items-center gap-2"><FaEnvelope className="text-primary" /> Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange(currentFormKey, 'email', e.target.value)}
              className={inputClass}
              disabled={loading}
              autoComplete="email"
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text font-semibold flex items-center gap-2"><FaLock className="text-secondary" /> Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange(currentFormKey, 'password', e.target.value)}
              className={inputClass}
              disabled={loading}
              autoComplete={activeTab === 'admin' ? 'current-password' : 'password'}
            />
          </label>
        </>
      )
    }

    if (currentFormKey === 'userRegister') {
      return (
        <>
          <label className="form-control w-full">
            <span className="label-text font-semibold flex items-center gap-2"><FaUser className="text-primary" /> Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange(currentFormKey, 'name', e.target.value)}
              className={inputClass}
              disabled={loading}
              autoComplete="name"
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text font-semibold flex items-center gap-2"><FaEnvelope className="text-primary" /> Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange(currentFormKey, 'email', e.target.value)}
              className={inputClass}
              disabled={loading}
              autoComplete="email"
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text font-semibold flex items-center gap-2"><FaLock className="text-secondary" /> Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange(currentFormKey, 'password', e.target.value)}
              className={inputClass}
              disabled={loading}
              autoComplete="new-password"
            />
          </label>
        </>
      )
    }

    // decorator apply
    return (
      <>
        <label className="form-control w-full">
          <span className="label-text font-semibold flex items-center gap-2"><FaUser className="text-primary" /> Full Name</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange(currentFormKey, 'name', e.target.value)}
            className={inputClass}
            disabled={loading}
            autoComplete="name"
          />
        </label>
        <label className="form-control w-full">
          <span className="label-text font-semibold flex items-center gap-2"><FaEnvelope className="text-primary" /> Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange(currentFormKey, 'email', e.target.value)}
            className={inputClass}
            disabled={loading}
            autoComplete="email"
          />
        </label>
        <label className="form-control w-full">
          <span className="label-text font-semibold flex items-center gap-2"><FaPhone className="text-secondary" /> Phone</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange(currentFormKey, 'phone', e.target.value)}
            className={inputClass}
            disabled={loading}
            autoComplete="tel"
          />
        </label>
        <label className="form-control w-full">
          <span className="label-text font-semibold flex items-center gap-2"><FaInfoCircle className="text-primary" /> Years of Experience</span>
          <input
            type="number"
            min="0"
            value={form.experience}
            onChange={(e) => handleChange(currentFormKey, 'experience', e.target.value)}
            className={inputClass}
            disabled={loading}
          />
        </label>
        <label className="form-control w-full">
          <span className="label-text font-semibold flex items-center gap-2"><FaLink className="text-accent" /> Portfolio (optional)</span>
          <input
            type="url"
            value={form.portfolio}
            onChange={(e) => handleChange(currentFormKey, 'portfolio', e.target.value)}
            className={inputClass}
            disabled={loading}
            placeholder="https://"
          />
        </label>
        <label className="form-control w-full">
          <span className="label-text font-semibold flex items-center gap-2"><FaInfoCircle className="text-primary" /> Short Bio</span>
          <textarea
            value={form.bio}
            onChange={(e) => handleChange(currentFormKey, 'bio', e.target.value)}
            className="textarea textarea-bordered bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all"
            rows={3}
            disabled={loading}
          ></textarea>
        </label>
      </>
    )
  }

  const heading = activeTab === 'admin'
    ? 'Admin Login'
    : activeTab === 'user'
      ? isUserRegister ? 'Create your account' : 'User Login'
      : isDecoratorApply ? 'Apply as Decorator' : 'Decorator Login'

  const primaryCta = activeTab === 'admin'
    ? 'Login as Admin'
    : activeTab === 'user'
      ? isUserRegister ? 'Register' : 'Login'
      : isDecoratorApply ? 'Apply as Decorator' : 'Login as Decorator'

  const toggleCta = activeTab === 'user'
    ? isUserRegister ? 'Already have an account? Login' : "Don't have an account? Register"
    : activeTab === 'decorator'
      ? isDecoratorApply ? 'Already a decorator? Login' : 'Want to become a decorator? Apply'
      : ''

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-base-100 shadow-2xl border border-base-300 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-base-200 bg-gradient-to-br from-primary/5 via-base-100 to-secondary/10">
              <div className="flex gap-2 mb-6">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
                    disabled={loading}
                  >
                    {tab === 'admin' && 'Admin'}
                    {tab === 'user' && 'User'}
                    {tab === 'decorator' && 'Decorator'}
                  </button>
                ))}
              </div>

              <h2 className="text-3xl font-bold mb-2">{heading}</h2>
              <p className="text-base-content/70 mb-6">
                {activeTab === 'admin' && 'Admins can only login with their issued credentials.'}
                {activeTab === 'user' && (isUserRegister ? 'Create a new user account.' : 'Login to your user account.')}
                {activeTab === 'decorator' && (isDecoratorApply ? 'Submit your application to become a decorator.' : 'Login to your decorator account.')}
              </p>

              {error && (
                <div className="alert alert-error text-sm mb-4">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">{
                  <motion.div
                    key={currentFormKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {renderFields()}
                  </motion.div>
                }</AnimatePresence>

                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? 'Please wait…' : primaryCta}
                </button>
              </form>

              {toggleCta && (
                <button
                  className="btn btn-ghost btn-sm mt-3"
                  onClick={() => {
                    if (activeTab === 'user') setIsUserRegister((p) => !p)
                    if (activeTab === 'decorator') setIsDecoratorApply((p) => !p)
                  }}
                  disabled={loading}
                >
                  {toggleCta}
                </button>
              )}
            </div>

            <div className="p-8 lg:p-10 bg-base-100 hidden lg:flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-3">Role-based access</h3>
                <p className="text-base-content/70">
                  Roles are assigned by the backend. Admins are pre-created. Decorators can apply and will be approved by admins. Users can register freely.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 mt-6">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="font-semibold">Admin</p>
                  <p className="text-sm text-base-content/70">System control. No self-signup.</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                  <p className="font-semibold">Decorator</p>
                  <p className="text-sm text-base-content/70">Apply or login if approved.</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="font-semibold">User</p>
                  <p className="text-sm text-base-content/70">Register or login to book services.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Auth
