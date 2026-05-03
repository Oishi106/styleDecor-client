import axiosInstance from './axiosInstance'

export const getUserFavorites = async () => {
  try {
    const res = await axiosInstance.get('/favourites')
    return res.data
  } catch (err) {
    console.error('getUserFavorites error', err)
    throw err
  }
}

export const createFavorite = async (payload) => {
  const body = {
    itemId: payload.itemId || payload.item_id,
    itemType: payload.itemType || payload.item_type || 'service',
    name: payload.name,
    price: payload.price,
    image: payload.image,
  }
  try {
    const res = await axiosInstance.post('/favourites', body)
    return res.data || res
  } catch (err) {
    console.error('createFavorite error', err)
    throw err
  }
}

export const deleteFavorite = async (id) => {
  try {
    const res = await axiosInstance.delete(`/favourites/${id}`)
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