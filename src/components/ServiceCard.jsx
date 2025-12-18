import React from 'react'
import { Link } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'

const ServiceCard = ({ 
    id,
    image, 
    service_name, 
    category, 
    price, 
    short_description, 
    rating 
}) => {
    return (
        <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <figure className="relative h-48 overflow-hidden">
                <img 
                    src={image} 
                    alt={service_name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="badge badge-primary absolute top-3 right-3 font-semibold">
                    {category}
                </div>
            </figure>
            
            <div className="card-body">
                <h2 className="card-title text-lg font-bold">
                    {service_name}
                </h2>
                
                <p className="text-sm text-base-content/70 line-clamp-2 mb-2">
                    {short_description}
                </p>
                
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-warning">
                        {[...Array(5)].map((_, index) => (
                            <FaStar 
                                key={index} 
                                className={index < Math.floor(rating) ? 'text-warning' : 'text-gray-300'}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-medium ml-1">
                        ({rating})
                    </span>
                </div>
                
                <div className="card-actions items-center justify-between mt-auto">
                    <div className="text-2xl font-bold text-primary">
                        ${price}
                    </div>
                    <Link 
                        to={`/services/${id}`}
                        className="btn btn-primary btn-sm"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ServiceCard
