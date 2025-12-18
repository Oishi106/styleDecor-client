import React from 'react'

const LoadingSpinner = ({ fullScreen = false, text = 'Loading...' }) => {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      {text && <p className="text-lg font-semibold text-base-content">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-base-100/80 backdrop-blur-sm z-50">
        {spinnerContent}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {spinnerContent}
    </div>
  )
}

export default LoadingSpinner