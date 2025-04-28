"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getCurrentUser = exports.login = exports.register = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const firebase_1 = require("../config/firebase");
const auth_1 = require("firebase/auth");
// Register a new user
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            (0, responseHandler_1.sendError)(res, 'Email and password are required', 400);
            return;
        }
        // Create user in Firebase Auth
        const userCredential = await (0, auth_1.createUserWithEmailAndPassword)(firebase_1.auth, email, password);
        const user = userCredential.user;
        // Return user data
        const userData = {
            uid: user.uid,
            email: user.email
        };
        (0, responseHandler_1.sendSuccess)(res, userData, 'User registered successfully', 201);
    }
    catch (error) {
        // Handle common Firebase Auth errors
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
        const user = userCredential.user;
        // Return user data
        const userData = {
            uid: user.uid,
            email: user.email
        };
        (0, responseHandler_1.sendSuccess)(res, userData, 'User logged in successfully');
    }
    catch (error) {
        // Handle common Firebase Auth errors
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
        const user = firebase_1.auth.currentUser;
        if (!user) {
            (0, responseHandler_1.sendError)(res, 'No user is signed in', 401);
            return;
        }
        const userData = {
            uid: user.uid,
            email: user.email
        };
        (0, responseHandler_1.sendSuccess)(res, userData, 'User data retrieved successfully');
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
