/**
 * Payment Component
 * 
 * Professional Stripe checkout interface for StyleDecor
 * Features:
 * - Stripe Elements integration
 * - Real payment processing
 * - Order summary with itemized pricing
 * - Secure payment processing with loading state
 * - Success confirmation with animation
 * - Integration with backend APIs
 * 
 * Design: Modern & Minimalist with gradient backgrounds
 * Responsive: Mobile-optimized layout
 */

import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLock, FaCheckCircle } from 'react-icons/fa'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useBooking } from '../context/BookingProvider'
import { useAuth } from '../context/AuthProvider'
import { createPaymentIntent, confirmPayment } from '../api/paymentApi'

// Initialize Stripe with public key from environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
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

// Stripe Payment Form Component
const PaymentForm = ({ booking, service, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState(null)
  const [toast, setToast] = useState(null)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false) // Prevent double calls

  useEffect(() => {
    // IMPORTANT: Only call after booking is created and bookingId exists
    const getPaymentIntent = async () => {
      try {
        if (!booking?._id) {
          setToast({ message: 'Invalid booking ID. Please create booking first.', type: 'error' })
          return
        }

        const response = await createPaymentIntent(booking.price * 100, booking._id)
        setClientSecret(response.clientSecret)
      } catch (error) {
        console.error('Error getting payment intent:', error)
        setToast({ message: 'Failed to initialize payment', type: 'error' })
      }
    }

    getPaymentIntent()
  }, [booking?._id])

  const handlePayment = async (e) => {
    e.preventDefault()

    // Prevent double payment calls
    if (paymentConfirmed) {
      setToast({ message: 'Payment already processing...', type: 'error' })
      return
    }

    if (!stripe || !elements || !clientSecret) {
      setToast({ message: 'Payment system not ready', type: 'error' })
      return
    }

    // Validate booking data
    if (!booking?._id) {
      setToast({ message: 'Invalid booking. Please start over.', type: 'error' })
      return
    }

    setIsProcessing(true)

    try {
      const cardElement = elements.getElement(CardElement)

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: booking?.name || 'Guest',
            email: booking?.email || 'guest@example.com'
          }
        }
      })

      if (error) {
        setToast({ message: error.message, type: 'error' })
        setIsProcessing(false)
        return
      }

      // IMPORTANT: Only confirm payment if status is succeeded
      if (paymentIntent.status === 'succeeded') {
        setPaymentConfirmed(true) // Prevent further calls

        try {
          // Call PATCH /payments/confirm/:bookingId ONLY ONCE
          await confirmPayment(booking._id, paymentIntent.id)

          setToast({ message: 'Payment successful!', type: 'success' })
          setTimeout(() => {
            onSuccess()
          }, 1500)
        } catch (confirmError) {
          console.error('Error confirming payment:', confirmError)
          setToast({ message: 'Payment processed but confirmation failed. Contact support.', type: 'error' })
          setIsProcessing(false)
        }
      } else {
        setToast({ message: `Payment status: ${paymentIntent.status}`, type: 'error' })
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setToast({ message: error.message || 'Payment failed', type: 'error' })
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Card Element */}
      <div className="card bg-base-200 p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#000',
                '::placeholder': {
                  color: '#888'
                }
              },
              invalid: {
                color: '#dc2626'
              }
            }
          }}
        />
      </div>

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-sm text-base-content/60">
        <FaLock className="text-primary" />
        <span>Your payment information is encrypted and secure</span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        className="btn btn-primary btn-lg w-full"
      >
        {isProcessing ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Processing...
          </>
        ) : (
          `Pay $${booking?.amount?.toFixed(2) || '0.00'}`
        )}
      </button>
    </form>
  )
}

const Payment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { addPayment } = useBooking()
  
  // Booking data passed from previous page
  const { booking, service } = location.state || {}
  
  // Payment state management
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handlePaymentSuccess = () => {
    // Add payment record to context
    addPayment({
      service: booking?.serviceName || 'Service',
      amount: `$${booking?.amount || '0'}`,
      method: 'Stripe Card'
    })

    setPaymentSuccess(true)
    
    // Redirect to payment history after 3 seconds
    setTimeout(() => {
      navigate('/dashboard/payments')
    }, 3000)
  }

  /**
   * Success State - Animated confirmation screen
   */
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success/10 to-primary/10 flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="card bg-base-100 shadow-2xl max-w-lg w-full text-center p-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="text-success mb-6 flex justify-center"
          >
            <FaCheckCircle size={80} />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-lg text-base-content/70 mb-8">
            Your booking has been confirmed and paid. Redirecting to payment history...
          </p>
          <div className="flex justify-center mb-6">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
          <button
            onClick={() => navigate('/dashboard/payments')}
            className="btn btn-primary btn-lg w-full"
          >
            View Payment History
          </button>
        </motion.div>
      </div>
    )
  }

  /**
   * Main Payment Form View
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-primary/5 to-secondary/5 py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Complete Payment</h1>
          <p className="text-base sm:text-lg text-base-content/60">Secure checkout powered by Stripe</p>
        </motion.div>

        {/* Main Payment Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card bg-base-100 shadow-2xl p-6 sm:p-8 mb-8"
        >
          {/* Order Summary Section */}
          <div className="mb-8 pb-8 border-b-2 border-base-200">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>Order Summary</span>
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-base-content/70">{booking?.roomName || 'Service'}</span>
                <span className="font-bold text-lg">${booking?.price?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="divider my-2"></div>
              <div className="flex justify-between text-xl font-bold pt-2">
                <span>Total Amount</span>
                <span className="text-primary">${booking?.price?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Payment Form with Stripe */}
          <Elements stripe={stripePromise}>
            <PaymentForm 
              booking={booking} 
              service={service} 
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        </motion.div>
      </div>
    </div>
  )
}

export default Payment
