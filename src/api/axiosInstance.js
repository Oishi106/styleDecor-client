import axios from 'axios'

const axiosInstance = axios.create({
  // Default to the local backend the user shared (port 3000).
  // Override with VITE_API_BASE_URL or VITE_API_PROXY_TARGET when needed.
  baseURL: (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_PROXY_TARGET || 'http://localhost:3000').replace(/\/+$/, ''),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token for protected requests
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
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
      // Clear auth token if unauthorized/expired
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')

      // Notify the app so it can redirect to login.
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'))
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
