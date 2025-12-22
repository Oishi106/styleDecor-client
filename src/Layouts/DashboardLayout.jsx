import React, { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
	FaBars,
	FaTimes,
	FaHome,
	FaShieldAlt,
	FaPalette,
	FaUser,
	FaSignOutAlt,
	FaChartLine,
	FaUsers,
	FaCog,
	FaBell,
	FaClipboardList,
	FaSpinner,
} from 'react-icons/fa'
import { useAuth } from '../context/AuthProvider'

/**
 * Shared Dashboard Layout Component
 *
 * Features:
 * - Persistent Sidebar with role-based navigation
 * - Top Navbar with user profile and notifications
 * - Dynamic menu items based on user role (User, Admin, Decorator)
 * - Loading spinner for async route transitions
 * - Home and Logout buttons always visible
 * - Mobile-responsive design
 * - Smooth Framer Motion animations
 */
const DashboardLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const { user, role, logout, loading: authLoading } = useAuth()
	const location = useLocation()
	const navigate = useNavigate()

	// Determine role strictly from backend-provided auth state
	const userRole = role

	// Role-based menu configuration
	const roleBasedMenus = {
		user: [
			{
				title: 'Dashboard',
				icon: FaHome,
				href: '/dashboard/user',
				section: 'user',
				items: [
					{ label: 'Overview', href: '/dashboard/user' },
					{ label: 'My Profile', href: '/dashboard/profile' },
					{ label: 'My Bookings', href: '/dashboard/bookings' },
					{ label: 'Payment History', href: '/dashboard/payments' },
					{ label: 'Saved Services', href: '/dashboard/saved' },
				],
			},
		],
		admin: [
			{
				title: 'Admin Panel',
				icon: FaShieldAlt,
				href: '/dashboard/admin',
				section: 'admin',
				items: [
					{ label: 'Overview', href: '/dashboard/admin' },
					{ label: 'Decorator Applications', href: '/dashboard/admin' },
					{ label: 'Bookings', href: '/dashboard/admin' },
					{ label: 'Add Decorator', href: '/dashboard/admin' },
				],
			},
		],
		decorator: [
			{
				title: 'My Projects',
				icon: FaPalette,
				href: '/dashboard/decorator',
				section: 'decorator',
				items: [
					{ label: 'My Assigned Bookings', href: '/dashboard/decorator' },
				],
			},
		],
	}

	// Get menu items based on user role
	const menuItems = userRole ? roleBasedMenus[userRole] || [] : []

	const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

	const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

	// Simulate loading on route change
	useEffect(() => {
		setIsLoading(true)
		const timer = setTimeout(() => setIsLoading(false), 300)
		return () => clearTimeout(timer)
	}, [location.pathname])

	// Close sidebar on mobile when navigation happens
	useEffect(() => {
		setSidebarOpen(false)
	}, [location.pathname])

	// Handle logout
	const handleLogout = async () => {
		try {
			setIsLoading(true)
			await logout()
			navigate('/login')
		} catch (error) {
			console.error('Logout error:', error)
		} finally {
			setIsLoading(false)
		}
	}

	// Navigate to home
	const handleHome = () => {
		navigate('/')
	}

	const sidebarVariants = {
		hidden: { x: '-100%' },
		visible: { x: 0 }
	}

	const overlayVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 }
	}

	const loadingSpinnerVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 }
	}

	// Show skeleton loading while auth is loading
	if (authLoading) {
		return (
			<div className="flex h-screen bg-base-100 items-center justify-center">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="flex flex-col items-center gap-4"
				>
					<FaSpinner className="text-4xl animate-spin text-primary" />
					<p className="text-base-content/60">Loading dashboard...</p>
				</motion.div>
			</div>
		)
	}

	// Fallback if user role cannot be determined
	if (!userRole) {
		return (
			<div className="flex h-screen bg-base-100 items-center justify-center">
				<div className="text-center space-y-4">
					<p className="text-lg font-semibold text-base-content">
						Unable to determine user role
					</p>
					<button
						onClick={handleLogout}
						className="btn btn-primary"
					>
						<FaSignOutAlt /> Logout
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="flex h-screen bg-base-100">
			{/* Loading Spinner Overlay */}
			<AnimatePresence>
				{isLoading && (
					<motion.div
						variants={loadingSpinnerVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
						className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 pointer-events-none"
					>
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
						>
							<FaSpinner className="text-5xl text-primary" />
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

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
				className="fixed lg:static w-64 h-screen bg-linear-to-b from-neutral to-neutral-900 text-neutral-content flex flex-col z-40 lg:z-auto"
			>
				{/* Sidebar Header */}
				<div className="p-6 border-b border-neutral-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="bg-primary p-2 rounded-lg">
							<span className="text-xl font-bold text-white">🎨</span>
						</div>
						<div>
							<h3 className="font-bold text-lg text-white">StyleDecor</h3>
							<p className="text-xs text-neutral-300 capitalize">{userRole} Portal</p>
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
					<div className="flex items-center gap-3 mb-3">
						{user?.photoURL ? (
							<img
								src={user.photoURL}
								alt={user.displayName}
								className="w-10 h-10 rounded-full object-cover border-2 border-primary"
							/>
						) : (
							<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center border-2 border-primary/50">
								<span className="text-white font-bold text-sm">
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
					<div className="space-y-2">
						<span className="inline-block badge badge-primary capitalize">
							{userRole}
						</span>
					</div>
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

				{/* Sidebar Footer - Always Visible */}
				<div className="p-6 border-t border-neutral-700 space-y-3">
					{/* Home Button - Always Visible */}
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleHome}
						className="btn btn-outline w-full justify-start gap-2 text-neutral-300 hover:text-white"
					>
						<FaHome className="text-lg" />
						Home
					</motion.button>

					{/* Notifications */}
					<button className="btn btn-outline w-full justify-start gap-2 text-neutral-300 hover:text-white">
						<FaBell className="text-lg" />
						Notifications
					</button>

					{/* Logout Button - Always Visible */}
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleLogout}
						disabled={isLoading}
						className="btn btn-error w-full justify-start gap-2"
					>
						{isLoading ? (
							<FaSpinner className="text-lg animate-spin" />
						) : (
							<FaSignOutAlt className="text-lg" />
						)}
						Logout
					</motion.button>
				</div>
			</motion.div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Top Navbar */}
				<div className="bg-white border-b border-base-300 shadow-sm">
					<div className="px-4 lg:px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
						{/* Mobile Menu Button */}
						<button
							onClick={toggleSidebar}
							className="lg:hidden btn btn-ghost btn-circle"
							title="Toggle Sidebar"
						>
							<FaBars className="text-2xl" />
						</button>

						{/* Page Title */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							key={location.pathname}
							className="flex-1 text-center lg:text-left px-4"
						>
							<h1 className="text-2xl font-bold text-base-content">
								{menuItems[0]?.title || 'Dashboard'}
							</h1>
							<p className="text-xs text-base-content/60 capitalize">
								Role: {userRole}
							</p>
						</motion.div>

						{/* Navbar Right Section */}
						<div className="flex items-center gap-3 lg:gap-4">
							{/* Notifications Bell */}
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
								className="btn btn-ghost btn-circle relative"
								title="Notifications"
							>
								<FaBell className="text-xl" />
								<span className="badge badge-sm badge-primary absolute top-0 right-0">
									3
								</span>
							</motion.button>

							{/* User Profile Avatar */}
							<motion.div
								whileHover={{ scale: 1.05 }}
								className="avatar cursor-pointer hover:opacity-80 transition-opacity"
								title={user?.displayName}
							>
								{user?.photoURL ? (
									<img
										src={user.photoURL}
										alt={user.displayName}
										className="w-10 rounded-full border border-primary"
									/>
								) : (
									<div className="w-10 bg-primary rounded-full flex items-center justify-center border border-primary">
										<span className="text-white font-bold text-sm">
											{user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
										</span>
									</div>
								)}
							</motion.div>
						</div>
					</div>
				</div>

				{/* Main Content Area */}
				<div className="flex-1 overflow-y-auto bg-base-50">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8" style={{ maxWidth: '1280px' }}>
						<motion.div
							key={location.pathname}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							<Outlet />
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DashboardLayout
