// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import admin from 'firebase-admin'
import dotenv from 'dotenv';
dotenv.config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiszDfST4ur-TVHDlNx0PBnWfJC9YkZnA",
  authDomain: "arestates-902c0.firebaseapp.com",
  projectId: "arestates-902c0",
  storageBucket: "arestates-902c0.firebasestorage.app",
  messagingSenderId: "363331303494",
  appId: "1:363331303494:web:d64d23525b918a7c4d7247",
  measurementId: "G-YLW0LRZGFQ"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

if (!admin.apps.length) {
  if (process.env.NODE_ENV === 'development') {
    // Use emulator in dev
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
    admin.initializeApp();
  } else {
    // Use service account in production
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      }),
    });
  }
}

export { auth , db, admin };
export default app;

// export const auth = getAuth(app)

