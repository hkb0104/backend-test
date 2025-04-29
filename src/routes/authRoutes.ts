// src/routes/appRoutes.ts
import express from 'express';
import * as authController from '../controllers/authController';
import { authenticateUser } from '../middleware/authMiddleware';
import { saveModel, getModels } from '../controllers/modelController';

const router = express.Router();

// 🔐 Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user', authController.getCurrentUser);
router.post('/logout', authController.logout);

// 📦 Model Routes
router.post('/models', authenticateUser, saveModel);
router.get('/models', authenticateUser, getModels); // New GET route

// 📋 Log all registered routes
router.stack.forEach((layer) => {
  if (layer.route) {
    const route = layer.route as any;
    const methods = Object.keys(route.methods || {})
      .filter(method => method !== '_all')
      .map(m => m.toUpperCase())
      .join(', ');

    console.log(`📄 Registered route: ${methods} /api/${layer.route.path}`);
  }
});

export default router;