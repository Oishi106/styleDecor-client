import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowRight, FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthProvider'
import { createBooking } from '../api/bookingApi'

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    pricePerRoom: 100,
    description: 'Ideal for small rooms and simple styling refreshes.',
    features: ['Color refresh', 'Basic furniture styling', 'On-site planning'],
  },
  {
    id: 'standard',
    name: 'Standard',
    pricePerRoom: 180,
    description: 'Balanced styling for apartments, homes, and medium events.',
    features: ['Theme planning', 'Decor curation', 'Room-by-room setup'],
  },
  {
    id: 'premium',
    name: 'Premium',
    pricePerRoom: 320,
    description: 'Luxury-level styling with detailed customization and premium touches.',
    features: ['Premium materials', 'Dedicated designer', 'Full luxury concept'],
  },
]

const addOns = [
  { id: 'lighting', label: 'Mood lighting', price: 60 },
  { id: 'floral', label: 'Fresh floral setup', price: 80 },
  { id: 'photoZone', label: 'Photo zone styling', price: 120 },
]

const CustomizedPackage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedPackage, setSelectedPackage] = useState('standard')
  const [rooms, setRooms] = useState(1)
  const [bookingDate, setBookingDate] = useState('')
  const [location, setLocation] = useState('')
  const [selectedAddOns, setSelectedAddOns] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const activePackage = packages.find((item) => item.id === selectedPackage) || packages[1]

  const totalPrice = useMemo(() => {
    const addOnPrice = selectedAddOns.reduce((sum, addOnId) => {
      const addOn = addOns.find((item) => item.id === addOnId)
      return sum + (addOn?.price || 0)
    }, 0)

    return activePackage.pricePerRoom * Number(rooms || 0) + addOnPrice
  }, [activePackage, rooms, selectedAddOns])

  const toggleAddOn = (addOnId) => {
    setSelectedAddOns((current) => (
      current.includes(addOnId)
        ? current.filter((item) => item !== addOnId)
        : [...current, addOnId]
    ))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!bookingDate || !location) {
      setToast({ type: 'error', message: 'Please select a date and location.' })
      return
    }

    const displayName = user?.name || user?.displayName
    if (!user?.email || !displayName) {
      setToast({ type: 'error', message: 'Please log in again to continue.' })
      return
    }

    setIsSubmitting(true)
    try {
      const bookingData = {
        name: displayName,
        email: user.email,
        roomId: `custom-${activePackage.id}`,
        roomName: `Customized Package - ${activePackage.name}`,
        service_name: `Customized Package - ${activePackage.name}`,
        price: totalPrice,
        bookingDate,
        location,
        status: 'pending',
        paymentStatus: 'pending',
        packageDetails: {
          packageId: activePackage.id,
          packageName: activePackage.name,
          rooms: Number(rooms),
          addOns: selectedAddOns,
        },
      }

      const response = await createBooking(bookingData)

      if (!response?.insertedId) {
        throw new Error('Booking ID missing')
      }

      navigate('/payment', {
        state: {
          booking: {
            _id: response.insertedId,
            name: displayName,
            email: user.email,
            roomName: bookingData.roomName,
            price: bookingData.price,
          },
          service: {
            service_name: bookingData.roomName,
            price: bookingData.price,
          },
        },
      })
    } catch (error) {
      console.error('Customize booking error:', error)
      const message = error?.response?.data?.message || error?.message || 'Failed to create booking. Please try again.'
      setToast({ type: 'error', message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-base-100 via-primary/5 to-secondary/5 py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12"
        >
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-primary font-semibold mb-3">Customize Your Space</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">Build a Decoration Package That Fits Your Vision</h1>
            <p className="text-lg text-base-content/70 mb-6 max-w-2xl">
              Pick a package, adjust the room count, add premium extras, and confirm your booking in one flow.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <div className="badge badge-primary badge-lg gap-2">Fast booking</div>
              <div className="badge badge-secondary badge-lg gap-2">Flexible add-ons</div>
              <div className="badge badge-accent badge-lg gap-2">Secure payment</div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => document.getElementById('customize-form')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-primary">
                Start Booking
                <FaArrowRight />
              </button>
              <button onClick={() => navigate(-1)} className="btn btn-outline">Go Back</button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl shadow-2xl min-h-[340px] border border-base-300">
            <img
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80"
              alt="Customized decoration setup"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <h2 className="text-2xl font-bold mb-2">Premium interior styling, your way</h2>
              <p className="text-white/85 max-w-lg">From living rooms to event spaces, every detail is curated around your taste.</p>
            </div>
          </div>
        </motion.div>

        <div id="customize-form" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-base-100 shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-5">Choose Your Package</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packages.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedPackage(item.id)}
                    className={`text-left rounded-2xl border p-5 transition-all ${selectedPackage === item.id ? 'border-primary bg-primary/5 shadow-md' : 'border-base-300 bg-base-200/60 hover:border-primary/40'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      {selectedPackage === item.id ? <FaCheckCircle className="text-primary" /> : null}
                    </div>
                    <p className="text-sm text-base-content/70 mb-4">{item.description}</p>
                    <p className="text-2xl font-extrabold text-primary mb-4">${item.pricePerRoom}/room</p>
                    <ul className="space-y-2 text-sm text-base-content/70">
                      {item.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <FaCheckCircle className="text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-5">Add Premium Extras</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {addOns.map((addOn) => (
                  <label key={addOn.id} className="cursor-pointer rounded-2xl border border-base-300 bg-base-200/60 p-5 hover:border-primary/40 transition-all flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedAddOns.includes(addOn.id)}
                      onChange={() => toggleAddOn(addOn.id)}
                      className="checkbox checkbox-primary mt-1"
                    />
                    <div>
                      <p className="font-semibold text-lg">{addOn.label}</p>
                      <p className="text-sm text-base-content/60">+${addOn.price}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="card bg-base-100 shadow-lg p-6 md:p-8 space-y-6">
              <h2 className="text-2xl font-bold">Booking Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="form-control">
                  <span className="label-text font-semibold mb-2 flex items-center gap-2"><FaCalendarAlt className="text-primary" />Preferred Date</span>
                  <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="input input-bordered w-full" />
                </label>

                <label className="form-control">
                  <span className="label-text font-semibold mb-2 flex items-center gap-2"><FaMapMarkerAlt className="text-secondary" />Project Location</span>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="input input-bordered w-full" placeholder="Enter full address" />
                </label>
              </div>

              <label className="form-control max-w-sm">
                <span className="label-text font-semibold mb-2">Number of Rooms</span>
                <input type="number" min="1" value={rooms} onChange={(e) => setRooms(Math.max(1, Number(e.target.value)))} className="input input-bordered w-full" />
              </label>

              {toast ? (
                <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                  <span>{toast.message}</span>
                </div>
              ) : null}

              <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg w-full md:w-auto">
                {isSubmitting ? 'Creating Booking...' : 'Confirm & Continue to Payment'}
              </button>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="card bg-base-100 shadow-lg p-6 md:p-8 sticky top-28">
              <h3 className="text-2xl font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 text-base-content/70 mb-6">
                <p className="flex justify-between gap-4"><span>Package</span><span className="font-semibold text-base-content">{activePackage.name}</span></p>
                <p className="flex justify-between gap-4"><span>Rooms</span><span className="font-semibold text-base-content">{rooms}</span></p>
                <p className="flex justify-between gap-4"><span>Add-ons</span><span className="font-semibold text-base-content">{selectedAddOns.length}</span></p>
              </div>

              <div className="rounded-2xl bg-primary/5 p-5 mb-6">
                <p className="text-sm text-base-content/60">Estimated Total</p>
                <p className="text-4xl font-extrabold text-primary">${totalPrice}</p>
              </div>

              <ul className="space-y-3 text-sm text-base-content/70">
                <li>Custom room-by-room styling plan</li>
                <li>Transparent pricing before payment</li>
                <li>Stripe payment handoff after booking</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CustomizedPackage