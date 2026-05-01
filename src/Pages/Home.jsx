import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ServiceCard from '../components/ServiceCard'
import DecoratorCard from '../components/DecoratorCard'
import { FaMapMarkedAlt, FaUsers, FaCheckCircle, FaGlobeAsia } from 'react-icons/fa'
// customize booking removed — reverted to previous home layout
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { getAllRooms } from '../api/roomApi'

const Home = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  // Fix for default marker icon issue in React Leaflet
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
  }, [])

  // Coverage locations
  const coverageLocations = [
    {
      id: 1,
      name: 'Bangladesh',
      position: [23.6850, 90.3563],
      description: 'Primary service region - Full coverage available'
    },
    {
      id: 2,
      name: 'India',
      position: [20.5937, 78.9629],
      description: 'Expanding services available'
    },
    {
      id: 3,
      name: 'Pakistan',
      position: [30.3753, 69.3451],
      description: 'Limited services available'
    },
    {
      id: 4,
      name: 'UAE',
      position: [23.4241, 53.8478],
      description: 'Premium services available'
    },
    {
      id: 5,
      name: 'Thailand',
      position: [15.8700, 100.9925],
      description: 'Select services available'
    }
  ]

  // Fetch services from API
  const fetchServices = async () => {
    try {
      const data = await getAllRooms()
      const list = Array.isArray(data) ? data : []
      // Take only first 4 services for home page
      setServices(list.slice(0, 4))
    } catch (err) {
      console.error('Error fetching services:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const topDecorators = [
    {
      id: 'decorator-1',
      name: 'Ayesha Rahman',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
      rating: 4.9,
      reviews: 126,
      location: 'Dhaka, Bangladesh',
      specialization: 'Modern Luxury Interiors',
      experience: '8+ years of premium interior styling',
      bio: 'Transforms apartments and penthouses with clean layouts, layered lighting, and custom decor detailing.',
      specialties: ['Luxury Living Rooms', 'Smart Space Styling', 'Lighting Mood Design'],
      projects: ['Lakeside Apartment', 'Banani Penthouse Revamp']
    },
    {
      id: 'decorator-2',
      name: 'Rafiul Karim',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
      rating: 4.8,
      reviews: 109,
      location: 'Chattogram, Bangladesh',
      specialization: 'Event and Wedding Themes',
      experience: '10+ years in event and wedding decoration',
      bio: 'Known for elegant stage concepts and floral experiences designed around each client story.',
      specialties: ['Wedding Stage Design', 'Floral Art Direction', 'Photo Zone Concepts'],
      projects: ['Royal Wedding Gala', 'Seaside Reception Set']
    },
    {
      id: 'decorator-3',
      name: 'Nusrat Jahan',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=80',
      rating: 4.9,
      reviews: 142,
      location: 'Sylhet, Bangladesh',
      specialization: 'Scandinavian and Minimal Decor',
      experience: '7+ years crafting calm, modern spaces',
      bio: 'Blends neutral palettes, texture-rich materials, and practical layouts for long-term comfort.',
      specialties: ['Scandinavian Homes', 'Minimal Workspace', 'Custom Decor Curation'],
      projects: ['Tea Valley Villa', 'Minimal Studio Suite']
    },
    {
      id: 'decorator-4',
      name: 'Imran Hossain',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
      rating: 4.7,
      reviews: 97,
      location: 'Khulna, Bangladesh',
      specialization: 'Corporate and Office Aesthetics',
      experience: '9+ years in commercial transformation',
      bio: 'Creates productivity-focused office interiors that still feel premium, warm, and brand-aligned.',
      specialties: ['Office Branding', 'Reception Concepts', 'Conference Room Design'],
      projects: ['Tech Hub Workspace', 'Executive Office Refresh']
    }
  ]

  const faqItems = [
    {
      question: 'How do I book a decorator from the home page?',
      answer:
        'Choose your preferred service, open details, and confirm a date with payment. Our team contacts you quickly to finalize your style briefing.'
    },
    {
      question: 'Do you provide fully customized decoration packages?',
      answer:
        'Yes. We design each project from scratch based on space size, event type, budget, and your color/theme preference.'
    },
    {
      question: 'Can I select the same top decorator for recurring projects?',
      answer:
        'Absolutely. If the decorator is available, you can request the same professional for follow-up projects or seasonal refreshes.'
    },
    {
      question: 'What happens if I need to reschedule my booking?',
      answer:
        'You can reschedule through your dashboard booking history. We recommend requesting changes at least 24 hours before the scheduled slot.'
    }
  ]

// customize booking handlers removed

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero min-h-150 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/70"></div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: false, amount: 0.3 }}
                className="h-full"
              >
                <ServiceCard {...service} />
              </motion.div>
            ))
          )}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/services" className="btn btn-outline btn-primary">
            View All Services
          </Link>
        </div>
      </section>

      {/* Top Decorators Section */}
      <section className="py-16 px-6 lg:px-12 bg-linear-to-b from-base-200 via-base-200 to-base-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Top Decorators</h2>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Meet our talented team of professional interior decorators
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Avg. Rating', value: '4.8/5' },
              { label: 'Decorators Active', value: '40+' },
              { label: 'Projects Completed', value: '1200+' },
              { label: 'Client Return Rate', value: '91%' }
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-primary/20 bg-base-100/80 backdrop-blur p-4 text-center shadow-md"
              >
                <p className="text-xs uppercase tracking-wider text-base-content/60">{stat.label}</p>
                <p className="text-xl md:text-2xl font-extrabold text-primary mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {topDecorators.map((decorator, index) => (
              <motion.div
                key={decorator.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: false, amount: 0.3 }}
                className="h-full"
              >
                <DecoratorCard {...decorator} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services" className="btn btn-primary btn-wide">
              Book with Top Decorators
            </Link>
          </div>
        </div>
      </section>


      
      {/* Customize Decoration Section */}
      <section className="py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden border border-primary/15 bg-linear-to-br from-base-100 via-base-100 to-primary/10 ">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
              <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                <p className="uppercase tracking-[0.3em] text-xs text-primary font-semibold mb-3">Tailored Concepts</p>
                <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
                  Customize Decoration Packages for Your Space
                </h2>
                <p className="text-base-content/70 text-lg mb-6 max-w-xl">
                  Choose the style, room count, and premium add-ons that match your event or interior vision.
                  Build a package that feels personal instead of one-size-fits-all.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-2xl">
                  <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
                    <p className="text-sm text-base-content/60">Starting From</p>
                    <p className="text-2xl font-extrabold text-primary">$100</p>
                  </div>
                  <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
                    <p className="text-sm text-base-content/60">Flexible Plans</p>
                    <p className="text-2xl font-extrabold text-primary">3 Options</p>
                  </div>
                  <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
                    <p className="text-sm text-base-content/60">Fast Booking</p>
                    <p className="text-2xl font-extrabold text-primary">1 Click</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/customize" className="btn btn-primary btn-lg">
                    Customize Decoration
                  </Link>
                  <Link to="/services" className="btn btn-outline btn-lg">
                    Browse Services
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[320px] lg:min-h-full">
                <img
                  src="https://images.unsplash.com/photo-1551135049-8a33b5883817?w=1200&auto=format&fit=crop&q=80"
                  alt="Customized decoration preview"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <div className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
                    Premium styling with curated room-by-room planning
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      {/* Home inline customize booking removed */}


      {/* Coverage Map Preview */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Global Service Coverage</h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            Expanding our professional decoration services worldwide with presence in multiple countries
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: FaGlobeAsia, title: '5 Countries', desc: 'Active in multiple regions' },
            { icon: FaCheckCircle, title: '500+ Projects', desc: 'Successfully completed' },
            { icon: FaUsers, title: '1000+ Clients', desc: 'Satisfied customers' },
            { icon: FaMapMarkedAlt, title: '24/7 Support', desc: 'Always here to help' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <div className="card bg-base-100 shadow-lg border-2 border-primary/20 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="card-body items-center text-center">
                  <stat.icon className="text-5xl text-primary mb-4" />
                  <h3 className="card-title text-xl">{stat.title}</h3>
                  <p className="text-sm text-base-content/70">{stat.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: false, amount: 0.3 }}
          className="card bg-base-100 shadow-2xl overflow-hidden"
        >
          <div style={{ height: '500px', width: '100%', position: 'relative' }}>
            <MapContainer
              center={[20, 50]}
              zoom={3}
              style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {coverageLocations.map((location) => (
                <Marker key={location.id} position={location.position}>
                  <Popup>
                    <div className="text-center p-2">
                      <h3 className="font-bold text-lg mb-1">{location.name}</h3>
                      <p className="text-sm text-gray-600">{location.description}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Coverage Info Below Map */}
          <div className="card-body p-8 bg-linear-to-r from-primary/5 to-secondary/5">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {coverageLocations.map((location) => (
                <motion.div
                  key={location.id}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-base-100 rounded-lg border-2 border-primary/20 hover:border-primary/50 transition-all"
                >
                  <h4 className="font-bold text-lg mb-2 text-primary">{location.name}</h4>
                  <p className="text-xs text-base-content/70">{location.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <Link to="/coverage" className="btn btn-primary btn-lg gap-2">
            <FaMapMarkedAlt /> Explore Full Coverage Map
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-6 lg:px-12 bg-linear-to-b from-base-100 via-base-100 to-base-200">
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

      {/* How It Works Section */}
      <section className="py-16 px-6 lg:px-12 bg-linear-to-b from-base-200 via-base-200 to-base-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Simple steps to transform your space with StyleDecor
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { 
                step: '01', 
                title: 'Browse Services', 
                desc: 'Explore our wide range of decoration services and choose what fits your needs',
                icon: '🔍'
              },
              { 
                step: '02', 
                title: 'Book Appointment', 
                desc: 'Select your preferred date, time, and decorator for a consultation',
                icon: '📅'
              },
              { 
                step: '03', 
                title: 'Design & Plan', 
                desc: 'Work with our experts to create the perfect design plan for your space',
                icon: '✏️'
              },
              { 
                step: '04', 
                title: 'Enjoy Results', 
                desc: 'Sit back and watch as we transform your space into something beautiful',
                icon: '✨'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: false, amount: 0.3 }}
              >
                <div className="relative">
                  <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-t-4 border-primary">
                    <div className="card-body items-center text-center">
                      <div className="text-6xl mb-4">{item.icon}</div>
                      <div className="badge badge-primary badge-lg mb-4 px-4 py-3 text-lg font-bold">
                        {item.step}
                      </div>
                      <h3 className="card-title text-xl mb-3">{item.title}</h3>
                      <p className="text-sm text-base-content/70">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          
        </div>
      </section>


       {/* Premium FAQ Section */}
      <section className="py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-base-100 via-base-100 to-primary/10 p-8 md:p-12 ">
            <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl"></div>
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-secondary/20 blur-3xl"></div>

            <div className="relative z-10 text-center mb-10">
              <p className="uppercase text-xs tracking-[0.3em] text-primary font-semibold mb-3">Client Concierge</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="max-w-2xl mx-auto text-base-content/70">
                Everything you need to know before booking your next interior or event decoration project.
              </p>
              
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
              {faqItems.map((item, index) => (
                <motion.details
                  key={item.question}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  viewport={{ once: false, amount: 0.3 }}
                  className="group rounded-2xl border border-base-content/10 bg-base-100/80 backdrop-blur p-6 shadow-lg open:border-primary/40"
                >
                  <summary className="list-none cursor-pointer flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-base-content">{item.question}</h3>
                    <span className="h-7 w-7 shrink-0 rounded-full bg-primary/10 text-primary grid place-items-center text-lg font-bold transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-base-content/70">{item.answer}</p>
                </motion.details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home