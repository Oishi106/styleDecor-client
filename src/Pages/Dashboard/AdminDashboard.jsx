import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthProvider'
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
	const [activeTab, setActiveTab] = useState('bookings')

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

	const handleApprove = async (application) => {
		const id = application?._id || application?.id
		if (!id) return
		try {
			await approveDecoratorApplication(id, { email: application?.email })
			await loadApplications()
		} catch (err) {
			alert(err?.response?.data?.message || 'Failed to approve application')
		}
	}

	const handleReject = async (application) => {
		const id = application?._id || application?.id
		if (!id) return
		try {
			await rejectDecoratorApplication(id, { email: application?.email })
			await loadApplications()
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

	const closeAssign = () => {
		setAssigningBooking(null)
		setAssignEmail('')
		setAssignLoading(false)
	}

	const handleAssign = async (e) => {
		e.preventDefault()
		if (!assigningBooking) return
		if (!assignEmail) {
			alert('Please select a decorator')
			return
		}
		setAssignLoading(true)
		try {
			const bookingId = assigningBooking._id || assigningBooking.id
			await assignDecoratorToBooking(bookingId, { decoratorEmail: assignEmail })
			const selected = decorators.find((d) => {
				const email = d.email || d.decoratorEmail || d.userEmail
				return email === assignEmail
			})
			const selectedName = selected?.name || selected?.fullName || selected?.displayName || null
			setBookings((prev) =>
				prev.map((b) => {
					const id = b._id || b.id
					if (id !== bookingId) return b
					return {
						...b,
						decorator: { email: assignEmail, name: selectedName },
						jobStatus: 'assigned',
					}
				}),
			)
			closeAssign()
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
					onClick={() => setActiveTab('bookings')}
					className={`tab ${activeTab === 'bookings' ? 'tab-active' : ''}`}
				>
					Bookings
				</button>
				<button
					onClick={() => setActiveTab('applications')}
					className={`tab ${activeTab === 'applications' ? 'tab-active' : ''}`}
				>
					Decorator Applications
				</button>
				<button
					onClick={() => setActiveTab('add-decorator')}
					className={`tab ${activeTab === 'add-decorator' ? 'tab-active' : ''}`}
				>
					Add Decorator
				</button>
			</div>

			{activeTab === 'bookings' && (
				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body gap-4">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
								<h3 className="text-xl font-bold">All Bookings</h3>
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
												const decoratorEmail = b.decorator?.email || b.decoratorEmail || b.decorator?.userEmail
												const decoratorName = b.decorator?.name || b.decoratorName
												const currentDecorator = decoratorName
													? `${decoratorName}${decoratorEmail ? ` (${decoratorEmail})` : ''}`
													: (decoratorEmail || '—')
												return (
													<tr key={id}>
														<td className="font-semibold">{id}</td>
														<td>{b.userEmail || b.email || '—'}</td>
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
								<div><span className="font-semibold">Service:</span> {assigningBooking.roomName || assigningBooking.serviceName || assigningBooking.service || '—'}</div>
								<div><span className="font-semibold">User:</span> {assigningBooking.userEmail || assigningBooking.email || '—'}</div>
							</div>

							<form onSubmit={handleAssign} className="space-y-3">
								<label className="form-control">
									<div className="label"><span className="label-text">Decorator</span></div>
									<select
										className="select select-bordered"
										value={assignEmail}
										onChange={(e) => setAssignEmail(e.target.value)}
										disabled={assignLoading || decoratorsLoading}
									>
										<option value="">Select a decorator</option>
										{decorators.map((d) => {
											const email = d.email || d.decoratorEmail || d.userEmail
											const key = d._id || email
											const name = d.name || d.fullName || d.displayName
											return (
												<option key={key} value={email}>
													{name ? `${name} (${email})` : email}
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

							{appsError && (
								<div className="alert alert-error">
									<span>{appsError}</span>
								</div>
							)}
							{appsLoading ? (
								<div className="flex justify-center py-10">
									<span className="loading loading-spinner loading-lg"></span>
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
												<th>Status</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{visibleApplications.map((a) => {
												const id = a._id || a.id
												const status = a.status || 'pending'
												return (
													<tr key={id}>
														<td className="font-semibold">{id}</td>
														<td>{a.name || '—'}</td>
														<td>{a.email || '—'}</td>
														<td>{a.phone || '—'}</td>
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
		</div>
	)
}

export default AdminDashboard
