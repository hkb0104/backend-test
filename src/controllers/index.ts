// src/controllers/index.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { auth, clientAuth, storage } from '../config/firebase';
import { AuthRequest } from '../middleware/auth';
import { User, Model, ModelEntity } from '../types/index';
import * as crypto from 'crypto';
import { Auth } from 'firebase-admin/lib/auth/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

const prisma = new PrismaClient();

// USER CONTROLLERS

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username, is_admin = false } = req.body;

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username,
    });

    // Create user in Prisma DB
    const user = await prisma.user.create({
      data: {
        id: userRecord.uid,
        email,
        username,
        is_admin,
      },
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        is_admin: user.is_admin,
      },
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message || 'Failed to create user' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.uid },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
      is_admin: user.is_admin,
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch user' });
  }
};

// MODEL CONTROLLERS

export const createModel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { name, description, entities } = req.body;

    // Validate entities structure
    if (!Array.isArray(entities)) {
      res.status(400).json({ error: 'Entities must be an array' });
      return;
    }

    // Create model in database
    const model = await prisma.model.create({
      data: {
        name,
        description,
        entities: entities as any,
        userId: req.user.uid,
      },
    });

    res.status(201).json({
      message: 'Model created successfully',
      model: {
        id: model.id,
        name: model.name,
        description: model.description,
        entities: model.entities,
        userId: model.userId,
      },
    });
  } catch (error: any) {
    console.error('Error creating model:', error);
    res.status(500).json({ error: error.message || 'Failed to create model' });
  }
};

export const getModels = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.uid },
    });

    // If user is admin, return all models, otherwise return only user's models
    const models = user?.is_admin
      ? await prisma.model.findMany({
          include: { user: { select: { username: true, email: true } } },
        })
      : await prisma.model.findMany({
          where: { userId: req.user.uid },
        });

    res.status(200).json(models);
  } catch (error: any) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch models' });
  }
};

export const getModelById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const modelId = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id: req.user.uid },
    });

    const model = await prisma.model.findUnique({
      where: { id: modelId },
      include: { user: { select: { username: true, email: true } } },
    });

    if (!model) {
      res.status(404).json({ error: 'Model not found' });
      return;
    }

    // Check if user has access to this model
    if (!user?.is_admin && model.userId !== req.user.uid) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.status(200).json(model);
  } catch (error: any) {
    console.error('Error fetching model:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch model' });
  }
};

export const updateModel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const modelId = req.params.id;
    const { name, description, entities } = req.body;

    // Check if model exists
    const existingModel = await prisma.model.findUnique({
      where: { id: modelId },
    });

    if (!existingModel) {
      res.status(404).json({ error: 'Model not found' });
      return;
    }

    // Check if user has permission to update the model
    const user = await prisma.user.findUnique({
      where: { id: req.user.uid },
    });

    if (!user?.is_admin && existingModel.userId !== req.user.uid) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Update model
    const updatedModel = await prisma.model.update({
      where: { id: modelId },
      data: {
        name,
        description,
        entities: entities as any,
      },
    });

    res.status(200).json({
      message: 'Model updated successfully',
      model: updatedModel,
    });
  } catch (error: any) {
    console.error('Error updating model:', error);
    res.status(500).json({ error: error.message || 'Failed to update model' });
  }
};

export const deleteModel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const modelId = req.params.id;

    // Check if model exists
    const existingModel = await prisma.model.findUnique({
      where: { id: modelId },
    });

    if (!existingModel) {
      res.status(404).json({ error: 'Model not found' });
      return;
    }

    // Check if user has permission to delete the model
    const user = await prisma.user.findUnique({
      where: { id: req.user.uid },
    });

    if (!user?.is_admin && existingModel.userId !== req.user.uid) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Delete model
    await prisma.model.delete({
      where: { id: modelId },
    });

    res.status(200).json({ message: 'Model deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting model:', error);
    res.status(500).json({ error: error.message || 'Failed to delete model' });
  }
};

// File upload controller
export const uploadModelFile = async (req: Request & { user?: { uid: string, email: string }, file?: Express.Multer.File }, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    // Generate a unique filename
    const filename = `models/${req.user.uid}/${Date.now()}-${crypto.randomBytes(8).toString('hex')}-${req.file.originalname}`;
    
    // Create a file in Firebase Storage
    const fileBuffer = req.file.buffer;
    const file = storage.file(filename);
    
    // Upload the file
    await file.save(fileBuffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // Generate a download URL
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '01-01-2100', // Long expiration for demo
    });

    res.status(200).json({ 
      message: 'File uploaded successfully',
      url,
      filename
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: error.message || 'Failed to upload file' });
  }
};
// LOGIN CONTROLLER
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Use client auth for sign-in
    const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
    const idToken = await userCredential.user.getIdToken();

    // Fetch user details from Prisma DB
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ error: 'User not found in database' });
      return;
    }

    res.status(200).json({
      message: 'Login successful',
      token: idToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        is_admin: user.is_admin,
      },
    });
  } catch (error: any) {
    console.error('Error during login:', error);

    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    res.status(500).json({ error: error.message || 'Failed to login' });
  }
};


