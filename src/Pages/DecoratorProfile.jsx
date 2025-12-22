import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaStar, FaMapMarkerAlt, FaBriefcase, FaArrowLeft } from 'react-icons/fa'

const DecoratorProfile = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const decorator = location.state?.decorator

  if (!decorator) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Profile not found</h1>
          <p className="text-base-content/70">We could not load the decorator profile.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 py-12 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="btn btn-ghost gap-2 mb-6"
        >
          <FaArrowLeft /> Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card bg-base-100 shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center">
              <div className="avatar mb-4">
                <div className="w-28 h-28 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  <img src={decorator.image} alt={decorator.name} className="object-cover" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center">{decorator.name}</h2>
              <p className="text-base-content/70 text-center mb-3">{decorator.specialization}</p>
              <div className="flex items-center gap-2 text-warning font-semibold">
                <FaStar />
                <span>{decorator.rating}</span>
                <span className="text-base-content/60">({decorator.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-base-content/70 mt-2">
                <FaMapMarkerAlt className="text-primary" />
                <span>{decorator.location}</span>
              </div>
              <div className="mt-4 text-sm font-semibold text-base-content">
                {decorator.experience || 'Experienced professional'}
              </div>
            </div>

            <div className="lg:col-span-2 p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">About</h3>
                <p className="text-base-content/70 leading-relaxed">{decorator.bio || 'No bio provided.'}</p>
              </div>

              {decorator.specialties?.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {decorator.specialties.map((item, idx) => (
                      <span key={idx} className="badge badge-primary badge-outline">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {decorator.projects?.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <FaBriefcase /> Recent Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {decorator.projects.map((proj, idx) => (
                      <div key={idx} className="card bg-base-200 shadow-sm">
                        <div className="card-body p-4">
                          <p className="font-semibold">{proj.title}</p>
                          <p className="text-sm text-base-content/70">{proj.result}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DecoratorProfile
