import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaEnvelope, FaLock, FaUser, FaPhone, FaLink, FaInfoCircle } from 'react-icons/fa'
import { registerRequest, applyDecoratorRequest } from '../api/authApi'
import { useAuth } from '../context/AuthProvider'

const initialForms = {
  userLogin: { email: '', password: '' },
  userRegister: { name: '', email: '', password: '', photoUrl: '' },
  decoratorApply: { name: '', email: '', phone: '', experience: '', portfolio: '', bio: '' }
}

const Auth = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, refreshMe, role } = useAuth()
  const [isUserRegister, setIsUserRegister] = useState(false)
  const [isDecoratorApply, setIsDecoratorApply] = useState(false)
  const [forms, setForms] = useState(initialForms)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userPreview, setUserPreview] = useState('')

  const resetModes = () => {
    setForms(initialForms)
    setError('')
    setUserPreview('')
  }

  useEffect(() => {
    if (!isUserRegister) setUserPreview('')
  }, [isUserRegister])

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

  const handleUserPhotoUrlChange = (value) => {
    setForms((prev) => ({
      ...prev,
      userRegister: {
        ...prev.userRegister,
        photoUrl: value
      }
    }))
    setUserPreview(value || '')
    setError('')
  }

  const clearUserPhoto = () => {
    setForms((prev) => ({
      ...prev,
      userRegister: { ...prev.userRegister, photoUrl: '' }
    }))
    setUserPreview('')
  }

  const dashboardPathByRole = (r) => {
    if (r === 'admin') return '/dashboard/admin'
    if (r === 'decorator') return '/dashboard/decorator'
    return '/dashboard/user'
  }

  const requiredRoleFromPath = (path) => {
    if (!path) return null
    if (path.startsWith('/dashboard/admin')) return 'admin'
    if (path.startsWith('/dashboard/decorator')) return 'decorator'
    if (path.startsWith('/dashboard/user')) return 'user'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
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
        return
      }

      if (isUserRegister) {
        const { name, email, password } = forms.userRegister
        if (!name || !email || !password) throw new Error('All fields are required')
        await registerRequest({ name, email, password, photoUrl: forms.userRegister.photoUrl })
        await login(email, password)
        const me = await refreshMe()
        navigate(dashboardPathByRole(me?.role || role || 'user'), { replace: true })
        return
      }

      const { email, password } = forms.userLogin
      if (!email || !password) throw new Error('Email and password are required')
      await login(email, password)
      const me = await refreshMe()
      const resolvedRole = me?.role || role

      const from = location.state?.from?.pathname
      const requiredRole = requiredRoleFromPath(from)
      if (requiredRole && resolvedRole && requiredRole !== resolvedRole) {
        navigate('/unauthorized', {
          replace: true,
          state: { requiredRole, actualRole: resolvedRole, from: location.state?.from }
        })
        return
      }

      if (from) {
        navigate(from, { replace: true })
        return
      }

      navigate(dashboardPathByRole(resolvedRole || 'user'), { replace: true })
      return
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Something went wrong'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const currentFormKey = useMemo(() => {
    if (isDecoratorApply) return 'decoratorApply'
    if (isUserRegister) return 'userRegister'
    return 'userLogin'
  }, [isUserRegister, isDecoratorApply])

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
              autoComplete="current-password"
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
          <label className="form-control w-full">
            <span className="label-text font-semibold flex items-center gap-2"><FaLink className="text-accent" /> Photo URL (optional)</span>
            <input
              type="url"
              value={form.photoUrl}
              onChange={(e) => handleUserPhotoUrlChange(e.target.value)}
              className={inputClass}
              disabled={loading}
              placeholder="https://your-photo.jpg"
              autoComplete="off"
            />
          </label>
          {userPreview && (
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-16 rounded-full ring ring-primary/40 ring-offset-base-100 ring-offset-2">
                  <img src={userPreview} alt="preview" />
                </div>
              </div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={clearUserPhoto} disabled={loading}>Remove</button>
            </div>
          )}
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

  const heading = isDecoratorApply ? 'Apply as Decorator' : isUserRegister ? 'Create your account' : 'Login'

  const primaryCta = isDecoratorApply ? 'Apply as Decorator' : isUserRegister ? 'Register' : 'Login'

  const toggleCta = isDecoratorApply
    ? 'Back to Login'
    : isUserRegister
      ? 'Already have an account? Login'
      : "Don't have an account? Register"

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-base-100 shadow-2xl border border-base-300 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-base-200 bg-linear-to-br from-primary/5 via-base-100 to-secondary/10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-lg bg-base-100 border border-base-300">
                  <p className="font-semibold">👤 User</p>
                  <p className="text-xs text-base-content/60">Book decorations</p>
                </div>
                <div className="p-3 rounded-lg bg-base-100 border border-base-300">
                  <p className="font-semibold">🎨 Decorator</p>
                  <p className="text-xs text-base-content/60">Manage services</p>
                </div>
                <div className="p-3 rounded-lg bg-base-100 border border-base-300">
                  <p className="font-semibold">🛠 Admin</p>
                  <p className="text-xs text-base-content/60">System control</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2">{heading}</h2>
              <p className="text-base-content/70 mb-6">
                {isDecoratorApply
                  ? 'Submit your application to become a decorator.'
                  : isUserRegister
                    ? 'Create a new user account.'
                    : 'Login to your account.'}
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
                    if (isDecoratorApply) {
                      setIsDecoratorApply(false)
                      setIsUserRegister(false)
                      resetModes()
                      return
                    }
                    setIsDecoratorApply(false)
                    setIsUserRegister((p) => !p)
                    resetModes()
                  }}
                  disabled={loading}
                >
                  {toggleCta}
                </button>
              )}

              {!isDecoratorApply && (
                <button
                  className="btn btn-ghost btn-sm mt-1"
                  onClick={() => {
                    setIsUserRegister(false)
                    setIsDecoratorApply(true)
                    resetModes()
                  }}
                  disabled={loading}
                >
                  Want to become a decorator? Apply
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
