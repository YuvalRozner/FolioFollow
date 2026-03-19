import { Router } from 'express';
import { query } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler';
import { lotService } from '../services/lotService';
import { validate } from '../middleware/validate';

export const lotRouter = Router();

lotRouter.get('/', [
  query('accountId').optional().isString(),
  query('securityId').optional().isString(),
  query('status').optional().isString(),
], validate, asyncHandler(async (req, res) => {
  const data = await lotService.list(req.user!.uid, {
    accountId: req.query.accountId as string | undefined,
    securityId: req.query.securityId as string | undefined,
    status: req.query.status as string | undefined,
  });
  res.json({ data });
}));

lotRouter.get('/by-security/:securityId', asyncHandler(async (req, res) => {
  const data = await lotService.bySecurity(req.user!.uid, String(req.params.securityId));
  res.json({ data });
}));

lotRouter.get('/:id', asyncHandler(async (req, res) => {
  const data = await lotService.getById(req.user!.uid, String(req.params.id));
  res.json({ data });
}));
