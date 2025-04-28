import * as admin from 'firebase-admin';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth as getClientAuth } from 'firebase/auth';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_CREDENTIALS!, 'base64').toString()
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

// Initialize Firebase Client SDK
const clientConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const clientApp = getApps().length === 0 ? initializeApp(clientConfig) : getApp();
const clientAuth = getClientAuth(clientApp);

// Exports
export const db = admin.firestore();
export const auth = admin.auth();
export const adminAuth = admin.auth();
export const storage = admin.storage().bucket();
export { clientAuth };