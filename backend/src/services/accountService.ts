import { Account, CreateAccountDTO } from '@shared/types';
import { DEFAULT_ACCOUNT_TEMPLATES } from '@shared/constants';
import { v4 as uuidv4 } from 'uuid';
import { collections } from './baseService';
import { nowIso } from '../utils/date';
import { notFound } from '../utils/errors';

export class AccountService {
  async listByUser(userId: string): Promise<Account[]> {
    const snapshot = await collections.accounts().where('userId', '==', userId).orderBy('createdAt', 'asc').get();
    return snapshot.docs.map((doc) => ({ ...(doc.data() as Account), id: doc.id }));
  }

  async getById(userId: string, accountId: string): Promise<Account> {
    const snapshot = await collections.accounts().doc(accountId).get();
    if (!snapshot.exists) throw notFound('Account not found');
    const account = { ...(snapshot.data() as Account), id: snapshot.id };
    if (account.userId !== userId) throw notFound('Account not found');
    return account;
  }

  async create(userId: string, payload: CreateAccountDTO): Promise<{ account: Account; suggestedTemplates: typeof DEFAULT_ACCOUNT_TEMPLATES }> {
    const now = nowIso();
    const existing = await this.listByUser(userId);
    const id = uuidv4();
    const account: Account = { id, userId, ...payload, createdAt: now, updatedAt: now };
    await collections.accounts().doc(id).set(account);
    const suggestedTemplates = existing.length === 0 ? DEFAULT_ACCOUNT_TEMPLATES : [] as unknown as typeof DEFAULT_ACCOUNT_TEMPLATES;
    return { account, suggestedTemplates };
  }

  async update(userId: string, accountId: string, payload: Partial<CreateAccountDTO>): Promise<Account> {
    await this.getById(userId, accountId);
    await collections.accounts().doc(accountId).set({ ...payload, updatedAt: nowIso() }, { merge: true });
    return this.getById(userId, accountId);
  }

  async delete(userId: string, accountId: string): Promise<void> {
    await this.getById(userId, accountId);

    const [transactionsSnapshot, lotsSnapshot, lotSalesSnapshot, cashBalancesSnapshot] = await Promise.all([
      collections.transactions().where('userId', '==', userId).where('accountId', '==', accountId).get(),
      collections.lots().where('userId', '==', userId).where('accountId', '==', accountId).get(),
      collections.lotSales().where('userId', '==', userId).where('accountId', '==', accountId).get(),
      collections.cashBalances().where('userId', '==', userId).where('accountId', '==', accountId).get(),
    ]);

    const refs = [
      ...transactionsSnapshot.docs.map((doc) => doc.ref),
      ...lotsSnapshot.docs.map((doc) => doc.ref),
      ...lotSalesSnapshot.docs.map((doc) => doc.ref),
      ...cashBalancesSnapshot.docs.map((doc) => doc.ref),
      collections.accounts().doc(accountId),
    ];

    for (let i = 0; i < refs.length; i += 499) {
      const batch = collections.accounts().firestore.batch();
      refs.slice(i, i + 499).forEach((ref) => batch.delete(ref));
      await batch.commit();
    }
  }
}

export const accountService = new AccountService();
