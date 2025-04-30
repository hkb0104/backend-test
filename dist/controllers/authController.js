"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getCurrentUser = exports.login = exports.register = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const firebase_1 = require("../config/firebase");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
// Register a new user
const register = async (req, res) => {
    try {
        const { email, password, username, is_admin = false } = req.body;
        if (!email || !password || !username) {
            (0, responseHandler_1.sendError)(res, 'Email, password, and username are required', 400);
            return;
        }
        // Create user in Firebase Auth
        const userCredential = await (0, auth_1.createUserWithEmailAndPassword)(firebase_1.auth, email, password);
        const firebaseUser = userCredential.user;
        // Store user data in Firestore
        const userData = {
            id: firebaseUser.uid,
            email,
            username,
            is_admin,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, 'users', firebaseUser.uid), userData);
        // Get Firebase ID token
        const idToken = await firebaseUser.getIdToken();
        // Return user data (exclude password)
        const responseData = {
            id: userData.id,
            email: userData.email,
            username: userData.username,
            is_admin: userData.is_admin,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
        };
        (0, responseHandler_1.sendSuccess)(res, { user: responseData, idToken }, 'User registered successfully', 201);
    }
    catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            (0, responseHandler_1.sendError)(res, 'Email already in use', 400);
            return;
        }
        if (error.code === 'auth/invalid-email') {
            (0, responseHandler_1.sendError)(res, 'Invalid email format', 400);
            return;
        }
        if (error.code === 'auth/weak-password') {
            (0, responseHandler_1.sendError)(res, 'Password is too weak', 400);
            return;
        }
        (0, responseHandler_1.sendError)(res, 'Registration failed', 500, error);
    }
};
exports.register = register;
// Login a user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            (0, responseHandler_1.sendError)(res, 'Email and password are required', 400);
            return;
        }
        // Sign in with Firebase Auth
        const userCredential = await (0, auth_1.signInWithEmailAndPassword)(firebase_1.auth, email, password);
        const firebaseUser = userCredential.user;
        // Fetch user data from Firestore
        const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', firebaseUser.uid));
        if (!userDoc.exists()) {
            (0, responseHandler_1.sendError)(res, 'User not found in database', 404);
            return;
        }
        const userData = userDoc.data();
        // Get Firebase ID token
        const idToken = await firebaseUser.getIdToken();
        // Return user data (exclude password)
        const responseData = {
            id: userData.id,
            email: userData.email,
            username: userData.username,
            is_admin: userData.is_admin,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
        };
        (0, responseHandler_1.sendSuccess)(res, { user: responseData, idToken }, 'User logged in successfully');
    }
    catch (error) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            (0, responseHandler_1.sendError)(res, 'Invalid email or password', 401);
            return;
        }
        if (error.code === 'auth/too-many-requests') {
            (0, responseHandler_1.sendError)(res, 'Too many failed login attempts. Please try again later', 429);
            return;
        }
        (0, responseHandler_1.sendError)(res, 'Login failed', 500, error);
    }
};
exports.login = login;
// Get current user data
const getCurrentUser = async (req, res) => {
    try {
        const user = req.user; // From authenticateUser middleware
        if (!user) {
            (0, responseHandler_1.sendError)(res, 'No user is signed in', 401);
            return;
        }
        // Fetch user data from Firestore
        const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', user.uid));
        if (!userDoc.exists()) {
            (0, responseHandler_1.sendError)(res, 'User not found in database', 404);
            return;
        }
        const userData = userDoc.data();
        // Return user data (exclude password)
        const responseData = {
            id: userData.id,
            email: userData.email,
            username: userData.username,
            is_admin: userData.is_admin,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
        };
        (0, responseHandler_1.sendSuccess)(res, responseData, 'User data retrieved successfully');
    }
    catch (error) {
        (0, responseHandler_1.sendError)(res, 'Failed to get user data', 500, error);
    }
};
exports.getCurrentUser = getCurrentUser;
// Logout user
const logout = async (req, res) => {
    try {
        await (0, auth_1.signOut)(firebase_1.auth);
        (0, responseHandler_1.sendSuccess)(res, {}, 'User logged out successfully');
    }
    catch (error) {
        (0, responseHandler_1.sendError)(res, 'Failed to log out', 500, error);
    }
};
exports.logout = logout;
