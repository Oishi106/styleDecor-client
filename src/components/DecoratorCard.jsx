import React from 'react'
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa'

const DecoratorCard = ({ 
    name, 
    image, 
    rating, 
    reviews, 
    location, 
    specialization 
}) => {
    return (
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <figure className="px-6 pt-6">
                <div className="avatar">
                    <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img 
                            src={image || 'https://via.placeholder.com/150'} 
                            alt={name}
                            className="object-cover"
                        />
                    </div>
                </div>
            </figure>
            
            <div className="card-body items-center text-center">
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
                
                <button className="btn btn-primary btn-sm mt-4">
                    View Profile
                </button>
            </div>
        </div>
    )
}

export default DecoratorCard
