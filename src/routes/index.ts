import express from 'express';
import multer from 'multer';
import { 
  register,
  signIn
} from '../controllers/index';
import { authenticateUser, AuthRequest } from '../middleware/auth';

const router = express();
router.use(express.json())
const upload = multer({ storage: multer.memoryStorage() });

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', signIn); 
// router.get('/auth/me', authenticateUser, getCurrentUser);

// Model routes
// router.post('/models', authenticateUser, createModel);
// router.get('/models', authenticateUser, getModels);
// router.get('/models/:id', authenticateUser, getModelById);
// router.put('/models/:id', authenticateUser, updateModel);
// router.delete('/models/:id', authenticateUser, deleteModel);

// File upload route - make sure uploadModelFile expects the file property from multer
// router.post('/upload', authenticateUser, upload.single('file'), uploadModelFile);

export default router;