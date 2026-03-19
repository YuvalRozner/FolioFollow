import { CreateExchangeRateDTO, ExchangeRate, RateSource } from '../shared/types';
import { DEFAULT_CURRENCY_PAIR } from '../shared/constants';
import { v4 as uuidv4 } from 'uuid';
import { collections } from './baseService';
import { nowIso, normalizeDate } from '../utils/date';

export class ExchangeRateService {
  async list(filters?: { dateFrom?: string; dateTo?: string }): Promise<ExchangeRate[]> {
    let query: FirebaseFirestore.Query = collections.exchangeRates().orderBy('date', 'desc');
    if (filters?.dateFrom) query = query.where('date', '>=', normalizeDate(filters.dateFrom));
    if (filters?.dateTo) query = query.where('date', '<=', normalizeDate(filters.dateTo));
    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({ ...(doc.data() as ExchangeRate), id: doc.id }));
  }

  async latest(): Promise<ExchangeRate | null> {
    const snapshot = await collections.exchangeRates().orderBy('date', 'desc').limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { ...(doc.data() as ExchangeRate), id: doc.id };
  }

  async getLatestRateValue(): Promise<number> {
    const latest = await this.latest();
    if (!latest) {
      throw new Error('No exchange rate data available');
    }
    return latest.rate;
  }

  async create(payload: CreateExchangeRateDTO, updatedBy?: string): Promise<ExchangeRate> {
    const id = uuidv4();
    const exchangeRate: ExchangeRate = {
      id,
      date: normalizeDate(payload.date),
      pair: DEFAULT_CURRENCY_PAIR,
      rate: payload.rate,
      source: RateSource.MANUAL,
      updatedBy,
      createdAt: nowIso(),
    };
    await collections.exchangeRates().doc(id).set(exchangeRate);
    return exchangeRate;
  }
}

export const exchangeRateService = new ExchangeRateService();
