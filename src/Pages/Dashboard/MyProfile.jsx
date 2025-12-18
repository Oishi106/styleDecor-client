import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import { useAuth } from '../../context/AuthProvider'

const MyProfile = () => {
	const { user } = useAuth()
	const [isEditing, setIsEditing] = useState(false)
	const [profileData, setProfileData] = useState({
		name: user?.displayName || 'John Doe',
		email: user?.email || 'john@example.com',
		phone: '+1 234 567 8900',
		address: '123 Main Street, New York, NY 10001',
		bio: 'Interior decoration enthusiast with a passion for modern and minimalist designs.',
		photoURL: user?.photoURL || ''
	})

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setProfileData(prev => ({ ...prev, [name]: value }))
	}

	const handleSave = () => {
		setIsEditing(false)
		// Show success message
		alert('Profile updated successfully!')
	}

	const handleCancel = () => {
		setIsEditing(false)
		// Reset to original data
		setProfileData({
			name: user?.displayName || 'John Doe',
			email: user?.email || 'john@example.com',
			phone: '+1 234 567 8900',
			address: '123 Main Street, New York, NY 10001',
			bio: 'Interior decoration enthusiast with a passion for modern and minimalist designs.',
			photoURL: user?.photoURL || ''
		})
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold">My Profile</h2>
					<p className="text-base-content/60">Manage your personal information</p>
				</div>
				{!isEditing ? (
					<button
						onClick={() => setIsEditing(true)}
						className="btn btn-primary gap-2"
					>
						<FaEdit />
						Edit Profile
					</button>
				) : (
					<div className="flex gap-2">
						<button
							onClick={handleSave}
							className="btn btn-success gap-2"
						>
							<FaSave />
							Save
						</button>
						<button
							onClick={handleCancel}
							className="btn btn-error gap-2"
						>
							<FaTimes />
							Cancel
						</button>
					</div>
				)}
			</div>

			{/* Profile Card */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="card bg-base-100 shadow-xl"
			>
				<div className="card-body">
					{/* Profile Picture Section */}
					<div className="flex flex-col items-center mb-6 pb-6 border-b border-base-300">
						<div className="relative">
							{profileData.photoURL ? (
								<img
									src={profileData.photoURL}
									alt="Profile"
									className="w-32 h-32 rounded-full object-cover border-4 border-primary"
								/>
							) : (
								<div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center border-4 border-primary">
									<span className="text-4xl text-white font-bold">
										{profileData.name.charAt(0).toUpperCase()}
									</span>
								</div>
							)}
							{isEditing && (
								<button className="absolute bottom-0 right-0 btn btn-circle btn-sm btn-primary">
									<FaCamera />
								</button>
							)}
						</div>
						<h3 className="text-2xl font-bold mt-4">{profileData.name}</h3>
						<p className="text-base-content/60">{profileData.email}</p>
						<div className="badge badge-primary mt-2">Premium Member</div>
					</div>

					{/* Profile Form */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Full Name */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold flex items-center gap-2">
									<FaUser className="text-primary" />
									Full Name
								</span>
							</label>
							<input
								type="text"
								name="name"
								value={profileData.name}
								onChange={handleInputChange}
								disabled={!isEditing}
								className="input input-bordered bg-base-200"
							/>
						</div>

						{/* Email */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold flex items-center gap-2">
									<FaEnvelope className="text-primary" />
									Email Address
								</span>
							</label>
							<input
								type="email"
								name="email"
								value={profileData.email}
								onChange={handleInputChange}
								disabled={!isEditing}
								className="input input-bordered bg-base-200"
							/>
						</div>

						{/* Phone */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold flex items-center gap-2">
									<FaPhone className="text-primary" />
									Phone Number
								</span>
							</label>
							<input
								type="tel"
								name="phone"
								value={profileData.phone}
								onChange={handleInputChange}
								disabled={!isEditing}
								className="input input-bordered bg-base-200"
							/>
						</div>

						{/* Address */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold flex items-center gap-2">
									<FaMapMarkerAlt className="text-primary" />
									Address
								</span>
							</label>
							<input
								type="text"
								name="address"
								value={profileData.address}
								onChange={handleInputChange}
								disabled={!isEditing}
								className="input input-bordered bg-base-200"
							/>
						</div>

						{/* Bio - Full Width */}
						<div className="form-control lg:col-span-2">
							<label className="label">
								<span className="label-text font-semibold">Bio</span>
							</label>
							<textarea
								name="bio"
								value={profileData.bio}
								onChange={handleInputChange}
								disabled={!isEditing}
								rows="4"
								className="textarea textarea-bordered bg-base-200"
							/>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Account Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="card bg-gradient-to-br from-primary to-primary-focus text-white shadow-xl"
				>
					<div className="card-body">
						<h3 className="text-lg font-semibold">Total Bookings</h3>
						<p className="text-4xl font-bold">12</p>
						<p className="text-sm opacity-80">Since joining</p>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="card bg-gradient-to-br from-secondary to-secondary-focus text-white shadow-xl"
				>
					<div className="card-body">
						<h3 className="text-lg font-semibold">Total Spent</h3>
						<p className="text-4xl font-bold">$2,450</p>
						<p className="text-sm opacity-80">All time</p>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="card bg-gradient-to-br from-accent to-warning text-white shadow-xl"
				>
					<div className="card-body">
						<h3 className="text-lg font-semibold">Member Since</h3>
						<p className="text-4xl font-bold">2024</p>
						<p className="text-sm opacity-80">1 year ago</p>
					</div>
				</motion.div>
			</div>
		</div>
	)
}

export default MyProfile
