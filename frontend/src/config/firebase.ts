import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB8IG8JfLONJiKqqXJOKC51T0-V7W3vmyc',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'foliofollow.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'foliofollow',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'foliofollow.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '179041212616',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:179041212616:web:51045b57981cab30c06dfd',
};

export const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
