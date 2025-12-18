import React from 'react'
import { motion } from 'framer-motion'
import { FaUsers, FaServicestack, FaChartLine, FaDollarSign } from 'react-icons/fa'

const AdminDashboard = () => {
	const stats = [
		{ label: 'Total Users', value: '1,234', icon: FaUsers, color: 'text-primary' },
		{ label: 'Active Services', value: '56', icon: FaServicestack, color: 'text-success' },
		{ label: 'Total Bookings', value: '890', icon: FaChartLine, color: 'text-secondary' },
		{ label: 'Revenue', value: '$45,890', icon: FaDollarSign, color: 'text-accent' }
	]

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
				<p className="text-base-content/60">Manage your platform</p>
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

			<div className="alert alert-info">
				<span>🎉 Admin Dashboard - Manage users, services, and platform settings</span>
			</div>
		</div>
	)
}

export default AdminDashboard
