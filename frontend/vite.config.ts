import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/release/**', '**/dist/**', '**/dist-electron/**', '**/*.tmp'],
    },
    proxy: {
      '/search': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
})
