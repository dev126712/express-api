import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    hmr: {
      host: '34.55.134.21', // Replace with your actual frontend Service IP
      clientPort: 80,
    },
    watch: {
      usePolling: true,
    },
  },
})
