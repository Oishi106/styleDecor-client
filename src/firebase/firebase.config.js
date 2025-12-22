// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDL5Rca_KUl5JQwAXNmdB6JQpia84Ak5Y",
  authDomain: "oishi-660af.firebaseapp.com",
  projectId: "oishi-660af",
  storageBucket: "oishi-660af.firebasestorage.app",
  messagingSenderId: "135560629504",
  appId: "1:135560629504:web:a8ce279a73d646a448b7e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Firebase ready flag
export const firebaseReady = true;

// Default export
export default app;