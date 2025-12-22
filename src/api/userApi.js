import axiosInstance from './axiosInstance'

// Store/Update user details in database
export const storeUserInDatabase = async (userData) => {
  try {
    const response = await axiosInstance.post('/users', userData)
    return response.data
  } catch (error) {
    console.error('Error storing user:', error)
    throw error
  }
}

// Get user details from database
export const getUserFromDatabase = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

// Update user details
export const updateUserInDatabase = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}`, userData)
    return response.data
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/users')
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

// Delete user
export const deleteUserFromDatabase = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}
