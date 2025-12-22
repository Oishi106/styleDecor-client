import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaChartBar, FaPalette, FaUser, FaArrowRight } from 'react-icons/fa'
import { useAuth } from '../context/AuthProvider'

const DashboardSelector = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-primary/5 to-secondary/5 py-12 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">Dashboard</h1>
          <p className="text-lg text-base-content/60">
            Welcome back, <span className="font-semibold text-primary">{user?.displayName || 'User'}</span>!
          </p>
        </motion.div>

        {/* Dashboard Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* User Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group cursor-pointer"
            onClick={() => navigate('/dashboard/user')}
          >
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full border-2 border-primary/20 hover:border-primary/60">
              <div className="card-body items-center text-center p-8">
                <div className="p-6 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-all duration-300 mb-4">
                  <FaUser className="text-5xl text-primary" />
                </div>
                <h2 className="card-title text-2xl mb-3">User Dashboard</h2>
                <p className="text-base-content/70 mb-6">
                  View your bookings, payments, and personal profile information
                </p>
                <button className="btn btn-primary btn-outline gap-2 group-hover:btn-primary transition-all w-full">
                  Go to Dashboard
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Admin Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group cursor-pointer"
            onClick={() => navigate('/dashboard/admin')}
          >
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full border-2 border-secondary/20 hover:border-secondary/60">
              <div className="card-body items-center text-center p-8">
                <div className="p-6 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-all duration-300 mb-4">
                  <FaChartBar className="text-5xl text-secondary" />
                </div>
                <h2 className="card-title text-2xl mb-3">Admin Dashboard</h2>
                <p className="text-base-content/70 mb-6">
                  Manage users, bookings, payments, and system settings
                </p>
                <button className="btn btn-secondary btn-outline gap-2 group-hover:btn-secondary transition-all w-full">
                  Go to Admin
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Decorator Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group cursor-pointer"
            onClick={() => navigate('/dashboard/decorator')}
          >
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full border-2 border-accent/20 hover:border-accent/60">
              <div className="card-body items-center text-center p-8">
                <div className="p-6 bg-accent/10 rounded-full group-hover:bg-accent/20 transition-all duration-300 mb-4">
                  <FaPalette className="text-5xl text-accent" />
                </div>
                <h2 className="card-title text-2xl mb-3">Decorator Dashboard</h2>
                <p className="text-base-content/70 mb-6">
                  Manage your services, projects, and client interactions
                </p>
                <button className="btn btn-accent btn-outline gap-2 group-hover:btn-accent transition-all w-full">
                  Go to Decorator
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-lg p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">User Dashboard</h3>
              <p className="text-sm text-base-content/70">
                Track your bookings, view payment history, and manage your profile
              </p>
            </div>
            <div className="divider md:divider-horizontal"></div>
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">Admin Dashboard</h3>
              <p className="text-sm text-base-content/70">
                Full system control for administrators to manage all aspects
              </p>
            </div>
            <div className="divider md:divider-horizontal"></div>
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">Decorator Dashboard</h3>
              <p className="text-sm text-base-content/70">
                Manage your services, projects, and client relationships
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardSelector
