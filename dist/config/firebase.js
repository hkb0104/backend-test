"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.auth = void 0;
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDhZz_v4AmGmUk-iisVktflgMP9znO7wwg",
    authDomain: "ar-estates-b05e8.firebaseapp.com",
    projectId: "ar-estates-b05e8",
    storageBucket: "ar-estates-b05e8.firebasestorage.app",
    messagingSenderId: "193665471727",
    appId: "1:193665471727:web:c881c0401db9e88972f71a",
    measurementId: "G-DZM3LLCQLH"
};
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const app = (0, app_1.initializeApp)(firebaseConfig);
const db = (0, firestore_1.getFirestore)(app);
exports.db = db;
const auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
exports.default = app;
// export const auth = getAuth(app)
