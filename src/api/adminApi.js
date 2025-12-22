import axiosInstance from './axiosInstance'

// Admin bookings
export const getAdminBookings = async (status = 'all') => {
  const response = await axiosInstance.get('/admin/bookings', {
    params: { status }
  })
  return response.data
}

// Admin: decorator applications
export const getDecoratorApplications = async () => {
  // Backend may store applications on user documents (decoratorApplication).
  // Prefer deriving from /users to avoid hitting non-existent admin routes.
  try {
    const response = await axiosInstance.get('/users')
    const users = Array.isArray(response.data) ? response.data : []
    return users
      .filter((u) => u?.decoratorApplication?.status)
      .map((u) => ({
        _id: u._id,
        id: u._id,
        name: u.name || u.fullName || u.displayName || '',
        email: u.email,
        phone: u.phone || u.contact || '',
        status: u.decoratorApplication?.status || 'pending',
        decoratorApplication: u.decoratorApplication,
      }))
  } catch (err) {
    // Fallback to legacy admin route if /users isn't available.
    if (err?.response?.status !== 404) throw err
    const response = await axiosInstance.get('/admin/decorator-applications')
    return response.data
  }
}

export const approveDecoratorApplication = async (applicationId, payload = {}) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/decorator-applications/${applicationId}/approve`,
      payload,
    )
    return response.data
  } catch (err) {
    if (err?.response?.status !== 404) throw err
    // Fallback: promote via POST /admin/decorators and attempt to mark user application as approved.
    if (payload?.email) {
      await axiosInstance.post('/admin/decorators', { email: payload.email })
    }
    try {
      await axiosInstance.put(`/users/${applicationId}`, {
        decoratorApplication: { status: 'approved' },
      })
    } catch {
      // Ignore if backend doesn't allow direct user updates.
    }
    return { ok: true }
  }
}

export const rejectDecoratorApplication = async (applicationId, payload = {}) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/decorator-applications/${applicationId}/reject`,
      payload,
    )
    return response.data
  } catch (err) {
    if (err?.response?.status !== 404) throw err
    // Fallback: attempt to mark the user's application as rejected.
    try {
      await axiosInstance.put(`/users/${applicationId}`, {
        decoratorApplication: { status: 'rejected' },
      })
    } catch {
      // Ignore if backend doesn't allow direct user updates.
    }
    return { ok: true }
  }
}

// Admin: add decorator manually (backend must implement)
export const addDecoratorManually = async (payload) => {
  // Recommended payload: { email } or { userId }
  const response = await axiosInstance.post('/admin/decorators', payload)
  return response.data
}

// Admin: list decorators (for assignment)
export const getAdminDecorators = async () => {
  // Prefer /users (admin-only) and filter by role.
  try {
    const response = await axiosInstance.get('/users', { params: { role: 'decorator' } })
    const users = Array.isArray(response.data) ? response.data : []
    return users.filter((u) => (u?.role || '').toLowerCase() === 'decorator')
  } catch (err) {
    // Legacy fallbacks
    if (err?.response?.status !== 404) throw err
    let lastError = err
    for (const path of ['/admin/decorators']) {
      try {
        const response = await axiosInstance.get(path)
        return response.data
      } catch (e) {
        lastError = e
        if (e?.response?.status === 404) continue
        throw e
      }
    }
    throw lastError
  }
}

// Admin: assign decorator to a booking/event
export const assignDecoratorToBooking = async (bookingId, payload) => {
  const candidates = [
    `/bookings/assign-decorator/${bookingId}`,
    `/admin/bookings/${bookingId}/assign-decorator`,
    `/admin/bookings/${bookingId}/assign`,
  ]
  let lastError = null
  for (const path of candidates) {
    try {
      const response = await axiosInstance.patch(path, payload)
      return response.data
    } catch (err) {
      lastError = err
      if (err?.response?.status === 404) continue
      throw err
    }
  }
  throw lastError
}
