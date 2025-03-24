import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this to handle peer dependency issues
  optimizeDeps: {
    include: ['@react-three/fiber', '@react-three/postprocessing'],
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'three'],
  },
})
