import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome, FaRing, FaBuilding, FaPaintRoller, FaUsers, FaClock, FaHandshake, FaMoneyBillWave } from 'react-icons/fa'

const About = () => {
  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About StyleDecor
            </h1>
            <p className="mt-4 text-base md:text-lg text-base-content/70 max-w-2xl mx-auto">
              We craft beautiful spaces for homes, weddings, and events—bringing your vision to life with professional decorators and a customer-first mindset.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who We Are</h2>
            <p className="text-base-content/80 leading-relaxed">
              StyleDecor is a creative decoration brand specializing in home and ceremony decor. Our experienced team blends design, craftsmanship, and attention to detail to transform spaces for everyday living and life’s biggest moments. We are committed to a smooth, customer-focused experience from idea to execution.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3"><span className="badge badge-primary mt-1">•</span> Home & ceremony decoration tailored to your style</li>
              <li className="flex items-start gap-3"><span className="badge badge-secondary mt-1">•</span> Professional decorators with real-world expertise</li>
              <li className="flex items-start gap-3"><span className="badge badge-accent mt-1">•</span> Customer-first service with clear communication</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-primary/10">
                    <FaUsers className="mx-auto text-primary text-2xl" />
                    <p className="mt-2 font-semibold">Pro Team</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/10">
                    <FaClock className="mx-auto text-secondary text-2xl" />
                    <p className="mt-2 font-semibold">On-Time</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10">
                    <FaHandshake className="mx-auto text-accent text-2xl" />
                    <p className="mt-2 font-semibold">Customer First</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.4 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
        >
          Our Services Overview
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[{
            icon: <FaHome className="text-primary text-3xl" />, title: 'Home Decoration', desc: 'Make your home cozy, stylish, and uniquely yours.'
          }, {
            icon: <FaRing className="text-secondary text-3xl" />, title: 'Wedding & Event', desc: 'Elegant ceremony and event decor for special days.'
          }, {
            icon: <FaBuilding className="text-accent text-3xl" />, title: 'Office & Seminar', desc: 'Professional spaces with a polished, modern touch.'
          }, {
            icon: <FaPaintRoller className="text-primary text-3xl" />, title: 'Custom Styling', desc: 'Theme-based styling and bespoke decorations.'
          }].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="card bg-base-100 shadow hover:shadow-lg transition"
            >
              <div className="card-body items-center text-center">
                <div className="mb-2">{item.icon}</div>
                <h3 className="card-title mb-1">{item.title}</h3>
                <p className="text-sm text-base-content/70">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.4 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
        >
          Why Choose Us
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[{
            icon: <FaUsers className="text-primary" />, title: 'Experienced Decorators', desc: 'Skilled specialists for homes, weddings, and events.'
          }, {
            icon: <FaMoneyBillWave className="text-secondary" />, title: 'Affordable Pricing', desc: 'Transparent costs with packages for every budget.'
          }, {
            icon: <FaClock className="text-accent" />, title: 'On-Time Service', desc: 'Reliable scheduling and efficient execution.'
          }, {
            icon: <FaHandshake className="text-primary" />, title: 'Trusted Locally', desc: 'Loved by clients across the region.'
          }].map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="card bg-base-100 border border-base-300/50 hover:border-primary/40 hover:shadow-md transition"
            >
              <div className="card-body">
                <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center mb-3">
                  <span className="text-2xl">{f.icon}</span>
                </div>
                <h3 className="card-title text-lg">{f.title}</h3>
                <p className="text-sm text-base-content/70">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hero rounded-2xl bg-gradient-to-r from-primary/15 via-base-100 to-secondary/15">
          <div className="hero-content text-center py-12 lg:py-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to Transform Your Space?</h2>
              <p className="text-base-content/70 mb-6">Explore our services and find the perfect package for your home, ceremony, or event.</p>
              <Link to="/services" className="btn btn-primary btn-lg">Explore Our Services</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About