import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,         // Supaya bisa diakses Network/Cloudflare
    allowedHosts: true, // Izin akses host Cloudflare (yang tadi kita fix)
    proxy: {
      // INI JEMBATANNYA:
      '/api': {
        target: 'http://127.0.0.1:5000', // <--- Pastikan Port ini sama dengan Backend kamu
        changeOrigin: true,
        secure: false,
      },
      // Tambahkan juga untuk folder uploads (gambar)
      '/uploads': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})