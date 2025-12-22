import axiosInstance from './axiosInstance'

// Get all rooms/services
export const getAllRooms = async () => {
  try {
    const response = await axiosInstance.get('/rooms')
    return response.data
  } catch (error) {
    console.error('Error fetching rooms:', error)
    throw error
  }
}

// Get single room by ID
export const getRoomById = async (roomId) => {
  try {
    // Primary: RESTful by id using MongoDB ObjectId
    const response = await axiosInstance.get(`/rooms/${roomId}`)
    // Handle both direct object and wrapped response
    return response.data.data || response.data
  } catch (error) {
    console.error('Error fetching room:', error)
    throw error
  }
}

// Create new room (admin only)
export const createRoom = async (roomData) => {
  try {
    const response = await axiosInstance.post('/rooms', roomData)
    return response.data
  } catch (error) {
    console.error('Error creating room:', error)
    throw error
  }
}

// Update room (admin only)
export const updateRoom = async (roomId, roomData) => {
  try {
    const response = await axiosInstance.put(`/rooms/${roomId}`, roomData)
    return response.data
  } catch (error) {
    console.error('Error updating room:', error)
    throw error
  }
}

// Delete room (admin only)
export const deleteRoom = async (roomId) => {
  try {
    const response = await axiosInstance.delete(`/rooms/${roomId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting room:', error)
    throw error
  }
}
