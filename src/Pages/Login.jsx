import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAuth } from '../context/AuthProvider'
import { storeUserInDatabase } from '../api/userApi'

const Login = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { login, loginWithGoogle, loginWithFacebook, error, isMockAuth } = useAuth()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [localError, setLocalError] = useState('')
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	})

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value
		}))
		setLocalError('')
	}

	const validateEmail = (email) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return regex.test(email)
	}

	const handleLogin = async (e) => {
		e.preventDefault()
		setLocalError('')

		// Validation
		if (!formData.email || !formData.password) {
			setLocalError('Please fill in all fields')
			return
		}

		if (!validateEmail(formData.email)) {
			setLocalError('Please enter a valid email address')
			return
		}

		if (formData.password.length < 6) {
			setLocalError('Password must be at least 6 characters')
			return
		}

		setIsSubmitting(true)
		try {
			await login(formData.email, formData.password)
			
			// Store user info in database
			const userData = {
				email: formData.email,
				lastLogin: new Date().toISOString()
			}
			try {
				await storeUserInDatabase(userData)
			} catch (dbError) {
				console.warn('Failed to store user in database:', dbError)
				// Continue with login even if database storage fails
			}
			
			// Small delay to ensure auth state updates
			setTimeout(() => {
				const from = location.state?.from?.pathname || '/'
				navigate(from, { replace: true })
			}, 300)
		} catch (err) {
			setLocalError(err.message || 'Login failed. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleSocialLogin = async (provider) => {
		setLocalError('')
		setIsSubmitting(true)
		try {
			let result
			if (provider === 'Google') {
				result = await loginWithGoogle()
			} else if (provider === 'Facebook') {
				result = await loginWithFacebook()
			}

			if (result && result.user) {
				// Store user info in database
				const userData = {
					name: result.user.displayName || '',
					email: result.user.email || '',
					photoUrl: result.user.photoURL || '',
					lastLogin: new Date().toISOString(),
					provider: provider.toLowerCase()
				}
				try {
					await storeUserInDatabase(userData)
				} catch (dbError) {
					console.warn('Failed to store user in database:', dbError)
					// Continue with login even if database storage fails
				}
				
				// Small delay to ensure auth state updates
				setTimeout(() => {
					const from = location.state?.from?.pathname || '/'
					navigate(from, { replace: true })
				}, 300)
			}
		} catch (err) {
			const errorMsg = err.message || `${provider} login failed`
			setLocalError(errorMsg)
			console.error(`${provider} login error:`, err)
		} finally {
			setIsSubmitting(false)
		}
	}

	const displayError = localError || error

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-8"
				>
					<div className="inline-block bg-gradient-to-br from-primary to-secondary p-4 rounded-full mb-4">
						<span className="text-4xl">🎨</span>
					</div>
					<h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
						StyleDecor
					</h1>
					<p className="text-sm lg:text-base text-base-content/70">
						Transform your space with elegance
					</p>
				</motion.div>

				{/* Login Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="card bg-base-100 shadow-xl border border-base-300"
				>
					<div className="card-body p-6 lg:p-8">
						{/* Welcome Message */}
						<div className="mb-6">
							<h2 className="text-2xl lg:text-3xl font-bold mb-1">Welcome Back!</h2>
							<p className="text-sm text-base-content/60">
								Sign in to your account to continue
							</p>
						</div>

						{/* Error Alert */}
						{displayError && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="alert alert-error mb-6 py-3"
							>
								<span className="text-sm">{displayError}</span>
							</motion.div>
						)}

					

						{/* Login Form */}
						<form onSubmit={handleLogin} className="space-y-4">
							{/* Email Input */}
							<div className="form-control">
								<label className="label pb-2">
									<span className="label-text font-semibold text-base-content flex items-center gap-2">
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
									className="input input-bordered bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
									disabled={isSubmitting}
									autoComplete="email"
								/>
							</div>

							{/* Password Input */}
							<div className="form-control">
								<label className="label pb-2">
									<span className="label-text font-semibold text-base-content flex items-center gap-2">
										<FaLock className="text-secondary" />
										Password
									</span>
								</label>
								<div className="relative">
									<input
										type={showPassword ? 'text' : 'password'}
										name="password"
										value={formData.password}
										onChange={handleInputChange}
										placeholder="••••••••"
										className="input input-bordered bg-base-200 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
										disabled={isSubmitting}
										autoComplete="current-password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content transition-colors"
										tabIndex="-1"
									>
										{showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
									</button>
								</div>
								<label className="label pt-2">
									<a href="#" className="label-text-alt link link-hover text-primary text-xs lg:text-sm">
										Forgot password?
									</a>
								</label>
							</div>

							{/* Login Button */}
							<button
								type="submit"
								className="btn btn-primary btn-lg w-full font-bold text-base lg:text-lg mt-6"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<span className="loading loading-spinner loading-sm"></span>
										Logging in...
									</>
								) : (
									'Sign In'
								)}
							</button>
						</form>

						{/* Divider */}
						<div className="divider my-6 text-base-content/40">OR</div>

						{/* Social Login Buttons */}
						<div className="space-y-3">
							<button
								onClick={() => handleSocialLogin('Google')}
								className="btn btn-outline w-full gap-2 hover:btn-error transition-all disabled:opacity-50 text-base"
								disabled={isSubmitting}
								title="Continue with Google"
							>
								{isSubmitting ? (
									<span className="loading loading-spinner loading-sm"></span>
								) : (
									<FaGoogle className="text-lg" />
								)}
								Continue with Google
							</button>

							
						</div>

						{/* Sign Up Link */}
						<div className="text-center mt-8 pt-6 border-t border-base-300">
							<p className="text-sm text-base-content/70">
								Don't have an account?{' '}
								<Link to="/register" className="link link-primary font-semibold hover:underline">
									Register Now
								</Link>
							</p>
						</div>
					</div>
				</motion.div>

				{/* Footer Info */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="text-center mt-6 text-xs text-base-content/50"
				>
					<p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
				</motion.div>
			</div>
		</div>
	)
}

export default Login
