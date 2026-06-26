import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the built site works when opened from disk or hosted at any path.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
