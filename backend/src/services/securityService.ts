import { CreateSecurityDTO, Security } from '../shared/types';
import { v4 as uuidv4 } from 'uuid';
import { collections } from './baseService';
import { nowIso } from '../utils/date';
import { conflict, notFound } from '../utils/errors';

export class SecurityService {
  async list(search?: string): Promise<Security[]> {
    const snapshot = await collections.securities().orderBy('symbol', 'asc').get();
    const all = snapshot.docs.map((doc) => ({ ...(doc.data() as Security), id: doc.id }));
    if (!search) return all;
    const normalized = search.toLowerCase();
    return all.filter((item) => item.symbol.toLowerCase().includes(normalized) || item.name.toLowerCase().includes(normalized));
  }

  async getById(id: string): Promise<Security> {
    const snapshot = await collections.securities().doc(id).get();
    if (!snapshot.exists) throw notFound('Security not found');
    return { ...(snapshot.data() as Security), id: snapshot.id };
  }

  async create(payload: CreateSecurityDTO): Promise<Security> {
    const existing = await collections.securities().where('symbol', '==', payload.symbol).get();
    if (!existing.empty) throw conflict('Security with this symbol already exists');
    const now = nowIso();
    const id = uuidv4();
    const security: Security = { id, ...payload, createdAt: now, updatedAt: now };
    await collections.securities().doc(id).set(security);
    return security;
  }

  async update(id: string, payload: Partial<CreateSecurityDTO>): Promise<Security> {
    await this.getById(id);
    await collections.securities().doc(id).set({ ...payload, updatedAt: nowIso() }, { merge: true });
    return this.getById(id);
  }

  async updatePrice(id: string, price: number): Promise<Security> {
    await this.getById(id);
    const now = nowIso();
    await collections.securities().doc(id).set({ currentPrice: price, priceUpdatedAt: now, updatedAt: now }, { merge: true });
    return this.getById(id);
  }

  async bulkUpdatePrices(updates: Array<{ securityId: string; price: number }>): Promise<Security[]> {
    const batch = collections.securities().firestore.batch();
    const now = nowIso();
    for (const update of updates) {
      const ref = collections.securities().doc(update.securityId);
      batch.set(ref, { currentPrice: update.price, priceUpdatedAt: now, updatedAt: now }, { merge: true });
    }
    await batch.commit();
    return Promise.all(updates.map((item) => this.getById(item.securityId)));
  }
}

export const securityService = new SecurityService();
