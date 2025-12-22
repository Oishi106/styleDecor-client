import axiosInstance from './axiosInstance'

// Create payment intent
export const createPaymentIntent = async (amount, bookingId) => {
  try {
    const response = await axiosInstance.post('/create-payment-intent', {
      amount,
      bookingId
    })
    return response.data
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

// Confirm payment after Stripe processing
export const confirmPayment = async (bookingId, transactionId) => {
  try {
    const response = await axiosInstance.patch(`/payments/confirm/${bookingId}`, {
      transactionId
    })
    return response.data
  } catch (error) {
    console.error('Error confirming payment:', error)
    throw error
  }
}
