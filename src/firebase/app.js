import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDpVIx3OOxVc7Fgxq3Op4KJTLdJDgxdNGI',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'medicine-store-aecfa.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'medicine-store-aecfa',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'medicine-store-aecfa.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '612342836851',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:612342836851:web:f9f0654c94c1eeec274406',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-2PL7FT8DNT',
};

export const isFirebaseConfigured = () => Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = isFirebaseConfigured() ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
