import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axiosInstance from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthProvider'
import {
	FaClock,
	FaCheckCircle,
	FaChevronRight,
	FaClipboardList,
	FaDollarSign,
	FaPlayCircle,
} from 'react-icons/fa'

const DecoratorDashboard = () => {
	const { user, role, loading: authLoading } = useAuth()
	const [jobs, setJobs] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')

	useEffect(() => {
		if (authLoading) return
		if (!user || role !== 'decorator') return
		const fetchJobs = async () => {
			setLoading(true)
			setError('')
			try {
				const params = statusFilter && statusFilter !== 'all' ? { status: statusFilter } : undefined
				const res = await axiosInstance.get('/decorator/jobs', { params })
				const payload = res?.data
				const list = Array.isArray(payload)
					? payload
					: Array.isArray(payload?.jobs)
						? payload.jobs
						: Array.isArray(payload?.data)
							? payload.data
							: []
				setJobs(list)
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
	}, [authLoading, user, role, statusFilter])

	const STATUS_STEPS = ['assigned', 'in-progress', 'completed']
	const statusColors = {
		assigned: 'badge-info',
		'in-progress': 'badge-warning',
		completed: 'badge-success',
	}
	const statusIcons = {
		assigned: <FaClipboardList />,
		'in-progress': <FaPlayCircle />,
		completed: <FaCheckCircle />,
	}

	/**
	 * Update project status to next step in workflow
	 */
	const handleStatusUpdate = async (bookingId, newStatus) => {
		if (!user || role !== 'decorator') return
		try {
			await axiosInstance.patch(`/decorator/job-status/${bookingId}`, { status: newStatus })
			setJobs((prev) => prev.map((p) => (p._id === bookingId ? { ...p, jobStatus: newStatus } : p)))
		} catch (err) {
			alert(err?.response?.data?.message || 'Failed to update status')
		}
	}

	const getNextStatus = (currentStatus) => {
		const currentIndex = STATUS_STEPS.indexOf(currentStatus)
		if (currentIndex < 0) return 'in-progress'
		return currentIndex < STATUS_STEPS.length - 1 ? STATUS_STEPS[currentIndex + 1] : null
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

	const completedJobs = useMemo(() => jobs.filter((j) => j.jobStatus === 'completed'), [jobs])
	const activeJobs = useMemo(() => jobs.filter((j) => j.jobStatus !== 'completed'), [jobs])
	const totalEarnings = useMemo(
		() => completedJobs.reduce((sum, j) => sum + parseAmount(j.price ?? j.amount), 0),
		[completedJobs],
	)

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
				<div className="card bg-success/10 border border-success/20">
					<div className="card-body py-4 px-4">
						<p className="text-xs text-base-content/60">Completed</p>
						<p className="text-2xl font-bold text-success">
							{completedJobs.length}
						</p>
					</div>
				</div>
				<div className="card bg-primary/10 border border-primary/20">
					<div className="card-body py-4 px-4">
						<p className="text-xs text-base-content/60">Active</p>
						<p className="text-2xl font-bold text-primary">
							{activeJobs.length}
						</p>
					</div>
				</div>
				<div className="card bg-warning/10 border border-warning/20">
					<div className="card-body py-4 px-4">
						<p className="text-xs text-base-content/60">Assigned</p>
						<p className="text-2xl font-bold text-warning">
							{jobs.filter((j) => (j.jobStatus || 'assigned') === 'assigned').length}
						</p>
					</div>
				</div>
				<div className="card bg-secondary/10 border border-secondary/20">
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
								<span>No jobs found.</span>
							</div>
						)}
						{!loading && !error && jobs.map((job, idx) => {
							const jobId = job._id || job.id
							const currentStatus = job.jobStatus || 'assigned'
							const nextStatus = getNextStatus(currentStatus)
							const serviceName = job.roomName || job.serviceName || job.service || '—'
							const customer = job.userEmail || job.email || job.user?.email || '—'
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

										{/* Status Update Section - Mobile Optimized */}
										{currentStatus !== 'completed' && nextStatus && (
											<div className="space-y-2 bg-info/10 rounded-lg p-3 border border-info/20">
												<p className="text-xs font-semibold text-info-content">Next Step</p>
												<div className="flex gap-2">
													<button
														onClick={() => handleStatusUpdate(jobId, nextStatus)}
														className="btn btn-sm btn-info flex-1 gap-2"
													>
														<FaChevronRight className="text-xs" />
														Update to {nextStatus}
													</button>
												</div>
											</div>
										)}

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
