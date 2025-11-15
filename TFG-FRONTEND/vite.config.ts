import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
    },
    allowedHosts: ['dei.uca.edu.sv', 'localhost'],
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://backend:5050',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/dei-api': {
        target: 'https://dei.uca.edu.sv',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dei-api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})