import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaHome, FaShieldAlt, FaPalette, FaUser, FaSignOutAlt, FaChartLine, FaUsers, FaCog, FaBell, FaClipboardList } from 'react-icons/fa'
import { useAuth } from '../context/AuthProvider'

const DashboardLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const { user, logout } = useAuth()
	const location = useLocation()

	const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

	const menuItems = [
		{
			title: 'User Dashboard',
			icon: FaHome,
			href: '/dashboard',
			section: 'user',
			items: [
				{ label: 'Overview', href: '/dashboard' },
				{ label: 'My Profile', href: '/dashboard/profile' },
				{ label: 'My Bookings', href: '/dashboard/bookings' },
				{ label: 'Payment History', href: '/dashboard/payments' },
				{ label: 'Saved Services', href: '/dashboard/saved' }
			]
		},
		{
			title: 'Admin Dashboard',
			icon: FaShieldAlt,
			href: '/admin',
			section: 'admin',
			items: [
				{ label: 'Overview', href: '/admin' },
				{ label: 'Users', href: '/admin/users' },
				{ label: 'Services', href: '/admin/services' },
				{ label: 'Bookings', href: '/admin/bookings' },
				{ label: 'Analytics', href: '/admin/analytics' }
			]
		},
		{
			title: 'Decorator Dashboard',
			icon: FaPalette,
			href: '/decorator',
			section: 'decorator',
			items: [
				{ label: 'Overview', href: '/decorator' },
				{ label: 'My Services', href: '/decorator/services' },
				{ label: 'Bookings', href: '/decorator/bookings' },
				{ label: 'Reviews', href: '/decorator/reviews' },
				{ label: 'Earnings', href: '/decorator/earnings' }
			]
		}
	]

	const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

	const sidebarVariants = {
		hidden: { x: '-100%' },
		visible: { x: 0 }
	}

	const overlayVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 }
	}

	return (
		<div className="flex h-screen bg-base-100">
			{/* Mobile Overlay */}
			<AnimatePresence>
				{sidebarOpen && (
					<motion.div
						variants={overlayVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
						onClick={() => setSidebarOpen(false)}
						className="fixed inset-0 bg-black/50 z-30 lg:hidden"
					/>
				)}
			</AnimatePresence>

			{/* Sidebar */}
			<motion.div
				variants={sidebarVariants}
				initial="visible"
				animate={sidebarOpen ? 'visible' : 'hidden'}
				transition={{ type: 'spring', stiffness: 300, damping: 30 }}
				className="fixed lg:static w-64 h-screen bg-gradient-to-b from-neutral to-neutral-900 text-neutral-content flex flex-col z-40 lg:z-auto"
			>
				{/* Sidebar Header */}
				<div className="p-6 border-b border-neutral-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="bg-primary p-2 rounded-lg">
							<span className="text-xl font-bold text-white">🎨</span>
						</div>
						<div>
							<h3 className="font-bold text-lg text-white">StyleDecor</h3>
							<p className="text-xs text-neutral-300">Dashboard</p>
						</div>
					</div>
					<button
						onClick={() => setSidebarOpen(false)}
						className="lg:hidden btn btn-ghost btn-sm btn-circle"
					>
						<FaTimes className="text-lg" />
					</button>
				</div>

				{/* User Profile Section */}
				<div className="px-6 py-4 border-b border-neutral-700">
					<div className="flex items-center gap-3 mb-2">
						{user?.photoURL ? (
							<img
								src={user.photoURL}
								alt={user.displayName}
								className="w-10 h-10 rounded-full object-cover"
							/>
						) : (
							<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
								<span className="text-white font-bold">
									{user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
								</span>
							</div>
						)}
						<div className="flex-1 min-w-0">
							<p className="text-sm font-semibold text-white truncate">
								{user?.displayName || 'User'}
							</p>
							<p className="text-xs text-neutral-300 truncate">
								{user?.email || 'user@example.com'}
							</p>
						</div>
					</div>
					<button className="btn btn-sm btn-outline w-full mt-2 text-neutral-300 hover:text-white">
						<FaCog className="text-sm" />
						Settings
					</button>
				</div>

				{/* Navigation Menu */}
				<nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
					{menuItems.map((section, idx) => {
						const Icon = section.icon
						const sectionActive = isActive(section.href)
						return (
							<div key={idx}>
								{/* Main Section */}
								<Link
									to={section.href}
									onClick={() => setSidebarOpen(false)}
									className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
										sectionActive
											? 'bg-primary text-white shadow-lg'
											: 'text-neutral-300 hover:bg-neutral-800'
									}`}
								>
									<Icon className="text-lg" />
									<span>{section.title}</span>
									{sectionActive && (
										<motion.div
											layoutId="activeIndicator"
											className="ml-auto w-2 h-2 bg-white rounded-full"
										/>
									)}
								</Link>

								{/* Submenu */}
								<AnimatePresence>
									{sectionActive && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: 'auto' }}
											exit={{ opacity: 0, height: 0 }}
											className="overflow-hidden"
										>
											<div className="mt-2 ml-4 space-y-1 border-l border-neutral-700 pl-4">
												{section.items.map((item, itemIdx) => (
													<Link
														key={itemIdx}
														to={item.href}
														onClick={() => setSidebarOpen(false)}
														className={`block px-3 py-2 rounded text-sm transition-all ${
															location.pathname === item.href
																? 'bg-primary text-white font-semibold'
																: 'text-neutral-300 hover:text-white hover:bg-neutral-800'
														}`}
													>
														{item.label}
													</Link>
												))}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						)
					})}
				</nav>

				{/* Sidebar Footer */}
				<div className="p-6 border-t border-neutral-700 space-y-3">
					<button className="btn btn-outline w-full justify-start gap-2 text-neutral-300 hover:text-white">
						<FaBell className="text-lg" />
						Notifications
					</button>
					<button
						onClick={logout}
						className="btn btn-error w-full justify-start gap-2"
					>
						<FaSignOutAlt className="text-lg" />
						Logout
					</button>
				</div>
			</motion.div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Top Header */}
				<div className="bg-white border-b border-base-300 px-6 py-4 flex items-center justify-between">
					<button
						onClick={toggleSidebar}
						className="lg:hidden btn btn-ghost btn-circle"
					>
						<FaBars className="text-2xl" />
					</button>
					<div className="flex-1 text-center lg:text-left">
						<h1 className="text-2xl font-bold text-base-content">
							{menuItems.find(item => isActive(item.href))?.title || 'Dashboard'}
						</h1>
					</div>
					<div className="flex items-center gap-4">
						<button className="btn btn-ghost btn-circle relative">
							<FaBell className="text-xl" />
							<span className="badge badge-sm badge-primary absolute top-0 right-0">3</span>
						</button>
						{user?.photoURL ? (
							<img
								src={user.photoURL}
								alt={user.displayName}
								className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
								title={user.displayName}
							/>
						) : (
							<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
								<span className="text-white font-bold text-sm">
									{user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
								</span>
							</div>
						)}
					</div>
				</div>

				{/* Main Content Area */}
				<div className="flex-1 overflow-y-auto bg-base-50">
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className="p-6"
					>
						<Outlet />
					</motion.div>
				</div>
			</div>
		</div>
	)
}

export default DashboardLayout
