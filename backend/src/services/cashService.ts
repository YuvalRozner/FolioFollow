import { CashBalance, Currency, Transaction, TransactionType } from '@shared/types';
import { v4 as uuidv4 } from 'uuid';
import { collections } from './baseService';
import { nowIso } from '../utils/date';
import { round } from '../utils/math';

export class CashService {
  async listBalances(userId: string, accountId?: string): Promise<CashBalance[]> {
    let query: FirebaseFirestore.Query = collections.cashBalances().where('userId', '==', userId);
    if (accountId) query = query.where('accountId', '==', accountId);
    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({ ...(doc.data() as CashBalance), id: doc.id }));
  }

  async getBalanceMap(userId: string, accountId?: string): Promise<Map<string, CashBalance>> {
    const balances = await this.listBalances(userId, accountId);
    return new Map(balances.map((item) => [`${item.accountId}:${item.currency}`, item]));
  }

  async replaceBalances(userId: string, accountId: string, balances: Record<Currency, number>): Promise<void> {
    const existing = await this.listBalances(userId, accountId);
    const batch = collections.cashBalances().firestore.batch();
    for (const item of existing) {
      batch.delete(collections.cashBalances().doc(item.id));
    }

    for (const currency of Object.values(Currency)) {
      const id = uuidv4();
      const balance: CashBalance = {
        id,
        userId,
        accountId,
        currency,
        balance: round(balances[currency] ?? 0, 6),
        updatedAt: nowIso(),
      };
      batch.set(collections.cashBalances().doc(id), balance);
    }

    await batch.commit();
  }

  async getHistory(userId: string, accountId?: string): Promise<Transaction[]> {
    let query: FirebaseFirestore.Query = collections.transactions().where('userId', '==', userId);
    if (accountId) query = query.where('accountId', '==', accountId);
    const snapshot = await query.get();
    return snapshot.docs
      .map((doc) => ({ ...(doc.data() as Transaction), id: doc.id }))
      .filter((tx) => [TransactionType.DEPOSIT, TransactionType.WITHDRAW, TransactionType.BUY, TransactionType.SELL].includes(tx.type))
      .sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`));
  }
}

export const cashService = new CashService();
