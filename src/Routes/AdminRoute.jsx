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
	const { user, loading } = useAuth()
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

	/**
	 * Check if user is admin
	 * TODO: Replace with actual role checking from Firebase custom claims or database
	 * For now, we check if user email ends with @admin.com (demo purposes)
	 */
	const isAdmin = user?.email?.endsWith('@admin.com') || user?.uid === 'admin-user'

	// Show error message if user is not admin
	if (!isAdmin) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-error/10 to-warning/10 flex items-center justify-center p-4">
				<div className="card bg-base-100 shadow-2xl max-w-md w-full">
					<div className="card-body text-center">
						<h2 className="card-title text-2xl justify-center mb-4">🔐 Access Denied</h2>
						<p className="text-base-content/70 mb-6">
							You do not have permission to access the Admin Dashboard.
						</p>
						<p className="text-sm text-base-content/60 mb-6 bg-base-200 p-3 rounded">
							Contact system administrator to request admin access.
						</p>
						<div className="card-actions flex flex-col gap-2">
							<button
								onClick={() => window.history.back()}
								className="btn btn-outline w-full"
							>
								Go Back
							</button>
							<button
								onClick={() => window.location.href = '/'}
								className="btn btn-primary w-full"
							>
								Return Home
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	// Render admin component if user is authenticated and is admin
	return children
}

export default AdminRoute
