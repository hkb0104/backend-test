// src/controllers/authController.ts
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responseHandler';
import { auth } from '../config/firebase';
import {
 createUserWithEmailAndPassword,
 signInWithEmailAndPassword,
 signOut,
 UserCredential
} from 'firebase/auth';

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
 try {
 const { email, password } = req.body;

 if (!email || !password) {
 sendError(res, 'Email and password are required', 400);
 return;
 }

 // Create user in Firebase Auth
 const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
 const user = userCredential.user;

 // Return user data
 const userData = {
 uid: user.uid,
 email: user.email
 };

 sendSuccess(res, userData, 'User registered successfully', 201);
 } catch (error: any) {
 // Handle common Firebase Auth errors
 if (error.code === 'auth/email-already-in-use') {
 sendError(res, 'Email already in use', 400);
 return;
 }
 if (error.code === 'auth/invalid-email') {
 sendError(res, 'Invalid email format', 400);
 return;
 }
 if (error.code === 'auth/weak-password') {
 sendError(res, 'Password is too weak', 400);
 return;
 }

 sendError(res, 'Registration failed', 500, error);
 }
};

// Login a user
export const login = async (req: Request, res: Response): Promise<void> => {
 try {
 const { email, password } = req.body;

 if (!email || !password) {
 sendError(res, 'Email and password are required', 400);
 return;
 }

 // Sign in with Firebase Auth
 const userCredential = await signInWithEmailAndPassword(auth, email, password);
 const user = userCredential.user;

 // Return user data
 const userData = {
 uid: user.uid,
 email: user.email
 };

 sendSuccess(res, userData, 'User logged in successfully');
 } catch (error: any) {
 // Handle common Firebase Auth errors
 if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
 sendError(res, 'Invalid email or password', 401);
 return;
 }
 if (error.code === 'auth/too-many-requests') {
 sendError(res, 'Too many failed login attempts. Please try again later', 429);
 return;
 }

 sendError(res, 'Login failed', 500, error);
 }
};

// Get current user data
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
 try {
 const user = auth.currentUser;

 if (!user) {
 sendError(res, 'No user is signed in', 401);
 return;
 }

 const userData = {
 uid: user.uid,
 email: user.email
 };

 sendSuccess(res, userData, 'User data retrieved successfully');
 } catch (error) {
 sendError(res, 'Failed to get user data', 500, error);
 }
};

// Logout user
export const logout = async (req: Request, res: Response): Promise<void> => {
 try {
 await signOut(auth);
 sendSuccess(res, {}, 'User logged out successfully');
 } catch (error) {
 sendError(res, 'Failed to log out', 500, error);
 }
};