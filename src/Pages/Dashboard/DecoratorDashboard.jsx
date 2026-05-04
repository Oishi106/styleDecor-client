import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthProvider'
import { useChat } from '../../context/chatContext'
import {
  FaClock,
  FaCheckCircle,
  FaClipboardList,
  FaDollarSign,
  FaComments,
  FaUser,
  FaShieldAlt,
  FaEnvelope,
  FaSpinner,
} from 'react-icons/fa'

const DecoratorDashboard = () => {
  const { user, role, loading: authLoading } = useAuth()
  const { startNewConversation } = useChat()
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [chatLoading, setChatLoading] = useState(null)

  // ✅ DB থেকে admin contact নেওয়া
  const [adminContact, setAdminContact] = useState({ email: '', name: 'Admin' })

  const decoratorEmail = user?.email
  const effectiveRole = (role || user?.role || '').toString().toLowerCase()

  // ✅ Admin contact DB থেকে load করো
  useEffect(() => {
    axiosInstance.get('/users/contacts')
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : []
        const admin = list.find(c => c.role === 'admin')
        if (admin) {
          setAdminContact({ email: admin.email, name: admin.name || 'Admin' })
        }
      })
      .catch(() => {})
  }, [])

  // Jobs load করো
  useEffect(() => {
    if (authLoading) return
    if (!user || effectiveRole !== 'decorator') {
      setJobs([])
      setError('')
      return
    }
    if (!decoratorEmail) {
      setError('Missing account email. Please re-login.')
      return
    }

    const fetchJobs = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await axiosInstance.get('/decorator/jobs')
        const payload = response?.data
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.jobs)
            ? payload.jobs
            : []
        setJobs(list)
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [authLoading, user, effectiveRole, decoratorEmail])

  // ✅ Chat start করে messages page এ navigate করো
  const handleStartChat = async (targetEmail, targetName, key) => {
    if (!targetEmail) return
    setChatLoading(key)
    try {
      await startNewConversation(targetEmail, targetName)
      navigate('/dashboard/messages')
    } catch (err) {
      console.error('Chat start error:', err)
    } finally {
      setChatLoading(null)
    }
  }

  const parseAmount = (value) => {
    if (value == null) return 0
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      const num = Number(value.replace(/[^0-9.]/g, ''))
      return Number.isFinite(num) ? num : 0
    }
    return 0
  }

  const visibleJobs = useMemo(() => {
    if (statusFilter === 'all') return jobs
    return jobs.filter(j => (j.jobStatus || 'assigned') === statusFilter)
  }, [jobs, statusFilter])

  const completedCount = useMemo(() => jobs.filter(j => (j.jobStatus || 'assigned') === 'completed').length, [jobs])
  const inProgressCount = useMemo(() => jobs.filter(j => (j.jobStatus || 'assigned') === 'in-progress').length, [jobs])
  const assignedCount = useMemo(() => jobs.filter(j => (j.jobStatus || 'assigned') === 'assigned').length, [jobs])
  const totalEarnings = useMemo(() =>
    jobs.filter(j => (j.jobStatus || 'assigned') === 'completed')
      .reduce((sum, j) => sum + parseAmount(j.price ?? j.amount), 0),
    [jobs]
  )

  // ✅ User contacts — assigned jobs থেকে unique users
  const userContacts = useMemo(() => {
    const map = new Map()
    jobs.forEach(job => {
      const email = job.user?.email
      if (!email) return
      map.set(email, {
        id: email,
        name: job.user?.name || job.user?.displayName || email,
        email,
        count: (map.get(email)?.count || 0) + 1,
      })
    })
    return Array.from(map.values()).sort((a, b) => b.count - a.count)
  }, [jobs])

  const statusColors = {
    assigned: 'badge-info',
    'in-progress': 'badge-warning',
    completed: 'badge-success',
  }
  const statusIcons = {
    assigned: <FaClipboardList />,
    'in-progress': <FaClipboardList />,
    completed: <FaCheckCircle />,
  }

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold">My Jobs</h2>
            <p className="text-base-content/60">Jobs assigned to you</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-base-content/70">Status</label>
            <select
              className="select select-bordered"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">all</option>
              <option value="assigned">assigned</option>
              <option value="in-progress">in-progress</option>
              <option value="completed">completed</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div
          className={`card bg-success/10 border border-success/20 cursor-pointer ${statusFilter === 'completed' ? 'ring-1 ring-success/40' : ''}`}
          onClick={() => setStatusFilter('completed')}
        >
          <div className="card-body py-4 px-4">
            <p className="text-xs text-base-content/60">Completed</p>
            <p className="text-2xl font-bold text-success">{completedCount}</p>
          </div>
        </div>
        <div
          className={`card bg-primary/10 border border-primary/20 cursor-pointer ${statusFilter === 'in-progress' ? 'ring-1 ring-primary/40' : ''}`}
          onClick={() => setStatusFilter('in-progress')}
        >
          <div className="card-body py-4 px-4">
            <p className="text-xs text-base-content/60">Active</p>
            <p className="text-2xl font-bold text-primary">{inProgressCount}</p>
          </div>
        </div>
        <div
          className={`card bg-warning/10 border border-warning/20 cursor-pointer ${statusFilter === 'assigned' ? 'ring-1 ring-warning/40' : ''}`}
          onClick={() => setStatusFilter('assigned')}
        >
          <div className="card-body py-4 px-4">
            <p className="text-xs text-base-content/60">Assigned</p>
            <p className="text-2xl font-bold text-warning">{assignedCount}</p>
          </div>
        </div>
        <div className="card bg-secondary/10 border border-secondary/20">
          <div className="card-body py-4 px-4">
            <p className="text-xs text-base-content/60">Earnings</p>
            <p className="text-xl font-bold text-secondary">${totalEarnings.toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Chat Shortcuts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* ✅ Chat with Admin — DB থেকে admin email */}
        <div className="card bg-base-100 shadow-lg border border-primary/15">
          <div className="card-body space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <FaShieldAlt />
              </div>
              <div>
                <h3 className="text-lg font-bold">Chat with Admin</h3>
                <p className="text-sm text-base-content/60">Send updates, approvals, or support requests</p>
              </div>
            </div>
            {adminContact.email ? (
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <FaEnvelope className="text-primary" />
                <span>{adminContact.email}</span>
              </div>
            ) : (
              <p className="text-sm text-base-content/40">No admin found</p>
            )}
            <button
              type="button"
              onClick={() => handleStartChat(adminContact.email, adminContact.name, 'admin')}
              disabled={chatLoading === 'admin' || !adminContact.email}
              className="btn btn-primary w-full gap-2"
            >
              {chatLoading === 'admin'
                ? <><FaSpinner className="animate-spin" /> Starting...</>
                : <><FaComments /> Start Admin Chat</>
              }
            </button>
          </div>
        </div>

        {/* ✅ Chat with Users — only from assigned jobs */}
        <div className="card bg-base-100 shadow-lg border border-secondary/15">
          <div className="card-body space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-secondary/10 text-secondary">
                <FaUser />
              </div>
              <div>
                <h3 className="text-lg font-bold">Chat with Users</h3>
                <p className="text-sm text-base-content/60">Reach customers from your assigned jobs</p>
              </div>
            </div>
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {userContacts.length === 0 ? (
                <p className="text-sm text-base-content/50">No customer contacts found yet.</p>
              ) : (
                userContacts.map(contact => (
                  <div key={contact.id} className="flex items-center justify-between gap-3 rounded-lg border border-base-300 p-3">
                    <div>
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-xs text-base-content/60">{contact.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartChat(contact.email, contact.name, contact.email)}
                      disabled={chatLoading === contact.email}
                      className="btn btn-outline btn-sm gap-2"
                    >
                      {chatLoading === contact.email
                        ? <FaSpinner className="animate-spin" />
                        : <><FaComments /> Chat</>
                      }
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* My Jobs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="divider my-4">MY JOBS</div>
        <div className="space-y-4">
          <AnimatePresence>
            {loading && (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body flex items-center justify-center">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              </div>
            )}
            {!loading && error && <div className="alert alert-error"><span>{error}</span></div>}
            {!loading && !error && jobs.length === 0 && <div className="alert alert-info"><span>No assigned jobs.</span></div>}
            {!loading && !error && jobs.length > 0 && visibleJobs.length === 0 && (
              <div className="alert alert-info"><span>No jobs match the selected status.</span></div>
            )}
            {!loading && !error && visibleJobs.map((job, idx) => {
              const jobId = job._id || job.id
              const currentStatus = job.jobStatus || 'assigned'
              const serviceName = job.roomName || '—'
              const customer = job.user?.email || '—'
              const bookingDate = job.bookingDate || job.date
              const price = parseAmount(job.price ?? job.amount)

              return (
                <motion.div
                  key={jobId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="card-body space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{serviceName}</h3>
                        <p className="text-sm text-base-content/70 flex items-center gap-2 mt-1">
                          <FaClock className="text-primary text-xs" />
                          {customer}
                        </p>
                      </div>
                      <span className={`badge ${statusColors[currentStatus] || 'badge-ghost'} badge-lg gap-2 capitalize`}>
                        {statusIcons[currentStatus]}
                        {currentStatus}
                      </span>
                    </div>
                    <div className="space-y-2 bg-base-200 rounded-lg p-3">
                      <p className="text-xs text-base-content/70">Booking ID: {jobId}</p>
                      {bookingDate && (
                        <p className="text-xs text-base-content/70 flex items-center gap-2">
                          <FaClock className="text-primary text-xs" />
                          {new Date(bookingDate).toLocaleString()}
                        </p>
                      )}
                      <p className="text-sm font-bold text-success">
                        <FaDollarSign className="inline mr-1" />{price.toLocaleString()}
                      </p>
                    </div>
                    {currentStatus === 'completed' && (
                      <div className="bg-success/10 rounded-lg p-3 border border-success/20 flex items-center gap-2 text-success text-sm">
                        <FaCheckCircle /> Project completed successfully!
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default DecoratorDashboard