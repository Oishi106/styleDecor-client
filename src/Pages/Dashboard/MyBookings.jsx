
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa'
import { useEffect } from 'react'
import axiosInstance from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthProvider'

const MyBookings = () => {
	const { role, loading: authLoading } = useAuth()
	const [bookings, setBookings] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	// View-only page; no mutations here

	useEffect(() => {
		if (authLoading) return
		if (role !== 'user') {
			setBookings([])
			setLoading(false)
			return
		}
		const fetchBookings = async () => {
			setLoading(true)
			setError('')
			try {
				const res = await axiosInstance.get('/user/bookings')
				setBookings(Array.isArray(res.data) ? res.data : [])
			} catch (err) {
				setError(err?.response?.data?.message || 'Failed to load bookings')
			} finally {
				setLoading(false)
			}
		}
		fetchBookings()
	}, [authLoading, role])

	/**
	 * Handle booking cancellation
	 * Shows confirmation dialog before cancelling
	 */
	/**
	 * Get badge styling based on booking status
	 * Returns appropriate DaisyUI badge class
	 */
	const getStatusBadge = (status) => {
		switch (status) {
			case 'Confirmed':
				return 'badge-success'
			case 'Pending':
				return 'badge-warning'
			case 'Completed':
				return 'badge-info'
			case 'Cancelled':
				return 'badge-error'
			default:
				return 'badge-ghost'
		}
	}

	const getPaymentBadge = (paymentStatus) => {
		switch (paymentStatus) {
			case 'paid':
				return 'badge-success'
			case 'half-paid':
				return 'badge-warning'
			case 'pending':
				return 'badge-ghost'
			case 'cancelled':
				return 'badge-error'
			default:
				return 'badge-ghost'
		}
	}

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h2 className="text-3xl font-bold">My Bookings</h2>
				<p className="text-base-content/60">View and manage your service bookings</p>
			</div>

			{/* Statistics Overview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="card bg-primary text-white shadow-lg"
				>
					<div className="card-body py-4">
						<p className="text-sm opacity-80">Total Bookings</p>
						<p className="text-3xl font-bold">{bookings.length}</p>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="card bg-success text-white shadow-lg"
				>
					<div className="card-body py-4">
						<p className="text-sm opacity-80">Confirmed</p>
						<p className="text-3xl font-bold">
							{bookings.filter(b => b.status === 'Confirmed').length}
						</p>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="card bg-warning text-white shadow-lg"
				>
					<div className="card-body py-4">
						<p className="text-sm opacity-80">Pending</p>
						<p className="text-3xl font-bold">
							{bookings.filter(b => b.status === 'Pending').length}
						</p>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="card bg-info text-white shadow-lg"
				>
					<div className="card-body py-4">
						<p className="text-sm opacity-80">Completed</p>
						<p className="text-3xl font-bold">
							{bookings.filter(b => b.status === 'Completed').length}
						</p>
					</div>
				</motion.div>
			</div>

			{/* Bookings Table - Desktop View */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="card bg-base-100 shadow-xl"
			>
				<div className="card-body">
					{error && (
						<div className="alert alert-error mb-4"><span>{error}</span></div>
					)}
					{loading ? (
						<div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg"></span></div>
					) : (
					<div className="overflow-x-auto">
						<table className="table table-zebra">
							<thead>
								<tr>
									<th>Booking ID</th>
									<th>Service</th>
									<th>Decorator</th>
									<th>Date</th>
									<th>Location</th>
									<th>Amount</th>
									<th>Job Status</th>
									<th>Payment</th>
								</tr>
							</thead>
							<tbody>
								{bookings.map((booking) => (
									<tr key={booking._id || booking.id} className="hover">
										<td className="font-semibold">#{booking._id || booking.id}</td>
										<td>
											<div className="font-semibold">{booking.roomName || booking.serviceName || booking.service || '—'}</div>
										</td>
										<td>{booking.decoratorName || booking.decoratorEmail || booking.decorator || '—'}</td>
										<td>
											<div className="flex items-center gap-2">
												<FaCalendarAlt className="text-primary" />
												{booking.bookingDate || booking.date || '—'}
											</div>
										</td>
										<td>
											<div className="flex items-center gap-2">
												<FaMapMarkerAlt className="text-secondary" />
												{booking.location || '—'}
											</div>
										</td>
										<td>
											<div className="flex items-center gap-2">
												<FaDollarSign className="text-success" />
												<span className="font-bold">{booking.price ?? booking.amount ?? '—'}</span>
											</div>
										</td>
										<td>
											<span className={`badge ${getStatusBadge(booking.jobStatus || booking.status)}`}>
												{booking.jobStatus || booking.status || '—'}
											</span>
										</td>
										<td>
											<span className={`badge ${getPaymentBadge(booking.paymentStatus)}`}>
												{booking.paymentStatus || 'pending'}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					)}
				</div>
			</motion.div>

			{/* Empty State - Shown when no bookings exist */}
			{bookings.length === 0 && (
				<div className="card bg-base-100 shadow-xl">
					<div className="card-body text-center py-12">
						<p className="text-6xl mb-4">📅</p>
						<h3 className="text-2xl font-bold mb-2">No Bookings Yet</h3>
						<p className="text-base-content/60 mb-4">
							You haven't made any bookings yet. Start exploring our services!
						</p>
						<button className="btn btn-primary">Browse Services</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default MyBookings
