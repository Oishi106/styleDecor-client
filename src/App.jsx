import './App.css'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { BookingProvider } from './context/BookingProvider'
import router from './Routes/Routes'

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <RouterProvider router={router} />
      </BookingProvider>
    </AuthProvider>
  )
}

export default App
