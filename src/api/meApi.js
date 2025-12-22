import axiosInstance from './axiosInstance'

export const getMe = async () => {
  const response = await axiosInstance.get('/users/me')
  return response.data
}
