// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseHandler';
import { getAuth } from 'firebase-admin/auth';
import admin from '../config/firebase';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
  };
}

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'No authorization token provided', 401);
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      sendError(res, 'Invalid token format', 401);
      return;
    }

    // DEV: Skip verification in emulator mode
    if (process.env.NODE_ENV === 'development') {
      req.user = { uid: 'dev-user-id' };
      next();
      return;
    }

    // PROD: Verify Firebase ID token
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = { uid: decodedToken.uid };
    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token', 401);
  }
};