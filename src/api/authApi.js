import axiosInstance from './axiosInstance'

// Login and obtain JWT + role
export const loginRequest = async (email, password) => {
  const response = await axiosInstance.post('/auth/jwt', { email, password })
  return response.data
}

// Register new user (role assigned by backend)
export const registerRequest = async (payload) => {
  const response = await axiosInstance.post('/users', payload)
  return response.data
}

// Decorator application
export const applyDecoratorRequest = async (payload) => {
  const response = await axiosInstance.post('/decorator/apply', payload)
  return response.data
}
