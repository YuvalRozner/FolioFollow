import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  const appError = error instanceof AppError ? error : new AppError(500, 'INTERNAL_ERROR', error.message || 'Internal server error');
  if (appError.statusCode >= 500) {
    console.error(`[${req.requestId ?? 'n/a'}]`, error);
  }
  res.status(appError.statusCode).json({
    error: {
      code: appError.code,
      message: appError.message,
    },
  });
};
