import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5000,
    host: true,
    allowedHosts: [
        "822868bb127a.ngrok-free.app",
        "localhost",
        "127.0.0.1"
    ]
    
  },

})
