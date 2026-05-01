import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom' 
import './index.css'
import AuthProvider from './context/AuthProvider.jsx'
import { FavoritesProvider } from './context/FavoritesProvider.jsx'
import { ChatProvider } from './context/ChatProvider.jsx'
import router from './Routes/Routes.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <ChatProvider>
          <RouterProvider router={router} />
        </ChatProvider>
      </FavoritesProvider>
    </AuthProvider>
  </StrictMode>,
)