import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthProvider'
import { FaUser, FaEnvelope, FaCalendar, FaShieldAlt } from 'react-icons/fa'

const Profile = () => {
  const { user, isMockAuth } = useAuth()

  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-base-content/60">Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="pb-16">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="avatar mb-4">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" />
                ) : (
                  <div className="bg-neutral text-neutral-content flex items-center justify-center text-4xl font-bold">
                    {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {user.displayName || 'User Profile'}
            </h1>
            <p className="mt-2 text-base-content/70">{user.email}</p>
            {isMockAuth && (
              <div className="badge badge-info mt-3">Mock Session</div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Profile Details */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="card bg-base-100 shadow"
          >
            <div className="card-body">
              <h2 className="card-title">Personal Information</h2>
              <ul className="space-y-4 mt-3">
                <li className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FaUser className="text-primary" />
                  </span>
                  <div>
                    <p className="text-sm text-base-content/60">Name</p>
                    <p className="font-semibold">{user.displayName || 'Not provided'}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <FaEnvelope className="text-secondary" />
                  </span>
                  <div>
                    <p className="text-sm text-base-content/60">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <FaShieldAlt className="text-accent" />
                  </span>
                  <div>
                    <p className="text-sm text-base-content/60">Account Type</p>
                    <p className="font-semibold">
                      {user.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 
                       user.providerData?.[0]?.providerId === 'facebook.com' ? 'Facebook' : 
                       'Email/Password'}
                    </p>
                  </div>
                </li>
                {user.metadata?.creationTime && (
                  <li className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                      <FaCalendar />
                    </span>
                    <div>
                      <p className="text-sm text-base-content/60">Member Since</p>
                      <p className="font-semibold">
                        {new Date(user.metadata.creationTime).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="card bg-base-100 shadow"
          >
            <div className="card-body">
              <h2 className="card-title">Activity Summary</h2>
              <div className="stats stats-vertical shadow-sm bg-base-200 mt-3">
                <div className="stat">
                  <div className="stat-title">Total Bookings</div>
                  <div className="stat-value text-primary">0</div>
                  <div className="stat-desc">No bookings yet</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Saved Projects</div>
                  <div className="stat-value text-secondary">0</div>
                  <div className="stat-desc">Start exploring</div>
                </div>
              </div>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-outline btn-sm">Edit Profile</button>
                <button className="btn btn-primary btn-sm">View Bookings</button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Profile
