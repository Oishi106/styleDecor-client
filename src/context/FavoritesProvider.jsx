import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthProvider'
import favoriteApi from '../api/favoriteApi'

const FavoritesContext = createContext({
  favorites: [],
  isFavorited: () => false,
  getFavoriteByItemId: () => null,
  addFavorite: async () => {},
  removeFavorite: async () => {},
  refreshFavorites: async () => {},
})

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)

  const normalizeFavorite = (favorite) => {
    if (!favorite || typeof favorite !== 'object') return favorite

    const meta = favorite.meta && typeof favorite.meta === 'object' ? favorite.meta : {}
    const itemId = favorite.itemId || favorite.item_id || favorite.serviceId || favorite._id || meta.itemId || meta.serviceId || null
    const itemType = favorite.itemType || favorite.item_type || meta.itemType || meta.item_type || 'service'
    const name = favorite.name || meta.name || meta.service_name || ''
    const price = favorite.price ?? meta.price ?? ''
    const image = favorite.image || meta.image || ''
    const category = favorite.category || meta.category || ''
    const description = favorite.description || favorite.short_description || meta.description || meta.short_description || meta.service_description || ''
    const rating = favorite.rating ?? meta.rating ?? 0

    return {
      ...favorite,
      itemId,
      itemType,
      serviceId: favorite.serviceId || itemId,
      name,
      price,
      image,
      category,
      description,
      short_description: favorite.short_description || description,
      rating,
      meta: {
        ...meta,
        name,
        price,
        image,
        category,
        description,
        short_description: favorite.short_description || description,
        rating,
      },
    }
  }

  const extractFavoriteId = (favorite) => favorite?._id || favorite?.id || favorite?.favoriteId || favorite?.itemId || favorite?.serviceId || null

  const refreshFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([])
      return
    }
    try {
      setLoading(true)
      const data = await favoriteApi.getUserFavorites()
      setFavorites(Array.isArray(data) ? data.map(normalizeFavorite) : [])
    } catch (err) {
      console.error('Failed to load favorites', err)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refreshFavorites()
  }, [refreshFavorites])

  const addFavorite = async (serviceData) => {
    try {
      const normalized = normalizeFavorite(serviceData)
      const payload = {
        itemId: normalized.itemId,
        itemType: normalized.itemType,
        serviceId: normalized.serviceId,
        name: normalized.name,
        price: normalized.price,
        image: normalized.image,
        category: normalized.category,
        description: normalized.description,
        short_description: normalized.short_description,
        rating: normalized.rating,
        meta: normalized.meta,
      }

      const res = await favoriteApi.createFavorite(payload)
      const created = normalizeFavorite(res?.data || res)

      setFavorites((s) => {
        const existing = s.filter((favorite) => extractFavoriteId(favorite) !== extractFavoriteId(created))
        return [created, ...existing]
      })
      window.alert('Added to favourites')
      await refreshFavorites()
      return created
    } catch (err) {
      console.error('Add favorite failed', err)
      const msg = err?.response?.data?.message || 'Failed to add'
      window.alert(`Error: ${msg}`)
      throw err
    }
  }

  const removeFavorite = async (favoriteId) => {
    try {
      await favoriteApi.deleteFavorite(favoriteId)
      setFavorites((s) => s.filter((f) => extractFavoriteId(f) !== favoriteId))
      window.alert('Removed from favourites')
      await refreshFavorites()
    } catch (err) {
      window.alert('Failed to remove')
      throw err
    }
  }

  const isFavorited = (serviceId) => {
    return favorites.some((f) => f.serviceId === serviceId || f.itemId === serviceId || f._id === serviceId || f.item_id === serviceId)
  }

  const getFavoriteByItemId = (itemId) => {
    return favorites.find((f) => f.serviceId === itemId || f.itemId === itemId || f._id === itemId || f.item_id === itemId) || null
  }

  return (
    <FavoritesContext.Provider value={{ favorites, loading, isFavorited, getFavoriteByItemId, addFavorite, removeFavorite, refreshFavorites }}>
      {children}
    </FavoritesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = () => useContext(FavoritesContext)
export default FavoritesProvider