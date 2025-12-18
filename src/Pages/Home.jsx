import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ServiceCard from '../components/ServiceCard'
import DecoratorCard from '../components/DecoratorCard'
import { FaMapMarkedAlt } from 'react-icons/fa'

// Mock service data
const mockServices = [
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
  }
]

// Mock decorator data
const mockDecorators = [
  {
    name: 'Sarah Johnson',
    image: 'https://i.pravatar.cc/150?img=1',
    rating: 4.9,
    reviews: 127,
    location: 'Dhaka',
    specialization: 'Modern Interior'
  },
  {
    name: 'Michael Chen',
    image: 'https://i.pravatar.cc/150?img=12',
    rating: 4.8,
    reviews: 98,
    location: 'Chittagong',
    specialization: 'Classic Design'
  },
  {
    name: 'Emma Williams',
    image: 'https://i.pravatar.cc/150?img=5',
    rating: 5.0,
    reviews: 156,
    location: 'Dhaka',
    specialization: 'Minimalist Style'
  },
  {
    name: 'David Brown',
    image: 'https://i.pravatar.cc/150?img=13',
    rating: 4.7,
    reviews: 89,
    location: 'Sylhet',
    specialization: 'Luxury Decor'
  }
]

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero min-h-[600px] relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        </div>
        <div className="hero-content text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            className="max-w-3xl"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg"
            >
              Transform Your Space
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-lg md:text-xl mb-8 text-white/90"
            >
              Professional interior decoration services to bring your dream space to life. 
              Expert designers, quality service, and stunning results.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <Link to="/services" className="btn btn-primary btn-lg gap-2">
                Book Decoration Service
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            Explore our wide range of professional decoration services tailored to your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/services" className="btn btn-outline btn-primary">
            View All Services
          </Link>
        </div>
      </section>

      {/* Top Decorators Section */}
      <section className="py-16 px-6 lg:px-12 bg-gradient-to-b from-base-200 via-base-200 to-base-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Top Decorators</h2>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Meet our talented team of professional interior decorators
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockDecorators.map((decorator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: false, amount: 0.3 }}
              >
                <DecoratorCard {...decorator} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Map Preview */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Service Coverage</h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            We provide professional decoration services across major cities in Bangladesh
          </p>
        </div>
        
        <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 shadow-xl">
          <div className="card-body items-center text-center py-20">
            <FaMapMarkedAlt className="text-6xl text-primary mb-6" />
            <h3 className="text-2xl font-bold mb-4">Coverage Map Coming Soon</h3>
            <p className="text-base-content/70 max-w-md mb-6">
              Interactive map showing our service coverage areas will be available here. 
              Currently serving Dhaka, Chittagong, Sylhet, and surrounding regions.
            </p>
            <Link to="/coverage" className="btn btn-primary">
              Explore Coverage Areas
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-6 lg:px-12 bg-gradient-to-b from-base-100 via-base-100 to-base-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose StyleDecor?</h2>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              We deliver exceptional decoration services with professionalism and creativity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { emoji: '🎨', title: 'Expert Designers', desc: 'Certified professionals with years of experience in interior decoration' },
              { emoji: '⚡', title: 'Fast Service', desc: 'Quick turnaround time without compromising on quality' },
              { emoji: '💎', title: 'Premium Quality', desc: 'High-quality materials and attention to every detail' },
              { emoji: '💰', title: 'Affordable Pricing', desc: 'Competitive rates with flexible payment options' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: false, amount: 0.3 }}
              >
                <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className="card-body items-center text-center">
                    <div className="text-5xl mb-4">{item.emoji}</div>
                    <h3 className="card-title text-lg">{item.title}</h3>
                    <p className="text-sm text-base-content/70">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            Real experiences from satisfied customers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Fatima Rahman', img: 25, text: 'Absolutely amazing service! They transformed my living room beyond my expectations. Professional, creative, and on-time delivery.' },
            { name: 'Karim Ahmed', img: 33, text: 'Best decision ever! The team was fantastic and the results speak for themselves. My office looks modern and inspiring now.' },
            { name: 'Nadia Khan', img: 44, text: 'Incredible attention to detail! They listened to all my ideas and created a beautiful space that perfectly matches my style.' }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all">
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img src={`https://i.pravatar.cc/150?img=${testimonial.img}`} alt={testimonial.name} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <div className="text-warning text-sm">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                  <p className="text-sm text-base-content/70">
                    "{testimonial.text}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home