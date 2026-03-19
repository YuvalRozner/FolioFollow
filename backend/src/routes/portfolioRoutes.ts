import { Router } from 'express';
import { query } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler';
import { portfolioService } from '../services/portfolioService';
import { validate } from '../middleware/validate';

export const portfolioRouter = Router();

portfolioRouter.get('/summary', query('accountId').optional().isString(), validate, asyncHandler(async (req, res) => {
  const data = await portfolioService.getSummary(req.user!.uid, req.query.accountId as string | undefined);
  res.json({ data });
}));

portfolioRouter.get('/holdings', query('accountId').optional().isString(), validate, asyncHandler(async (req, res) => {
  const data = await portfolioService.getHoldings(req.user!.uid, req.query.accountId as string | undefined);
  res.json({ data });
}));
