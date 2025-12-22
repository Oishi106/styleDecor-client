

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUsers, FaServicestack, FaChartLine, FaDollarSign, FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff, FaClock, FaCheck } from 'react-icons/fa'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAuth } from '../../context/AuthProvider'

const AdminDashboard = () => {
	// Get current user for RBAC check
	const { user } = useAuth()
	
	// Active tab state
	const [activeTab, setActiveTab] = useState('overview')
	
	// Decorators management state
	const [decorators, setDecorators] = useState([
		{ id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', status: 'Approved', phone: '+1234567890', rating: 4.8 },
		{ id: 2, name: 'Mike Chen', email: 'mike@example.com', status: 'Approved', phone: '+1234567891', rating: 4.5 },
		{ id: 3, name: 'Emma Davis', email: 'emma@example.com', status: 'Pending', phone: '+1234567892', rating: 0 },
		{ id: 4, name: 'John Smith', email: 'john@example.com', status: 'Disabled', phone: '+1234567893', rating: 4.2 }
	])
	
	// Services management state
	const [services, setServices] = useState([
		{ id: 1, name: 'Living Room Makeover', price: '15000', unit: 'per sq-ft', category: 'Home', desc: 'Complete living room renovation' },
		{ id: 2, name: 'Wedding Hall Setup', price: '50000', unit: 'flat', category: 'Wedding', desc: 'Elegant wedding decoration' },
		{ id: 3, name: 'Office Redesign', price: '20000', unit: 'per sq-ft', category: 'Office', desc: 'Modern office interior design' }
	])
	
	// Bookings state
	const [bookings, setBookings] = useState([
		{ id: 1, customer: 'Ahmed Hassan', service: 'Living Room Makeover', amount: '15000', status: 'Paid', date: '2025-12-21', assignedTo: 'Sarah Johnson' },
		{ id: 2, customer: 'Fatima Khan', service: 'Wedding Hall Setup', amount: '50000', status: 'Paid', date: '2025-12-20', assignedTo: 'Emma Davis' },
		{ id: 3, customer: 'Rahul Roy', service: 'Office Redesign', amount: '20000', status: 'Pending', date: '2025-12-19', assignedTo: null },
		{ id: 4, customer: 'Priya Singh', service: 'Living Room Makeover', amount: '15000', status: 'Paid', date: '2025-12-18', assignedTo: null }
	])
	
	// Edit states
	const [editingDecorator, setEditingDecorator] = useState(null)
	const [editingService, setEditingService] = useState(null)
	const [assigningBooking, setAssigningBooking] = useState(null)
	
	// Dashboard stats
	const stats = [
		{ label: 'Total Users', value: '1,234', icon: FaUsers, color: 'text-primary' },
		{ label: 'Active Services', value: services.length.toString(), icon: FaServicestack, color: 'text-success' },
		{ label: 'Total Bookings', value: bookings.length.toString(), icon: FaChartLine, color: 'text-secondary' },
		{ label: 'Revenue', value: '৳4,58,900', icon: FaDollarSign, color: 'text-accent' }
	]

	// Analytics data - Service Demand (Histogram)
	const serviceDemandData = [
		{ name: 'Living Room', bookings: 45 },
		{ name: 'Wedding', bookings: 38 },
		{ name: 'Office', bookings: 52 },
		{ name: 'Bedroom', bookings: 28 },
		{ name: 'Kitchen', bookings: 41 }
	]

	// Analytics data - Revenue Monitoring (Line Chart)
	const revenueData = [
		{ month: 'Jan', revenue: 45000 },
		{ month: 'Feb', revenue: 52000 },
		{ month: 'Mar', revenue: 48000 },
		{ month: 'Apr', revenue: 61000 },
		{ month: 'May', revenue: 55000 },
		{ month: 'Jun', revenue: 67000 }
	]

	/**
	 * Toggle decorator status (Approve/Disable)
	 */
	const toggleDecoratorStatus = (id, currentStatus) => {
		setDecorators(decorators.map(d =>
			d.id === id ? { ...d, status: currentStatus === 'Approved' ? 'Disabled' : 'Approved' } : d
		))
	}

	/**
	 * Delete decorator
	 */
	const deleteDecorator = (id) => {
		if (confirm('Are you sure you want to delete this decorator?')) {
			setDecorators(decorators.filter(d => d.id !== id))
		}
	}

	/**
	 * Save service (create/edit)
	 */
	const saveService = (serviceData) => {
		if (editingService) {
			setServices(services.map(s => s.id === editingService.id ? { ...serviceData, id: s.id } : s))
		} else {
			setServices([...services, { ...serviceData, id: Math.max(...services.map(s => s.id)) + 1 }])
		}
		setEditingService(null)
	}

	/**
	 * Delete service
	 */
	const deleteService = (id) => {
		if (confirm('Are you sure you want to delete this service?')) {
			setServices(services.filter(s => s.id !== id))
		}
	}

	/**
	 * Assign decorator to booking
	 */
	const assignDecoratorToBooking = (bookingId, decoratorName) => {
		setBookings(bookings.map(b =>
			b.id === bookingId ? { ...b, assignedTo: decoratorName } : b
		))
		setAssigningBooking(null)
	}

	/**
	 * Render main content based on active tab
	 */
	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
				<p className="text-base-content/60">Manage your platform, services, and decorators</p>
			</div>

			{/* Tab Navigation */}
			<div className="tabs tabs-bordered">
				<button
					onClick={() => setActiveTab('overview')}
					className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
				>
					Overview
				</button>
				<button
					onClick={() => setActiveTab('decorators')}
					className={`tab ${activeTab === 'decorators' ? 'tab-active' : ''}`}
				>
					Decorators
				</button>
				<button
					onClick={() => setActiveTab('services')}
					className={`tab ${activeTab === 'services' ? 'tab-active' : ''}`}
				>
					Services
				</button>
				<button
					onClick={() => setActiveTab('bookings')}
					className={`tab ${activeTab === 'bookings' ? 'tab-active' : ''}`}
				>
					Bookings
				</button>
				<button
					onClick={() => setActiveTab('analytics')}
					className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`}
				>
					Analytics
				</button>
			</div>

			{/* OVERVIEW TAB */}
			{activeTab === 'overview' && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
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

					{/* Welcome Card */}
					<div className="alert alert-info">
						<span>👋 Welcome Admin! You have full control over platform management</span>
					</div>
				</motion.div>
			)}

			{/* DECORATORS TAB */}
			{activeTab === 'decorators' && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<div className="flex justify-between items-center">
						<h3 className="text-2xl font-bold">Manage Decorators</h3>
						<button
							onClick={() => setEditingDecorator('new')}
							className="btn btn-primary gap-2"
						>
							<FaPlus /> Add Decorator
						</button>
					</div>

					{/* Decorators Table */}
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<div className="overflow-x-auto">
								<table className="table table-zebra">
									<thead>
										<tr>
											<th>Name</th>
											<th>Email</th>
											<th>Phone</th>
											<th>Rating</th>
											<th>Status</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{decorators.map(decorator => (
											<tr key={decorator.id} className="hover">
												<td className="font-semibold">{decorator.name}</td>
												<td>{decorator.email}</td>
												<td>{decorator.phone}</td>
												<td>
													<span className="font-bold">{decorator.rating ? `${decorator.rating}⭐` : 'N/A'}</span>
												</td>
												<td>
													<span className={`badge ${decorator.status === 'Approved' ? 'badge-success' : decorator.status === 'Pending' ? 'badge-warning' : 'badge-error'}`}>
														{decorator.status}
													</span>
												</td>
												<td>
													<div className="flex gap-2">
														<button
															onClick={() => toggleDecoratorStatus(decorator.id, decorator.status)}
															className={`btn btn-sm ${decorator.status === 'Approved' ? 'btn-warning' : 'btn-success'}`}
															title={decorator.status === 'Approved' ? 'Disable' : 'Approve'}
														>
															{decorator.status === 'Approved' ? <FaToggleOn /> : <FaToggleOff />}
														</button>
														<button
															onClick={() => setEditingDecorator(decorator)}
															className="btn btn-sm btn-info"
														>
															<FaEdit />
														</button>
														<button
															onClick={() => deleteDecorator(decorator.id)}
															className="btn btn-sm btn-error"
														>
															<FaTrash />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</motion.div>
			)}

			{/* SERVICES TAB */}
			{activeTab === 'services' && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<div className="flex justify-between items-center">
						<h3 className="text-2xl font-bold">Manage Services</h3>
						<button
							onClick={() => setEditingService({ name: '', price: '', unit: '', category: '', desc: '' })}
							className="btn btn-primary gap-2"
						>
							<FaPlus /> Add Service
						</button>
					</div>

					{/* Services Form */}
					{editingService && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							className="card bg-base-100 shadow-xl"
						>
							<div className="card-body">
								<ServiceForm
									service={editingService}
									onSave={saveService}
									onCancel={() => setEditingService(null)}
								/>
							</div>
						</motion.div>
					)}

					{/* Services List */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{services.map(service => (
							<motion.div
								key={service.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
							>
								<div className="card-body">
									<h4 className="card-title text-lg">{service.name}</h4>
									<div className="space-y-2 text-sm">
										<p><strong>Price:</strong> ৳{service.price}/{service.unit}</p>
										<p><strong>Category:</strong> {service.category}</p>
										<p className="text-base-content/70">{service.desc}</p>
									</div>
									<div className="card-actions justify-end gap-2 mt-4">
										<button
											onClick={() => setEditingService(service)}
											className="btn btn-sm btn-info"
										>
											<FaEdit /> Edit
										</button>
										<button
											onClick={() => deleteService(service.id)}
											className="btn btn-sm btn-error"
										>
											<FaTrash /> Delete
										</button>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			)}

			{/* BOOKINGS TAB */}
			{activeTab === 'bookings' && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<h3 className="text-2xl font-bold">Booking & Assignment</h3>

					{/* Bookings Table */}
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<div className="overflow-x-auto">
								<table className="table table-zebra">
									<thead>
										<tr>
											<th>Booking ID</th>
											<th>Customer</th>
											<th>Service</th>
											<th>Amount</th>
											<th>Status</th>
											<th>Assigned To</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{bookings.map(booking => (
											<tr key={booking.id} className="hover">
												<td className="font-semibold">#{booking.id}</td>
												<td>{booking.customer}</td>
												<td>{booking.service}</td>
												<td className="font-bold">৳{booking.amount}</td>
												<td>
													<span className={`badge ${booking.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
														{booking.status}
													</span>
												</td>
												<td>{booking.assignedTo || '—'}</td>
												<td>
													{booking.status === 'Paid' && !booking.assignedTo && (
														<button
															onClick={() => setAssigningBooking(booking)}
															className="btn btn-sm btn-success"
														>
															<FaCheck /> Assign
														</button>
													)}
													{booking.assignedTo && (
														<span className="text-sm text-success">✓ Assigned</span>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</motion.div>
			)}

			{/* ANALYTICS TAB */}
			{activeTab === 'analytics' && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<h3 className="text-2xl font-bold">Analytics & Reports</h3>

					{/* Service Demand Histogram */}
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<h4 className="card-title text-xl mb-4">Service Demand (Histogram)</h4>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={serviceDemandData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar dataKey="bookings" fill="#8b5cf6" name="Number of Bookings" />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Revenue Monitoring Line Chart */}
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<h4 className="card-title text-xl mb-4">Revenue Monitoring (Last 6 Months)</h4>
							<ResponsiveContainer width="100%" height={300}>
								<LineChart data={revenueData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="month" />
									<YAxis />
									<Tooltip formatter={(value) => `৳${value.toLocaleString()}`} />
									<Legend />
									<Line
										type="monotone"
										dataKey="revenue"
										stroke="#10b981"
										strokeWidth={2}
										name="Revenue (BDT)"
										dot={{ fill: '#10b981' }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>
				</motion.div>
			)}

			{/* Assignment Modal */}
			<AnimatePresence>
				{assigningBooking && (
					<AssignmentModal
						booking={assigningBooking}
						decorators={decorators.filter(d => d.status === 'Approved')}
						onAssign={assignDecoratorToBooking}
						onClose={() => setAssigningBooking(null)}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}

/**
 * Service Form Component for Create/Edit
 * Handles creation and editing of decoration service packages
 */
function ServiceForm({ service, onSave, onCancel }) {
	const [formData, setFormData] = useState(service)

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		onSave(formData)
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<h4 className="font-bold text-lg">{service.id ? 'Edit Service' : 'Add New Service'}</h4>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="form-control">
					<label className="label"><span className="label-text">Service Name</span></label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="e.g., Living Room Makeover"
						className="input input-bordered"
						required
					/>
				</div>

				<div className="form-control">
					<label className="label"><span className="label-text">Price (BDT)</span></label>
					<input
						type="number"
						name="price"
						value={formData.price}
						onChange={handleChange}
						placeholder="15000"
						className="input input-bordered"
						required
					/>
				</div>

				<div className="form-control">
					<label className="label"><span className="label-text">Unit</span></label>
					<select
						name="unit"
						value={formData.unit}
						onChange={handleChange}
						className="select select-bordered"
						required
					>
						<option value="">Select Unit</option>
						<option value="per sq-ft">Per Sq-ft</option>
						<option value="flat">Flat Rate</option>
						<option value="per room">Per Room</option>
					</select>
				</div>

				<div className="form-control">
					<label className="label"><span className="label-text">Category</span></label>
					<select
						name="category"
						value={formData.category}
						onChange={handleChange}
						className="select select-bordered"
						required
					>
						<option value="">Select Category</option>
						<option value="Home">Home</option>
						<option value="Office">Office</option>
						<option value="Wedding">Wedding</option>
					</select>
				</div>
			</div>

			<div className="form-control">
				<label className="label"><span className="label-text">Description</span></label>
				<textarea
					name="desc"
					value={formData.desc}
					onChange={handleChange}
					placeholder="Service description..."
					className="textarea textarea-bordered"
					rows="3"
					required
				/>
			</div>

			<div className="flex gap-2 justify-end">
				<button type="button" onClick={onCancel} className="btn btn-outline">
					Cancel
				</button>
				<button type="submit" className="btn btn-primary">
					Save Service
				</button>
			</div>
		</form>
	)
}

/**
 * Assignment Modal Component
 * Modal for assigning approved decorators to paid bookings
 */
function AssignmentModal({ booking, decorators, onAssign, onClose }) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
			onClick={onClose}
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				onClick={(e) => e.stopPropagation()}
				className="bg-base-100 rounded-lg shadow-xl max-w-md w-full p-6"
			>
				<h3 className="font-bold text-xl mb-4">Assign Decorator to Booking</h3>
				<p className="text-sm text-base-content/70 mb-4">
					Booking #{booking.id} - {booking.service} (৳{booking.amount})
				</p>

				<div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
					{decorators.length > 0 ? (
						decorators.map(decorator => (
							<button
								key={decorator.id}
								onClick={() => onAssign(booking.id, decorator.name)}
								className="w-full text-left p-3 rounded-lg hover:bg-primary hover:text-white transition-colors border border-base-300"
							>
								<div className="font-semibold">{decorator.name}</div>
								<div className="text-sm opacity-70">{decorator.rating ? `${decorator.rating}⭐` : 'New'}</div>
							</button>
						))
					) : (
						<p className="text-center text-base-content/60">No approved decorators available</p>
					)}
				</div>

				<button onClick={onClose} className="btn btn-outline w-full">
					Close
				</button>
			</motion.div>
		</motion.div>
	)
}

export default AdminDashboard
