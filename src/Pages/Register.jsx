import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaLock, FaImage } from 'react-icons/fa'
import { useAuth } from '../context/AuthProvider'

const Register = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { register, setError, error, isMockAuth } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photoDataUrl: ''
  })

  const [preview, setPreview] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setFormData(prev => ({ ...prev, photoDataUrl: dataUrl }))
      setPreview(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setFormData(prev => ({ ...prev, photoDataUrl: '' }))
    setPreview('')
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    setIsSubmitting(true)
    try {
      await register(formData.name, formData.email, formData.password, formData.photoDataUrl)
      // Small delay to ensure auth state updates
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
      }, 300)
    } catch (err) {
      console.error('Register error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-base-100 to-primary/10 flex items-center justify-center py-12 px-6">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Intro */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block text-center"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Join StyleDecor
          </h1>
          <p className="text-lg text-base-content/70 mb-6">
            Create your account to save projects, book services, and get personalized recommendations.
          </p>
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Happy Clients</div>
              <div className="stat-value text-primary">5K+</div>
              <div className="stat-desc">Trusted nationwide</div>
            </div>
            <div className="stat">
              <div className="stat-title">Services</div>
              <div className="stat-value text-secondary">50+</div>
              <div className="stat-desc">Across all categories</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Register Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body p-8 lg:p-12">
              <h2 className="text-4xl font-bold mb-2 text-center">Create Account</h2>
            
             
              {error && (
                <div className="alert alert-error text-sm mb-4">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-6">
                {/* Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <FaUser className="text-secondary" />
                      Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="input input-bordered bg-base-200 focus:input-secondary transition-all"
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <FaEnvelope className="text-primary" />
                      Email Address
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="input input-bordered bg-base-200 focus:input-primary transition-all"
                  />
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <FaLock className="text-secondary" />
                      Password
                    </span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className="input input-bordered bg-base-200 focus:input-secondary transition-all"
                  />
                </div>

                {/* Profile Image Upload */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <FaImage className="text-accent" />
                      Profile Image (optional)
                    </span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    onChange={handleImageChange}
                  />
                  {preview && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-16 rounded-full ring ring-primary/40 ring-offset-base-100 ring-offset-2">
                          <img src={preview} alt="preview" />
                        </div>
                      </div>
                      <button type="button" onClick={clearImage} className="btn btn-ghost btn-sm">
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Register Button */}
                <button type="submit" className="btn btn-secondary btn-lg w-full font-bold" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating account...' : 'Register'}
                </button>
              </form>

              <div className="text-center mt-8">
                <p className="text-base-content/70">
                  Already have an account?{' '}
                  <Link to="/login" className="link link-primary font-semibold">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register