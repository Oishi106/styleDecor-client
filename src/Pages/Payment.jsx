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

const PaymentForm = ({ booking, service, paymentMethod, onSuccess }) => {
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

        const response = await createPaymentIntent(Math.round(paymentAmountForBooking(booking) * 100), booking._id)
        setClientSecret(response.clientSecret)
      } catch (error) {
        console.error('Error getting payment intent:', error)
        setToast({ message: 'Failed to initialize payment', type: 'error' })
      }
    }

    const paymentAmountForBooking = (booking) => Number(booking?.price ?? booking?.amount ?? 0)

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
  const { user, loading: authLoading } = useAuth()
  
  // Booking data passed from previous page
  const { booking, service } = location.state || {}
  const paymentAmount = Number(booking?.price ?? booking?.amount ?? 0)
  
  // Payment state management
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isPageValid, setIsPageValid] = useState(true)

  useEffect(() => {
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
   * Main Payment Form View
   */
  return (
    <div className="min-h-screen bg-linear-to-br from-base-100 via-primary/5 to-secondary/5 py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <button onClick={() => navigate(-1)} className="btn btn-ghost gap-2 mb-6">
            <FaArrowLeft /> Back to Booking
          </button>
          <h1 className="text-5xl font-bold mb-3">Choose Payment Method</h1>
          <p className="text-lg text-base-content/60">Select your preferred way to pay for your booking</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="space-y-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setPaymentMethod('card')}
                className={`card cursor-pointer transition-all border-2 ${paymentMethod === 'card' ? 'border-primary bg-primary/5 shadow-lg' : 'border-base-300 bg-base-100 hover:border-primary/40'}`}
              >
                <div className="card-body p-5 flex-row items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl grid place-items-center text-2xl ${paymentMethod === 'card' ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content'}`}>
                    <FaCreditCard />
                  </div>
                  <div className="flex-1">
                    <h3 className="card-title text-xl mb-1">Credit or Debit Card</h3>
                    <p className="text-base-content/60">Pay securely using Visa, Mastercard, or Amex</p>
                  </div>
                  <div className="badge badge-primary">Recommended</div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setPaymentMethod('apple')}
                className={`card cursor-pointer transition-all border-2 ${paymentMethod === 'apple' ? 'border-primary bg-primary/5 shadow-lg' : 'border-base-300 bg-base-100 hover:border-primary/40'}`}
              >
                <div className="card-body p-5 flex-row items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl grid place-items-center text-2xl ${paymentMethod === 'apple' ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content'}`}>
                    <FaApple />
                  </div>
                  <div className="flex-1">
                    <h3 className="card-title text-xl mb-1">Apple Pay</h3>
                    <p className="text-base-content/60">Fast checkout on supported devices</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setPaymentMethod('google')}
                className={`card cursor-pointer transition-all border-2 ${paymentMethod === 'google' ? 'border-primary bg-primary/5 shadow-lg' : 'border-base-300 bg-base-100 hover:border-primary/40'}`}
              >
                <div className="card-body p-5 flex-row items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl grid place-items-center text-2xl ${paymentMethod === 'google' ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content'}`}>
                    <FaGoogle />
                  </div>
                  <div className="flex-1">
                    <h3 className="card-title text-xl mb-1">Google Pay</h3>
                    <p className="text-base-content/60">Quick payment with your Google account</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card bg-base-100 shadow-2xl p-6 sm:p-8 mb-8"
            >
              <div className="mb-8 pb-8 border-b-2 border-base-200">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>Order Summary</span>
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-base-content/70">{booking?.roomName || service?.service_name || 'Service'}</span>
                    <span className="font-bold text-lg">${paymentAmount.toFixed(2)}</span>
                  </div>
                  <div className="divider my-2"></div>
                  <div className="flex justify-between text-xl font-bold pt-2">
                    <span>Total Amount</span>
                    <span className="text-primary">${paymentAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Elements stripe={stripePromise}>
                <PaymentForm booking={booking} service={service} paymentMethod={paymentMethod} onSuccess={handlePaymentSuccess} />
              </Elements>
            </motion.div>
          </motion.div>

          <aside className="space-y-6">
            <div className="card bg-base-100 shadow-lg p-6 md:p-8 sticky top-28">
              <h3 className="text-2xl font-bold mb-4">Payment Details</h3>
              <div className="space-y-3 text-base-content/70 mb-6">
                <p className="flex justify-between gap-4"><span>Booking</span><span className="font-semibold text-base-content">{booking?.roomName || service?.service_name || 'Service'}</span></p>
                <p className="flex justify-between gap-4"><span>Customer</span><span className="font-semibold text-base-content">{displayName || booking?.name || 'Guest'}</span></p>
                <p className="flex justify-between gap-4"><span>Email</span><span className="font-semibold text-base-content">{booking?.email || user?.email || '-'}</span></p>
              </div>

              <div className="rounded-2xl bg-primary/5 p-5 mb-6">
                <p className="text-sm text-base-content/60">Payable Amount</p>
                <p className="text-4xl font-extrabold text-primary">${paymentAmount.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-3 text-sm text-base-content/60">
                <FaLock className="text-primary" />
                <span>Stripe-powered secure checkout</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Payment
