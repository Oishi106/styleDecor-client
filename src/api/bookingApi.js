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

// Role-based bookings
export const getUserBookings = async () => {
  try {
    const response = await axiosInstance.get('/user/bookings')
    return response.data
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    throw error
  }
}

export const getDecoratorBookings = async (status) => {
  try {
    // Backend uses /decorator/jobs. Keep a fallback for older routes.
    const params = status ? { status } : undefined
    try {
      const response = await axiosInstance.get('/decorator/jobs', { params })
      return response.data
    } catch (err) {
      if (err?.response?.status !== 404) throw err
      const response = await axiosInstance.get('/decorator/bookings', { params })
      return response.data
    }
  } catch (error) {
    console.error('Error fetching decorator jobs:', error)
    throw error
  }
}

export const getAdminBookings = async (status = 'all') => {
  try {
    const response = await axiosInstance.get('/admin/bookings', { params: { status } })
    return response.data
  } catch (error) {
    console.error('Error fetching admin bookings:', error)
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
