import express from 'express';
import multer from 'multer';
import { 
  registerUser, 
  getCurrentUser, 
  createModel, 
  getModels,
  getModelById,
  updateModel,
  deleteModel,
  uploadModelFile,
  loginUser
} from '../controllers';
import { authenticateUser, AuthRequest } from '../middleware/auth';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Auth routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser); 
router.get('/auth/me', authenticateUser, getCurrentUser);

// Model routes
router.post('/models', authenticateUser, createModel);
router.get('/models', authenticateUser, getModels);
router.get('/models/:id', authenticateUser, getModelById);
router.put('/models/:id', authenticateUser, updateModel);
router.delete('/models/:id', authenticateUser, deleteModel);

// File upload route - make sure uploadModelFile expects the file property from multer
router.post('/upload', authenticateUser, upload.single('file'), uploadModelFile);

export default router;