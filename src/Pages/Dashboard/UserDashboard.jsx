import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaChartLine, FaCalendarCheck, FaHeart, FaCreditCard, FaUser, FaClipboardList, FaMoneyBillWave, FaArrowRight } from 'react-icons/fa'

const UserDashboard = () => {
	const stats = [
		{ label: 'Total Bookings', value: '12', icon: FaCalendarCheck, color: 'text-primary' },
		{ label: 'Completed', value: '8', icon: FaChartLine, color: 'text-success' },
		{ label: 'Saved Services', value: '5', icon: FaHeart, color: 'text-error' },
		{ label: 'Total Spent', value: '$2,450', icon: FaCreditCard, color: 'text-secondary' }
	]

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
				<p className="text-base-content/60">Here's what's happening with your account</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, idx) => {
					const Icon = stat.icon
					return (
						<motion.div
							key={idx}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: idx * 0.1 }}
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

			{/* Quick Access Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<Link to="/dashboard/profile">
						<div className="card bg-gradient-to-br from-primary/10 to-primary/5 hover:shadow-xl transition-all cursor-pointer group">
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

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
				>
					<Link to="/dashboard/bookings">
						<div className="card bg-gradient-to-br from-secondary/10 to-secondary/5 hover:shadow-xl transition-all cursor-pointer group">
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

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
				>
					<Link to="/dashboard/payments">
						<div className="card bg-gradient-to-br from-accent/10 to-accent/5 hover:shadow-xl transition-all cursor-pointer group">
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

			{/* Recent Activity */}
			<div className="card bg-base-100 shadow-lg">
				<div className="card-body">
					<h3 className="card-title text-xl mb-4">Recent Bookings</h3>
					<div className="space-y-4">
						{[1, 2, 3].map((_, idx) => (
							<div key={idx} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
										<span className="text-2xl">🎨</span>
									</div>
									<div>
										<p className="font-semibold">Living Room Makeover</p>
										<p className="text-sm text-base-content/60">Booked on Dec {15 - idx}, 2025</p>
									</div>
								</div>
								<div className="badge badge-success">Completed</div>
							</div>
						))}
					</div>
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
