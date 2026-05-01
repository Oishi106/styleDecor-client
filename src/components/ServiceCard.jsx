import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa'
import { useFavorites } from '../context/FavoritesProvider'
import { useAuth } from '../context/AuthProvider'

const ServiceCard = ({ 
    id,
    _id,
    image, 
    service_name, 
    category, 
    price, 
    short_description, 
    rating 
}) => {
    const serviceId = _id || id
    const detailPath = serviceId ? `/services/${serviceId}` : '#'
    const safeRating = Number(rating) || 0
    const { isFavorited, addFavorite, removeFavorite, getFavoriteByItemId } = useFavorites()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loadingFav, setLoadingFav] = useState(false)
    const favObj = typeof getFavoriteByItemId === 'function' ? getFavoriteByItemId(serviceId) : null
    const initialFavorited = Boolean(favObj) || isFavorited(serviceId)
    const [favoritedLocal, setFavoritedLocal] = useState(initialFavorited)

    useEffect(() => {
        setFavoritedLocal(initialFavorited)
    }, [initialFavorited])

    return (
        <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
            <figure className="relative h-48 overflow-hidden">
                <img 
                    src={image} 
                    alt={service_name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="badge badge-primary absolute top-3 right-3 font-semibold">
                    {category}
                </div>
                <button
                    onClick={async () => {
                        if (!user) return navigate('/login')
                        // optimistic UI
                        setFavoritedLocal((s) => !s)
                        try {
                            setLoadingFav(true)
                            if (favoritedLocal && favObj) {
                                await removeFavorite(favObj._id || favObj.id)
                            } else {
                                await addFavorite({
                                    itemId: serviceId,
                                    itemType: 'service',
                                    serviceId,
                                    name: service_name,
                                    price,
                                    image,
                                    category,
                                    rating: safeRating,
                                    description: short_description,
                                    short_description,
                                    meta: {
                                        name: service_name,
                                        price,
                                        image,
                                        category,
                                        rating: safeRating,
                                        description: short_description,
                                        short_description,
                                    },
                                })
                            }
                        } catch (err) {
                            console.error(err)
                            // rollback
                            setFavoritedLocal((s) => !s)
                        } finally {
                            setLoadingFav(false)
                        }
                    }}
                    className="absolute left-3 top-3 btn btn-ghost btn-circle p-2"
                    aria-label={favoritedLocal ? 'Remove from favourites' : 'Add to favourites'}
                >
                    {loadingFav ? (
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle></svg>
                    ) : favoritedLocal ? (
                        <FaHeart className="text-error" />
                    ) : (
                        <FaRegHeart className="text-neutral" />
                    )}
                </button>
            </figure>
            
            <div className="card-body flex flex-col grow">
                <h2 className="card-title text-lg font-bold">
                    {service_name}
                </h2>
                
                <p className="text-sm text-base-content/70 line-clamp-2 mb-2 grow">
                    {short_description}
                </p>
                
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-warning">
                        {[...Array(5)].map((_, index) => (
                            <FaStar 
                                key={index} 
                                className={index < Math.floor(safeRating) ? 'text-warning' : 'text-gray-300'}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-medium ml-1">
                        ({safeRating})
                    </span>
                </div>
                
                <div className="card-actions items-center justify-between mt-auto">
                    <div className="text-2xl font-bold text-primary">
                        ${price}
                    </div>
                    <Link 
                        to={detailPath}
                        className="btn btn-primary btn-sm disabled:btn-disabled"
                        aria-disabled={!serviceId}
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ServiceCard
