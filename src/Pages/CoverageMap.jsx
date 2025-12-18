import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'
import L from 'leaflet'
import { useNavigate } from 'react-router-dom'

// Fix for default marker icon issue in React Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Coverage locations worldwide
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

const CoverageMap = () => {
  const navigate = useNavigate()

  const handleContactClick = () => {
    navigate('/contact')
  }

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
          <h1 className="text-5xl font-bold mb-3">Global Service Coverage</h1>
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
            We provide professional decoration services worldwide with expanding reach
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card bg-base-100 shadow-2xl overflow-hidden"
          style={{ position: 'relative', zIndex: 10 }}
        >
          <div className="card-body p-0">
            <div style={{ height: '600px', width: '100%', position: 'relative' }}>
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
          </div>
        </motion.div>

        {/* Coverage Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-12"
        >
          {coverageLocations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="card-body p-6 text-center">
                <div className="text-3xl mb-2">📍</div>
                <h3 className="font-bold text-lg mb-1">{location.name}</h3>
                <p className="text-sm text-base-content/70">{location.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-lg mt-12 p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Not in Your Area?</h2>
          <p className="text-lg text-base-content/70 mb-6 max-w-2xl mx-auto">
            We're expanding our services! Contact us to check if we can serve your location.
          </p>
          <button className="btn btn-primary btn-lg mx-auto" onClick={handleContactClick}>
            Contact Us
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default CoverageMap