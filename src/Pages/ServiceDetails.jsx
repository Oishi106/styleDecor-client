import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaStar, FaArrowLeft } from 'react-icons/fa'
import { getRoomById } from '../api/roomApi'

const ServiceDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true)
        const data = await getRoomById(id)
        
        if (!data) {
          throw new Error('Service not found')
        }
        
        console.log('Fetched service data:', data)
        
        const normalized = {
          ...data,
          id: data._id || data.id || id,
          service_name: data.service_name || data.title || data.name || 'Untitled Service',
          category: data.category || data.type || 'General',
          price: Number(data.price) || 0,
          rating: Number(data.rating) || 0,
          reviews: data.reviews || data.reviewCount || 0,
          image: data.image || data.photo || data.thumbnail,
          full_description: data.full_description || data.description || data.short_description || 'No description available.',
          short_description: data.short_description || data.description || '',
          unit: data.unit || data.unitType || 'per service'
        }
        
        console.log('Normalized service:', normalized)
        setService(normalized)
      } catch (err) {
        setError(err.message || 'Failed to load service')
        console.error('Error fetching service:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchService()
    } else {
      setError('No service ID provided')
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{error || 'Service Not Found'}</h1>
          <button onClick={() => navigate('/services')} className="btn btn-primary">
            Back to Services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-base-100 to-base-200 py-12 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/services')}
          className="btn btn-ghost gap-2 mb-8"
        >
          <FaArrowLeft /> Back to Services
        </motion.button>

        {/* Service Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card bg-base-100 shadow-2xl overflow-hidden"
        >
          {/* Image Section */}
          <figure className="relative h-96 overflow-hidden bg-base-300">
            <motion.img
              src={service.image}
              alt={service.service_name}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            />
            <div className="absolute top-4 right-4 badge badge-lg badge-primary font-bold">
              {service.category}
            </div>
          </figure>

          {/* Content Section */}
          <div className="card-body p-8 lg:p-12">
            {/* Title & Rating */}
            <h1 className="text-5xl font-bold mb-4 text-base-content">
              {service.service_name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <FaStar className="text-warning" />
                <span className="font-bold text-lg">{service.rating}</span>
                <span className="text-base-content/60">({service.reviews} reviews)</span>
              </div>
            </div>

            {/* Price Info */}
            <div className="grid grid-cols-3 gap-4 mb-8 bg-linear-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
              <div>
                <p className="text-sm text-base-content/60 font-semibold">Price</p>
                <p className="text-3xl font-bold text-primary">${service.price}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60 font-semibold">Unit</p>
                <p className="text-lg font-bold text-base-content">{service.unit}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60 font-semibold">Category</p>
                <p className="text-lg font-bold text-secondary">{service.category}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Service</h2>
              <p className="text-base-content/80 text-lg leading-relaxed">
                {service.full_description}
              </p>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Professional Consultation', 'Design Plan', 'Expert Implementation', 'Quality Assurance'].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="badge badge-primary">✓</div>
                    <span className="text-base-content/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Book Now Button */}
            <div className="card-actions justify-end">
              <button
                onClick={() => navigate('/booking', { state: { service } })}
                className="btn btn-primary btn-lg gap-2 font-bold"
              >
                Book Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ServiceDetails