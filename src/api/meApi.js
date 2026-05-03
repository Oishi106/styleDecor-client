import axiosInstance from './axiosInstance'

export const getMe = async () => {
  const response = await axiosInstance.get('/users/me')
  return response.data
}

export const updateMe = async (payload) => {
  // Support sending FormData (file upload) or JSON payloads
  if (payload instanceof FormData) {
    const response = await axiosInstance.put('/users/me', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }
  const response = await axiosInstance.put('/users/me', payload)
  return response.data
}
