/**
 * Stripe Payment Page
 * 
 * Payment method selection and checkout interface
 * Features:
 * - Multiple payment method options (Card, Apple Pay, Google Pay)
 * - Real booking data display
 * - Secure Stripe checkout
 * - Real-time amount calculation
 * 
 * Design: Modern & Minimalist with gradient backgrounds
 * Responsive: Mobile-optimized layout
 */

import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLock, FaCheckCircle, FaCreditCard, FaApple, FaGoogle, FaArrowLeft } from 'react-icons/fa'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
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
const PaymentForm = ({ booking, service, paymentMethod, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState(null)
  const [toast, setToast] = useState(null)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  useEffect(() => {
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

    if (paymentConfirmed) {
      setToast({ message: 'Payment already processing...', type: 'error' })
      return
    }

    if (!stripe || !elements || !clientSecret) {
      setToast({ message: 'Payment system not ready', type: 'error' })
      return
    }

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

      if (paymentIntent.status === 'succeeded') {
        setPaymentConfirmed(true)

        try {
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
      <div className="card bg-base-200 p-6 border-2 border-primary/20">
        <label className="text-sm font-semibold text-base-content mb-3 block">Card Details</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#000',
                fontFamily: 'system-ui, -apple-system, sans-serif',
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
      <div className="flex items-center gap-3 bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
        <FaLock className="text-primary text-lg" />
        <span className="text-sm text-base-content/70">Your payment information is encrypted and secure. We never store your card details.</span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        className="btn btn-primary btn-lg w-full font-bold"
      >
        {isProcessing ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Processing Payment...
          </>
        ) : (
          <>
            <FaCreditCard />
            Pay ${booking?.price?.toFixed(2) || '0.00'}
          </>
        )}
      </button>
    </form>
  )
}

const StripePayment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading: authLoading } = useAuth()
  
  // Booking data passed from booking page
  const { booking, service } = location.state || {}
  
  // Payment state management
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isPageValid, setIsPageValid] = useState(true)

  useEffect(() => {
    // Validate that booking data is present
    if (!booking || !booking._id) {
      setIsPageValid(false)
    }
  }, [booking])

  const displayName = user?.name || user?.displayName
  const userReady = !!(user && displayName && user.email)

  const handlePaymentSuccess = () => {
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
      <div className="min-h-screen bg-linear-to-br from-success/10 to-primary/10 flex items-center justify-center px-6">
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
   * Invalid State - No booking data
   */
  if (!isPageValid) {
    return (
      <div className="min-h-screen bg-linear-to-br from-base-100 via-primary/5 to-secondary/5 flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="card bg-base-100 shadow-2xl max-w-lg w-full text-center p-12"
        >
          <h1 className="text-3xl font-bold mb-4">No Booking Found</h1>
          <p className="text-lg text-base-content/70 mb-8">
            Please create a booking first before proceeding to payment.
          </p>
          <button
            onClick={() => navigate('/services')}
            className="btn btn-primary btn-lg w-full"
          >
            Back to Services
          </button>
        </motion.div>
      </div>
    )
  }

  // Auth gating before rendering payment UI
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  if (!userReady) {
    return (
      <div className="min-h-screen bg-linear-to-br from-base-100 via-primary/5 to-secondary/5 flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="card bg-base-100 shadow-2xl max-w-lg w-full text-center p-12"
        >
          <h1 className="text-3xl font-bold mb-4">User Information Incomplete</h1>
          <p className="text-lg text-base-content/70 mb-8">
            User information incomplete. Please wait or re-login.
          </p>
          <button onClick={() => navigate('/login')} className="btn btn-primary btn-lg w-full">Go to Login</button>
        </motion.div>
      </div>
    )
  }

  /**
   * Main Payment Page View
   */
  return (
    <div className="min-h-screen bg-linear-to-br from-base-100 via-primary/5 to-secondary/5 py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost gap-2 mb-6"
          >
            <FaArrowLeft /> Back to Booking
          </button>
          <h1 className="text-5xl font-bold mb-3">Choose Payment Method</h1>
          <p className="text-lg text-base-content/60">Select your preferred way to pay for your booking</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            {/* Payment Method Options */}
            <div className="space-y-4 mb-8">
              {/* Card Payment Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setPaymentMethod('card')}
                className={`card cursor-pointer transition-all border-2 ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/5'
                    : 'border-base-200 bg-base-100'
                } shadow-lg p-6`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-lg ${
                    paymentMethod === 'card'
                      ? 'bg-primary text-white'
                      : 'bg-base-200'
                  }`}>
                    <FaCreditCard size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">Credit/Debit Card</h3>
                    <p className="text-sm text-base-content/60">Visa, Mastercard, American Express</p>
                  </div>
                  {paymentMethod === 'card' && (
                    <FaCheckCircle className="text-primary text-2xl" />
                  )}
                </div>
              </motion.div>

              {/* Apple Pay Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setPaymentMethod('apple')}
                className={`card cursor-pointer transition-all border-2 ${
                  paymentMethod === 'apple'
                    ? 'border-primary bg-primary/5'
                    : 'border-base-200 bg-base-100'
                } shadow-lg p-6`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-lg ${
                    paymentMethod === 'apple'
                      ? 'bg-primary text-white'
                      : 'bg-base-200'
                  }`}>
                    <FaApple size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">Apple Pay</h3>
                    <p className="text-sm text-base-content/60">Fast and secure payment with Apple Pay</p>
                  </div>
                  {paymentMethod === 'apple' && (
                    <FaCheckCircle className="text-primary text-2xl" />
                  )}
                </div>
              </motion.div>

              {/* Google Pay Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setPaymentMethod('google')}
                className={`card cursor-pointer transition-all border-2 ${
                  paymentMethod === 'google'
                    ? 'border-primary bg-primary/5'
                    : 'border-base-200 bg-base-100'
                } shadow-lg p-6`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-lg ${
                    paymentMethod === 'google'
                      ? 'bg-primary text-white'
                      : 'bg-base-200'
                  }`}>
                    <FaGoogle size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">Google Pay</h3>
                    <p className="text-sm text-base-content/60">Quick checkout with Google Pay</p>
                  </div>
                  {paymentMethod === 'google' && (
                    <FaCheckCircle className="text-primary text-2xl" />
                  )}
                </div>
              </motion.div>
            </div>

            {/* Payment Form Section */}
            {paymentMethod === 'card' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="card bg-base-100 shadow-2xl p-6 sm:p-8"
              >
                <h2 className="text-2xl font-bold mb-6">Card Information</h2>
                <Elements stripe={stripePromise}>
                  <PaymentForm 
                    booking={{ ...booking, name: displayName, email: user.email }}
                    service={service}
                    paymentMethod={paymentMethod}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              </motion.div>
            )}

            {/* Placeholder for Apple Pay and Google Pay */}
            {(paymentMethod === 'apple' || paymentMethod === 'google') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="card bg-base-100 shadow-2xl p-8 text-center"
              >
                <p className="text-lg text-base-content/60 mb-4">
                  {paymentMethod === 'apple' ? 'Apple Pay' : 'Google Pay'} integration coming soon
                </p>
                <button
                  disabled
                  className="btn btn-primary btn-lg w-full"
                >
                  Coming Soon
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="sticky top-24"
          >
            <div className="card bg-base-100 shadow-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              {/* Service Details */}
              <div className="space-y-4 mb-6 pb-6 border-b-2 border-base-200">
                <div>
                  <p className="text-sm text-base-content/60 mb-1">Service</p>
                  <p className="text-lg font-bold">{booking?.roomName || 'Service'}</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/60 mb-1">Booking Date</p>
                  <p className="text-lg font-semibold">{booking?.bookingDate || 'TBD'}</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/60 mb-1">Location</p>
                  <p className="text-lg font-semibold">{booking?.location || 'TBD'}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b-2 border-base-200">
                <div className="flex justify-between">
                  <span className="text-base-content/60">Service Price</span>
                  <span className="font-bold">${booking?.price?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Tax (0%)</span>
                  <span className="font-bold">$0.00</span>
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-linear-to-r from-primary/10 to-secondary/10 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-3xl font-bold text-primary">
                    ${booking?.price?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="bg-success/10 border-l-4 border-success rounded p-4">
                <div className="flex items-center gap-2 text-success font-bold">
                  <FaCheckCircle />
                  Ready to Pay
                </div>
              </div>

              {/* Info Text */}
              <p className="text-xs text-base-content/60 text-center mt-6">
                By clicking pay, you agree to our terms and conditions
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default StripePayment
