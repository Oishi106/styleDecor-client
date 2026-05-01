import axiosInstance from './axiosInstance'

export const getUserFavorites = async () => {
  try {
    const res = await axiosInstance.get('/favorites')
    return res.data
  } catch (err) {
    console.error('getUserFavorites error', err)
    throw err
  }
}

export const createFavorite = async (payload) => {
  // payload: { itemId, itemType, meta }
  // Send both camelCase and snake_case keys for backend compatibility
  const body = {
    ...payload,
    item_id: payload.itemId || payload.item_id,
    item_type: payload.itemType || payload.item_type,
  }
  try {
    const res = await axiosInstance.post('/favorites', body)
    console.log('createFavorite response', res?.data || res)
    return res.data || res
  } catch (err) {
    console.error('createFavorite error', err)
    throw err
  }
}

export const deleteFavorite = async (id) => {
  try {
    const res = await axiosInstance.delete(`/favorites/${id}`)
    console.log('deleteFavorite response', res?.data || res)
    return res.data || res
  } catch (err) {
    console.error('deleteFavorite error', err)
    throw err
  }
}

export default {
  getUserFavorites,
  createFavorite,
  deleteFavorite,
}
