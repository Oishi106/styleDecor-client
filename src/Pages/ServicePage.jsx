import React, { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaFilter, FaDollarSign, FaSync } from 'react-icons/fa'
import ServiceCard from '../components/ServiceCard'
import { getAllRooms } from '../api/roomApi'

const ServicePage = () => {
  const [allServices, setAllServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const data = await getAllRooms()
        const normalized = (Array.isArray(data) ? data : []).map((item) => ({
          ...item,
          id: item.id || item._id || item.roomId,
          detailId: item.id || item._id || item.roomId,
          service_name: item.service_name || item.title || item.name || 'Untitled Service',
          category: item.category || item.type || 'General',
          price: Number(item.price) || 0,
          rating: Number(item.rating) || 0,
          image: item.image || item.photo || item.thumbnail,
          short_description: item.short_description || item.description || 'No description provided.',
        }))
        setAllServices(normalized)
      } catch (err) {
        setError(err.message || 'Failed to fetch services')
        console.error('Error fetching services:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [maxPrice, setMaxPrice] = useState(null)

  // Calculate max price from services
  const calculatedMaxPrice = useMemo(() => {
    if (allServices.length === 0) return 100000
    return Math.max(...allServices.map(s => s.price))
  }, [allServices])

  // Use calculatedMaxPrice if maxPrice is not set
  const effectiveMaxPrice = maxPrice !== null ? maxPrice : calculatedMaxPrice

  // Get unique categories
  const categories = ['all', ...new Set(allServices.map(s => s.category))]

  // Filter services based on search, category, and price
  const filteredServices = useMemo(() => {
    return allServices.filter(service => {
      const name = service.service_name || ''
      const category = service.category || 'General'
      const price = Number(service.price) || 0

      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory
      const matchesPrice = price <= effectiveMaxPrice

      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [searchTerm, selectedCategory, effectiveMaxPrice, allServices])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <span>Error: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-base-100 via-primary/5 to-secondary/5 py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-3 text-base-content">
            Our Services
          </h1>
          <p className="text-base text-base-content/60 max-w-2xl mx-auto">
            Discover our range of professional interior decoration services
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card bg-linear-to-br from-base-100 to-base-50 shadow-2xl border-2 border-primary/20 p-8 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-lg flex items-center gap-2">
                  <FaSearch className="text-primary" />
                  Search Service
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter service name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered bg-linear-to-r from-base-200 to-base-300 focus:outline-none focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all text-base"
              />
            </div>

            {/* Category Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-lg flex items-center gap-2">
                  <FaFilter className="text-secondary" />
                  Category
                </span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select select-bordered bg-linear-to-r from-base-200 to-base-300 focus:outline-none focus:select-primary focus:ring-2 focus:ring-secondary/50 transition-all text-base"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Slider */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-lg flex items-center gap-2">
                  <FaDollarSign className="text-accent" />
                  Max Budget
                </span>
                <span className="badge badge-primary badge-md font-bold">${effectiveMaxPrice}</span>
              </label>
              <input
                type="range"
                min="0"
                max={calculatedMaxPrice}
                value={effectiveMaxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="range range-primary range-lg"
              />
              <div className="flex justify-between text-xs font-semibold text-base-content/60 mt-3">
                <span className="badge badge-outline">$0</span>
                <span className="badge badge-outline">${calculatedMaxPrice}</span>
              </div>
            </div>

            {/* Reset Button */}
            <div className="form-control flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setMaxPrice(null)
                }}
                className="btn btn-primary gap-2 self-end h-12 text-base font-bold hover:shadow-lg transition-all"
              >
                <FaSync />
                Reset Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 pt-6 border-t-2 border-primary/20"
          >
            <p className="text-center text-base font-semibold">
              Showing{' '}
              <span className="badge badge-lg badge-primary font-bold">
                {filteredServices.length}
              </span>
              {' '}of{' '}
              <span className="badge badge-lg badge-secondary font-bold">
                {allServices.length}
              </span>
              {' '}services
            </p>
          </motion.div>
        </motion.div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -10 }}
              >
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="card bg-linear-to-br from-base-100 to-secondary/10 shadow-2xl border-2 border-secondary/30 p-16"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-7xl mb-6 animate-bounce">🔍</div>
              <h2 className="text-4xl font-bold mb-3 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                No Services Found
              </h2>
              <p className="text-lg text-base-content/70 mb-8 max-w-md">
                Try adjusting your search criteria or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setMaxPrice(600)
                }}
                className="btn btn-primary btn-lg gap-2 font-bold hover:shadow-xl transition-all"
              >
                <FaSync />
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ServicePage