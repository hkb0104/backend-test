// src/controllers/index.ts
import { Request, Response } from 'express';
import { auth } from '../config/firebase';
// import { AuthRequest } from '../middleware/auth';
// import { User, Model, ModelEntity } from '../types/index';
// import * as crypto from 'crypto';
// import { Auth } from 'firebase-admin/lib/auth/auth';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';


// USER CONTROLLERS

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const idToken = await user.getIdToken();
    res.status(201).json({ user: { uid: user.uid, email: user.email }, idToken });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const idToken = await user.getIdToken(); // Get Firebase ID token (JWT)
    console.log('User:', user.uid, 'Token:', idToken);
    return { user, idToken };
  } catch (error) {
    console.error('Sign-in error:', error);
    throw error;
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const idToken = await user.getIdToken();
    console.log('Current user:', user.uid, 'Token:', idToken);
    // Send idToken to your Express server for protected routes
  } else {
    console.log('No user signed in');
  }
});