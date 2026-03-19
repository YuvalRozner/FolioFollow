import { Router } from 'express';
import { body, query } from 'express-validator';
import { exchangeRateService } from '../services/exchangeRateService';
import { adminOnly } from '../middleware/adminOnly';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middleware/validate';

export const exchangeRateRouter = Router();

exchangeRateRouter.get('/', [query('dateFrom').optional().isISO8601(), query('dateTo').optional().isISO8601()], validate, asyncHandler(async (req, res) => {
  const data = await exchangeRateService.list({ dateFrom: req.query.dateFrom as string | undefined, dateTo: req.query.dateTo as string | undefined });
  res.json({ data });
}));

exchangeRateRouter.get('/latest', asyncHandler(async (_req, res) => {
  const data = await exchangeRateService.latest();
  res.json({ data });
}));

exchangeRateRouter.post('/', adminOnly, [body('date').isISO8601(), body('rate').isFloat({ min: 0.01 })], validate, asyncHandler(async (req, res) => {
  const data = await exchangeRateService.create(req.body, req.user!.uid);
  res.status(201).json({ data });
}));
