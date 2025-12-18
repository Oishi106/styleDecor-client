import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaStar, FaArrowLeft } from 'react-icons/fa'

// Mock service data
const allServices = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200',
    service_name: 'Living Room Makeover',
    category: 'Interior Design',
    price: 299,
    unit: 'per room',
    short_description: 'Transform your living space with modern furniture and decor arrangements.',
    rating: 4.8,
    reviews: 156,
    full_description: 'Our expert designers will completely transform your living room into a stunning showcase. We handle everything from furniture selection and arrangement to lighting design and color coordination. We focus on creating a space that reflects your personality while maximizing comfort and functionality.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200',
    service_name: 'Bedroom Styling',
    category: 'Home Decor',
    price: 249,
    unit: 'per room',
    short_description: 'Create a relaxing sanctuary with expert bedroom decoration services.',
    rating: 4.9,
    reviews: 203,
    full_description: 'We create the perfect bedroom sanctuary tailored to your style and preferences. From modern minimalist designs to cozy traditional aesthetics, our team ensures your bedroom is a peaceful retreat with optimal comfort and visual harmony.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200',
    service_name: 'Kitchen Redesign',
    category: 'Renovation',
    price: 399,
    unit: 'per kitchen',
    short_description: 'Modern kitchen layouts with functional and aesthetic improvements.',
    rating: 4.7,
    reviews: 128,
    full_description: 'Transform your kitchen into a modern, functional space. We focus on optimizing workflow, improving storage solutions, and creating an aesthetically pleasing environment that combines style with practicality.'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200',
    service_name: 'Office Space Design',
    category: 'Commercial',
    price: 499,
    unit: 'per workspace',
    short_description: 'Professional workspace design to boost productivity and creativity.',
    rating: 4.6,
    reviews: 89,
    full_description: 'We design professional office spaces that inspire productivity and creativity. Our designs balance aesthetics with functionality, incorporating ergonomic furniture, proper lighting, and motivational color schemes.'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=1200',
    service_name: 'Bathroom Remodeling',
    category: 'Renovation',
    price: 349,
    unit: 'per bathroom',
    short_description: 'Luxurious bathroom designs with modern fixtures and elegant layouts.',
    rating: 4.8,
    reviews: 114,
    full_description: 'Create your dream bathroom with luxurious finishes and modern amenities. We handle everything from fixture selection to waterproofing and lighting design, ensuring both beauty and functionality.'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200',
    service_name: 'Wall Art Curation',
    category: 'Home Decor',
    price: 189,
    unit: 'per wall',
    short_description: 'Expert selection and arrangement of wall art to complement your space.',
    rating: 4.9,
    reviews: 167,
    full_description: 'We curate and arrange wall art pieces that perfectly complement your interior design. From paintings and prints to sculptural pieces, we create gallery-like displays that elevate your space.'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1585399363032-096db2f91aed?w=1200',
    service_name: 'Lighting Design',
    category: 'Interior Design',
    price: 279,
    unit: 'per room',
    short_description: 'Strategic lighting solutions to enhance ambiance and functionality.',
    rating: 4.7,
    reviews: 95,
    full_description: 'Proper lighting can completely transform a space. We design custom lighting solutions that enhance the ambiance, improve functionality, and create the perfect mood for any room.'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1574909514516-4b922e08af35?w=1200',
    service_name: 'Furniture Selection',
    category: 'Home Decor',
    price: 329,
    unit: 'per room',
    short_description: 'Curated furniture pieces that match your style and budget.',
    rating: 4.8,
    reviews: 142,
    full_description: 'We help you select and arrange furniture pieces that perfect match your style, budget, and space requirements. Our expertise ensures comfortable, functional, and beautiful room layouts.'
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1617638924702-92d37a439220?w=1200',
    service_name: 'Color Consultation',
    category: 'Interior Design',
    price: 199,
    unit: 'per project',
    short_description: 'Professional color schemes and palette design for any room.',
    rating: 4.6,
    reviews: 78,
    full_description: 'Color sets the mood and atmosphere of any space. Our color consultants will help you choose the perfect palette that reflects your personality and creates the desired ambiance.'
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1585399364003-9d6c00b5e6e3?w=1200',
    service_name: 'Retail Store Design',
    category: 'Commercial',
    price: 599,
    unit: 'per store',
    short_description: 'Eye-catching retail spaces that drive customer engagement.',
    rating: 4.9,
    reviews: 112,
    full_description: 'We design retail spaces that attract customers and enhance shopping experience. Our designs focus on product visibility, customer flow, and creating an inviting atmosphere.'
  },
  {
    id: 11,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200',
    service_name: 'Garden Landscaping',
    category: 'Outdoor Design',
    price: 449,
    unit: 'per garden',
    short_description: 'Beautiful outdoor spaces with plants and decorative elements.',
    rating: 4.7,
    reviews: 86,
    full_description: 'Transform your outdoor space into a beautiful garden oasis. We design and implement landscaping solutions that include plant selection, hardscaping, and decorative elements.'
  },
  {
    id: 12,
    image: 'https://images.unsplash.com/photo-1615873516217-92454c440339?w=1200',
    service_name: 'Entryway Decoration',
    category: 'Home Decor',
    price: 229,
    unit: 'per entryway',
    short_description: 'Create stunning first impressions with expert entryway styling.',
    rating: 4.8,
    reviews: 131,
    full_description: 'Your entryway sets the tone for your entire home. We create stunning first impressions through strategic design, appropriate lighting, and welcoming decor elements.'
  }
]

const ServiceDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const service = allServices.find(s => s.id === parseInt(id))

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <button onClick={() => navigate('/services')} className="btn btn-primary">
            Back to Services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-12 px-6 lg:px-12">
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
            <div className="grid grid-cols-3 gap-4 mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
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
                onClick={() => navigate('/booking')}
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