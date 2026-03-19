import { Router } from 'express';
import { body } from 'express-validator';
import { userService } from '../services/userService';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middleware/validate';

export const authRouter = Router();

authRouter.get(
  '/me',
  asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.user!.uid);
    res.json({ data: user });
  }),
);

authRouter.put(
  '/me',
  body('language').isIn(['he', 'en']),
  validate,
  asyncHandler(async (req, res) => {
    const user = await userService.updateLanguage(req.user!.uid, req.body.language);
    res.json({ data: user });
  }),
);
