import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

const DecoratorRoute = ({ children }) => {
	const { user, role, loading } = useAuth()
	const location = useLocation()

	// Show loading spinner while checking authentication
	if (loading) {
		return (
			<div className="min-h-[50vh] flex items-center justify-center">
				<div className="text-center">
					<span className="loading loading-spinner loading-lg text-primary"></span>
					<p className="mt-4 text-base-content/60">Verifying decorator access...</p>
				</div>
			</div>
		)
	}

	// Redirect to login if not authenticated
	if (!user) {
		return <Navigate to="/login" replace state={{ from: location }} />
	}

	const isDecorator = role === 'decorator'
	if (!isDecorator) {
		return <Navigate to="/unauthorized" replace state={{ requiredRole: 'decorator', actualRole: role, from: location }} />
	}

	// Render decorator component if user is authenticated and is decorator
	return children
}

export default DecoratorRoute
