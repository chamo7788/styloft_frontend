import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Change output directory from 'dist' to 'build'
  },
  optimizeDeps: {
    include: ['@react-three/fiber', '@react-three/postprocessing'],
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'three'],
  },
})
