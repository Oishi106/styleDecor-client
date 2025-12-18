import React from 'react'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaMapMarkerAlt, FaDollarSign, FaTrash, FaEye } from 'react-icons/fa'
import { useBooking } from '../../context/BookingProvider'

const MyBookings = () => {
	const { bookings, cancelBooking } = useBooking()

	const handleCancelBooking = (id) => {
		if (confirm('Are you sure you want to cancel this booking?')) {
			cancelBooking(id)
		}
	}

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

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h2 className="text-3xl font-bold">My Bookings</h2>
				<p className="text-base-content/60">View and manage your service bookings</p>
			</div>

			{/* Stats Cards */}
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

			{/* Bookings Table */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="card bg-base-100 shadow-xl"
			>
				<div className="card-body">
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
									<th>Status</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{bookings.map((booking) => (
									<tr key={booking.id} className="hover">
										<td className="font-semibold">#{booking.id}</td>
										<td>
											<div className="font-semibold">{booking.service}</div>
										</td>
										<td>{booking.decorator}</td>
										<td>
											<div className="flex items-center gap-2">
												<FaCalendarAlt className="text-primary" />
												{booking.date}
											</div>
										</td>
										<td>
											<div className="flex items-center gap-2">
												<FaMapMarkerAlt className="text-secondary" />
												{booking.location}
											</div>
										</td>
										<td>
											<div className="flex items-center gap-2">
												<FaDollarSign className="text-success" />
												<span className="font-bold">{booking.amount}</span>
											</div>
										</td>
										<td>
											<span className={`badge ${getStatusBadge(booking.status)}`}>
												{booking.status}
											</span>
										</td>
										<td>
											<div className="flex gap-2">
												<button
													className="btn btn-sm btn-ghost btn-circle"
													title="View Details"
												>
													<FaEye />
												</button>
												{booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
													<button
														onClick={() => handleCancelBooking(booking.id)}
														className="btn btn-sm btn-error btn-circle"
														title="Cancel Booking"
													>
														<FaTrash />
													</button>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</motion.div>

			{/* Empty State */}
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
