import './App.css'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { ChatProvider } from './context/ChatProvider'
import router from './Routes/Routes'

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <RouterProvider router={router} />
      </ChatProvider>
    </AuthProvider>
  )
}

export default App
