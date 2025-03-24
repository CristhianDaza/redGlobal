import type { FirebaseConfig } from '../types/firebase';

import { initializeApp, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'
import { Analytics, getAnalytics } from 'firebase/analytics'

const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
}

const app: FirebaseApp = initializeApp(firebaseConfig)

const analytics: Analytics = getAnalytics(app)
const db: Firestore = getFirestore(app)
const storage: FirebaseStorage = getStorage(app, import.meta.env.VITE_BACKET_URL)

export {
  analytics,
  db,
  storage,
}
