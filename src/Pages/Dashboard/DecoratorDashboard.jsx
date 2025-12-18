import React from 'react'
import { motion } from 'framer-motion'
import { FaPalette, FaCalendarAlt, FaStar, FaDollarSign } from 'react-icons/fa'

const DecoratorDashboard = () => {
	const stats = [
		{ label: 'My Services', value: '8', icon: FaPalette, color: 'text-primary' },
		{ label: 'Bookings', value: '45', icon: FaCalendarAlt, color: 'text-success' },
		{ label: 'Avg Rating', value: '4.8', icon: FaStar, color: 'text-warning' },
		{ label: 'Earnings', value: '$12,560', icon: FaDollarSign, color: 'text-secondary' }
	]

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-3xl font-bold mb-2">Decorator Dashboard</h2>
				<p className="text-base-content/60">Manage your decoration services</p>
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

			<div className="alert alert-success">
				<span>🎨 Decorator Dashboard - Manage your services, bookings, and reviews</span>
			</div>
		</div>
	)
}

export default DecoratorDashboard
