import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { FaShieldAlt } from 'react-icons/fa'

const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Services', to: '/services' },
    { name: 'About', to: '/about' },
    { name: 'Contact', to: '/contact' },
]

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const displayName = user?.name || user?.fullName || user?.displayName || ''
    const email = user?.email || ''
    const photoURL = user?.photoURL || user?.photoUrl || user?.avatarUrl || ''
    const avatarInitial = (displayName || email || 'U').charAt(0).toUpperCase()

    const handleLogout = async () => {
        try {
            await logout()
        } finally {
            navigate('/login', { replace: true })
        }
    }

    const renderLinks = () => (
        navLinks.map((link) => (
            <li key={link.name}>
                <NavLink 
                    to={link.to} 
                    className={({ isActive }) => 
                        `font-medium ${isActive ? 'bg-primary text-primary-content' : ''}`
                    }
                >
                    {link.name}
                </NavLink>
            </li>
        ))
    )

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-base-100/90 backdrop-blur shadow-sm">
            <div className="navbar w-full px-4 lg:px-8">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 w-56 rounded-box bg-base-100 p-3 shadow z-10"
                        >
                            {renderLinks()}
                            {user ? (
                                <>
                                    <li className="mt-2">
                                        <Link to="/dashboard" className="btn btn-primary btn-sm justify-center">
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li className="mt-2">
                                        <button onClick={handleLogout} className="btn btn-outline btn-sm justify-center">
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li className="mt-2">
                                    <Link to="/login" className="btn btn-outline btn-sm justify-center">
                                        Login
                                    </Link>
                                </li>
                            )}
                            <li className="mt-2">
                                <details>
                                    <summary className="font-medium">Account</summary>
                                    <ul className="p-2 bg-base-100">
                                        <li><a>Profile</a></li>
                                        <li><a>Settings</a></li>
                                        {user ? (
                                            <li><button onClick={handleLogout}>Logout</button></li>
                                        ) : (
                                            <li><Link to="/login">Login</Link></li>
                                        )}
                                    </ul>
                                </details>
                            </li>
                        </ul>
                    </div>
                    <Link to="/" className="btn btn-ghost gap-2 px-0 normal-case text-xl">
                        <FaShieldAlt className="text-primary text-2xl" />
                        <span className="font-bold text-2xl tracking-tight">StyleDecor</span>
                    </Link>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal gap-2 px-1 text-sm">
                        {renderLinks()}
                    </ul>
                </div>

                <div className="navbar-end gap-3">
                    {!user && (
                        <Link to="/login" className="btn btn-outline btn-sm">
                            Login
                        </Link>
                    )}
                    {user && (
                        <Link to="/dashboard" className="btn btn-primary btn-sm">
                            Dashboard
                        </Link>
                    )}
                    {user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                {photoURL ? (
                                    <div className="w-10 rounded-full">
                                        <img alt="avatar" src={photoURL} />
                                    </div>
                                ) : (
                                    <div className="bg-neutral text-neutral-content w-10 rounded-full flex items-center justify-center">
                                        {avatarInitial}
                                    </div>
                                )}
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content mt-3 w-52 rounded-box bg-base-100 p-3 shadow z-10"
                            >
                                <li className="menu-title">Account</li>
                                <li><a>{displayName || email || 'Account'}</a></li>
                                <li><Link to="/profile">My Profile</Link></li>
                                <li><Link to="/dashboard">Dashboard</Link></li>
                                <li><button onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default Navbar