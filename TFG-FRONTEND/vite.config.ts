import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD

  base: '/alarma/',

=======
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
>>>>>>> parent of 6e9d4d8 (🐛 Create Hosts)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
