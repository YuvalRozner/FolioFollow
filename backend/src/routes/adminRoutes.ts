import { Router } from 'express';
import { body } from 'express-validator';
import { UserRole } from '@shared/types';
import { userService } from '../services/userService';
import { adminOnly } from '../middleware/adminOnly';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middleware/validate';

export const adminRouter = Router();

adminRouter.use(adminOnly);

adminRouter.get('/users', asyncHandler(async (_req, res) => {
  const data = await userService.listUsers();
  res.json({ data });
}));

adminRouter.put('/users/:id/role', body('role').isIn(Object.values(UserRole)), validate, asyncHandler(async (req, res) => {
  const data = await userService.updateRole(String(req.params.id), req.body.role);
  res.json({ data });
}));
