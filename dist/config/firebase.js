"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.db = exports.auth = void 0;
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
exports.admin = firebase_admin_1.default;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
const app = (0, app_1.initializeApp)(firebaseConfig);
const db = (0, firestore_1.getFirestore)(app);
exports.db = db;
const auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
if (!firebase_admin_1.default.apps.length) {
    if (process.env.NODE_ENV === 'development') {
        // Use emulator in dev
        process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
        firebase_admin_1.default.initializeApp();
    }
    else {
        // Use service account in production
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL
            }),
        });
    }
}
exports.default = app;
// export const auth = getAuth(app)
