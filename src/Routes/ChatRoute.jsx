import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

const ChatRoute = ({ children }) => {
	const { user, role, loading } = useAuth()
	const location = useLocation()

	if (loading) {
		return (
			<div className="min-h-[50vh] flex items-center justify-center">
				<div className="text-center">
					<span className="loading loading-spinner loading-lg text-primary"></span>
					<p className="mt-4 text-base-content/60">Verifying chat access...</p>
				</div>
			</div>
		)
	}

	if (!user) {
		return <Navigate to="/login" replace state={{ from: location }} />
	}

	const allowedRoles = ['user', 'decorator', 'admin']
	if (!allowedRoles.includes(role)) {
		return <Navigate to="/unauthorized" replace state={{ requiredRole: 'user, decorator, or admin', actualRole: role, from: location }} />
	}

	return children
}

export default ChatRoute