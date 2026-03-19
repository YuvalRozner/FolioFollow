import { Router } from 'express';
import { body } from 'express-validator';
import { AccountType, Currency } from '../shared/types';
import { accountService } from '../services/accountService';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middleware/validate';

export const accountRouter = Router();

const accountValidators = [
  body('name').isString().notEmpty(),
  body('institution').isString(),
  body('type').isIn(Object.values(AccountType)),
  body('currency').isIn(Object.values(Currency)),
  body('notes').optional().isString(),
];

accountRouter.get('/', asyncHandler(async (req, res) => {
  const accounts = await accountService.listByUser(req.user!.uid);
  res.json({ data: accounts });
}));

accountRouter.post('/', accountValidators, validate, asyncHandler(async (req, res) => {
  const result = await accountService.create(req.user!.uid, req.body);
  res.status(201).json({ data: result });
}));

accountRouter.get('/:id', asyncHandler(async (req, res) => {
  const account = await accountService.getById(req.user!.uid, String(req.params.id));
  res.json({ data: account });
}));

accountRouter.put('/:id', [
  body('name').optional().isString().notEmpty(),
  body('institution').optional().isString(),
  body('type').optional().isIn(Object.values(AccountType)),
  body('currency').optional().isIn(Object.values(Currency)),
  body('notes').optional().isString(),
], validate, asyncHandler(async (req, res) => {
  const account = await accountService.update(req.user!.uid, String(req.params.id), req.body);
  res.json({ data: account });
}));

accountRouter.delete('/:id', asyncHandler(async (req, res) => {
  await accountService.delete(req.user!.uid, String(req.params.id));
  res.status(204).send();
}));
