// src/controllers/modelController.ts
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responseHandler';
import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Model } from '../types';
import { AuthRequest } from '../middleware/errorMiddleware';

export const saveModel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      sendError(res, 'No user is signed in', 401);
      return;
    }

    const { entities, name, description } = req.body as Partial<Model>;

    if (!entities || !name) {
      sendError(res, 'Entities and name are required', 400);
      return;
    }

    // Create model data
    const modelData: Model = {
      id: doc(db, 'models').id, // Generate unique ID
      userId: user.uid,
      entities,
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Firestore
    await setDoc(doc(db, 'models', modelData.id), modelData);

    // Return model data
    sendSuccess(res, modelData, 'Model saved successfully', 201);
  } catch (error) {
    sendError(res, 'Failed to save model', 500, error);
  }
};