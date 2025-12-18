import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import ServiceCard from '../components/ServiceCard'
import { FaSearch, FaFilter, FaDollarSign, FaSync } from 'react-icons/fa'

// Mock service data
const allServices = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500',
    service_name: 'Living Room Makeover',
    category: 'Interior Design',
    price: 299,
    short_description: 'Transform your living space with modern furniture and decor arrangements.',
    rating: 4.8
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500',
    service_name: 'Bedroom Styling',
    category: 'Home Decor',
    price: 249,
    short_description: 'Create a relaxing sanctuary with expert bedroom decoration services.',
    rating: 4.9
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=500',
    service_name: 'Kitchen Redesign',
    category: 'Renovation',
    price: 399,
    short_description: 'Modern kitchen layouts with functional and aesthetic improvements.',
    rating: 4.7
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500',
    service_name: 'Office Space Design',
    category: 'Commercial',
    price: 499,
    short_description: 'Professional workspace design to boost productivity and creativity.',
    rating: 4.6
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500',
    service_name: 'Bathroom Remodeling',
    category: 'Renovation',
    price: 349,
    short_description: 'Luxurious bathroom designs with modern fixtures and elegant layouts.',
    rating: 4.8
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=500',
    service_name: 'Wall Art Curation',
    category: 'Home Decor',
    price: 189,
    short_description: 'Expert selection and arrangement of wall art to complement your space.',
    rating: 4.9
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1585399363032-096db2f91aed?w=500',
    service_name: 'Lighting Design',
    category: 'Interior Design',
    price: 279,
    short_description: 'Strategic lighting solutions to enhance ambiance and functionality.',
    rating: 4.7
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1574909514516-4b922e08af35?w=500',
    service_name: 'Furniture Selection',
    category: 'Home Decor',
    price: 329,
    short_description: 'Curated furniture pieces that match your style and budget.',
    rating: 4.8
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1617638924702-92d37a439220?w=500',
    service_name: 'Color Consultation',
    category: 'Interior Design',
    price: 199,
    short_description: 'Professional color schemes and palette design for any room.',
    rating: 4.6
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1585399364003-9d6c00b5e6e3?w=500',
    service_name: 'Retail Store Design',
    category: 'Commercial',
    price: 599,
    short_description: 'Eye-catching retail spaces that drive customer engagement.',
    rating: 4.9
  },
  {
    id: 11,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
    service_name: 'Garden Landscaping',
    category: 'Outdoor Design',
    price: 449,
    short_description: 'Beautiful outdoor spaces with plants and decorative elements.',
    rating: 4.7
  },
  {
    id: 12,
    image: 'https://images.unsplash.com/photo-1615873516217-92454c440339?w=500',
    service_name: 'Entryway Decoration',
    category: 'Home Decor',
    price: 229,
    short_description: 'Create stunning first impressions with expert entryway styling.',
    rating: 4.8
  }
]

const ServicePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [maxPrice, setMaxPrice] = useState(600)

  // Get unique categories
  const categories = ['all', ...new Set(allServices.map(s => s.category))]

  // Filter services based on search, category, and price
  const filteredServices = useMemo(() => {
    return allServices.filter(service => {
      const matchesSearch = service.service_name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
      const matchesPrice = service.price <= maxPrice

      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [searchTerm, selectedCategory, maxPrice])

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-primary/5 to-secondary/5 py-12 px-6 lg:px-12">
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
          className="card bg-gradient-to-br from-base-100 to-base-50 shadow-2xl border-2 border-primary/20 p-8 mb-12"
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
                className="input input-bordered bg-gradient-to-r from-base-200 to-base-300 focus:outline-none focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all text-base"
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
                className="select select-bordered bg-gradient-to-r from-base-200 to-base-300 focus:outline-none focus:select-primary focus:ring-2 focus:ring-secondary/50 transition-all text-base"
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
                <span className="badge badge-primary badge-md font-bold">${maxPrice}</span>
              </label>
              <input
                type="range"
                min="0"
                max="600"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="range range-primary range-lg"
              />
              <div className="flex justify-between text-xs font-semibold text-base-content/60 mt-3">
                <span className="badge badge-outline">$0</span>
                <span className="badge badge-outline">$600</span>
              </div>
            </div>

            {/* Reset Button */}
            <div className="form-control flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setMaxPrice(600)
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
            className="card bg-gradient-to-br from-base-100 to-secondary/10 shadow-2xl border-2 border-secondary/30 p-16"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-7xl mb-6 animate-bounce">🔍</div>
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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