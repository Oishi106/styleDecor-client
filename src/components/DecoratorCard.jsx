import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaStar, FaMapMarkerAlt, FaHeart, FaRegHeart } from 'react-icons/fa'
import { useFavorites } from '../context/FavoritesProvider'
import { useAuth } from '../context/AuthProvider'

const DecoratorCard = ({ 
    id,
    name, 
    image, 
    rating, 
    reviews, 
    location, 
    specialization,
    bio,
    specialties,
    experience,
    projects
}) => {
    const { isFavorited, addFavorite, removeFavorite, getFavoriteByItemId } = useFavorites()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loadingFav, setLoadingFav] = useState(false)
    const favObj = typeof getFavoriteByItemId === 'function' ? getFavoriteByItemId(id) : null
    const initialFavorited = Boolean(favObj) || isFavorited(id)
    const [favoritedLocal, setFavoritedLocal] = useState(initialFavorited)
    return (
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            <figure className="px-6 pt-6 relative">
                <div className="avatar">
                    <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img 
                            src={image || 'https://via.placeholder.com/150'} 
                            alt={name}
                            className="object-cover"
                        />
                    </div>
                </div>
                <button
                    onClick={async () => {
                        if (!user) return navigate('/login')
                        setFavoritedLocal((s) => !s)
                        try {
                            setLoadingFav(true)
                            if (favoritedLocal && favObj) {
                                await removeFavorite(favObj._id || favObj.id)
                            } else {
                                await addFavorite({ itemId: id, itemType: 'decorator', meta: { name } })
                            }
                        } catch (err) {
                            console.error(err)
                            setFavoritedLocal((s) => !s)
                        } finally {
                            setLoadingFav(false)
                        }
                    }}
                    className="absolute right-6 top-2 btn btn-ghost btn-circle p-2"
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
            
            <div className="card-body items-center text-center flex flex-col flex-1">
                <h2 className="card-title text-lg">{name}</h2>
                
                <div className="badge badge-outline badge-sm">{specialization}</div>
                
                <div className="flex items-center gap-1 mt-2">
                    <FaStar className="text-warning" />
                    <span className="font-semibold">{rating}</span>
                    <span className="text-sm text-base-content/60">({reviews} reviews)</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-base-content/70 mt-1">
                    <FaMapMarkerAlt className="text-primary" />
                    <span>{location}</span>
                </div>
                
                <Link
                    to={id ? `/decorators/${id}` : '#'}
                    state={{
                        decorator: {
                            id,
                            name,
                            image,
                            rating,
                            reviews,
                            location,
                            specialization,
                            bio,
                            specialties,
                            experience,
                            projects
                        }
                    }}
                    className="btn btn-primary btn-sm disabled:btn-disabled mt-auto"
                    aria-disabled={!id}
                >
                    View Profile
                </Link>
            </div>
        </div>
    )
}

export default DecoratorCard
