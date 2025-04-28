// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app;

// export const auth = getAuth(app)

