import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

const Unauthorized = () => {
  const location = useLocation()
  const { role } = useAuth()
  const requiredRole = location.state?.requiredRole
  const actualRole = location.state?.actualRole || role

  const dashboardHref = actualRole === 'admin'
    ? '/dashboard/admin'
    : actualRole === 'decorator'
      ? '/dashboard/decorator'
      : '/dashboard/user'

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
      <div className="card bg-base-100 shadow-2xl max-w-md w-full">
        <div className="card-body text-center gap-4">
          <h1 className="text-2xl font-bold">403 — Unauthorized</h1>
          <p className="text-base-content/70">
            You don’t have permission to access that dashboard.
          </p>
          {(requiredRole || actualRole) && (
            <div className="text-sm bg-base-200 rounded p-3 text-left">
              {requiredRole && <div><span className="font-semibold">Required:</span> {requiredRole}</div>}
              {actualRole && <div><span className="font-semibold">Your role:</span> {actualRole}</div>}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Link className="btn btn-primary" to={dashboardHref}>Go to my dashboard</Link>
            <Link className="btn btn-outline" to="/">Return home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
