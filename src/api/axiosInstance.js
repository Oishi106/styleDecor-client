import axios from 'axios'

const axiosInstance = axios.create({
  // Prefer same-origin so Vite dev proxy can forward API requests and avoid CORS.
  // Set VITE_API_BASE_URL to use an absolute backend URL (e.g. https://style-decor-server-fghchs7vz-mahmuda-afroz-oishis-projects.vercel.app).
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token')
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
      // Clear auth token if unauthorized/expired
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
