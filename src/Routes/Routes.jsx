import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../Layouts/MainLayout'
import ErrorPage from '../Pages/ErrorPage'
import Home from '../Pages/Home'
import About from '../Pages/About'
import Contact from '../Pages/Contact'
import ServicePage from '../Pages/ServicePage'
import ServiceDetails from '../Pages/ServiceDetails'
import Booking from '../Pages/Booking'
import Payment from '../Pages/Payment'
import CoverageMap from '../Pages/CoverageMap'
import Login from '../Pages/Login'

const DashboardPlaceholder = () => <div>Dashboard coming soon</div>

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
                path: 'dashboard',
                element: <DashboardPlaceholder />,
            },
            {
                path: 'booking',
                element: <Booking />,
            },
            {
                path: 'payment',
                element: <Payment />,
            },
            {
                path: 'coverage',
                element: <CoverageMap />,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: '*',
                element: <ErrorPage />,
            },
        ],
    },
])

export default router