import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Where your backend API runs in dev. Override with VITE_API_PROXY_TARGET.
  const target = env.VITE_API_PROXY_TARGET || 'https://style-decor-server-fghchs7vz-mahmuda-afroz-oishis-projects.vercel.app'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/auth': { target, changeOrigin: true },
        '/users': { target, changeOrigin: true },
        '/admin': { target, changeOrigin: true },
        '/decorator': { target, changeOrigin: true },
        '/user': { target, changeOrigin: true },
        '/bookings': { target, changeOrigin: true },
        '/payments': { target, changeOrigin: true },
        '/rooms': { target, changeOrigin: true },
        '/services': { target, changeOrigin: true },
      },
    },
  }
})
