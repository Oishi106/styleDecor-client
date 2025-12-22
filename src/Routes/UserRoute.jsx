import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

const UserRoute = ({ children }) => {
	const { user, role, loading } = useAuth()
	const location = useLocation()

	if (loading) {
		return (
			<div className="min-h-[50vh] flex items-center justify-center">
				<div className="text-center">
					<span className="loading loading-spinner loading-lg text-primary"></span>
					<p className="mt-4 text-base-content/60">Verifying user access...</p>
				</div>
			</div>
		)
	}

	if (!user) {
		return <Navigate to="/login" replace state={{ from: location }} />
	}

	const isUser = role === 'user'
	if (!isUser) {
		return <Navigate to="/unauthorized" replace state={{ requiredRole: 'user', actualRole: role, from: location }} />
	}

	return children
}

export default UserRoute
