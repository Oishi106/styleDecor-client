/**
 * PaymentHistory Component
 * 
 * Transaction history page for user dashboard
 * Features:
 * - Complete payment transaction history
 * - Summary cards (total paid, pending, transaction count)
 * - Detailed transaction table with status badges
 * - Download invoice functionality
 * - Filter and export options
 * 
 * Design: Clean table layout with visual status indicators
 * Responsive: Mobile-optimized with scrollable table
 */

import React from 'react'
import { motion } from 'framer-motion'
import { FaDollarSign, FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle, FaDownload, FaFilter } from 'react-icons/fa'
import { useBooking } from '../../context/BookingProvider'

const PaymentHistory = () => {
	const { payments } = useBooking()

	/**
	 * Get badge styling and icon based on payment status
	 * Returns object with badge class and status icon
	 */
	const getStatusBadge = (status) => {
		switch (status) {
			case 'Completed':
				return { class: 'badge-success', icon: <FaCheckCircle /> }
			case 'Pending':
				return { class: 'badge-warning', icon: <FaClock /> }
			case 'Failed':
				return { class: 'badge-error', icon: <FaTimesCircle /> }
			default:
				return { class: 'badge-ghost', icon: null }
		}
	}

	/**
	 * Calculate total amount paid
	 * Sums all completed transactions
	 */
	const totalPaid = payments
		.filter(p => p.status === 'Completed')
		.reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '').replace(',', '')), 0)

	/**
	 * Calculate total pending amount
	 * Sums all pending transactions
	 */
	const totalPending = payments
		.filter(p => p.status === 'Pending')
		.reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '').replace(',', '')), 0)

	return (
		<div className="space-y-6">
			{/* Page Header with Action Buttons */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h2 className="text-3xl font-bold">Payment History</h2>
					<p className="text-base-content/60">Track all your transactions and payments</p>
				</div>
				<div className="flex gap-2">
					<button className="btn btn-outline gap-2">
						<FaFilter />
						Filter
					</button>
					<button className="btn btn-primary gap-2">
						<FaDownload />
						Export
					</button>
				</div>
			</div>

			{/* Financial Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Total Paid Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="card bg-gradient-to-br from-success to-success-focus text-white shadow-xl"
				>
					<div className="card-body">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm opacity-80">Total Paid</p>
								<p className="text-3xl font-bold">${totalPaid.toLocaleString()}</p>
								<p className="text-xs opacity-70 mt-1">
									{payments.filter(p => p.status === 'Completed').length} transactions
								</p>
							</div>
							<FaCheckCircle className="text-5xl opacity-30" />
						</div>
					</div>
				</motion.div>

				{/* Pending Amount Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="card bg-gradient-to-br from-warning to-warning-focus text-white shadow-xl"
				>
					<div className="card-body">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm opacity-80">Pending</p>
								<p className="text-3xl font-bold">${totalPending.toLocaleString()}</p>
								<p className="text-xs opacity-70 mt-1">
									{payments.filter(p => p.status === 'Pending').length} transactions
								</p>
							</div>
							<FaClock className="text-5xl opacity-30" />
						</div>
					</div>
				</motion.div>

				{/* Total Transactions Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="card bg-gradient-to-br from-primary to-primary-focus text-white shadow-xl"
				>
					<div className="card-body">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm opacity-80">Total Transactions</p>
								<p className="text-3xl font-bold">{payments.length}</p>
								<p className="text-xs opacity-70 mt-1">All time</p>
							</div>
							<FaDollarSign className="text-5xl opacity-30" />
						</div>
					</div>
				</motion.div>
			</div>

			{/* Payment Transactions Table */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="card bg-base-100 shadow-xl"
			>
				<div className="card-body">
					<h3 className="card-title text-xl mb-4">Transaction History</h3>
					<div className="overflow-x-auto">
						<table className="table table-zebra">
							<thead>
								<tr>
									<th>Payment ID</th>
									<th>Service</th>
									<th>Date</th>
									<th>Amount</th>
									<th>Method</th>
									<th>Transaction ID</th>
									<th>Status</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{payments.map((payment, index) => {
									const statusInfo = getStatusBadge(payment.status)
									return (
										<tr key={payment.id} className="hover">
											<td className="font-semibold">{payment.id}</td>
											<td>
												<div className="font-medium">{payment.service}</div>
											</td>
											<td>
												<div className="flex items-center gap-2">
													<FaCalendarAlt className="text-primary" />
													{payment.date}
												</div>
											</td>
											<td>
												<div className="flex items-center gap-2">
													<FaDollarSign className="text-success" />
													<span className="font-bold text-lg">{payment.amount}</span>
												</div>
											</td>
											<td>
												<span className="badge badge-outline">{payment.method}</span>
											</td>
											<td className="text-xs text-base-content/60 font-mono">
												{payment.transactionId}
											</td>
											<td>
												<span className={`badge ${statusInfo.class} gap-2`}>
													{statusInfo.icon}
													{payment.status}
												</span>
											</td>
											<td>
												{/* Download Invoice Button (only for completed payments) */}
												{payment.status === 'Completed' && (
													<button 
														className="btn btn-sm btn-ghost gap-2 hover:btn-primary"
														title="Download Invoice"
													>
														<FaDownload />
														Invoice
													</button>
												)}
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>
			</motion.div>

			{/* Empty State - Shown when no payments exist */}
			{payments.length === 0 && (
				<div className="card bg-base-100 shadow-xl">
					<div className="card-body text-center py-12">
						<p className="text-6xl mb-4">💳</p>
						<h3 className="text-2xl font-bold mb-2">No Payment History</h3>
						<p className="text-base-content/60 mb-4">
							You haven't made any payments yet. Complete a booking to see your payment history here.
						</p>
					</div>
				</div>
			)}
		</div>
	)
}

export default PaymentHistory
