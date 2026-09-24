import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/mobile': {
        target: 'https://dev-medic.axadjonovsardorbek.uz',
        changeOrigin: true,
        secure: false,
      },
      '/web': {
        target: 'https://dev-medic.axadjonovsardorbek.uz',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'https://dev-medic.axadjonovsardorbek.uz',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

