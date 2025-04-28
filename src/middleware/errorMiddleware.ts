// src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseHandler';

// Global error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  sendError(res, err.message, statusCode, {
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
