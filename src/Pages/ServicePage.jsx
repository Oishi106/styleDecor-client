import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import ServiceCard from '../components/ServiceCard'

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
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            Discover our comprehensive range of professional interior decoration services
          </p>
        </div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card bg-base-100 shadow-lg p-6 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Search Service</span>
              </label>
              <input
                type="text"
                placeholder="Enter service name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered bg-base-200 focus:outline-none focus:input-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Category</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select select-bordered bg-base-200 focus:outline-none focus:select-primary"
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
                <span className="label-text font-semibold">Max Budget</span>
                <span className="badge badge-primary">${maxPrice}</span>
              </label>
              <input
                type="range"
                min="0"
                max="600"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="range range-primary"
              />
              <div className="flex justify-between text-xs text-base-content/50 mt-2">
                <span>$0</span>
                <span>$600</span>
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
                className="btn btn-outline btn-primary self-end"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-center">
            <p className="text-sm text-base-content/60">
              Showing <span className="font-bold text-primary">{filteredServices.length}</span> of{' '}
              <span className="font-bold">{allServices.length}</span> services
            </p>
          </div>
        </motion.div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="card bg-base-100 shadow-lg p-12"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold mb-2">No Services Found</h2>
              <p className="text-base-content/70 mb-6">
                Try adjusting your search criteria or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setMaxPrice(600)
                }}
                className="btn btn-primary"
              >
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