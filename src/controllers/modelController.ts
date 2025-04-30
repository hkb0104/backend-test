// src/controllers/modelController.ts
import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/responseHandler';
import { db } from '../config/firebase';
import { 
  doc, 
  setDoc, 
  collection,
  getDocs,
  query,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { Model } from '../types';
import { AuthRequest } from '../middleware/authMiddleware';

// Save a new model
export const saveModel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      sendError(res, 'No authenticated user', 401);
      return;
    }
    
    const { entities, name, description } = req.body as Partial<Model>;
    if (!entities || !name) {
      sendError(res, 'Entities and name are required', 400);
      return;
    }
    
    // Create a reference to a new document
    const modelRef = doc(collection(db, 'models'));
    const modelData: Model = {
      id: modelRef.id,
      userId: user.uid,
      entities,
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(modelRef, modelData);
    sendSuccess(res, modelData, 'Model saved successfully', 201);
  } catch (error) {
    sendError(res, 'Failed to save model', 500, error);
  }
};

// Get all models
export const getModels = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      sendError(res, 'Authentication required', 401);
      return;
    }

    // Get all models
    const modelsRef = collection(db, 'models');
    const q = query(modelsRef);
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    
    // Convert docs to model objects
    const models: Model[] = [];
    snapshot.forEach(doc => {
      models.push({
        id: doc.id,
        ...doc.data()
      } as Model);
    });

    sendSuccess(res, models, `Found ${models.length} models`, 200);
  } catch (error) {
    sendError(res, 'Failed to fetch models', 500, error);
  }
};