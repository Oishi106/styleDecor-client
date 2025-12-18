import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../Layouts/MainLayout'
import DashboardLayout from '../Layouts/DashboardLayout'
import ErrorPage from '../Pages/ErrorPage'
import Home from '../Pages/Home'
import About from '../Pages/About'
import Contact from '../Pages/Contact'
import ServicePage from '../Pages/ServicePage'
import ServiceDetails from '../Pages/ServiceDetails'
import Booking from '../Pages/Booking'
import Payment from '../Pages/Payment'
import CoverageMap from '../Pages/CoverageMap'
import Register from '../Pages/Register'
import PrivateRoutes from './PrivateRoutes'
import Login from '../Pages/Login'
import Profile from '../Pages/Profile'
import UserDashboard from '../Pages/Dashboard/UserDashboard'
import AdminDashboard from '../Pages/Dashboard/AdminDashboard'
import DecoratorDashboard from '../Pages/Dashboard/DecoratorDashboard'
import MyProfile from '../Pages/Dashboard/MyProfile'
import MyBookings from '../Pages/Dashboard/MyBookings'
import PaymentHistory from '../Pages/Dashboard/PaymentHistory'

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        hydrateFallbackElement: <p>Loading...</p>,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'services',
                element: <ServicePage />,
            },
            {
                path: 'services/:id',
                element: <ServiceDetails />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'contact',
                element: <Contact />,
            },
            {
                path: 'booking',
                element: (
                    <PrivateRoutes>
                        <Booking />
                    </PrivateRoutes>
                ),
            },
            {
                path: 'payment',
                element: (
                    <PrivateRoutes>
                        <Payment />
                    </PrivateRoutes>
                ),
            },
            {
                path: 'coverage',
                element: <CoverageMap />,
            },
            {
                path: 'register',
                element: <Register />,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'profile',
                element: (
                    <PrivateRoutes>
                        <Profile />
                    </PrivateRoutes>
                ),
            },
            {
                path: '*',
                element: <ErrorPage />,
            },
        ],
    },
    // Dashboard Routes with DashboardLayout
    {
        path: '/dashboard',
        element: (
            <PrivateRoutes>
                <DashboardLayout />
            </PrivateRoutes>
        ),
        children: [
            {
                index: true,
                element: <UserDashboard />,
            },
            {
                path: 'profile',
                element: <MyProfile />,
            },
            {
                path: 'bookings',
                element: <MyBookings />,
            },
            {
                path: 'payments',
                element: <PaymentHistory />,
            },
            {
                path: 'saved',
                element: <div className="p-6"><h2 className="text-2xl font-bold">Saved Services</h2></div>,
            },
        ],
    },
    {
        path: '/admin',
        element: (
            <PrivateRoutes>
                <DashboardLayout />
            </PrivateRoutes>
        ),
        children: [
            {
                index: true,
                element: <AdminDashboard />,
            },
            {
                path: 'users',
                element: <div className="p-6"><h2 className="text-2xl font-bold">Manage Users</h2></div>,
            },
            {
                path: 'services',
                element: <div className="p-6"><h2 className="text-2xl font-bold">Manage Services</h2></div>,
            },
            {
                path: 'bookings',
                element: <div className="p-6"><h2 className="text-2xl font-bold">All Bookings</h2></div>,
            },
            {
                path: 'analytics',
                element: <div className="p-6"><h2 className="text-2xl font-bold">Analytics</h2></div>,
            },
        ],
    },
    {
        path: '/decorator',
        element: (
            <PrivateRoutes>
                <DashboardLayout />
            </PrivateRoutes>
        ),
        children: [
            {
                index: true,
                element: <DecoratorDashboard />,
            },
            {
                path: 'services',
                element: <div className="p-6"><h2 className="text-2xl font-bold">My Services</h2></div>,
            },
            {
                path: 'bookings',
                element: <div className="p-6"><h2 className="text-2xl font-bold">My Bookings</h2></div>,
            },
            {
                path: 'reviews',
                element: <div className="p-6"><h2 className="text-2xl font-bold">Reviews</h2></div>,
            },
            {
                path: 'earnings',
                element: <div className="p-6"><h2 className="text-2xl font-bold">Earnings</h2></div>,
            },
        ],
    },
])

export default router