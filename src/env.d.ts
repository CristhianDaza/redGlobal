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
  readonly VITE_API_MARPICO_BASE_URL: string
  readonly VITE_API_MARPICO_TOKEN: string
  readonly VITE_API_PROMOS_BASE_URL: string
  readonly VITE_API_STOCKSUR_BASE_URL: string
  readonly VITE_API_CATAPROM_BASE_URL: string
  readonly VITE_API_CATAPROM_PROXY_URL: string
  readonly VITE_CLOUDINARY_CLOUD_NAME: string
  readonly VITE_CLOUDINARY_API_KEY: string
  readonly VITE_CLOUDINARY_API_SECRET: string
  readonly VITE_CLOUDINARY_API_ENVIRONMENT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
