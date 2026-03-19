import { Router } from 'express';
import { query } from 'express-validator';
import { cashService } from '../services/cashService';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middleware/validate';

export const cashRouter = Router();

cashRouter.get('/balances', query('accountId').optional().isString(), validate, asyncHandler(async (req, res) => {
  const data = await cashService.listBalances(req.user!.uid, req.query.accountId as string | undefined);
  res.json({ data });
}));

cashRouter.get('/history', query('accountId').optional().isString(), validate, asyncHandler(async (req, res) => {
  const data = await cashService.getHistory(req.user!.uid, req.query.accountId as string | undefined);
  res.json({ data });
}));
