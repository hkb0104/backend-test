import * as admin from 'firebase-admin';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth as getClientAuth } from 'firebase/auth';
import 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
let serviceAccount;
try {
  // 1. Decode the Base64 string directly from the environment variable
  const decodedCredentials = Buffer.from(process.env.FIREBASE_CREDENTIALS!, 'base64').toString('utf-8'); // Specify utf-8 encoding

  // 2. Parse the decoded string DIRECTLY as JSON
  serviceAccount = JSON.parse(decodedCredentials);

  console.log("Firebase credentials parsed successfully");
} catch (error) {
  console.error("Error parsing Firebase credentials:", error);
  // It's helpful to log the first few characters of the decoded string to see if it looks like JSON
  // Be careful not to log sensitive parts like the private key
  const potentiallyBadJson = Buffer.from(process.env.FIREBASE_CREDENTIALS!, 'base64').toString('utf-8');
  console.error("Decoded string starts with:", potentiallyBadJson.substring(0, 50) + "...");
  console.error("Please check your FIREBASE_CREDENTIALS environment variable and ensure it's a valid Base64 encoded JSON");
  process.exit(1); // Exit the application if credentials can't be parsed
}

// Initialize Firebase Admin (This part should now work if serviceAccount is parsed correctly)
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // Requires a valid serviceAccount object
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET?.replace('gs://', '')
  });
  console.log("Firebase Admin SDK initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase Admin:", error); // If this errors now, the parsed object might still be wrong
  console.error("Parsed service account object (check structure, sensitive parts omitted):", {
      type: serviceAccount?.type,
      project_id: serviceAccount?.project_id,
      private_key: serviceAccount?.private_key ? "[PRESENT]" : "[MISSING]",
      client_email: serviceAccount?.client_email,
      // DO NOT LOG the full serviceAccount or private_key here in production
  });
  process.exit(1);
}


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