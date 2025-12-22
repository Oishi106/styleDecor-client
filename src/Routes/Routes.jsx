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
import StripePayment from '../Pages/StripePayment'
import CoverageMap from '../Pages/CoverageMap'
import Register from '../Pages/Register'
import PrivateRoutes from './PrivateRoutes'
import AdminRoute from './AdminRoute'
import DecoratorRoute from './DecoratorRoute'
import UserRoute from './UserRoute'
import Profile from '../Pages/Profile'
import Auth from '../Pages/Auth'
import DashboardSelector from '../Pages/DashboardSelector'
import UserDashboard from '../Pages/Dashboard/UserDashboard'
import AdminDashboard from '../Pages/Dashboard/AdminDashboard'
import DecoratorDashboard from '../Pages/Dashboard/DecoratorDashboard'
import DecoratorProfile from '../Pages/DecoratorProfile'
import MyProfile from '../Pages/Dashboard/MyProfile'
import MyBookings from '../Pages/Dashboard/MyBookings'
import PaymentHistory from '../Pages/Dashboard/PaymentHistory'
import Unauthorized from '../Pages/Unauthorized'

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
                path: 'decorators/:id',
                element: <DecoratorProfile />,
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
                path: 'stripe-payment',
                element: (
                    <PrivateRoutes>
                        <StripePayment />
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
                element: <Auth />,
            },
            {
                path: 'unauthorized',
                element: <Unauthorized />,
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
                element: <DashboardSelector />,
            },
            {
                path: 'user',
                element: (
                    <UserRoute>
                        <UserDashboard />
                    </UserRoute>
                ),
            },
            {
                path: 'admin',
                element: (
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                ),
            },
            {
                path: 'decorator',
                element: (
                    <DecoratorRoute>
                        <DecoratorDashboard />
                    </DecoratorRoute>
                ),
            },
            {
                path: 'profile',
                element: (
                    <UserRoute>
                        <MyProfile />
                    </UserRoute>
                ),
            },
            {
                path: 'bookings',
                element: (
                    <UserRoute>
                        <MyBookings />
                    </UserRoute>
                ),
            },
            {
                path: 'payments',
                element: (
                    <UserRoute>
                        <PaymentHistory />
                    </UserRoute>
                ),
            },
            {
                path: 'saved',
                element: (
                    <UserRoute>
                        <div className="p-6"><h2 className="text-2xl font-bold">Saved Services</h2></div>
                    </UserRoute>
                ),
            },
        ],
    },
    // Legacy redirects (backwards compatibility)
    {
        path: '/admin',
        element: <DashboardSelector />,
    },
    {
        path: '/admin/dashboard',
        element: <DashboardSelector />,
    },
    {
        path: '/decorator',
        element: <DashboardSelector />,
    },
    {
        path: '/decorator/dashboard',
        element: <DashboardSelector />,
    },
])

export default router