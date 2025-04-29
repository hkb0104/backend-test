import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseHandler';
import { getAuth } from 'firebase-admin/auth';
import admin from '../config/firebase'; // This should export the initialized FirebaseApp

// Extend the Express Request type to include user
export interface AuthRequest extends Request {
  user?: any; // You can define a more specific type if needed
}

// Middleware to authenticate user
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
    
    try {
      // Use Firebase Admin SDK for token verification
      const decodedToken = await getAuth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      sendError(res, 'Invalid or expired token', 401);
      return;
    }
  } catch (error) {
    sendError(res, 'Authentication failed', 500, error);
  }
};