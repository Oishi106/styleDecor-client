

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaChartLine, FaCalendarCheck, FaHeart, FaCreditCard, FaUser, FaClipboardList, FaMoneyBillWave, FaArrowRight } from 'react-icons/fa'
import axiosInstance from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthProvider'

const UserDashboard = () => {
	
	const { user, role, loading: authLoading } = useAuth()
	const [bookings, setBookings] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		if (authLoading) return
		if (!user || role !== 'user') {
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
	}, [authLoading, user, role])

	const stats = [
		{ label: 'Total Bookings', value: String(bookings.length), icon: FaCalendarCheck, color: 'text-primary' },
		{ label: 'Completed', value: String(bookings.filter(b => b.jobStatus === 'completed').length), icon: FaChartLine, color: 'text-success' },
		{ label: 'Pending Payments', value: String(bookings.filter(b => b.paymentStatus === 'pending').length), icon: FaHeart, color: 'text-error' },
		{ label: 'Total Spent', value: `$${bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + (Number(b.price) || 0), 0)}`, icon: FaCreditCard, color: 'text-secondary' }
	]

	if (authLoading) {
		return (
			<div className="min-h-[50vh] flex items-center justify-center">
				<span className="loading loading-spinner loading-lg text-primary"></span>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			{/* Welcome Header Section */}
			<div>
				<h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
				<p className="text-base-content/60">Here's what's happening with your account</p>
			</div>

			{/* Statistics Grid - 4 cards showing key metrics */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, idx) => {
					const Icon = stat.icon
					return (
						<motion.div
							key={idx}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: idx * 0.1 }} // Staggered animation
							className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
						>
							<div className="card-body">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-base-content/60">{stat.label}</p>
										<p className="text-3xl font-bold mt-1">{stat.value}</p>
									</div>
									<Icon className={`text-4xl ${stat.color}`} />
								</div>
							</div>
						</motion.div>
					)
				})}
			</div>

			{/* Quick Access Navigation Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* My Profile Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<Link to="/dashboard/profile">
						<div className="card bg-linear-to-br from-primary/10 to-primary/5 hover:shadow-xl transition-all cursor-pointer group">
							<div className="card-body">
								<div className="flex items-center justify-between mb-4">
									<FaUser className="text-4xl text-primary" />
									<FaArrowRight className="text-xl text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>
								<h3 className="text-xl font-bold mb-2">My Profile</h3>
								<p className="text-sm text-base-content/60">
									View and edit your personal information
								</p>
							</div>
						</div>
					</Link>
				</motion.div>

				{/* My Bookings Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
				>
					<Link to="/dashboard/bookings">
						<div className="card bg-linear-to-br from-secondary/10 to-secondary/5 hover:shadow-xl transition-all cursor-pointer group">
							<div className="card-body">
								<div className="flex items-center justify-between mb-4">
									<FaClipboardList className="text-4xl text-secondary" />
									<FaArrowRight className="text-xl text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>
								<h3 className="text-xl font-bold mb-2">My Bookings</h3>
								<p className="text-sm text-base-content/60">
									Manage your service bookings and appointments
								</p>
							</div>
						</div>
					</Link>
				</motion.div>

				{/* Payment History Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
				>
					<Link to="/dashboard/payments">
						<div className="card bg-linear-to-br from-accent/10 to-accent/5 hover:shadow-xl transition-all cursor-pointer group">
							<div className="card-body">
								<div className="flex items-center justify-between mb-4">
									<FaMoneyBillWave className="text-4xl text-accent" />
									<FaArrowRight className="text-xl text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>
								<h3 className="text-xl font-bold mb-2">Payment History</h3>
								<p className="text-sm text-base-content/60">
									View all your transactions and invoices
								</p>
							</div>
						</div>
					</Link>
				</motion.div>
			</div>

			{/* Bookings List */}
			<div className="card bg-base-100 shadow-lg">
				<div className="card-body">
					<h3 className="card-title text-xl mb-4">My Bookings</h3>
					{error && (
						<div className="alert alert-error mb-4"><span>{error}</span></div>
					)}
					{loading ? (
						<div className="flex justify-center py-8">
							<span className="loading loading-spinner loading-lg"></span>
						</div>
					) : (
						<div className="space-y-4">
							{bookings.map((b) => (
								<div key={b._id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
											<span className="text-2xl">🎨</span>
										</div>
										<div>
											<p className="font-semibold">{b.roomName || b.serviceName}</p>
											<p className="text-sm text-base-content/60">Price: ${b.price}</p>
											<p className="text-xs text-base-content/60">Payment: {b.paymentStatus} • Job: {b.jobStatus}</p>
											{b.decoratorName && (
												<p className="text-xs text-base-content/60">Decorator: {b.decoratorName}</p>
											)}
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Link to={`/dashboard/bookings/${b._id}`} className="btn btn-ghost btn-sm">View Details</Link>
										{b.paymentStatus === 'pending' && (
											(() => {
												const displayName = user?.name || user?.displayName
												const canPay = !!(user && displayName && user.email)
												return (
													<Link
														to="/stripe-payment"
														state={{ booking: { _id: b._id, price: b.price, name: displayName, email: user?.email, roomName: b.roomName } }}
														className={`btn btn-primary btn-sm ${authLoading || !canPay ? 'btn-disabled pointer-events-none' : ''}`}
													>
														{authLoading ? 'Loading…' : 'Pay Now'}
													</Link>
												)
											})()
										)}
									</div>
								</div>
							))}
						</div>
					)}
					<div className="mt-6">
						<Link to="/dashboard/bookings" className="btn btn-primary btn-block">
							View All Bookings
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserDashboard
