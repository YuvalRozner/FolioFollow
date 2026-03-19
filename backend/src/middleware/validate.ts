import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { badRequest } from '../utils/errors';

export const validate = (req: Request, _res: Response, next: NextFunction) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(badRequest('Invalid request data', result.array()));
  }
  next();
};
