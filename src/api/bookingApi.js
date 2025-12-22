import axiosInstance from './axiosInstance'

// Create new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post('/bookings', bookingData)
    return response.data
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

// Get user's bookings
export const getUserBookings = async (userId) => {
  try {
    const response = await axiosInstance.get(`/bookings/user/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    throw error
  }
}

// Get all bookings (admin only)
export const getAllBookings = async () => {
  try {
    const response = await axiosInstance.get('/bookings')
    return response.data
  } catch (error) {
    console.error('Error fetching bookings:', error)
    throw error
  }
}

// Get single booking
export const getBookingById = async (bookingId) => {
  try {
    const response = await axiosInstance.get(`/bookings/${bookingId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching booking:', error)
    throw error
  }
}

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await axiosInstance.put(`/bookings/${bookingId}`, { status })
    return response.data
  } catch (error) {
    console.error('Error updating booking:', error)
    throw error
  }
}

// Cancel booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await axiosInstance.delete(`/bookings/${bookingId}`)
    return response.data
  } catch (error) {
    console.error('Error cancelling booking:', error)
    throw error
  }
}
