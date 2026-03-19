import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../shared/types';
import { forbidden, unauthorized } from '../utils/errors';

export const adminOnly = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) return next(unauthorized());
  if (req.user.role !== UserRole.ADMIN) return next(forbidden('Admin access required'));
  next();
};
