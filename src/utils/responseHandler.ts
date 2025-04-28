// src/utils/responseHandler.ts
import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: any = {},
  message = 'Success',
  statusCode = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message = 'An error occurred',
  statusCode = 500,
  error: any = {}
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : {},
  });
};