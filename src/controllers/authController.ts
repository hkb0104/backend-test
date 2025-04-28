// src/controllers/authController.ts
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responseHandler';
import { auth, db } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User } from '../types';

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username, is_admin = false } = req.body as Partial<User>;

    if (!email || !password || !username) {
      sendError(res, 'Email, password, and username are required', 400);
      return;
    }

    // Create user in Firebase Auth
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Store user data in Firestore
    const userData: User = {
      id: firebaseUser.uid,
      email,
      username,
      is_admin,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userData);

    // Get Firebase ID token
    const idToken = await firebaseUser.getIdToken();

    // Return user data (exclude password)
    const responseData: Partial<User> = {
      id: userData.id,
      email: userData.email,
      username: userData.username,
      is_admin: userData.is_admin,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    sendSuccess(res, { user: responseData, idToken }, 'User registered successfully', 201);
  } catch (error: any) {
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
    const firebaseUser = userCredential.user;

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) {
      sendError(res, 'User not found in database', 404);
      return;
    }

    const userData = userDoc.data() as User;

    // Get Firebase ID token
    const idToken = await firebaseUser.getIdToken();

    // Return user data (exclude password)
    const responseData: Partial<User> = {
      id: userData.id,
      email: userData.email,
      username: userData.username,
      is_admin: userData.is_admin,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    sendSuccess(res, { user: responseData, idToken }, 'User logged in successfully');
  } catch (error: any) {
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
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user; // From authenticateUser middleware

    if (!user) {
      sendError(res, 'No user is signed in', 401);
      return;
    }

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      sendError(res, 'User not found in database', 404);
      return;
    }

    const userData = userDoc.data() as User;

    // Return user data (exclude password)
    const responseData: Partial<User> = {
      id: userData.id,
      email: userData.email,
      username: userData.username,
      is_admin: userData.is_admin,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    sendSuccess(res, responseData, 'User data retrieved successfully');
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