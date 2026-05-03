import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaEye, FaEyeSlash, FaCheckCircle, FaUser, FaPalette, FaShieldAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthProvider'
import { storeUserInDatabase } from '../api/userApi'

const Login = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { login, loginWithGoogle, loginWithFacebook, error, isMockAuth } = useAuth()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [localError, setLocalError] = useState('')
	const [selectedRole, setSelectedRole] = useState('user')
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

	const roleConfig = {
		user: {
			label: 'User',
			icon: FaUser,
			color: 'from-blue-500 to-blue-600',
			bgColor: 'bg-blue-50',
			borderColor: 'border-blue-200',
			ringColor: 'ring-blue-500',
			title: 'Book Decorations',
			description: 'Login to book decoration services and browse projects'
		},
		decorator: {
			label: 'Decorator',
			icon: FaPalette,
			color: 'from-purple-500 to-pink-600',
			bgColor: 'bg-purple-50',
			borderColor: 'border-purple-200',
			ringColor: 'ring-purple-500',
			title: 'Manage Projects',
			description: 'Login to manage your projects and services'
		},
		admin: {
			label: 'Admin',
			icon: FaShieldAlt,
			color: 'from-red-500 to-orange-600',
			bgColor: 'bg-red-50',
			borderColor: 'border-red-200',
			ringColor: 'ring-red-500',
			title: 'System Control',
			description: 'Admin portal - System control and moderation (No self-signup)'
		}
	}

	const currentRole = roleConfig[selectedRole]
	const Icon = currentRole.icon

	return (
		<div className="min-h-screen bg-base-200 py-6 lg:py-0">
			{/* Role Cards Section - Top */}
			<div className="hidden lg:block mb-8 pt-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-3 gap-4 mb-8">
						{Object.entries(roleConfig).map(([key, config]) => {
							const CardIcon = config.icon
							return (
								<button
									key={key}
									onClick={() => {
										console.log('Clicked role:', key)
										setSelectedRole(key)
										setLocalError('')
									}}
									className={`p-6 rounded-xl border-2 transition-all text-left cursor-pointer group hover:shadow-md ${
										selectedRole === key
											? `border-primary ${config.bgColor} shadow-lg ring-2 ${config.ringColor} ring-offset-2`
											: `${config.borderColor} hover:border-primary`
									}`}
									type="button"
								>
									<div className="flex items-center gap-3 mb-2">
										<CardIcon className={`text-3xl bg-clip-text text-transparent bg-linear-to-r ${config.color}`} />
										<h3 className="text-lg font-bold text-base-content">{config.label}</h3>
									</div>
									<p className="text-sm text-base-content/70">{config.description.split(' and ')[0]}</p>
								</button>
							)
						})}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
				{/* Left: Hero visual */}
				<div className="relative hidden lg:block">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.8 }}
						className="absolute inset-0"
						style={{
							backgroundImage:
								"url('https://images.unsplash.com/photo-1616596874784-07e98d90b274?q=80&w=1600&auto=format&fit=crop')",
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}}
					/>
					<div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/30 to-black/60" />

					<div className="relative z-10 h-full w-full flex flex-col justify-between p-12 text-white">
						<motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
							<h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
								StyleDecor
							</h1>
							<p className="text-sm text-white/80 max-w-md">
								Elevate interiors with curated design, thoughtful details, and seamless execution.
							</p>
						</motion.div>

						<motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
							<div className="grid grid-cols-2 gap-4">
								<div className="p-4 rounded-lg bg-white/10 backdrop-blur border border-white/20">
									<p className="text-xs uppercase tracking-wide">Projects Delivered</p>
									<p className="text-2xl font-bold">500+</p>
								</div>
								<div className="p-4 rounded-lg bg-white/10 backdrop-blur border border-white/20">
									<p className="text-xs uppercase tracking-wide">Client Satisfaction</p>
									<p className="text-2xl font-bold">98%</p>
								</div>
							</div>
							<div className="mt-4 flex items-center gap-2 text-green-300">
								<FaCheckCircle /> Trusted by homeowners and businesses
							</div>
						</motion.div>
					</div>
				</div>

				{/* Right: Login form */}
				<div className="flex items-center justify-center p-6 lg:p-12 bg-base-200">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="w-full max-w-md"
					>
						<div className="text-center mb-8 lg:hidden">
							<h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">StyleDecor</h1>
							<p className="text-base-content/70">Sign in to continue</p>

							{/* Mobile Role Cards */}
							<div className="grid grid-cols-3 gap-2 mt-6 mb-6">
								{Object.entries(roleConfig).map(([key, config]) => {
									const CardIcon = config.icon
									return (
									<button
										key={key}
										onClick={() => {
											console.log('Clicked mobile role:', key)
											setSelectedRole(key)
											setLocalError('')
										}}
										className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 hover:shadow-md ${
											selectedRole === key
												? `border-primary ${config.bgColor}`
												: `${config.borderColor} hover:border-primary`
										}`}
										type="button"
									>
										<CardIcon className={`text-2xl bg-clip-text text-transparent bg-linear-to-r ${config.color}`} />
										<span className="text-xs font-bold text-center">{config.label}</span>
									</button>
									)
								})}
							</div>
						</div>

						<div className="card bg-base-100 shadow-xl border border-base-300">
							<motion.div
								key={selectedRole}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4 }}
								className="card-body p-6 lg:p-8"
							>
								{/* Welcome Message */}
								<div className="mb-6">
									<h2 className="text-2xl lg:text-3xl font-bold mb-1 flex items-center gap-2">
										<Icon className={`text-2xl bg-clip-text text-transparent bg-linear-to-r ${currentRole.color}`} />
										{currentRole.title}
									</h2>
									<p className="text-sm text-base-content/60">{currentRole.description}</p>
								</div>

								{/* Role Toggle Tabs */}
								<div className="tabs tabs-bordered mb-6 gap-0">
									{Object.entries(roleConfig).map(([key, config]) => {
										const TabIcon = config.icon
										return (
											<button
												key={key}
												onClick={() => {
													console.log('Tab clicked:', key)
													setSelectedRole(key)
													setLocalError('')
												}}
												className={`tab transition-all ${selectedRole === key ? 'tab-active border-b-2 border-primary font-bold' : 'border-b border-base-300'}`}
												type="button"
											>
												<TabIcon className="mr-2 text-lg" />
												<span className="hidden sm:inline">{config.label}</span>
											</button>
										)
									})}
								</div>

								{/* Error Alert */}
								{displayError && (
									<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert alert-error mb-6 py-3">
										<span className="text-sm">{displayError}</span>
									</motion.div>
								)}

								{/* Admin Notice */}
								{selectedRole === 'admin' && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className="alert alert-warning mb-6 py-3"
									>
										<span className="text-sm">⚠️ Admin access requires system credentials. No self-signup available.</span>
									</motion.div>
								)}

								{/* Decorator Notice */}
								{selectedRole === 'decorator' && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className="alert alert-info mb-6 py-3"
									>
										<span className="text-sm">ℹ️ Login if approved by admin. Apply to become a decorator.</span>
									</motion.div>
								)}

								{/* Login Form */}
								<motion.div
									key={selectedRole}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
								>
									<form onSubmit={handleLogin} className="space-y-4">
										{/* Email */}
										<div className="form-control">
											<label className="label pb-2">
												<span className="label-text font-semibold text-base-content flex items-center gap-2">
													<FaEnvelope className="text-primary" /> Email Address
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

										{/* Password */}
										<div className="form-control">
											<label className="label pb-2">
												<span className="label-text font-semibold text-base-content flex items-center gap-2">
													<FaLock className="text-secondary" /> Password
												</span>
											</label>
											<div className="relative">
												<input
													type={showPassword ? 'text' : 'password'}
													name="password"
													value={formData.password}
													onChange={handleInputChange}
													placeholder="Enter your password"
													className="input input-bordered bg-base-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all pr-10"
													disabled={isSubmitting}
													autoComplete="current-password"
												/>
												<button
													type="button"
													className="btn btn-ghost btn-xs absolute right-2 top-1/2 -translate-y-1/2"
													onClick={() => setShowPassword(!showPassword)}
													aria-label={showPassword ? 'Hide password' : 'Show password'}
												>
													{showPassword ? <FaEyeSlash /> : <FaEye />}
												</button>
											</div>
											<label className="label pt-2">
												<a href="#" className="label-text-alt link link-hover text-primary text-xs lg:text-sm">Forgot password?</a>
											</label>
										</div>

										{/* Submit */}
										<button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
											{isSubmitting ? (
												<>
													<span className="loading loading-spinner loading-sm"></span>
													Signing in...
												</>
											) : (
												'Login'
											)}
										</button>
									</form>

									{/* Divider - Only for User Role */}
									{selectedRole === 'user' && (
										<div className="divider my-6">or continue with</div>
									)}

									{/* Social Logins - Only for User Role */}
									{selectedRole === 'user' && (
										<div className="space-y-3">
											<button
												onClick={() => handleSocialLogin('Google')}
												className="btn btn-outline w-full gap-2 transition-all disabled:opacity-50 text-base"
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
									)}
								</motion.div>

								{/* Sign Up Link */}
								<div className="text-center mt-8 pt-6 border-t border-base-300">
									{selectedRole === 'user' && (
										<p className="text-sm text-base-content/70">
											Don't have an account?{' '}
											<Link to="/register" className="link link-primary font-semibold hover:underline">
												Register Now
											</Link>
										</p>
									)}
									{selectedRole === 'decorator' && (
										<p className="text-sm text-base-content/70">
											Not registered?{' '}
											<Link to="/register" className="link link-primary font-semibold hover:underline">
												Apply to become a Decorator
											</Link>
										</p>
									)}
									{selectedRole === 'admin' && (
										<p className="text-sm text-base-content/70">
											Admin access is restricted. Contact system administrator.
										</p>
									)}
								</div>
							</motion.div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	)
}

export default Login

