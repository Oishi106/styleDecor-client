import axiosInstance from './axiosInstance'

// Login and obtain JWT + role
export const loginRequest = async (email, password) => {
  // Backends vary on the exact login path.
  // To avoid noisy repeated 404s, cache the first working path.
  const envPath = import.meta.env.VITE_AUTH_LOGIN_PATH
  const storedPath = typeof window !== 'undefined' ? window.localStorage.getItem('authLoginPath') : null

  const candidates = [
    envPath,
    storedPath,
    '/auth/login',
    '/auth/jwt',
    '/auth',
  ].filter(Boolean)

  let lastError = null
  for (const path of candidates) {
    try {
      const response = await axiosInstance.post(path, { email, password })
		  if (!envPath && typeof window !== 'undefined') {
			  window.localStorage.setItem('authLoginPath', path)
		  }
      return response.data
    } catch (err) {
      lastError = err
      const status = err?.response?.status
      if (status === 404) continue
      throw err
    }
  }
  throw lastError
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
