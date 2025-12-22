import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	FaPalette,
	FaCalendarAlt,
	FaStar,
	FaDollarSign,
	FaMapMarkerAlt,
	FaClock,
	FaCheckCircle,
	FaEdit,
	FaChevronRight,
	FaTruck,
	FaToolbox,
	FaClipboardList,
	FaFileAlt,
} from 'react-icons/fa'


const DecoratorDashboard = () => {
	// State for assigned projects
	const [projects, setProjects] = useState([
		{
			id: 1,
			clientName: 'Fatima Hassan',
			location: 'Gulshan, Dhaka',
			service: 'Living Room Makeover',
			amount: '15,000 BDT',
			status: 'Planning', 
			date: '2025-12-21',
			time: '10:00 AM',
			priority: 'high',
			notes: 'Client prefers warm colors',
			materials: ['Paint', 'Wallpaper', 'Furniture'],
		},
		{
			id: 2,
			clientName: 'Ahmed Khan',
			location: 'Dhanmondi, Dhaka',
			service: 'Bedroom Decoration',
			amount: '12,000 BDT',
			status: 'On the Way',
			date: '2025-12-21',
			time: '02:00 PM',
			priority: 'high',
			notes: 'New apartment setup',
			materials: ['Curtains', 'Lighting', 'Decor Items'],
		},
		{
			id: 3,
			clientName: 'Noor Ahmed',
			location: 'Mirpur, Dhaka',
			service: 'Office Space Design',
			amount: '20,000 BDT',
			status: 'Materials Prepared',
			date: '2025-12-22',
			time: '09:00 AM',
			priority: 'medium',
			notes: 'Commercial office setup',
			materials: ['Furniture', 'Partitions', 'Lighting'],
		},
		{
			id: 4,
			clientName: 'Saima Begum',
			location: 'Uttara, Dhaka',
			service: 'Kitchen Redesign',
			amount: '18,000 BDT',
			status: 'Completed',
			date: '2025-12-20',
			time: '11:00 AM',
			priority: 'low',
			notes: 'Modern kitchen setup completed',
			materials: ['Cabinets', 'Countertop', 'Backsplash'],
		},
	])

	// Status workflow steps
	const statusSteps = [
		'Assigned',
		'Planning',
		'Materials Prepared',
		'On the Way',
		'Setup in Progress',
		'Completed',
	]

	const statusColors = {
		Assigned: 'badge-info',
		Planning: 'badge-warning',
		'Materials Prepared': 'badge-secondary',
		'On the Way': 'badge-accent',
		'Setup in Progress': 'badge-primary',
		Completed: 'badge-success',
	}

	const statusIcons = {
		Assigned: <FaClipboardList />,
		Planning: <FaEdit />,
		'Materials Prepared': <FaToolbox />,
		'On the Way': <FaTruck />,
		'Setup in Progress': <FaPalette />,
		Completed: <FaCheckCircle />,
	}

	/**
	 * Update project status to next step in workflow
	 */
	const handleStatusUpdate = (projectId, newStatus) => {
		setProjects(
			projects.map((project) =>
				project.id === projectId ? { ...project, status: newStatus } : project
			)
		)
	}

	/**
	 * Get status progress percentage for visual indicator
	 */
	const getStatusProgress = (status) => {
		const index = statusSteps.indexOf(status)
		return ((index + 1) / statusSteps.length) * 100
	}

	/**
	 * Get next available status in workflow
	 */
	const getNextStatus = (currentStatus) => {
		const currentIndex = statusSteps.indexOf(currentStatus)
		return currentIndex < statusSteps.length - 1
			? statusSteps[currentIndex + 1]
			: null
	}

	/**
	 * Get today's tasks (filter by date)
	 */
	const todaysTasks = projects.filter(
		(p) => p.date === '2025-12-21' && p.status !== 'Completed'
	)

	/**
	 * Get completed projects for earnings
	 */
	const completedProjects = projects.filter((p) => p.status === 'Completed')
	const totalEarnings = completedProjects.reduce((sum, p) => {
		return sum + parseInt(p.amount.replace(/,/g, ''))
	}, 0)

	/**
	 * Get pending projects (not completed)
	 */
	const pendingProjects = projects.filter((p) => p.status !== 'Completed')
	const pendingEarnings = pendingProjects.reduce((sum, p) => {
		return sum + parseInt(p.amount.replace(/,/g, ''))
	}, 0)

	return (
		<div className="space-y-6 pb-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="space-y-2"
			>
				<h2 className="text-3xl font-bold">My Projects</h2>
				<p className="text-base-content/60">
					Task-focused dashboard for on-site management
				</p>
			</motion.div>

			{/* Quick Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="grid grid-cols-2 md:grid-cols-4 gap-4"
			>
				<div className="card bg-success/10 border border-success/20">
					<div className="card-body py-4 px-4">
						<p className="text-xs text-base-content/60">Completed</p>
						<p className="text-2xl font-bold text-success">
							{completedProjects.length}
						</p>
					</div>
				</div>
				<div className="card bg-primary/10 border border-primary/20">
					<div className="card-body py-4 px-4">
						<p className="text-xs text-base-content/60">In Progress</p>
						<p className="text-2xl font-bold text-primary">
							{pendingProjects.length}
						</p>
					</div>
				</div>
				<div className="card bg-warning/10 border border-warning/20">
					<div className="card-body py-4 px-4">
						<p className="text-xs text-base-content/60">Today's Tasks</p>
						<p className="text-2xl font-bold text-warning">
							{todaysTasks.length}
						</p>
					</div>
				</div>
				<div className="card bg-secondary/10 border border-secondary/20">
					<div className="card-body py-4 px-4">
						<p className="text-xs text-base-content/60">Earnings</p>
						<p className="text-xl font-bold text-secondary">
							{(totalEarnings / 1000).toFixed(0)}K
						</p>
					</div>
				</div>
			</motion.div>

			{/* Today's Schedule */}
			{todaysTasks.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<div className="divider my-4">TODAY'S SCHEDULE</div>
					<div className="space-y-3">
						{todaysTasks
							.sort((a, b) => {
								const priorityOrder = { high: 0, medium: 1, low: 2 }
								return priorityOrder[a.priority] - priorityOrder[b.priority]
							})
							.map((task, idx) => (
								<motion.div
									key={task.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.3 + idx * 0.1 }}
									className={`card bg-base-100 shadow-sm border-l-4 ${
										task.priority === 'high'
											? 'border-error'
											: task.priority === 'medium'
												? 'border-warning'
												: 'border-success'
									}`}
								>
									<div className="card-body p-4 space-y-3">
										<div className="flex items-start justify-between gap-3">
											<div className="flex-1">
												<h3 className="font-bold text-base">
													{task.clientName}
												</h3>
												<p className="text-sm text-base-content/70 flex items-center gap-2 mt-1">
													<FaMapMarkerAlt className="text-error text-xs" />
													{task.location}
												</p>
											</div>
											<div className="text-right">
												<p className="text-sm font-bold text-primary">
													{task.time}
												</p>
												<span
													className={`badge ${statusColors[task.status]} badge-sm gap-1 mt-1`}
												>
													{statusIcons[task.status]}
													{task.status}
												</span>
											</div>
										</div>
										<p className="text-sm text-base-content/60">
											{task.service}
										</p>
										<p className="text-xs text-base-content/50 italic">
											{task.notes}
										</p>
									</div>
								</motion.div>
							))}
					</div>
				</motion.div>
			)}

			{/* My Assigned Projects */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<div className="divider my-4">MY ASSIGNED PROJECTS</div>
				<div className="space-y-4">
					<AnimatePresence>
						{projects.map((project, idx) => {
							const nextStatus = getNextStatus(project.status)
							const progress = getStatusProgress(project.status)

							return (
								<motion.div
									key={project.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ delay: 0.4 + idx * 0.05 }}
									className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
								>
									<div className="card-body space-y-4">
										{/* Project Header */}
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1">
												<h3 className="font-bold text-lg">
													{project.clientName}
												</h3>
												<p className="text-sm text-base-content/70 flex items-center gap-2 mt-1">
													<FaMapMarkerAlt className="text-error text-xs" />
													{project.location}
												</p>
											</div>
											<span
												className={`badge ${statusColors[project.status]} badge-lg gap-2`}
											>
												{statusIcons[project.status]}
												{project.status}
											</span>
										</div>

										{/* Service Info */}
										<div className="space-y-2 bg-base-200 rounded-lg p-3">
											<p className="text-sm font-semibold text-base-content">
												{project.service}
											</p>
											<p className="text-xs text-base-content/70 flex items-center gap-2">
												<FaClock className="text-primary text-xs" />
												{project.date} at {project.time}
											</p>
											<p className="text-sm font-bold text-success">
												{project.amount}
											</p>
										</div>

										{/* Status Progress Bar */}
										<div className="space-y-2">
											<div className="flex items-center justify-between text-xs">
												<span className="font-semibold">Progress</span>
												<span className="text-base-content/60">
													{statusSteps.indexOf(project.status) + 1} of{' '}
													{statusSteps.length}
												</span>
											</div>
											<progress
												className="progress progress-success w-full"
												value={progress}
												max="100"
											></progress>
										</div>

										{/* Materials (if visible) */}
										{project.materials.length > 0 && (
											<div className="space-y-2">
												<p className="text-xs font-semibold text-base-content">
													Materials Needed:
												</p>
												<div className="flex flex-wrap gap-2">
													{project.materials.map((material, i) => (
														<span
															key={i}
															className="badge badge-sm badge-outline"
														>
															{material}
														</span>
													))}
												</div>
											</div>
										)}

										{/* Status Update Section - Mobile Optimized */}
										{project.status !== 'Completed' && nextStatus && (
											<div className="space-y-2 bg-info/10 rounded-lg p-3 border border-info/20">
												<p className="text-xs font-semibold text-info-content">
													Next Step
												</p>
												<div className="flex gap-2">
													<button
														onClick={() =>
															handleStatusUpdate(
																project.id,
																nextStatus
															)
														}
														className="btn btn-sm btn-info flex-1 gap-2"
													>
														<FaChevronRight className="text-xs" />
														Update to {nextStatus}
													</button>
												</div>
											</div>
										)}

										{/* For Completed Projects */}
										{project.status === 'Completed' && (
											<div className="bg-success/10 rounded-lg p-3 border border-success/20 flex items-center gap-2 text-success text-sm">
												<FaCheckCircle /> Project completed successfully!
											</div>
										)}

										{/* Status Dropdown (for manual selection) */}
										<details className="collapse collapse-arrow border border-base-300 bg-base-200">
											<summary className="collapse-title py-2 px-3 text-sm font-semibold flex items-center gap-2">
												<FaEdit className="text-xs" /> Update Status Manually
											</summary>
											<div className="collapse-content space-y-2 p-3">
												<div className="grid grid-cols-2 gap-2">
													{statusSteps.map((step) => (
														<button
															key={step}
															onClick={() =>
																handleStatusUpdate(
																	project.id,
																	step
																)
															}
															className={`btn btn-xs ${
																project.status ===
																step
																	? 'btn-active'
																	: 'btn-ghost'
															}`}
														>
															{step}
														</button>
													))}
												</div>
											</div>
										</details>
									</div>
								</motion.div>
							)
						})}
					</AnimatePresence>
				</div>
			</motion.div>

			{/* Earnings Summary */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
			>
				<div className="divider my-4">EARNINGS SUMMARY</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Total Earnings Card */}
					<div className="card bg-gradient-to-br from-success to-success/70 text-success-content shadow-lg">
						<div className="card-body">
							<h3 className="card-title text-lg flex items-center gap-2">
								<FaDollarSign /> Total Earnings
							</h3>
							<p className="text-4xl font-bold mt-4">
								{totalEarnings.toLocaleString()} BDT
							</p>
							<p className="text-sm opacity-90 mt-2">
								From {completedProjects.length} completed projects
							</p>
						</div>
					</div>

					{/* Pending Earnings Card */}
					<div className="card bg-gradient-to-br from-warning to-warning/70 text-warning-content shadow-lg">
						<div className="card-body">
							<h3 className="card-title text-lg flex items-center gap-2">
								<FaClipboardList /> Pending Earnings
							</h3>
							<p className="text-4xl font-bold mt-4">
								{pendingEarnings.toLocaleString()} BDT
							</p>
							<p className="text-sm opacity-90 mt-2">
								From {pendingProjects.length} in-progress projects
							</p>
						</div>
					</div>
				</div>

				{/* Completed Projects History */}
				{completedProjects.length > 0 && (
					<div className="mt-6 space-y-3">
						<h3 className="font-bold text-lg flex items-center gap-2">
							<FaFileAlt /> Completed Projects
						</h3>
						<div className="space-y-2">
							{completedProjects.map((project, idx) => (
								<motion.div
									key={project.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.5 + idx * 0.05 }}
									className="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
								>
									<div className="flex-1">
										<p className="font-semibold text-sm">
											{project.clientName}
										</p>
										<p className="text-xs text-base-content/60">
											{project.service} • {project.location}
										</p>
									</div>
									<div className="text-right">
										<p className="font-bold text-success">
											+ {project.amount}
										</p>
										<p className="text-xs text-base-content/60">
											{project.date}
										</p>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				)}
			</motion.div>
		</div>
	)
}

export default DecoratorDashboard
