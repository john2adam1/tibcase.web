import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Local dev backend. One variable (VITE_API_BASE) drives both the REST proxy
  // below and the WebSocket origin in src/api.js. Defaults to DEV, never prod.
  const target = env.VITE_API_BASE || 'https://dev.tibstation.uz'
  const proxy = { target, changeOrigin: true, secure: false }

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/mobile': proxy,
        '/web': proxy,
        '/auth': proxy,
        '/api': proxy,
      },
    },
  }
})
