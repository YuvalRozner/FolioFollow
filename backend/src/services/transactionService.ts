import { Currency, Lot, LotSale, LotStatus, Transaction, TransactionQueryParams, TransactionType } from '../shared/types';
import { v4 as uuidv4 } from 'uuid';
import { collections } from './baseService';
import { nowIso } from '../utils/date';
import { badRequest, notFound } from '../utils/errors';
import { accountService } from './accountService';
import { exchangeRateService } from './exchangeRateService';
import { round } from '../utils/math';
import { cashService } from './cashService';

const compareTransactions = (a: Transaction, b: Transaction) => `${a.date}${a.createdAt}${a.id}`.localeCompare(`${b.date}${b.createdAt}${b.id}`);

export class TransactionService {
  async list(userId: string, params: TransactionQueryParams): Promise<{ data: Transaction[]; total: number }> {
    const snapshot = await collections.transactions().where('userId', '==', userId).get();
    let items = snapshot.docs.map((doc) => ({ ...(doc.data() as Transaction), id: doc.id }));

    items = items.filter((tx) => {
      if (params.accountId && tx.accountId !== params.accountId) return false;
      if (params.securityId && tx.securityId !== params.securityId) return false;
      if (params.type && tx.type !== params.type) return false;
      if (params.currency && tx.currency !== params.currency) return false;
      if (params.purpose && tx.purpose !== params.purpose) return false;
      if (params.dateFrom && tx.date < params.dateFrom) return false;
      if (params.dateTo && tx.date > params.dateTo) return false;
      return true;
    });

    const sortField = params.sort ?? 'date';
    const order = params.order ?? 'desc';
    items.sort((a, b) => {
      const left = (a as unknown as Record<string, unknown>)[sortField];
      const right = (b as unknown as Record<string, unknown>)[sortField];
      const comparison = String(left ?? '').localeCompare(String(right ?? ''));
      return order === 'asc' ? comparison : -comparison;
    });

    const total = items.length;
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 50));
    const offset = (page - 1) * limit;
    return { data: items.slice(offset, offset + limit), total };
  }

  async getById(userId: string, id: string): Promise<Transaction> {
    const snapshot = await collections.transactions().doc(id).get();
    if (!snapshot.exists) throw notFound('Transaction not found');
    const transaction = { ...(snapshot.data() as Transaction), id: snapshot.id };
    if (transaction.userId !== userId) throw notFound('Transaction not found');
    return transaction;
  }

  async create(userId: string, payload: Omit<Transaction, 'id' | 'userId' | 'totalAmount' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    await accountService.getById(userId, payload.accountId);
    this.validatePayload(payload.type, payload.securityId, payload.quantity, payload.pricePerUnit);
    const now = nowIso();
    const id = uuidv4();
    const exchangeRate = payload.currency === Currency.USD ? payload.exchangeRate ?? await exchangeRateService.getLatestRateValue() : payload.exchangeRate;
    const totalAmount = round(payload.quantity * payload.pricePerUnit, 6);
    const transaction: Transaction = {
      id,
      userId,
      accountId: payload.accountId,
      securityId: payload.securityId,
      type: payload.type,
      quantity: payload.quantity,
      pricePerUnit: payload.pricePerUnit,
      totalAmount,
      currency: payload.currency,
      exchangeRate,
      date: payload.date,
      nickname: payload.nickname,
      purpose: payload.purpose,
      notes: payload.notes,
      createdAt: now,
      updatedAt: now,
    };

    await collections.transactions().doc(id).set(transaction);
    await this.rebuildDerivedState(userId, payload.accountId);
    return transaction;
  }

  async update(userId: string, id: string, payload: Partial<Omit<Transaction, 'id' | 'userId' | 'totalAmount' | 'createdAt' | 'updatedAt'>>): Promise<Transaction> {
    const current = await this.getById(userId, id);
    const merged = { ...current, ...payload };
    this.validatePayload(merged.type, merged.securityId, merged.quantity, merged.pricePerUnit);
    const totalAmount = round(merged.quantity * merged.pricePerUnit, 6);
    await collections.transactions().doc(id).set({ ...payload, totalAmount, updatedAt: nowIso() }, { merge: true });
    await this.rebuildDerivedState(userId, current.accountId);
    if (payload.accountId && payload.accountId !== current.accountId) {
      await this.rebuildDerivedState(userId, payload.accountId);
    }
    return this.getById(userId, id);
  }

  async delete(userId: string, id: string): Promise<void> {
    const current = await this.getById(userId, id);
    await collections.transactions().doc(id).delete();
    await this.rebuildDerivedState(userId, current.accountId);
  }

  async rebuildDerivedState(userId: string, accountId: string): Promise<void> {
    const snapshot = await collections.transactions().where('userId', '==', userId).where('accountId', '==', accountId).get();
    const transactions = snapshot.docs.map((doc) => ({ ...(doc.data() as Transaction), id: doc.id })).sort(compareTransactions);

    const [existingLots, existingSales] = await Promise.all([
      collections.lots().where('userId', '==', userId).where('accountId', '==', accountId).get(),
      collections.lotSales().where('userId', '==', userId).where('accountId', '==', accountId).get(),
    ]);

    const deleteRefs = [...existingLots.docs.map((doc) => doc.ref), ...existingSales.docs.map((doc) => doc.ref)];
    for (let i = 0; i < deleteRefs.length; i += 499) {
      const batch = collections.transactions().firestore.batch();
      deleteRefs.slice(i, i + 499).forEach((ref) => batch.delete(ref));
      await batch.commit();
    }

    const balances: Record<Currency, number> = { [Currency.ILS]: 0, [Currency.USD]: 0 };
    const openLots: Lot[] = [];
    const lotWrites: Array<{ lot: Lot; merge?: boolean }> = [];
    const lotSaleWrites: LotSale[] = [];

    for (const tx of transactions) {
      switch (tx.type) {
        case TransactionType.DEPOSIT:
          balances[tx.currency] += tx.totalAmount;
          break;
        case TransactionType.WITHDRAW:
          if (balances[tx.currency] < tx.totalAmount) throw badRequest('Insufficient cash balance for withdrawal');
          balances[tx.currency] -= tx.totalAmount;
          break;
        case TransactionType.BUY: {
          if (!tx.securityId) throw badRequest('securityId is required for buy transactions');
          balances[tx.currency] -= tx.totalAmount;
          const lot: Lot = {
            id: uuidv4(),
            userId,
            accountId,
            securityId: tx.securityId,
            buyTransactionId: tx.id,
            quantityBought: tx.quantity,
            quantityRemaining: tx.quantity,
            costPerUnit: tx.pricePerUnit,
            costCurrency: tx.currency,
            exchangeRateAtBuy: tx.exchangeRate,
            status: LotStatus.OPEN,
            date: tx.date,
            createdAt: tx.createdAt,
            updatedAt: tx.updatedAt,
          } as Lot & { createdAt: string; updatedAt: string };
          openLots.push(lot as Lot);
          lotWrites.push({ lot });
          break;
        }
        case TransactionType.SELL: {
          if (!tx.securityId) throw badRequest('securityId is required for sell transactions');
          let remainingToSell = tx.quantity;
          const matchingLots = openLots.filter((lot) => lot.securityId === tx.securityId && lot.quantityRemaining > 0).sort((a, b) => a.date.localeCompare(b.date));
          for (const lot of matchingLots) {
            if (remainingToSell <= 0) break;
            const quantitySold = Math.min(lot.quantityRemaining, remainingToSell);
            lot.quantityRemaining = round(lot.quantityRemaining - quantitySold, 6);
            lot.status = lot.quantityRemaining === 0 ? LotStatus.CLOSED : LotStatus.PARTIAL;
            remainingToSell = round(remainingToSell - quantitySold, 6);
            const realizedPnlUSD = tx.currency === Currency.USD ? (tx.pricePerUnit - lot.costPerUnit) * quantitySold : undefined;
            const realizedPnlILS = tx.currency === Currency.USD
              ? (realizedPnlUSD ?? 0) * (tx.exchangeRate ?? 1)
              : (tx.pricePerUnit - lot.costPerUnit) * quantitySold;
            const lotSale: LotSale = {
              id: uuidv4(),
              lotId: lot.id,
              sellTransactionId: tx.id,
              quantitySold,
              salePricePerUnit: tx.pricePerUnit,
              saleCurrency: tx.currency,
              exchangeRateAtSell: tx.exchangeRate,
              realizedPnlILS: round(realizedPnlILS, 6),
              realizedPnlUSD: realizedPnlUSD !== undefined ? round(realizedPnlUSD, 6) : undefined,
              date: tx.date,
              createdAt: nowIso(),
              accountId,
              userId,
            };
            lotSaleWrites.push(lotSale);
          }
          if (remainingToSell > 0) throw badRequest('Not enough lot quantity available to fulfill sell transaction');
          balances[tx.currency] += tx.totalAmount;
          break;
        }
      }
    }

    openLots.forEach((lot) => {
      lotWrites.push({ lot, merge: true });
    });

    const writes = [
      ...lotWrites.map(({ lot, merge }) => ({ ref: collections.lots().doc(lot.id), data: lot, merge })),
      ...lotSaleWrites.map((lotSale) => ({ ref: collections.lotSales().doc(lotSale.id), data: lotSale, merge: undefined })),
    ];

    for (let i = 0; i < writes.length; i += 499) {
      const batch = collections.transactions().firestore.batch();
      writes.slice(i, i + 499).forEach(({ ref, data, merge }) => {
        if (merge) {
          batch.set(ref, data, { merge: true });
          return;
        }
        batch.set(ref, data);
      });
      await batch.commit();
    }

    await cashService.replaceBalances(userId, accountId, balances);
  }

  private validatePayload(type: TransactionType, securityId: string | undefined, quantity: number, pricePerUnit: number): void {
    if ([TransactionType.BUY, TransactionType.SELL].includes(type) && !securityId) {
      throw badRequest('securityId is required for buy and sell transactions');
    }

    if ([TransactionType.DEPOSIT, TransactionType.WITHDRAW].includes(type) && securityId) {
      throw badRequest('securityId must not be provided for deposit or withdraw transactions');
    }

    if (quantity <= 0) throw badRequest('quantity must be greater than zero');
    if (pricePerUnit < 0) throw badRequest('pricePerUnit must be zero or greater');
  }
}

export const transactionService = new TransactionService();
