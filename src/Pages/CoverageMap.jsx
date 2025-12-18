import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'
import L from 'leaflet'

// Fix for default marker icon issue in React Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Coverage locations in Bangladesh
const coverageLocations = [
  {
    id: 1,
    name: 'Dhaka',
    position: [23.8103, 90.4125],
    description: 'Capital city - Full service coverage available'
  },
  {
    id: 2,
    name: 'Chittagong',
    position: [22.3569, 91.7832],
    description: 'Port city - All decoration services available'
  },
  {
    id: 3,
    name: 'Sylhet',
    position: [24.8949, 91.8687],
    description: 'Tea capital - Premium services available'
  },
  {
    id: 4,
    name: 'Rajshahi',
    position: [24.3745, 88.6042],
    description: 'Silk city - Select services available'
  },
  {
    id: 5,
    name: 'Khulna',
    position: [22.8456, 89.5403],
    description: 'Gateway to Sundarbans - Full coverage'
  }
]

const CoverageMap = () => {
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
          <h1 className="text-5xl font-bold mb-3">Service Coverage Map</h1>
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
            We provide professional decoration services across major cities in Bangladesh
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card bg-base-100 shadow-2xl overflow-hidden"
        >
          <div className="card-body p-0">
            <div style={{ height: '600px', width: '100%' }}>
              <MapContainer
                center={[23.8103, 90.4125]}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                maxBounds={[[20.5, 87.5], [26.8, 92.8]]}
                maxBoundsViscosity={1.0}
                minZoom={7}
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
          <button className="btn btn-primary btn-lg mx-auto">
            Contact Us
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default CoverageMap