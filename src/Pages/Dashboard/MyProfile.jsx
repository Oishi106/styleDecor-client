import React from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaUser, FaShieldAlt } from 'react-icons/fa'
import { useAuth } from '../../context/AuthProvider'

const getDisplayName = (u) => u?.name || u?.displayName || u?.fullName || ''

const MyProfile = () => {
	const { user, role } = useAuth()
	const displayName = getDisplayName(user)
	const email = user?.email || ''
	const photoURL = user?.photoURL || user?.photoUrl || user?.avatarUrl || ''

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-3xl font-bold">My Profile</h2>
				<p className="text-base-content/60">Your account information</p>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				className="card bg-base-100 shadow-xl"
			>
				<div className="card-body gap-6">
					<div className="flex items-center gap-4">
						{photoURL ? (
							<img src={photoURL} alt={displayName || email || 'Profile'} className="w-16 h-16 rounded-full object-cover" />
						) : (
							<div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
								{(displayName || email || 'U').charAt(0).toUpperCase()}
							</div>
						)}
						<div className="min-w-0">
							<p className="text-xl font-bold truncate">{displayName || '—'}</p>
							<p className="text-sm text-base-content/60 truncate">{email || '—'}</p>
						</div>
						{role && <span className="badge badge-primary capitalize">{role}</span>}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="card bg-base-200">
							<div className="card-body py-4">
								<p className="text-xs text-base-content/60 flex items-center gap-2"><FaUser /> Name</p>
								<p className="font-semibold truncate">{displayName || '—'}</p>
							</div>
						</div>
						<div className="card bg-base-200">
							<div className="card-body py-4">
								<p className="text-xs text-base-content/60 flex items-center gap-2"><FaEnvelope /> Email</p>
								<p className="font-semibold truncate">{email || '—'}</p>
							</div>
						</div>
						<div className="card bg-base-200">
							<div className="card-body py-4">
								<p className="text-xs text-base-content/60 flex items-center gap-2"><FaShieldAlt /> Role</p>
								<p className="font-semibold capitalize">{role || '—'}</p>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	)
}

export default MyProfile
