import { Router } from 'express';
import { body, query } from 'express-validator';
import { Currency, TransactionType } from '../shared/types';
import { transactionService } from '../services/transactionService';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middleware/validate';

export const transactionRouter = Router();

const createValidators = [
  body('accountId').isString().notEmpty(),
  body('securityId').optional().isString().notEmpty(),
  body('type').isIn(Object.values(TransactionType)),
  body('quantity').isFloat({ gt: 0 }),
  body('pricePerUnit').isFloat({ min: 0 }),
  body('currency').isIn(Object.values(Currency)),
  body('exchangeRate').optional().isFloat({ min: 0.01 }),
  body('date').isISO8601(),
  body('nickname').optional().isString(),
  body('purpose').optional().isString(),
  body('notes').optional().isString(),
];

transactionRouter.get('/', [
  query('accountId').optional().isString(),
  query('securityId').optional().isString(),
  query('type').optional().isIn(Object.values(TransactionType)),
  query('currency').optional().isIn(Object.values(Currency)),
  query('purpose').optional().isString(),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601(),
  query('sort').optional().isString(),
  query('order').optional().isIn(['asc', 'desc']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
], validate, asyncHandler(async (req, res) => {
  const result = await transactionService.list(req.user!.uid, {
    accountId: req.query.accountId as string | undefined,
    securityId: req.query.securityId as string | undefined,
    type: req.query.type as TransactionType | undefined,
    currency: req.query.currency as Currency | undefined,
    purpose: req.query.purpose as string | undefined,
    dateFrom: req.query.dateFrom as string | undefined,
    dateTo: req.query.dateTo as string | undefined,
    sort: req.query.sort as string | undefined,
    order: req.query.order as 'asc' | 'desc' | undefined,
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  });
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 50);
  res.json({
    data: result.data,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  });
}));

transactionRouter.post('/', createValidators, validate, asyncHandler(async (req, res) => {
  const data = await transactionService.create(req.user!.uid, req.body);
  res.status(201).json({ data });
}));

transactionRouter.get('/:id', asyncHandler(async (req, res) => {
  const data = await transactionService.getById(req.user!.uid, String(req.params.id));
  res.json({ data });
}));

transactionRouter.put('/:id', [
  body('accountId').optional().isString().notEmpty(),
  body('securityId').optional().isString().notEmpty(),
  body('type').optional().isIn(Object.values(TransactionType)),
  body('quantity').optional().isFloat({ gt: 0 }),
  body('pricePerUnit').optional().isFloat({ min: 0 }),
  body('currency').optional().isIn(Object.values(Currency)),
  body('exchangeRate').optional().isFloat({ min: 0.01 }),
  body('date').optional().isISO8601(),
  body('nickname').optional().isString(),
  body('purpose').optional().isString(),
  body('notes').optional().isString(),
], validate, asyncHandler(async (req, res) => {
  const data = await transactionService.update(req.user!.uid, String(req.params.id), req.body);
  res.json({ data });
}));

transactionRouter.delete('/:id', asyncHandler(async (req, res) => {
  await transactionService.delete(req.user!.uid, String(req.params.id));
  res.status(204).send();
}));
