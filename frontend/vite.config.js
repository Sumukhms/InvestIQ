import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests from /api to your backend server
      '/api': {
        target: 'http://localhost:5000', // Your backend server address
        changeOrigin: true,
        secure: false,
      },
    },
  },
})