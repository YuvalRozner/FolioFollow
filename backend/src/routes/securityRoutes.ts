import { Router } from 'express';
import { body, query } from 'express-validator';
import { Currency, Exchange, SecurityType } from '@shared/types';
import { securityService } from '../services/securityService';
import { asyncHandler } from '../utils/asyncHandler';
import { adminOnly } from '../middleware/adminOnly';
import { validate } from '../middleware/validate';

export const securityRouter = Router();

securityRouter.get('/', query('search').optional().isString(), validate, asyncHandler(async (req, res) => {
  const data = await securityService.list(req.query.search as string | undefined);
  res.json({ data });
}));

securityRouter.get('/:id', asyncHandler(async (req, res) => {
  const data = await securityService.getById(String(req.params.id));
  res.json({ data });
}));

securityRouter.post('/', adminOnly, [
  body('symbol').isString().notEmpty(),
  body('name').isString().notEmpty(),
  body('type').isIn(Object.values(SecurityType)),
  body('exchange').isIn(Object.values(Exchange)),
  body('currency').isIn(Object.values(Currency)),
], validate, asyncHandler(async (req, res) => {
  const data = await securityService.create(req.body);
  res.status(201).json({ data });
}));

securityRouter.put('/:id', adminOnly, [
  body('symbol').optional().isString().notEmpty(),
  body('name').optional().isString().notEmpty(),
  body('type').optional().isIn(Object.values(SecurityType)),
  body('exchange').optional().isIn(Object.values(Exchange)),
  body('currency').optional().isIn(Object.values(Currency)),
], validate, asyncHandler(async (req, res) => {
  const data = await securityService.update(String(req.params.id), req.body);
  res.json({ data });
}));

securityRouter.put('/:id/price', adminOnly, body('price').isFloat({ min: 0 }), validate, asyncHandler(async (req, res) => {
  const data = await securityService.updatePrice(String(req.params.id), Number(req.body.price));
  res.json({ data });
}));

securityRouter.post('/prices/bulk', adminOnly, body('updates').isArray({ min: 1 }), validate, asyncHandler(async (req, res) => {
  const data = await securityService.bulkUpdatePrices(req.body.updates);
  res.json({ data });
}));
