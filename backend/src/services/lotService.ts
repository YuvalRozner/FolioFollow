import { Lot, LotSale } from '@shared/types';
import { collections } from './baseService';
import { notFound } from '../utils/errors';
import { securityService } from './securityService';
import { exchangeRateService } from './exchangeRateService';
import { returnsCalculator } from './returnsCalculator';
import { sum, safeDivide, round } from '../utils/math';

export class LotService {
  async list(userId: string, filters?: { accountId?: string; securityId?: string; status?: string }): Promise<Lot[]> {
    let query: FirebaseFirestore.Query = collections.lots().where('userId', '==', userId);
    if (filters?.accountId) query = query.where('accountId', '==', filters.accountId);
    if (filters?.securityId) query = query.where('securityId', '==', filters.securityId);
    if (filters?.status) query = query.where('status', '==', filters.status);
    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({ ...(doc.data() as Lot), id: doc.id }));
  }

  async getById(userId: string, lotId: string) {
    const snapshot = await collections.lots().doc(lotId).get();
    if (!snapshot.exists) throw notFound('Lot not found');
    const lot = { ...(snapshot.data() as Lot), id: snapshot.id };
    if (lot.userId !== userId) throw notFound('Lot not found');
    const security = await securityService.getById(lot.securityId);
    const latestRate = await exchangeRateService.getLatestRateValue();
    return returnsCalculator.calculateLot(lot, security, latestRate);
  }

  async bySecurity(userId: string, securityId: string) {
    const lots = await this.list(userId, { securityId });
    const security = await securityService.getById(securityId);
    const latestRate = await exchangeRateService.getLatestRateValue();
    const lotSalesSnapshot = await collections.lotSales().where('userId', '==', userId).get();
    const lotSales = lotSalesSnapshot.docs
      .map((doc) => ({ ...(doc.data() as LotSale), id: doc.id }))
      .filter((sale) => lots.some((lot) => lot.id === sale.lotId));
    const calculated = returnsCalculator.calculateSecurity({ security, lots, lotSales, currentUsdIlsRate: latestRate });
    return {
      securityId,
      symbol: security.symbol,
      name: security.name,
      currentPrice: security.currentPrice ?? 0,
      weightedAvgCost: calculated.weightedAvgCost,
      totalReturnPercent: calculated.totalReturnPercent,
      totalQuantity: calculated.totalQuantity,
      lots: calculated.lots.map((lot) => ({
        ...lot,
        currentValue: round(lot.currentPrice * lot.quantityRemaining),
      })),
      weightedReturnPercent: round(safeDivide(sum(calculated.lots.map((lot) => lot.returnPercent * lot.quantityRemaining)), sum(calculated.lots.map((lot) => lot.quantityRemaining)))),
    };
  }
}

export const lotService = new LotService();
