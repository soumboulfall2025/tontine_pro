import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Tontine App',
        short_name: 'Tontine',
        start_url: '.',
        display: 'standalone',
        background_color: '#f9fafb',
        theme_color: '#2563eb',
        description: 'Gestion moderne de tontine collaborative.',
        icons: [
          {
            src: '/vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
})
