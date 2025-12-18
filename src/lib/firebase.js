import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'

// Read config from Vite env variables
const env = import.meta.env

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

const isInvalid = (v) => !v || typeof v !== 'string' || v.trim() === '' || v.toLowerCase().startsWith('your_')
const missingKeys = Object.entries({
  VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  VITE_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  VITE_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
  VITE_FIREBASE_APP_ID: firebaseConfig.appId,
}).filter(([, v]) => isInvalid(v)).map(([k]) => k)

let app = null
let auth = null
let googleProvider = null
let facebookProvider = null
let firebaseReady = false

if (missingKeys.length) {
  const help = `Missing/invalid Firebase env: ${missingKeys.join(', ')}.\n` +
    'Create .env.local in the project root with your Firebase config (see .env.example) and restart the dev server.'
  // Warn but do not crash; allow mock auth fallback
  console.warn(help)
} else {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  googleProvider = new GoogleAuthProvider()
  facebookProvider = new FacebookAuthProvider()
  firebaseReady = true
}

export { app as default, auth, googleProvider, facebookProvider, firebaseReady }
