import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This proxy configuration is the fix.
    // It tells Vite to forward any request starting with '/api'
    // to your backend server running on http://localhost:5000.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Recommended for development
      },
    },
  },
})