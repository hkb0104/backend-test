// src/app.ts
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/health', (req, res) => {
 res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(errorHandler);

export default app;