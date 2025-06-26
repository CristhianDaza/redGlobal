/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_MEASUREMENT_ID: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_BACKET_URL: string
  readonly VITE_VERSION_APP: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vue'
            }
            if (id.includes('firebase')) {
              return 'firebase'
            }
            if (id.includes('@vueuse/head')) {
              return 'vueuse'
            }
            if (id.includes('axios')) {
              return 'axios'
            }
            if (id.includes('@emailjs')) {
              return 'emailjs'
            }
            if (id.includes('@todovue')) {
              return 'todovue'
            }
            return 'vendor'
          }

          if (id.includes('src/store')) return 'stores'
          if (id.includes('src/utils')) return 'utils'
        }
      }
    }
  }
})
