import React, { createContext, useContext, useState } from 'react'

const BookingContext = createContext(null)

export const BookingProvider = ({ children }) => {
	const [bookings, setBookings] = useState([
		// Initial mock data
		{
			id: 1,
			service: 'Living Room Makeover',
			date: '2025-12-20',
			location: 'New York, NY',
			amount: '$450',
			status: 'Confirmed',
			decorator: 'Sarah Johnson'
		}
	])

	const [payments, setPayments] = useState([
		// Initial mock data
		{
			id: 'PAY-001',
			service: 'Living Room Makeover',
			amount: '$450',
			date: '2025-12-15',
			status: 'Completed',
			method: 'Credit Card',
			transactionId: 'TXN-45678901'
		}
	])

	const addBooking = (booking) => {
		const newBooking = {
			id: bookings.length + 1,
			...booking,
			status: 'Pending'
		}
		setBookings([...bookings, newBooking])
		return newBooking
	}

	const addPayment = (payment) => {
		const newPayment = {
			id: `PAY-${String(payments.length + 1).padStart(3, '0')}`,
			...payment,
			date: new Date().toISOString().split('T')[0],
			status: 'Completed',
			transactionId: `TXN-${Math.random().toString(36).substr(2, 9)}`
		}
		setPayments([...payments, newPayment])
		return newPayment
	}

	const updateBookingStatus = (id, status) => {
		setBookings(bookings.map(booking => 
			booking.id === id ? { ...booking, status } : booking
		))
	}

	const cancelBooking = (id) => {
		updateBookingStatus(id, 'Cancelled')
	}

	return (
		<BookingContext.Provider value={{ 
			bookings, 
			payments, 
			addBooking, 
			addPayment,
			updateBookingStatus,
			cancelBooking
		}}>
			{children}
		</BookingContext.Provider>
	)
}

export const useBooking = () => {
	const context = useContext(BookingContext)
	if (!context) {
		throw new Error('useBooking must be used within BookingProvider')
	}
	return context
}
