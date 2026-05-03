import React, { useEffect, useState } from 'react'
import { FaEnvelope, FaUser, FaShieldAlt, FaEdit, FaSave, FaCamera } from 'react-icons/fa'
import { useAuth } from '../../context/AuthProvider'
import Swal from 'sweetalert2'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase/firebase.config'
import axiosInstance from '../../api/axiosInstance'

const getDisplayName = (u) => u?.name || u?.displayName || u?.fullName || ''

const MyProfile = () => {
    const { user, role, setUser } = useAuth()
    const [editing, setEditing] = useState(false)
    const [name, setName] = useState('')
    const [photoUrl, setPhotoUrl] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setName(getDisplayName(user) || '')
        setPhotoUrl(user?.photoURL || user?.photoUrl || user?.avatarUrl || '')
    }, [user])

    const handleFileChange = (e) => {
        const file = e?.target?.files?.[0]
        if (!file) return
        setSelectedFile(file)
        const reader = new FileReader()
        reader.onload = () => {
            setPhotoUrl(reader.result || '')
        }
        reader.readAsDataURL(file)
    }

    const onSave = async (e) => {
        e?.preventDefault()
        if (!user) return
        setSaving(true)

        try {
            let finalPhotoUrl = photoUrl

            // ১. ছবি থাকলে Firebase Storage এ আপলোড করো
            if (selectedFile) {
                const filePath = `profiles/${user?.email || 'user'}/${Date.now()}-${selectedFile.name}`
                const storageRef = ref(storage, filePath)
                const snapshot = await uploadBytes(storageRef, selectedFile)
                finalPhotoUrl = await getDownloadURL(snapshot.ref)
            }

            // ২. Backend এ update পাঠাও (token automatically যাবে)
            const response = await axiosInstance.patch(`/users/update/${user.email}`, {
                name: name,
                photoURL: finalPhotoUrl,
            })

            if (response.data.success) {
                const updatedUser = {
                    ...user,
                    name: name,
                    displayName: name,
                    photoURL: finalPhotoUrl,
                }

                // ৩. Context ও local state আপডেট করো
                setUser(updatedUser)
                setEditing(false)
                setSelectedFile(null)

                Swal.fire({
                    icon: 'success',
                    title: 'Saved',
                    text: 'Profile updated successfully!',
                    confirmButtonColor: '#6366f1',
                })
            } else {
                throw new Error('Failed to save to database')
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || err?.message || 'Failed to update profile',
            })
        } finally {
            setSaving(false)
        }
    }

    const displayName = getDisplayName(user)
    const email = user?.email || ''
    const photoURL = user?.photoURL || user?.photoUrl || user?.avatarUrl || ''

    if (!user) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <p className="text-base-content/60">Please log in to view your profile.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold">My Profile</h2>
                <p className="text-base-content/60">Your account information</p>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body gap-6">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            {(photoUrl || photoURL) ? (
                                <img
                                    src={photoUrl || photoURL}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                                    {(displayName || email || 'U').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xl font-bold truncate">{displayName || '—'}</p>
                            <p className="text-sm text-base-content/60 truncate">{email || '—'}</p>
                        </div>
                        <div className="ml-auto">
                            {!editing && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline flex items-center gap-2"
                                    onClick={() => setEditing(true)}
                                >
                                    <FaEdit /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Edit Form */}
                    {editing ? (
                        <form onSubmit={onSave} className="rounded-2xl border border-primary/20 bg-base-200/50 p-5 space-y-5">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div>
                                    <h3 className="text-lg font-semibold">Update Information</h3>
                                    <p className="text-sm text-base-content/60">Make changes to your profile below.</p>
                                </div>
                                <div className="badge badge-primary">Editing Mode</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Display Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="input input-bordered focus:input-primary"
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Profile Photo</span>
                                    </label>
                                    <label className="btn btn-outline btn-sm gap-2 w-full justify-start h-12">
                                        <FaCamera />
                                        <span className="truncate">
                                            {selectedFile ? selectedFile.name : 'Change Photo'}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Email (Read-only)</span>
                                    </label>
                                    <input
                                        value={email}
                                        readOnly
                                        className="input input-bordered opacity-70 cursor-not-allowed"
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">User Role</span>
                                    </label>
                                    <input
                                        value={role || '—'}
                                        readOnly
                                        className="input input-bordered opacity-70 cursor-not-allowed capitalize"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-300">
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => {
                                        setEditing(false)
                                        setName(getDisplayName(user))
                                        setPhotoUrl(user?.photoURL || user?.photoUrl || '')
                                        setSelectedFile(null)
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm flex items-center gap-2"
                                    disabled={saving}
                                >
                                    {saving
                                        ? <span className="loading loading-spinner loading-xs"></span>
                                        : <FaSave />}
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="card bg-base-200 shadow-sm">
                                <div className="card-body py-4">
                                    <p className="text-xs text-base-content/60 flex items-center gap-2">
                                        <FaUser /> Name
                                    </p>
                                    <p className="font-semibold truncate">{displayName || '—'}</p>
                                </div>
                            </div>
                            <div className="card bg-base-200 shadow-sm">
                                <div className="card-body py-4">
                                    <p className="text-xs text-base-content/60 flex items-center gap-2">
                                        <FaEnvelope /> Email
                                    </p>
                                    <p className="font-semibold truncate">{email || '—'}</p>
                                </div>
                            </div>
                            <div className="card bg-base-200 shadow-sm">
                                <div className="card-body py-4">
                                    <p className="text-xs text-base-content/60 flex items-center gap-2">
                                        <FaShieldAlt /> Role
                                    </p>
                                    <p className="font-semibold capitalize">{role || '—'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyProfile