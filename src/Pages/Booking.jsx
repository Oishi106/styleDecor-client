import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaCalendar, FaMapMarkerAlt, FaArrowRight, FaCreditCard } from 'react-icons/fa'

// Mock selected service
const mockService = {
  id: 1,
  service_name: 'Living Room Makeover',
  category: 'Interior Design',
  price: 299,
  unit: 'per room',
  image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400'
}

// Toast Component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success' ? 'alert-success' : 'alert-error'

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`alert ${bgColor} shadow-lg fixed top-4 right-4 z-50 max-w-sm`}
    >
      <div className="flex items-center gap-3">
        <FaCheckCircle className="text-2xl" />
        <span className="font-semibold">{message}</span>
      </div>
    </motion.div>
  )
}

const Booking = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    bookingDate: '',
    location: ''
  })
  const [toast, setToast] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleConfirmBooking = (e) => {
    e.preventDefault()

    if (!formData.bookingDate || !formData.location) {
      setToast({
        message: 'Please fill in all fields',
        type: 'error'
      })
      return
    }

    setIsLoading(true)

    // Simulate booking process
    setTimeout(() => {
      setToast({
        message: `✓ Booking confirmed for ${mockService.service_name}!`,
        type: 'success'
      })

      setTimeout(() => {
        navigate('/payment')
      }, 2000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-primary/5 to-secondary/5 py-12 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-3">Confirm Your Booking</h1>
          <p className="text-lg text-base-content/60">Review and complete your service booking</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleConfirmBooking} className="space-y-6">
              {/* Booking Details Card */}
              <div className="card bg-base-100 shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

                {/* Date Input */}
                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text font-bold text-lg flex items-center gap-2">
                      <FaCalendar className="text-primary" />
                      Preferred Booking Date
                    </span>
                  </label>
                  <input
                    type="date"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleInputChange}
                    className="input input-bordered input-lg bg-base-200 focus:input-primary transition-all"
                    required
                  />
                  <label className="label">
                    <span className="label-text-alt text-xs text-base-content/60">
                      Select a date for your service
                    </span>
                  </label>
                </div>

                {/* Location Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-lg flex items-center gap-2">
                      <FaMapMarkerAlt className="text-secondary" />
                      Service Location
                    </span>
                  </label>
                  <textarea
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter your full address..."
                    className="textarea textarea-bordered textarea-md bg-base-200 focus:textarea-primary transition-all"
                    rows="3"
                    required
                  />
                  <label className="label">
                    <span className="label-text-alt text-xs text-base-content/60">
                      Where should we provide the service?
                    </span>
                  </label>
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="card bg-gradient-to-br from-accent/10 to-primary/10 shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Important Information</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="badge badge-primary mt-1">1</span>
                    <span className="text-base-content/80">Our team will contact you within 24 hours to confirm the exact timing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="badge badge-primary mt-1">2</span>
                    <span className="text-base-content/80">A consultation meeting may be scheduled before the actual service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="badge badge-primary mt-1">3</span>
                    <span className="text-base-content/80">You'll receive a confirmation email with project details and timeline</span>
                  </li>
                </ul>
              </div>

              {/* Confirm Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-lg w-full font-bold gap-2 text-lg"
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <FaCreditCard />
                    Proceed to Payment
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Service Summary Card (Sidebar) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="sticky top-24"
          >
            <div className="card bg-base-100 shadow-2xl overflow-hidden">
              {/* Service Image */}
              <figure className="h-48 overflow-hidden bg-base-300">
                <img
                  src={mockService.image}
                  alt={mockService.service_name}
                  className="w-full h-full object-cover"
                />
              </figure>

              {/* Service Info */}
              <div className="card-body p-6">
                <div className="badge badge-secondary mb-2">{mockService.category}</div>
                <h3 className="card-title text-xl mb-4">{mockService.service_name}</h3>

                {/* Price Breakdown */}
                <div className="divider my-2"></div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Service Price</span>
                    <span className="font-bold text-lg text-primary">${mockService.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Unit</span>
                    <span className="font-semibold">{mockService.unit}</span>
                  </div>
                </div>

                <div className="divider my-2"></div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
                  <span className="font-bold text-lg">Total</span>
                  <span className="text-2xl font-bold text-primary">${mockService.price}</span>
                </div>

                {/* Status */}
                <div className="bg-success/10 border-l-4 border-success rounded p-4 mb-6">
                  <div className="flex items-center gap-2 text-success font-bold">
                    <FaCheckCircle />
                    Ready to Book
                  </div>
                </div>

                <p className="text-xs text-base-content/60 text-center">
                  Complete your booking by filling in the required details on the left
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default Booking
