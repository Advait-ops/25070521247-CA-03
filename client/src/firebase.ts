import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyDPhNsGP41HDB207_XTw0d45diHYsFkAxo",
  authDomain: "medilife-general-hospital.firebaseapp.com",
  projectId: "medilife-general-hospital",
  storageBucket: "medilife-general-hospital.firebasestorage.app",
  messagingSenderId: "676880136626",
  appId: "1:676880136626:web:ce712812f625e6d5a58cab"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
