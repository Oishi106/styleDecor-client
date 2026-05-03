import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_API_PROXY_TARGET || 'http://localhost:3000'

  return {
    plugins: [react(), tailwindcss()],      
    server: {
      // ✅ React Router এর জন্য — page reload এ সব route React এ যাবে
      historyApiFallback: true,
      proxy: {
        // ✅ শুধু API routes proxy করো — frontend routes নয়
        '/auth': { target, changeOrigin: true },
        '/users': { target, changeOrigin: true },
        '/admin': { target, changeOrigin: true },
        '/decorator': { target, changeOrigin: true },
        '/user': { target, changeOrigin: true },
        '/chat': { target, changeOrigin: true },
        '/favourites': { target, changeOrigin: true },
        '/bookings': { target, changeOrigin: true },
        '/payments': { target, changeOrigin: true },
        '/create-payment-intent': { target, changeOrigin: true },
        '/rooms': { target, changeOrigin: true },
        // ❌ '/services' সরিয়ে দিলাম — এটা frontend route
        // ❌ '/favorites' সরিয়ে দিলাম — '/favourites' ই use হচ্ছে
      },
    },
  }
})