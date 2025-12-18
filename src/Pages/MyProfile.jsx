import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthProvider'
import { FaUser, FaEnvelope, FaShieldAlt, FaPhone, FaLock, FaEdit, FaCheckCircle } from 'react-icons/fa'

const MyProfile = () => {
  const { user, isMockAuth } = useAuth()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: user?.displayName || '',
    phone: '',
    photoPreview: user?.photoURL || ''
  })

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setEditFormData(prev => ({ ...prev, photoPreview: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSaveChanges = () => {
    // UI only - show success toast
    setShowEditModal(false)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-base-content/60">Please log in to view your profile.</p>
      </div>
    )
  }

  const mockStats = [
    { title: 'Total Bookings', value: '12', desc: '3 pending', color: 'text-primary' },
    { title: 'Completed Services', value: '8', desc: 'This month: 2', color: 'text-secondary' },
    { title: 'Total Payments', value: '$2,450', desc: 'Lifetime', color: 'text-accent' }
  ]

  return (
    <div className="pb-16">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold">My Profile</h1>
            <p className="mt-2 text-base-content/70">View and manage your account information</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {mockStats.map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="stats shadow"
            >
              <div className="stat">
                <div className="stat-title">{stat.title}</div>
                <div className={`stat-value ${stat.color}`}>{stat.value}</div>
                <div className="stat-desc">{stat.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title">Profile Information</h2>
                  <button onClick={() => setShowEditModal(true)} className="btn btn-sm btn-primary gap-2">
                    <FaEdit /> Edit Profile
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="avatar">
                      <div className="w-32 rounded-xl ring ring-primary ring-offset-base-100 ring-offset-2">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Profile" />
                        ) : (
                          <div className="bg-neutral text-neutral-content flex items-center justify-center text-5xl font-bold">
                            {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    {isMockAuth && (
                      <div className="badge badge-info badge-sm mt-2">Mock Session</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-primary" />
                      </span>
                      <div>
                        <p className="text-sm text-base-content/60">Full Name</p>
                        <p className="font-semibold text-lg">{user.displayName || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <FaEnvelope className="text-secondary" />
                      </span>
                      <div>
                        <p className="text-sm text-base-content/60">Email Address</p>
                        <p className="font-semibold">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <FaShieldAlt className="text-accent" />
                      </span>
                      <div>
                        <p className="text-sm text-base-content/60">Role</p>
                        <p className="font-semibold">User</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                        <FaCheckCircle className="text-success" />
                      </span>
                      <div>
                        <p className="text-sm text-base-content/60">Account Status</p>
                        <div className="badge badge-success gap-1">Active</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center flex-shrink-0">
                        <FaPhone />
                      </span>
                      <div>
                        <p className="text-sm text-base-content/60">Phone Number</p>
                        <p className="font-semibold text-base-content/50">Not provided</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Security Info</h2>
                <div className="space-y-4 mt-2">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <FaLock className="text-warning" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-base-content/60">Password</p>
                      <p className="font-semibold">••••••••</p>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-block" disabled>
                    Change Password
                  </button>
                  <p className="text-xs text-base-content/50 text-center">
                    Password management coming soon
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-primary text-primary-content shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-sm">Account Type</h3>
                <p className="text-lg font-bold">
                  {user.providerData?.[0]?.providerId === 'google.com' ? 'Google Account' : 
                   user.providerData?.[0]?.providerId === 'facebook.com' ? 'Facebook Account' : 
                   'Email/Password'}
                </p>
                {user.metadata?.creationTime && (
                  <p className="text-xs opacity-80 mt-2">
                    Member since {new Date(user.metadata.creationTime).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Edit Modal */}
      {showEditModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
            <div className="space-y-4">
              {/* Profile Image */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Profile Image</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      {editFormData.photoPreview ? (
                        <img src={editFormData.photoPreview} alt="Preview" />
                      ) : (
                        <div className="bg-neutral text-neutral-content flex items-center justify-center text-2xl font-bold">
                          {(editFormData.name?.[0] || 'U').toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered file-input-sm w-full max-w-xs"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Full Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="input input-bordered"
                  placeholder="Your name"
                />
              </div>

              {/* Phone */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Phone Number (optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditChange}
                  className="input input-bordered"
                  placeholder="+880 1700-000000"
                />
              </div>
            </div>

            <div className="modal-action">
              <button onClick={() => setShowEditModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button onClick={handleSaveChanges} className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowEditModal(false)}>close</button>
          </form>
        </dialog>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="toast toast-end">
          <div className="alert alert-success">
            <FaCheckCircle />
            <span>Profile updated successfully!</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyProfile
