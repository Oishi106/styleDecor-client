import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa'

const Payment = () => {
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handlePayment = (e) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setPaymentSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 3000)
    }, 2000)
  }

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
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-6xl text-success mb-6"
          >
            <FaCheckCircle />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-lg text-base-content/70 mb-8">
            Your booking has been confirmed and paid. We'll contact you soon with more details.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary btn-lg w-full"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-primary/5 to-secondary/5 py-12 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-3">Payment</h1>
          <p className="text-lg text-base-content/60">Complete your booking payment securely</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card bg-base-100 shadow-2xl p-8 mb-8"
        >
          {/* Order Summary */}
          <div className="mb-8 pb-8 border-b-2 border-base-200">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-base-content/70">Living Room Makeover</span>
                <span className="font-bold">$299.00</span>
              </div>
              <div className="flex justify-between text-sm text-base-content/60">
                <span>Taxes & Fees</span>
                <span>$29.90</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4">
                <span>Total Amount</span>
                <span className="text-primary">$328.90</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: 'credit-card', name: 'Credit Card', desc: 'Visa, Mastercard, Amex' },
                  { id: 'debit-card', name: 'Debit Card', desc: 'All major debit cards' },
                  { id: 'digital-wallet', name: 'Digital Wallet', desc: 'Apple Pay, Google Pay' }
                ].map(method => (
                  <label key={method.id} className="flex items-center p-4 border-2 border-base-300 rounded-lg cursor-pointer hover:border-primary transition-all">
                    <input
                      type="radio"
                      name="payment-method"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="radio radio-primary"
                    />
                    <div className="ml-4">
                      <div className="font-bold">{method.name}</div>
                      <div className="text-sm text-base-content/60">{method.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Card Details (for demonstration) */}
            {paymentMethod === 'credit-card' && (
              <div className="space-y-4 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-lg">
                <div>
                  <label className="label">
                    <span className="label-text font-bold">Card Number</span>
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="input input-bordered w-full bg-base-100"
                    disabled
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text font-bold">Expiry Date</span>
                    </label>
                    <input type="text" placeholder="MM/YY" className="input input-bordered w-full bg-base-100" disabled />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-bold">CVV</span>
                    </label>
                    <input type="text" placeholder="123" className="input input-bordered w-full bg-base-100" disabled />
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-info/10 border-l-4 border-info rounded p-4">
              <div className="flex items-center gap-2 text-info font-semibold">
                <FaLock />
                Your payment is secure and encrypted
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="btn btn-primary btn-lg w-full font-bold gap-2 text-lg"
            >
              {isProcessing ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Processing Payment...
                </>
              ) : (
                <>
                  <FaCreditCard />
                  Pay $328.90
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-base-content/60"
        >
          <p>This is a UI demonstration. No actual payment will be processed.</p>
        </motion.div>
      </div>
    </div>
  )
}

export default Payment
