import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    hmr: {
      host: env.BACKEND_HOST || "localhost",
      clientPort: parseInt(env.BACKEND_PORT) || 80,
    },
    watch: {
      usePolling: true,
    },
  },
})
