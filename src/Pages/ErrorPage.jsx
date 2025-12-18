import React from 'react'
import { Link, useRouteError } from 'react-router-dom'

const ErrorPage = () => {
  const err = useRouteError?.() || {}
  const status = err?.status || 404
  const message = err?.statusText || err?.message || 'The page you are looking for could not be found.'

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-6 py-16">
      <div className="text-center max-w-xl">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 mb-6">
          <span className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {status}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Oops! Page not found</h1>
        <p className="text-base-content/70 mb-8">{message}</p>

        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn btn-primary">Back to Home</Link>
          <button className="btn btn-outline" onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage