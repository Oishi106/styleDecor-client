import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth token if unauthorized
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      // Optionally redirect to login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
