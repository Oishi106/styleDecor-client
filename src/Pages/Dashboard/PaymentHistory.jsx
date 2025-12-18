import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaDollarSign, FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle, FaDownload, FaFilter } from 'react-icons/fa'

const PaymentHistory = () => {
	const [payments] = useState([
		{
			id: 'PAY-001',
			service: 'Living Room Makeover',
			amount: '$450',
			date: '2025-12-15',
			status: 'Completed',
			method: 'Credit Card',
			transactionId: 'TXN-45678901'
		},
		{
			id: 'PAY-002',
			service: 'Bedroom Interior Design',
			amount: '$680',
			date: '2025-12-10',
			status: 'Completed',
			method: 'PayPal',
			transactionId: 'TXN-45678902'
		},
		{
			id: 'PAY-003',
			service: 'Kitchen Renovation',
			amount: '$1,200',
			date: '2025-12-05',
			status: 'Completed',
			method: 'Debit Card',
			transactionId: 'TXN-45678903'
		},
		{
			id: 'PAY-004',
			service: 'Office Space Design',
			amount: '$890',
			date: '2025-12-01',
			status: 'Pending',
			method: 'Credit Card',
			transactionId: 'TXN-45678904'
		},
		{
			id: 'PAY-005',
			service: 'Bathroom Remodeling',
			amount: '$520',
			date: '2025-11-28',
			status: 'Failed',
			method: 'Credit Card',
			transactionId: 'TXN-45678905'
		},
		{
			id: 'PAY-006',
			service: 'Garden Decoration',
			amount: '$350',
			date: '2025-11-20',
			status: 'Completed',
			method: 'PayPal',
			transactionId: 'TXN-45678906'
		},
		{
			id: 'PAY-007',
			service: 'Dining Room Setup',
			amount: '$420',
			date: '2025-11-15',
			status: 'Completed',
			method: 'Debit Card',
			transactionId: 'TXN-45678907'
		}
	])

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

	const totalPaid = payments
		.filter(p => p.status === 'Completed')
		.reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '').replace(',', '')), 0)

	const totalPending = payments
		.filter(p => p.status === 'Pending')
		.reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '').replace(',', '')), 0)

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
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

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

			{/* Payment Table */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="card bg-base-100 shadow-xl"
			>
				<div className="card-body">
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
											<td className="text-xs text-base-content/60">
												{payment.transactionId}
											</td>
											<td>
												<span className={`badge ${statusInfo.class} gap-2`}>
													{statusInfo.icon}
													{payment.status}
												</span>
											</td>
											<td>
												{payment.status === 'Completed' && (
													<button className="btn btn-sm btn-ghost gap-2">
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
		</div>
	)
}

export default PaymentHistory
