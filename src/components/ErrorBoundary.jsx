import React from 'react'
import { motion } from 'framer-motion'
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa'

/**
 * Global Error Boundary Component
 * 
 * Catches errors in child components and displays a user-friendly error UI
 * Features:
 * - Catches React component errors
 * - Displays error details and stack trace
 * - Provides recovery options (Retry, Home)
 * - Logs errors for debugging
 * - Smooth animations with Framer Motion
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
			errorCount: 0,
		}
	}

	/**
	 * Update state when error is caught
	 */
	static getDerivedStateFromError(error) {
		return { hasError: true }
	}

	/**
	 * Log error details for debugging
	 */
	componentDidCatch(error, errorInfo) {
		console.error('Error caught by boundary:', error, errorInfo)
		
		this.setState((prevState) => ({
			error,
			errorInfo,
			errorCount: prevState.errorCount + 1,
		}))

		// You can also log the error to an error reporting service here
		// Example: logErrorToService(error, errorInfo)
	}

	/**
	 * Reset error state
	 */
	handleReset = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		})
	}

	/**
	 * Navigate to home
	 */
	handleHome = () => {
		window.location.href = '/'
	}

	render() {
		const { hasError, error, errorInfo, errorCount } = this.state

		if (hasError) {
			const isDevelopment = process.env.NODE_ENV === 'development'

			return (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="min-h-screen bg-linear-to-br from-error/10 to-warning/10 flex items-center justify-center p-4"
				>
					<motion.div
						initial={{ scale: 0.95, y: 20 }}
						animate={{ scale: 1, y: 0 }}
						transition={{ type: 'spring', stiffness: 200 }}
						className="bg-base-100 rounded-2xl shadow-2xl border-2 border-error/30 max-w-2xl w-full overflow-hidden"
					>
						{/* Header */}
						<div className="bg-linear-to-r from-error to-error/70 text-error-content p-6 space-y-2">
							<div className="flex items-center gap-3">
								<FaExclamationTriangle className="text-3xl" />
								<h1 className="text-2xl lg:text-3xl font-bold">
									Oops! Something went wrong
								</h1>
							</div>
							<p className="text-sm opacity-90">
								We encountered an unexpected error. Our team has been notified.
							</p>
						</div>

						{/* Error Details */}
						<div className="p-6 space-y-4">
							{/* Error Message */}
							{error && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 }}
									className="bg-error/5 border border-error/20 rounded-lg p-4 space-y-2"
								>
									<p className="font-semibold text-error">Error Message:</p>
									<p className="text-sm font-mono text-base-content/80 break-all">
										{error.toString()}
									</p>
								</motion.div>
							)}

							{/* Error Stack Trace (Development Only) */}
							{isDevelopment && errorInfo && (
								<motion.details
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
									className="bg-warning/5 border border-warning/20 rounded-lg p-4"
								>
									<summary className="cursor-pointer font-semibold text-warning hover:text-warning/80 transition-colors">
										Stack Trace (Development Only)
									</summary>
									<pre className="mt-3 bg-base-200 p-3 rounded overflow-x-auto text-xs text-base-content/70">
										{errorInfo.componentStack}
									</pre>
								</motion.details>
							)}

							{/* Error Information */}
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className="grid grid-cols-2 gap-4 bg-base-200/50 p-4 rounded-lg"
							>
								<div>
									<p className="text-xs text-base-content/60">Error Count:</p>
									<p className="text-lg font-bold text-base-content">
										{errorCount}
									</p>
								</div>
								<div>
									<p className="text-xs text-base-content/60">Environment:</p>
									<p className="text-lg font-bold text-base-content capitalize">
										{process.env.NODE_ENV}
									</p>
								</div>
								<div>
									<p className="text-xs text-base-content/60">Timestamp:</p>
									<p className="text-sm font-mono text-base-content/70">
										{new Date().toLocaleTimeString()}
									</p>
								</div>
								<div>
									<p className="text-xs text-base-content/60">Component:</p>
									<p className="text-sm font-mono text-base-content/70">
										ErrorBoundary
									</p>
								</div>
							</motion.div>

							{/* What You Can Do */}
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className="bg-info/5 border border-info/20 rounded-lg p-4"
							>
								<p className="font-semibold text-info mb-2">What you can do:</p>
								<ul className="text-sm text-base-content/70 space-y-1 list-disc list-inside">
									<li>Try refreshing the page</li>
									<li>Clear your browser cache</li>
									<li>Return to home and try again</li>
									<li>Contact support if the issue persists</li>
								</ul>
							</motion.div>
						</div>

						{/* Action Buttons */}
						<div className="bg-base-200 p-6 flex gap-3 flex-col sm:flex-row justify-center">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={this.handleReset}
								className="btn btn-primary gap-2 flex-1"
							>
								<FaRedo className="text-lg" />
								Try Again
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={this.handleHome}
								className="btn btn-outline gap-2 flex-1"
							>
								<FaHome className="text-lg" />
								Go Home
							</motion.button>
						</div>

						{/* Support Contact */}
						<div className="bg-base-100 px-6 py-4 border-t border-base-300 text-center text-sm text-base-content/60">
							<p>
								Need help?{' '}
								<a
									href="mailto:support@styledecor.com"
									className="text-primary hover:underline font-semibold"
								>
									Contact support
								</a>
							</p>
						</div>
					</motion.div>
				</motion.div>
			)
		}

		return this.props.children
	}
}

export default ErrorBoundary
