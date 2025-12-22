/**
 * AdminRoute Component
 * 
 * Role-Based Access Control (RBAC) route wrapper
 * Ensures only admin users can access admin dashboard and related pages
 * 
 * Features:
 * - Check if user is authenticated
 * - Verify user has admin role
 * - Display loading state during authentication check
 * - Redirect unauthorized users to login/home page
 */

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

const AdminRoute = ({ children }) => {
	const { user, role, loading } = useAuth()
	const location = useLocation()

	// Show loading spinner while checking authentication
	if (loading) {
		return (
			<div className="min-h-[50vh] flex items-center justify-center">
				<div className="text-center">
					<span className="loading loading-spinner loading-lg text-primary"></span>
					<p className="mt-4 text-base-content/60">Verifying admin access...</p>
				</div>
			</div>
		)
	}

	// Redirect to login if not authenticated
	if (!user) {
		return <Navigate to="/login" replace state={{ from: location }} />
	}

	const isAdmin = role === 'admin'
	if (!isAdmin) {
		return <Navigate to="/unauthorized" replace state={{ requiredRole: 'admin', actualRole: role, from: location }} />
	}

	// Render admin component if user is authenticated and is admin
	return children
}

export default AdminRoute
