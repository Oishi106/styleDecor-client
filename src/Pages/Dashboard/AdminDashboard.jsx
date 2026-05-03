import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../../context/AuthProvider'
import StartConversationModal from '../../components/StartConversationModal'
import { FaClock, FaCheckCircle, FaClipboardList, FaDollarSign, FaComments, FaEnvelope, FaUser } from 'react-icons/fa'
import {
	addDecoratorManually,
	approveDecoratorApplication,
	assignDecoratorToBooking,
	getAdminBookings,
	getAdminDecorators,
	getDecoratorApplications,
	rejectDecoratorApplication,
} from '../../api/adminApi'

const PAYMENT_FILTERS = ['all', 'pending', 'half-paid', 'paid', 'cancelled']
const APPLICATION_FILTERS = ['pending', 'rejected', 'approved', 'all']

const normalizePaymentStatus = (s) => {
	if (s === 'paid' || s === 'half-paid' || s === 'pending' || s === 'cancelled') return s
	return 'pending'
}

const getDisplayName = (u) => u?.name || u?.displayName || u?.fullName || ''

const AdminDashboard = () => {
	const { user, role, loading: authLoading } = useAuth()
	const location = useLocation()
	const navigate = useNavigate()
	const getTabFromSearch = () => {
		const tab = new URLSearchParams(location.search).get('tab')
		if (tab === 'overview') return 'overview'
		if (tab === 'applications') return 'applications'
		if (tab === 'bookings') return 'bookings'
		if (tab === 'add-decorator') return 'add-decorator'
		if (tab === 'messages') return 'messages'
		return 'overview'
	}
	const [activeTab, setActiveTab] = useState(getTabFromSearch)

	// Bookings
	const [bookingStatus, setBookingStatus] = useState('all')
	const [bookings, setBookings] = useState([])
	const [bookingsLoading, setBookingsLoading] = useState(false)
	const [bookingsError, setBookingsError] = useState('')

	// Decorator applications
	const [appStatus, setAppStatus] = useState('pending')
	const [applications, setApplications] = useState([])
	const [appsLoading, setAppsLoading] = useState(false)
	const [appsError, setAppsError] = useState('')

	// Decorators for booking assignment
	const [decorators, setDecorators] = useState([])
	const [decoratorsLoading, setDecoratorsLoading] = useState(false)
	const [decoratorsError, setDecoratorsError] = useState('')
	const [assigningBooking, setAssigningBooking] = useState(null)
	const [assignEmail, setAssignEmail] = useState('')
	const [assignLoading, setAssignLoading] = useState(false)

	// Add decorator manually
	const [addEmail, setAddEmail] = useState('')
	const [addLoading, setAddLoading] = useState(false)
	const [addMessage, setAddMessage] = useState('')
	const [chatModalOpen, setChatModalOpen] = useState(false)
	const [chatTarget, setChatTarget] = useState({ id: '', name: '' })

	useEffect(() => {
		if (authLoading) return
		if (!user || role !== 'admin') return
		setBookingsLoading(true)
		setBookingsError('')
		getAdminBookings(bookingStatus)
			.then((data) => setBookings(Array.isArray(data) ? data : []))
			.catch((err) => setBookingsError(err?.response?.data?.message || 'Failed to load bookings'))
			.finally(() => setBookingsLoading(false))
	}, [authLoading, user, role, bookingStatus])

	useEffect(() => {
		setActiveTab(getTabFromSearch())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.search])

	const loadApplications = async () => {
		setAppsLoading(true)
		setAppsError('')
		try {
			const data = await getDecoratorApplications()
			setApplications(Array.isArray(data) ? data : [])
		} catch (err) {
			setAppsError(err?.response?.data?.message || 'Failed to load applications')
		} finally {
			setAppsLoading(false)
		}
	}

	const loadDecorators = async () => {
		setDecoratorsLoading(true)
		setDecoratorsError('')
		try {
			const data = await getAdminDecorators()
			setDecorators(Array.isArray(data) ? data : [])
		} catch (err) {
			setDecoratorsError(err?.response?.data?.message || 'Failed to load decorators')
		} finally {
			setDecoratorsLoading(false)
		}
	}

	useEffect(() => {
		if (authLoading) return
		if (!user || role !== 'admin') return
		if (activeTab !== 'applications') return
		loadApplications()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authLoading, user, role, activeTab])

	useEffect(() => {
		if (authLoading) return
		if (!user || role !== 'admin') return
		if (activeTab !== 'messages') return
		if (decorators.length === 0) {
			loadDecorators()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authLoading, user, role, activeTab])

	useEffect(() => {
		if (authLoading) return
		if (!user || role !== 'admin') return
		if (!assigningBooking) return
		if (decorators.length > 0) return
		loadDecorators()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authLoading, user, role, assigningBooking])

	const bookingsByPayment = useMemo(() => {
		const counts = { pending: 0, 'half-paid': 0, paid: 0, cancelled: 0 }
		for (const b of bookings) {
			const ps = normalizePaymentStatus(b.paymentStatus)
			counts[ps] = (counts[ps] || 0) + 1
		}
		return counts
	}, [bookings])

	const visibleApplications = useMemo(() => {
		if (appStatus === 'all') return applications
		return applications.filter((a) => (a.status || 'pending') === appStatus)
	}, [applications, appStatus])

	const applicationStats = useMemo(() => {
		return applications.reduce(
			(acc, application) => {
				const status = (application.status || 'pending').toLowerCase()
				acc.total += 1
				if (status === 'approved') acc.approved += 1
				else if (status === 'rejected') acc.rejected += 1
				else acc.pending += 1
				return acc
			},
			{ total: 0, pending: 0, approved: 0, rejected: 0 },
		)
	}, [applications])

	const handleTabChange = (tab) => {
		setActiveTab(tab)
		navigate(`/dashboard/admin?tab=${tab}`, { replace: true })
	}

	const handleApprove = async (application) => {
		const id = application?._id || application?.id
		if (!id) return
		try {
			await approveDecoratorApplication(id, { email: application?.email })
			setApplications((prev) =>
				prev.map((a) => {
					const aid = a?._id || a?.id
					if (aid !== id) return a
					return { ...a, status: 'approved' }
				}),
			)
		} catch (err) {
			alert(err?.response?.data?.message || 'Failed to approve application')
		}
	}

	const handleReject = async (application) => {
		const id = application?._id || application?.id
		if (!id) return
		try {
			await rejectDecoratorApplication(id, { email: application?.email })
			setApplications((prev) =>
				prev.map((a) => {
					const aid = a?._id || a?.id
					if (aid !== id) return a
					return { ...a, status: 'rejected' }
				}),
			)
		} catch (err) {
			alert(err?.response?.data?.message || 'Failed to reject application')
		}
	}

	const handleAddDecorator = async (e) => {
		e.preventDefault()
		setAddMessage('')
		if (!addEmail) {
			setAddMessage('Email is required')
			return
		}
		setAddLoading(true)
		try {
			await addDecoratorManually({ email: addEmail })
			setAddMessage('Decorator role assigned successfully.')
			setAddEmail('')
		} catch (err) {
			setAddMessage(
				err?.response?.data?.message ||
					'Failed to add decorator (backend must implement POST /admin/decorators).',
			)
		} finally {
			setAddLoading(false)
		}
	}

	const openAssign = (booking) => {
		setAssigningBooking(booking)
		setAssignEmail('')
		if (decorators.length === 0 && !decoratorsLoading) {
			loadDecorators()
		}
	}

	const openChat = (id, name, participantRole = 'decorator') => {
		setChatTarget({ id, name, participantRole })
		setChatModalOpen(true)
	}

	const closeAssign = () => {
		setAssigningBooking(null)
		setAssignEmail('')
		setAssignLoading(false)
	}

	const handleAssign = async (e) => {
		e.preventDefault()
		if (!assigningBooking) return
		const selectedEmail = (assignEmail || '').trim()
		if (!selectedEmail) {
			alert('Please select a decorator')
			return
		}
		setAssignLoading(true)
		try {
			const bookingId = assigningBooking._id || assigningBooking.id
			const selected = decorators.find((d) => d.email === selectedEmail)
			const selectedName = selected?.name || selected?.fullName || selected?.displayName || null
			await assignDecoratorToBooking(bookingId, { decoratorEmail: selectedEmail })
			setBookings((prev) =>
				prev.map((b) => {
					const id = b._id || b.id
					if (id !== bookingId) return b
					return {
						...b,
						decorator: { email: selectedEmail, name: selectedName },
						jobStatus: 'assigned',
					}
				}),
			)
			closeAssign()
			await Swal.fire({
				icon: 'success',
				title: 'Assigned',
				text: 'Decorator assigned successfully.',
				confirmButtonText: 'OK',
			})
		} catch (err) {
			alert(err?.response?.data?.message || 'Failed to assign decorator')
			setAssignLoading(false)
		}
	}

	if (authLoading) {
		return (
			<div className="min-h-[50vh] flex items-center justify-center">
				<span className="loading loading-spinner loading-lg text-primary"></span>
			</div>
		)
	}

	const adminName = getDisplayName(user)

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
				<p className="text-base-content/60">Signed in as {adminName || user?.email || 'Admin'}</p>
			</div>

			<div className="tabs tabs-bordered">
				<button
					onClick={() => handleTabChange('overview')}
					className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
				>
					Overview
				</button>
				<button
					onClick={() => handleTabChange('applications')}
					className={`tab ${activeTab === 'applications' ? 'tab-active' : ''}`}
				>
					Decorator Applications
				</button>
				<button
					onClick={() => handleTabChange('bookings')}
					className={`tab ${activeTab === 'bookings' ? 'tab-active' : ''}`}
				>
					Bookings
				</button>
				<button
					onClick={() => handleTabChange('add-decorator')}
					className={`tab ${activeTab === 'add-decorator' ? 'tab-active' : ''}`}
				>
					Add Decorator
				</button>
				<button
					onClick={() => handleTabChange('messages')}
					className={`tab ${activeTab === 'messages' ? 'tab-active' : ''}`}
				>
					Messages
				</button>
			</div>

			{(activeTab === 'overview' || activeTab === 'bookings') && (
				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body gap-4">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
								<h3 className="text-xl font-bold">
									{activeTab === 'overview' ? 'Overview' : 'All Bookings'}
								</h3>
								<div className="flex items-center gap-3">
									<label className="text-sm text-base-content/70">Payment status</label>
									<select
										className="select select-bordered"
										value={bookingStatus}
										onChange={(e) => setBookingStatus(e.target.value)}
									>
										{PAYMENT_FILTERS.map((s) => (
											<option key={s} value={s}>
												{s}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="stats stats-vertical md:stats-horizontal shadow bg-base-200">
								<div className="stat">
									<div className="stat-title">Pending</div>
									<div className="stat-value text-lg">{bookingsByPayment.pending}</div>
								</div>
								<div className="stat">
									<div className="stat-title">Half-paid</div>
									<div className="stat-value text-lg">{bookingsByPayment['half-paid']}</div>
								</div>
								<div className="stat">
									<div className="stat-title">Paid</div>
									<div className="stat-value text-lg">{bookingsByPayment.paid}</div>
								</div>
								<div className="stat">
									<div className="stat-title">Cancelled</div>
									<div className="stat-value text-lg">{bookingsByPayment.cancelled}</div>
								</div>
							</div>

							{bookingsError && (
								<div className="alert alert-error">
									<span>{bookingsError}</span>
								</div>
							)}
							{bookingsLoading ? (
								<div className="flex justify-center py-10">
									<span className="loading loading-spinner loading-lg"></span>
								</div>
							) : (
								<div className="overflow-x-auto">
									<table className="table table-zebra">
										<thead>
											<tr>
												<th>ID</th>
												<th>User</th>
												<th>Service</th>
												<th>Date</th>
												<th>Amount</th>
												<th>Payment</th>
												<th>Job</th>
												<th>Decorator</th>
												<th>Assign</th>
											</tr>
										</thead>
										<tbody>
											{bookings.map((b) => {
												const id = b._id || b.id
												const paymentStatus = normalizePaymentStatus(b.paymentStatus)
																const decoratorEmail = b.decorator?.email
																const decoratorName = b.decorator?.name
												const currentDecorator = decoratorName
													? `${decoratorName}${decoratorEmail ? ` (${decoratorEmail})` : ''}`
																	: (decoratorEmail || '—')
												return (
													<tr key={id}>
														<td className="font-semibold">{id}</td>
																<td>{b.user?.email || '—'}</td>
														<td>{b.roomName || b.serviceName || b.service || '—'}</td>
														<td>
															{b.bookingDate || b.date
																? new Date(b.bookingDate || b.date).toLocaleDateString()
																: '—'}
														</td>
														<td>{b.price ?? b.amount ?? '—'}</td>
														<td>
															<span
																className={`badge ${
																	paymentStatus === 'paid'
																			? 'badge-success'
																			: paymentStatus === 'half-paid'
																					? 'badge-warning'
																					: paymentStatus === 'cancelled'
																							? 'badge-error'
																							: 'badge-ghost'
																	}
																capitalize`}
															>
																{paymentStatus}
															</span>
														</td>
														<td>{b.jobStatus || b.status || '—'}</td>
														<td>{currentDecorator || '—'}</td>
														<td>
															<button
																className="btn btn-sm btn-outline"
																disabled={paymentStatus !== 'paid'}
																onClick={() => openAssign(b)}
																title={paymentStatus !== 'paid' ? 'Payment must be paid before assigning' : 'Assign decorator'}
															>
																Assign
															</button>
														</td>
													</tr>
												)
											})}
										</tbody>
									</table>

									{decoratorsError && <div className="alert alert-warning mt-3"><span>{decoratorsError}</span></div>}
								</div>
							)}
						</div>
					</div>
				</motion.div>
			)}

			{assigningBooking && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeAssign}>
					<div className="card bg-base-100 w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
						<div className="card-body gap-4">
							<h3 className="text-xl font-bold">Assign Decorator</h3>
							<p className="text-sm text-base-content/70">
								Select a decorator for this event/booking.
							</p>
							<div className="bg-base-200 rounded-lg p-3 text-sm">
								<div><span className="font-semibold">Booking:</span> {assigningBooking._id || assigningBooking.id}</div>
								<div><span className="font-semibold">Service:</span> {assigningBooking.roomName || '—'}</div>
								<div><span className="font-semibold">User:</span> {assigningBooking.user?.email || '—'}</div>
							</div>

							<form onSubmit={handleAssign} className="space-y-3">
								<label className="form-control">
									<div className="label"><span className="label-text">Decorator</span></div>
									<select
										className="select select-bordered"
										value={assignEmail}
										onChange={(e) => setAssignEmail((e.target.value || '').trim())}
										disabled={assignLoading || decoratorsLoading}
									>
										<option value="">Select a decorator</option>
										{decorators.map((decorator) => {
											const email = decorator?.email
											if (!email) return null
											const key = decorator?._id || email
											const name = decorator?.name || decorator?.fullName || decorator?.displayName || 'Decorator'
											return (
												<option key={key} value={email}>
													{name} ({email})
												</option>
											)
										})}
									</select>
								</label>

								<div className="flex justify-end gap-2">
									<button type="button" className="btn btn-ghost" onClick={closeAssign} disabled={assignLoading}>
										Cancel
									</button>
									<button type="submit" className="btn btn-primary" disabled={assignLoading || decoratorsLoading}>
										{assignLoading ? 'Assigning…' : 'Assign'}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}

			{activeTab === 'applications' && (
				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body gap-4">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
								<h3 className="text-xl font-bold">Decorator Applications</h3>
								<div className="flex items-center gap-3">
									<label className="text-sm text-base-content/70">Status</label>
									<select
										className="select select-bordered"
										value={appStatus}
										onChange={(e) => setAppStatus(e.target.value)}
									>
										{APPLICATION_FILTERS.map((s) => (
											<option key={s} value={s}>
												{s}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
								<div className="stats shadow bg-base-200">
									<div className="stat py-4">
										<div className="stat-title">Total</div>
										<div className="stat-value text-lg">{applicationStats.total}</div>
									</div>
								</div>
								<div className="stats shadow bg-base-200">
									<div className="stat py-4">
										<div className="stat-title">Pending</div>
										<div className="stat-value text-lg text-warning">{applicationStats.pending}</div>
									</div>
								</div>
								<div className="stats shadow bg-base-200">
									<div className="stat py-4">
										<div className="stat-title">Approved</div>
										<div className="stat-value text-lg text-success">{applicationStats.approved}</div>
									</div>
								</div>
								<div className="stats shadow bg-base-200">
									<div className="stat py-4">
										<div className="stat-title">Rejected</div>
										<div className="stat-value text-lg text-error">{applicationStats.rejected}</div>
									</div>
								</div>
							</div>

							{appsError && (
								<div className="alert alert-error">
									<span>{appsError}</span>
								</div>
							)}
							{appsLoading ? (
								<div className="flex justify-center py-10">
									<span className="loading loading-spinner loading-lg"></span>
								</div>
							) : visibleApplications.length === 0 ? (
								<div className="rounded-xl border border-dashed border-base-300 p-8 text-center text-base-content/60">
									<p className="font-semibold text-base-content">No decorator applications found</p>
									<p className="text-sm mt-1">Try changing the status filter or wait for new submissions.</p>
								</div>
							) : (
								<div className="overflow-x-auto">
									<table className="table table-zebra">
										<thead>
											<tr>
												<th>ID</th>
												<th>Name</th>
												<th>Email</th>
												<th>Phone</th>
												<th>Experience</th>
												<th>Portfolio</th>
												<th>Applied</th>
												<th>Status</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{visibleApplications.map((a) => {
												const id = a._id || a.id
												const status = a.status || 'pending'
												const application = a.decoratorApplication || {}
												const experience = application.experience || a.experience || '—'
												const portfolio = application.portfolio || a.portfolio || '—'
												const appliedAt = application.createdAt || application.submittedAt || a.createdAt || a.updatedAt
												return (
													<tr key={id}>
														<td className="font-semibold">{id}</td>
														<td>{a.name || '—'}</td>
														<td>{a.email || '—'}</td>
														<td>{a.phone || '—'}</td>
														<td>{experience}</td>
														<td>
															{portfolio === '—' ? (
																'—'
															) : (
																<a className="link link-primary" href={portfolio} target="_blank" rel="noreferrer">
																	View
																</a>
															)}
														</td>
														<td>{appliedAt ? new Date(appliedAt).toLocaleDateString() : '—'}</td>
														<td>
															<span
																className={`badge ${
																	status === 'approved'
																			? 'badge-success'
																			: status === 'rejected'
																					? 'badge-error'
																					: 'badge-warning'
																	} capitalize`}
															>
																{status}
															</span>
														</td>
														<td>
															<div className="flex gap-2">
																<button
																	className="btn btn-sm btn-success"
																	disabled={status !== 'pending'}
																	onClick={() => handleApprove(a)}
																>
																	Approve
																</button>
																<button
																	className="btn btn-sm btn-error"
																	disabled={status !== 'pending'}
																	onClick={() => handleReject(a)}
																>
																	Reject
																</button>
															</div>
														</td>
													</tr>
												)
											})}
										</tbody>
									</table>
								</div>
							)}
						</div>
					</div>
				</motion.div>
			)}

			{activeTab === 'add-decorator' && (
				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<h3 className="text-xl font-bold">Add Decorator Manually</h3>
							<p className="text-sm text-base-content/60">
								Assign decorator role to an existing user by email.
							</p>
							{addMessage && (
								<div
									className={`alert ${
										addMessage.toLowerCase().includes('success') ? 'alert-success' : 'alert-info'
									} mt-2`}
								>
									<span>{addMessage}</span>
								</div>
							)}
							<form onSubmit={handleAddDecorator} className="mt-4 flex flex-col md:flex-row gap-3">
								<input
									type="email"
									className="input input-bordered flex-1"
									placeholder="user@example.com"
									value={addEmail}
									onChange={(e) => setAddEmail(e.target.value)}
									disabled={addLoading}
								/>
								<button type="submit" className="btn btn-primary" disabled={addLoading}>
									{addLoading ? 'Working…' : 'Add'}
								</button>
							</form>
						</div>
					</div>
				</motion.div>
			)}

			{activeTab === 'messages' && (
				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						<div className="card bg-base-100 shadow-xl border border-primary/15">
							<div className="card-body space-y-4">
								<div className="flex items-center gap-3">
									<div className="p-3 rounded-full bg-primary/10 text-primary">
										<FaComments />
									</div>
									<div>
										<h3 className="text-xl font-bold">Chat with Decorators</h3>
										<p className="text-sm text-base-content/60">Start a conversation with any decorator</p>
									</div>
								</div>
								{decoratorsLoading ? (
									<div className="flex justify-center py-6">
										<span className="loading loading-spinner loading-md text-primary"></span>
									</div>
								) : decorators.length === 0 ? (
									<p className="text-sm text-base-content/50">No decorators found yet.</p>
								) : (
									<div className="space-y-2 max-h-80 overflow-y-auto pr-1">
										{decorators.map((decorator) => {
											const email = decorator?.email
											if (!email) return null
											const key = decorator?._id || email
											const name = decorator?.name || decorator?.fullName || decorator?.displayName || 'Decorator'
											return (
												<div key={key} className="flex items-center justify-between gap-3 rounded-lg border border-base-300 p-3">
													<div>
														<p className="font-semibold">{name}</p>
														<p className="text-xs text-base-content/60">{email}</p>
													</div>
													<button
														type="button"
														onClick={() => openChat(email, name)}
														className="btn btn-outline btn-sm gap-2"
													>
														<FaComments /> Chat
													</button>
												</div>
											)
										})}
									</div>
								)}
							</div>
						</div>
						<div className="card bg-base-100 shadow-xl border border-secondary/15">
							<div className="card-body space-y-4">
								<div className="flex items-center gap-3">
									<div className="p-3 rounded-full bg-secondary/10 text-secondary">
										<FaUser />
									</div>
									<div>
										<h3 className="text-xl font-bold">Open Messages</h3>
										<p className="text-sm text-base-content/60">Use the shared messages page for ongoing chats</p>
									</div>
								</div>
								<button type="button" className="btn btn-primary w-full gap-2" onClick={() => window.location.assign('/dashboard/messages')}>
									<FaComments /> Go to Messages
								</button>
							</div>
						</div>
					</div>
				</motion.div>
			)}

			<StartConversationModal
				isOpen={chatModalOpen}
				onClose={() => setChatModalOpen(false)}
				participantId={chatTarget.id}
				participantName={chatTarget.name}
				participantRole={chatTarget.participantRole}
			/>
		</div>
	)
}

export default AdminDashboard
