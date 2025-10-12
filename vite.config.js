import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import path from 'path'
import tailwindcss from '@tailwindcss/vite'
// import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    port: 5174,
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})

