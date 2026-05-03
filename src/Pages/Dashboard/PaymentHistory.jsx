/**
 * PaymentHistory Component
 *
 * Transaction history page for user dashboard
 * Features:
 * - Complete payment transaction history
 * - Summary cards (total paid, pending, transaction count)
 * - Detailed transaction table with status badges
 * - Download invoice functionality
 * - Filter and export options
 */

import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FaDollarSign, FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle, FaDownload, FaFilter } from 'react-icons/fa'
import axiosInstance from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthProvider'

const PaymentHistory = () => {
  const { role, loading: authLoading } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (role !== 'user') {
      setBookings([])
      setLoading(false)
      return
    }
    const fetchBookings = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await axiosInstance.get('/user/bookings')
        setBookings(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load payment history')
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [authLoading, role])

  const payments = useMemo(() => {
    return bookings
      // ✅ paymentStatus অথবা status যেকোনো একটা থাকলেই দেখাবে
      .filter((b) => b.paymentStatus || b.status)
      .map((b) => {
        const isPaid =
          b.paymentStatus === 'paid' ||
          b.status === 'paid'

        return {
          id: b.paymentId || b.transactionId || b._id || b.id,
          service: b.roomName || b.serviceName || b.service || 'Service',
          amount: Number(b.price || b.amount || 0),
          date: b.paidAt || b.updatedAt || b.createdAt || b.bookingDate || b.date,
          // ✅ status ও paymentStatus দুটো থেকেই Completed চেক করছে
          status: isPaid ? 'Completed' : 'Pending',
          method: b.paymentMethod || '—',
          transactionId: b.transactionId || '—',
          isPaid,
        }
      })
  }, [bookings])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return { class: 'badge-success', icon: <FaCheckCircle /> }
      case 'Pending':
        return { class: 'badge-warning', icon: <FaClock /> }
      case 'Failed':
        return { class: 'badge-error', icon: <FaTimesCircle /> }
      default:
        return { class: 'badge-ghost', icon: null }
    }
  }

  // ✅ status === 'Completed' দিয়ে চেক করছে
  const totalPaid = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

  const totalPending = payments
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

  return (
    <div className="space-y-6">
      {error && (
        <div className="alert alert-error"><span>{error}</span></div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Payment History</h2>
          <p className="text-base-content/60">Track all your transactions and payments</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline gap-2">
            <FaFilter />
            Filter
          </button>
          <button className="btn btn-primary gap-2">
            <FaDownload />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-xl"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Paid</p>
                <p className="text-3xl font-bold">${totalPaid.toLocaleString()}</p>
                <p className="text-xs opacity-70 mt-1">
                  {payments.filter(p => p.status === 'Completed').length} transactions
                </p>
              </div>
              <FaCheckCircle className="text-5xl opacity-30" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-xl"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Pending</p>
                <p className="text-3xl font-bold">${totalPending.toLocaleString()}</p>
                <p className="text-xs opacity-70 mt-1">
                  {payments.filter(p => p.status === 'Pending').length} transactions
                </p>
              </div>
              <FaClock className="text-5xl opacity-30" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-xl"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Transactions</p>
                <p className="text-3xl font-bold">{payments.length}</p>
                <p className="text-xs opacity-70 mt-1">All time</p>
              </div>
              <FaDollarSign className="text-5xl opacity-30" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transaction Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <h3 className="card-title text-xl mb-4">Transaction History</h3>
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Transaction ID</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const statusInfo = getStatusBadge(payment.status)
                    return (
                      <tr key={payment.id} className="hover">
                        <td className="font-semibold text-xs font-mono">
                          {String(payment.id).slice(-8)}
                        </td>
                        <td>
                          <div className="font-medium">{payment.service}</div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-primary" />
                            {payment.date ? new Date(payment.date).toLocaleDateString() : '—'}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <FaDollarSign className="text-success" />
                            <span className="font-bold text-lg">
                              {Number(payment.amount || 0).toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-outline">{payment.method}</span>
                        </td>
                        <td className="text-xs text-base-content/60 font-mono">
                          {payment.transactionId}
                        </td>
                        <td>
                          <span className={`badge ${statusInfo.class} gap-2`}>
                            {statusInfo.icon}
                            {payment.status}
                          </span>
                        </td>
                        <td>
                          {payment.status === 'Completed' && (
                            <button
                              className="btn btn-sm btn-ghost gap-2 hover:btn-primary"
                              title="Download Invoice"
                            >
                              <FaDownload />
                              Invoice
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Empty State */}
      {!loading && payments.length === 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <p className="text-6xl mb-4">💳</p>
            <h3 className="text-2xl font-bold mb-2">No Payment History</h3>
            <p className="text-base-content/60 mb-4">
              You haven't made any payments yet. Complete a booking to see your payment history here.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentHistory