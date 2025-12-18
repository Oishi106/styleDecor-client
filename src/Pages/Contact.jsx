import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // UI-only mock submit
    setTimeout(() => {
      setIsSubmitting(false)
      setShowToast(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setShowToast(false), 2500)
    }, 900)
  }

  return (
    <div className="pb-16">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 text-base md:text-lg text-base-content/70"
          >
            We’d love to hear from you
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4 }}
              className="card bg-base-100 shadow"
            >
              <div className="card-body">
                <h2 className="card-title">Contact Information</h2>
                <ul className="mt-3 space-y-4">
                  <li className="flex gap-3">
                    <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FaMapMarkerAlt className="text-primary" />
                    </span>
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-sm text-base-content/70">123 Style Street, Dhaka 1207, Bangladesh</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <FaPhone className="text-secondary" />
                    </span>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <a href="tel:+8801700000000" className="text-sm link">+880 1700-000000</a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <FaEnvelope className="text-accent" />
                    </span>
                    <div>
                      <p className="font-semibold">Email</p>
                      <a href="mailto:hello@styledecor.com" className="text-sm link">hello@styledecor.com</a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                      <FaClock />
                    </span>
                    <div>
                      <p className="font-semibold">Business Hours</p>
                      <p className="text-sm text-base-content/70">Sat–Thu: 9:00 AM – 6:00 PM</p>
                      <p className="text-sm text-base-content/70">Fri: Closed</p>
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="card bg-base-100 shadow"
            >
              <div className="card-body">
                <h3 className="card-title">Follow Us</h3>
                <div className="flex items-center gap-3 mt-2">
                  <a href="#" className="btn btn-circle btn-outline"><FaFacebook /></a>
                  <a href="#" className="btn btn-circle btn-outline"><FaInstagram /></a>
                  <a href="#" className="btn btn-circle btn-outline"><FaTwitter /></a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Send us a message</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Name</span></label>
                    <input name="name" value={formData.name} onChange={handleChange} className="input input-bordered bg-base-200" placeholder="Your name" />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Email</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="input input-bordered bg-base-200" placeholder="you@example.com" />
                  </div>
                  <div className="form-control md:col-span-2">
                    <label className="label"><span className="label-text font-semibold">Subject</span></label>
                    <input name="subject" value={formData.subject} onChange={handleChange} className="input input-bordered bg-base-200" placeholder="How can we help?" />
                  </div>
                  <div className="form-control md:col-span-2">
                    <label className="label"><span className="label-text font-semibold">Message</span></label>
                    <textarea name="message" value={formData.message} onChange={handleChange} className="textarea textarea-bordered bg-base-200 min-h-32" placeholder="Write your message..."></textarea>
                  </div>
                  <div className="md:col-span-2 flex justify-end mt-2">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Toast */}
      {showToast && (
        <div className="toast toast-end">
          <div className="alert alert-success">
            <span>Message sent! We’ll get back to you soon.</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Contact