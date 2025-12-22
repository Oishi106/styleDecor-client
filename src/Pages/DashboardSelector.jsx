import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

const DashboardSelector = () => {
  const navigate = useNavigate()
  const { loading, role } = useAuth()

  useEffect(() => {
    if (loading) return

    if (role === 'admin') {
      navigate('/dashboard/admin', { replace: true })
      return
    }
    if (role === 'decorator') {
      navigate('/dashboard/decorator', { replace: true })
      return
    }

    if (role === 'user') {
      navigate('/dashboard/user', { replace: true })
      return
    }

    navigate('/unauthorized', { replace: true })
  }, [loading, role, navigate])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  )
}

export default DashboardSelector
