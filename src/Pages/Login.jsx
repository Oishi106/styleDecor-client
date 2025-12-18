import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa'
import { useAuth } from '../context/AuthProvider'

const Login = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { login, loginWithGoogle, loginWithFacebook, setError, error, isMockAuth } = useAuth()
	const [isSubmitting, setIsSubmitting] = useState(false)
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
	}

	const handleLogin = async (e) => {
		e.preventDefault()
		setError(null)
		setIsSubmitting(true)
		try {
			await login(formData.email, formData.password)
			const from = location.state?.from?.pathname || '/'
			navigate(from, { replace: true })
		} catch (err) {
			setError(err.message || 'Failed to login')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleSocialLogin = async (provider) => {
		setError(null)
		setIsSubmitting(true)
		try {
			if (provider === 'Google') await loginWithGoogle()
			if (provider === 'Facebook') await loginWithFacebook()
			const from = location.state?.from?.pathname || '/'
			navigate(from, { replace: true })
		} catch (err) {
			setError(err.message || `Failed to login with ${provider}`)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 flex items-center justify-center py-12 px-6">
			<div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
				{/* Left Side - Branding */}
				<motion.div
					initial={{ opacity: 0, x: -50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6 }}
					className="hidden lg:block text-center"
				>
					<div className="mb-8">
						<div className="inline-block bg-gradient-to-br from-primary to-secondary p-8 rounded-full mb-6">
							<span className="text-6xl">🎨</span>
						</div>
					</div>
					<h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
						Welcome Back!
					</h1>
					<p className="text-xl text-base-content/70 mb-8">
						Sign in to continue your decoration journey with StyleDecor
					</p>
					<div className="space-y-4 text-left max-w-md mx-auto">
						<div className="flex items-center gap-3">
							<div className="badge badge-primary">✓</div>
							<span>Access your saved projects</span>
						</div>
						<div className="flex items-center gap-3">
							<div className="badge badge-secondary">✓</div>
							<span>Track your bookings</span>
						</div>
						<div className="flex items-center gap-3">
							<div className="badge badge-accent">✓</div>
							<span>Get personalized recommendations</span>
						</div>
					</div>
				</motion.div>

				{/* Right Side - Login Form */}
				<motion.div
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<div className="card bg-base-100 shadow-2xl">
						<div className="card-body p-8 lg:p-12">
							<h2 className="text-4xl font-bold mb-2 text-center">Login</h2>
							<p className="text-center text-base-content/60 mb-4">
								Enter your credentials to access your account
							</p>
							{isMockAuth && (
								<div className="alert alert-info text-sm mb-4">
									<span>Running in mock auth mode (no Firebase keys set). Any email/password will sign you in locally.</span>
								</div>
							)}

							{error && (
								<div className="alert alert-error text-sm">
									<span>{error}</span>
								</div>
							)}

							<form onSubmit={handleLogin} className="space-y-6">
								{/* Email Input */}
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
										placeholder="Enter your email"
										className="input input-bordered bg-base-200 focus:input-primary transition-all"
									/>
								</div>

								{/* Password Input */}
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
										placeholder="Enter your password"
										className="input input-bordered bg-base-200 focus:input-primary transition-all"
									/>
									<label className="label">
										<a href="#" className="label-text-alt link link-hover text-primary">
											Forgot password?
										</a>
									</label>
								</div>

								{/* Login Button */}
								<button type="submit" className="btn btn-primary btn-lg w-full font-bold" disabled={isSubmitting}>
									{isSubmitting ? 'Logging in...' : 'Login'}
								</button>
							</form>

							{/* Divider */}
							<div className="divider my-8">OR</div>

							{/* Social Login Buttons */}
							<div className="space-y-3">
								<button
									onClick={() => handleSocialLogin('Google')}
									className="btn btn-outline w-full gap-2 hover:btn-error transition-all"
									disabled={isSubmitting}
								>
									<FaGoogle className="text-xl" />
									Continue with Google
								</button>
                
								<button
									onClick={() => handleSocialLogin('Facebook')}
									className="btn btn-outline w-full gap-2 hover:btn-info transition-all"
									disabled={isSubmitting}
								>
									<FaFacebook className="text-xl" />
									Continue with Facebook
								</button>
							</div>

							{/* Sign Up Link */}
							<div className="text-center mt-8">
								<p className="text-base-content/70">
									Don't have an account?{' '}
									<Link to="/register" className="link link-primary font-semibold">
										Sign Up
									</Link>
								</p>
							</div>
						</div>
					</div>

					{/* Mobile Branding */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="lg:hidden text-center mt-6"
					>
						{isMockAuth ? (
							<p className="text-sm text-base-content/60">
								Mock auth is active. Add Firebase keys to enable real login.
							</p>
						) : null}
					</motion.div>
				</motion.div>
			</div>
		</div>
	)
}

export default Login

