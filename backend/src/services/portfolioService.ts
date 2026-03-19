import { Currency, HoldingRow, Lot, LotSale, PortfolioSummary, Security } from '@shared/types';
import { collections } from './baseService';
import { accountService } from './accountService';
import { cashService } from './cashService';
import { exchangeRateService } from './exchangeRateService';
import { returnsCalculator } from './returnsCalculator';
import { securityService } from './securityService';
import { round } from '../utils/math';

export class PortfolioService {
  async getHoldings(userId: string, accountId?: string): Promise<HoldingRow[]> {
    let lotsQuery: FirebaseFirestore.Query = collections.lots().where('userId', '==', userId);
    if (accountId) lotsQuery = lotsQuery.where('accountId', '==', accountId);
    const [lotsSnapshot, accounts, latestRate, allSecurities, lotSalesSnapshot] = await Promise.all([
      lotsQuery.get(),
      accountService.listByUser(userId),
      exchangeRateService.getLatestRateValue(),
      securityService.list(),
      collections.lotSales().where('userId', '==', userId).get(),
    ]);

    const lots = lotsSnapshot.docs.map((doc) => ({ ...(doc.data() as Lot), id: doc.id })).filter((lot) => lot.quantityRemaining > 0);
    const lotSales = lotSalesSnapshot.docs.map((doc) => ({ ...(doc.data() as LotSale), id: doc.id }));
    const securityMap = new Map<string, Security>(allSecurities.map((security) => [security.id, security] as [string, Security]));
    const accountMap = new Map(accounts.map((account) => [account.id, account]));

    const grouped = new Map<string, Lot[]>();
    for (const lot of lots) {
      const key = `${lot.accountId}:${lot.securityId}`;
      const bucket = grouped.get(key) ?? [];
      bucket.push(lot);
      grouped.set(key, bucket);
    }

    return Array.from(grouped.entries())
      .map(([key, groupLots]) => {
        const [groupAccountId, groupSecurityId] = key.split(':');
        const security = securityMap.get(groupSecurityId);
        const account = accountMap.get(groupAccountId);
        if (!security || !account) {
          console.warn(`Skipping orphaned holding group: security=${groupSecurityId}, account=${groupAccountId}`);
          return null;
        }
        const relatedSales = lotSales.filter((sale) => groupLots.some((lot) => lot.id === sale.lotId));
        const calculated = returnsCalculator.calculateSecurity({
          security,
          lots: groupLots,
          lotSales: relatedSales,
          currentUsdIlsRate: latestRate,
        });
        return {
          securityId: groupSecurityId,
          symbol: security.symbol,
          name: security.name,
          accountId: groupAccountId,
          accountName: account.name,
          totalQuantity: calculated.totalQuantity,
          weightedAvgCost: calculated.weightedAvgCost,
          currentPrice: calculated.currentPrice,
          currency: security.currency,
          marketValueILS: calculated.marketValueILS,
          marketValueUSD: calculated.marketValueUSD,
          unrealizedPnlILS: calculated.totalUnrealizedPnlILS,
          unrealizedPnlPercent: calculated.totalReturnPercent,
          realizedPnlILS: calculated.totalRealizedPnlILS,
          lots: calculated.lots,
        } as HoldingRow;
      })
      .filter((holding): holding is HoldingRow => holding !== null);
  }

  async getSummary(userId: string, accountId?: string): Promise<PortfolioSummary> {
    const [accounts, holdings, balances, currentUsdIlsRate] = await Promise.all([
      accountService.listByUser(userId),
      this.getHoldings(userId, accountId),
      cashService.listBalances(userId, accountId),
      exchangeRateService.getLatestRateValue(),
    ]);

    const filteredAccounts = accountId ? accounts.filter((account) => account.id === accountId) : accounts;
    return returnsCalculator.calculatePortfolio({
      holdings,
      accounts: filteredAccounts,
      cashBalances: balances.map((balance) => ({ accountId: balance.accountId, currency: balance.currency, balance: round(balance.balance, 2) })),
      currentUsdIlsRate,
    });
  }
}

export const portfolioService = new PortfolioService();
