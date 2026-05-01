import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axiosInstance from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthProvider'
import {
	FaClock,
	FaCheckCircle,
	FaClipboardList,
	FaDollarSign,
} from 'react-icons/fa'

const DecoratorDashboard = () => {
	const { user, role, loading: authLoading } = useAuth()
	const [jobs, setJobs] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')

	const decoratorEmail = user?.email
	const effectiveRole = (role || user?.role || '').toString().toLowerCase()

	useEffect(() => {
		if (authLoading) return
		if (!user || effectiveRole !== 'decorator') {
			setJobs([])
			setError('')
			return
		}
		if (!decoratorEmail) {
			setJobs([])
			setError('Missing account email. Please re-login.')
			return
		}
		const fetchJobs = async () => {
			setLoading(true)
			setError('')
			try {
				const token = localStorage.getItem('token')
				if (!token) {
					setJobs([])
					setError('Missing token. Please login again.')
					return
				}

				if (import.meta?.env?.DEV) {
					console.log('[DecoratorDashboard] decoratorEmail:', decoratorEmail)
				}

				const response = await axiosInstance.get('/decorator/jobs', {
					params: { decoratorEmail },
					headers: { Authorization: `Bearer ${token}` },
				})

				const payload = response?.data
				if (import.meta?.env?.DEV) {
					console.log('[DecoratorDashboard] /decorator/jobs response:', payload)
				}

				const list = Array.isArray(payload)
					? payload
					: Array.isArray(payload?.jobs)
						? payload.jobs
						: Array.isArray(payload?.data)
							? payload.data
							: []
				setJobs(Array.isArray(list) ? list : [])
			} catch (err) {
				const status = err?.response?.status
				const message = err?.response?.data?.message
				if (status === 401 || status === 403) {
					setError(message || 'Not authorized to load decorator jobs.')
				} else {
					setError(message || 'Failed to load jobs')
				}
			} finally {
				setLoading(false)
			}
		}
		fetchJobs()
	}, [authLoading, user, effectiveRole, decoratorEmail])
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

	const parseAmount = (value) => {
		if (value == null) return 0
		if (typeof value === 'number') return value
		if (typeof value === 'string') {
			const cleaned = value.replace(/[^0-9.]/g, '')
			const num = Number(cleaned)
			return Number.isFinite(num) ? num : 0
		}
		return 0
	}

	const visibleJobs = useMemo(() => {
		if (statusFilter === 'all') return jobs
		return jobs.filter((j) => (j.jobStatus || 'assigned') === statusFilter)
	}, [jobs, statusFilter])

	const completedCount = useMemo(
		() => jobs.filter((j) => (j.jobStatus || 'assigned') === 'completed').length,
		[jobs],
	)
	const inProgressCount = useMemo(
		() => jobs.filter((j) => (j.jobStatus || 'assigned') === 'in-progress').length,
		[jobs],
	)
	const assignedCount = useMemo(
		() => jobs.filter((j) => (j.jobStatus || 'assigned') === 'assigned').length,
		[jobs],
	)
	const completedJobs = useMemo(
		() => jobs.filter((j) => (j.jobStatus || 'assigned') === 'completed'),
		[jobs],
	)
	const totalEarnings = useMemo(
		() => completedJobs.reduce((sum, j) => sum + parseAmount(j.price ?? j.amount), 0),
		[completedJobs],
	)

	const setFilter = (filter) => {
		setStatusFilter(filter)
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
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="space-y-2"
			>
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
							onChange={(e) => setStatusFilter(e.target.value)}
						>
							<option value="all">all</option>
							<option value="assigned">assigned</option>
							<option value="in-progress">in-progress</option>
							<option value="completed">completed</option>
						</select>
					</div>
				</div>
			</motion.div>

			{/* Quick Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="grid grid-cols-2 md:grid-cols-4 gap-4"
			>
				<div
					className={`card bg-success/10 border border-success/20 cursor-pointer ${statusFilter === 'completed' ? 'ring-1 ring-success/40' : ''}`}
					onClick={() => setFilter('completed')}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') setFilter('completed')
					}}
				>
					<div className="card-body py-4 px-4">
						<p className="text-xs text-base-content/60">Completed</p>
						<p className="text-2xl font-bold text-success">
							{completedCount}
						</p>
					</div>
				</div>
				<div
					className={`card bg-primary/10 border border-primary/20 cursor-pointer ${statusFilter === 'in-progress' ? 'ring-1 ring-primary/40' : ''}`}
					onClick={() => setFilter('in-progress')}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') setFilter('in-progress')
					}}
				>
					<div className="card-body py-4 px-4">
						<p className="text-xs text-base-content/60">Active</p>
						<p className="text-2xl font-bold text-primary">
							{inProgressCount}
						</p>
					</div>
				</div>
				<div
					className={`card bg-warning/10 border border-warning/20 cursor-pointer ${statusFilter === 'assigned' ? 'ring-1 ring-warning/40' : ''}`}
					onClick={() => setFilter('assigned')}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') setFilter('assigned')
					}}
				>
					<div className="card-body py-4 px-4">
						<p className="text-xs text-base-content/60">Assigned</p>
						<p className="text-2xl font-bold text-warning">
							{assignedCount}
						</p>
					</div>
				</div>
				<div
					className={`card bg-secondary/10 border border-secondary/20 cursor-pointer ${statusFilter === 'completed' ? 'ring-1 ring-secondary/40' : ''}`}
					onClick={() => setFilter('completed')}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') setFilter('completed')
					}}
				>
					<div className="card-body py-4 px-4">
						<p className="text-xs text-base-content/60">Earnings</p>
						<p className="text-xl font-bold text-secondary">
							{totalEarnings.toLocaleString()}
						</p>
					</div>
				</div>
			</motion.div>

			{/* My Jobs */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<div className="divider my-4">MY JOBS</div>
				<div className="space-y-4">
					<AnimatePresence>
						{loading && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="card bg-base-100 shadow-lg"
							>
								<div className="card-body">Loading…</div>
							</motion.div>
						)}
						{!loading && error && (
							<div className="alert alert-error">
								<span>{error}</span>
							</div>
						)}
						{!loading && !error && jobs.length === 0 && (
							<div className="alert alert-info">
								<span>No assigned jobs.</span>
							</div>
						)}
						{!loading && !error && jobs.length > 0 && visibleJobs.length === 0 && (
							<div className="alert alert-info">
								<span>No jobs match the selected status.</span>
							</div>
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
										{/* Project Header */}
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1">
												<h3 className="font-bold text-lg">
													{serviceName}
												</h3>
												<p className="text-sm text-base-content/70 flex items-center gap-2 mt-1">
													<FaClock className="text-primary text-xs" />
													{customer}
												</p>
											</div>
											<span
												className={`badge ${statusColors[currentStatus] || 'badge-ghost'} badge-lg gap-2 capitalize`}
											>
												{statusIcons[currentStatus]}
												{currentStatus}
											</span>
										</div>

										{/* Service Info */}
										<div className="space-y-2 bg-base-200 rounded-lg p-3">
											<p className="text-xs text-base-content/70">Booking ID: {jobId}</p>
											{bookingDate && (
												<p className="text-xs text-base-content/70 flex items-center gap-2">
													<FaClock className="text-primary text-xs" />
													{new Date(bookingDate).toLocaleString()}
												</p>
											)}
											<p className="text-sm font-bold text-success">
												<FaDollarSign className="inline mr-1" /> {price.toLocaleString()}
											</p>
										</div>

										{/* For Completed Projects */}
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
