import { Account, Currency, HoldingRow, Lot, LotDetail, LotSale, PortfolioSummary, Security } from '@shared/types';
import { round, safeDivide, sum } from '../utils/math';

export interface CalculatedLotDetail extends LotDetail {
  unrealizedPnlILS: number;
  unrealizedPnlUSD: number;
  marketValueILS: number;
  marketValueUSD: number;
}

export interface CalculatedSecurityReturn {
  securityId: string;
  symbol: string;
  name: string;
  currency: Currency;
  weightedAvgCost: number;
  totalQuantity: number;
  currentPrice: number;
  marketValueILS: number;
  marketValueUSD: number;
  totalUnrealizedPnlILS: number;
  totalUnrealizedPnlUSD: number;
  totalRealizedPnlILS: number;
  totalRealizedPnlUSD: number;
  totalReturnPercent: number;
  lots: CalculatedLotDetail[];
}

export class ReturnsCalculatorService {
  calculateLot(lot: Lot, security: Security, currentUsdIlsRate: number): CalculatedLotDetail {
    const currentPrice = security.currentPrice ?? 0;
    const returnPercent = safeDivide(currentPrice - lot.costPerUnit, lot.costPerUnit) * 100;
    const unrealizedPnl = (currentPrice - lot.costPerUnit) * lot.quantityRemaining;
    const marketValue = currentPrice * lot.quantityRemaining;

    const unrealizedPnlILS = lot.costCurrency === Currency.USD ? unrealizedPnl * currentUsdIlsRate : unrealizedPnl;
    const unrealizedPnlUSD = lot.costCurrency === Currency.ILS ? safeDivide(unrealizedPnl, currentUsdIlsRate) : unrealizedPnl;
    const marketValueILS = security.currency === Currency.USD ? marketValue * currentUsdIlsRate : marketValue;
    const marketValueUSD = security.currency === Currency.ILS ? safeDivide(marketValue, currentUsdIlsRate) : marketValue;

    return {
      id: lot.id,
      date: lot.date,
      quantityBought: lot.quantityBought,
      quantityRemaining: lot.quantityRemaining,
      costPerUnit: round(lot.costPerUnit),
      currentPrice: round(currentPrice),
      returnPercent: round(returnPercent),
      unrealizedPnl: round(unrealizedPnl),
      status: lot.status,
      unrealizedPnlILS: round(unrealizedPnlILS),
      unrealizedPnlUSD: round(unrealizedPnlUSD),
      marketValueILS: round(marketValueILS),
      marketValueUSD: round(marketValueUSD),
    };
  }

  calculateSecurity(args: { security: Security; lots: Lot[]; lotSales: LotSale[]; currentUsdIlsRate: number }): CalculatedSecurityReturn {
    const { security, lots, lotSales, currentUsdIlsRate } = args;
    const calculatedLots = lots.map((lot) => this.calculateLot(lot, security, currentUsdIlsRate));
    const totalQuantity = sum(lots.map((lot) => lot.quantityRemaining));
    const totalCostBasis = sum(lots.map((lot) => lot.costPerUnit * lot.quantityRemaining));
    const weightedAvgCost = safeDivide(totalCostBasis, totalQuantity);
    const totalUnrealizedPnlILS = sum(calculatedLots.map((lot) => lot.unrealizedPnlILS));
    const totalUnrealizedPnlUSD = sum(calculatedLots.map((lot) => lot.unrealizedPnlUSD));
    const totalRealizedPnlILS = sum(lotSales.map((sale) => sale.realizedPnlILS));
    const totalRealizedPnlUSD = sum(lotSales.map((sale) => sale.realizedPnlUSD ?? 0));
    const totalReturnPercent = safeDivide(totalUnrealizedPnlILS + totalRealizedPnlILS, totalCostBasis) * 100;
    const currentPrice = security.currentPrice ?? 0;
    const marketValue = currentPrice * totalQuantity;

    return {
      securityId: security.id,
      symbol: security.symbol,
      name: security.name,
      currency: security.currency,
      weightedAvgCost: round(weightedAvgCost),
      totalQuantity: round(totalQuantity, 6),
      currentPrice: round(currentPrice),
      marketValueILS: round(security.currency === Currency.USD ? marketValue * currentUsdIlsRate : marketValue),
      marketValueUSD: round(security.currency === Currency.ILS ? safeDivide(marketValue, currentUsdIlsRate) : marketValue),
      totalUnrealizedPnlILS: round(totalUnrealizedPnlILS),
      totalUnrealizedPnlUSD: round(totalUnrealizedPnlUSD),
      totalRealizedPnlILS: round(totalRealizedPnlILS),
      totalRealizedPnlUSD: round(totalRealizedPnlUSD),
      totalReturnPercent: round(totalReturnPercent),
      lots: calculatedLots,
    };
  }

  calculatePortfolio(args: {
    holdings: HoldingRow[];
    accounts: Account[];
    cashBalances: Array<{ accountId: string; currency: Currency; balance: number }>;
    currentUsdIlsRate: number;
  }): PortfolioSummary {
    const { holdings, accounts, cashBalances, currentUsdIlsRate } = args;
    const totalHoldingsValueILS = sum(holdings.map((item) => item.marketValueILS));
    const totalHoldingsValueUSD = sum(holdings.map((item) => item.marketValueUSD));
    const realizedPnlILS = sum(holdings.map((item) => item.realizedPnlILS));
    const unrealizedPnlILS = sum(holdings.map((item) => item.unrealizedPnlILS));
    const realizedPnlUSD = safeDivide(realizedPnlILS, currentUsdIlsRate);
    const unrealizedPnlUSD = safeDivide(unrealizedPnlILS, currentUsdIlsRate);
    const cashBalanceILS = sum(cashBalances.filter((item) => item.currency === Currency.ILS).map((item) => item.balance));
    const cashBalanceUSD = sum(cashBalances.filter((item) => item.currency === Currency.USD).map((item) => item.balance));
    const totalValueILS = totalHoldingsValueILS + cashBalanceILS + cashBalanceUSD * currentUsdIlsRate;
    const totalValueUSD = totalHoldingsValueUSD + cashBalanceUSD + safeDivide(cashBalanceILS, currentUsdIlsRate);
    const investedCapital = totalValueILS - realizedPnlILS - unrealizedPnlILS;
    const totalReturnILS = realizedPnlILS + unrealizedPnlILS;

    const accountSummaries = accounts.map((account) => {
      const accountHoldings = holdings.filter((item) => item.accountId === account.id);
      const accountCash = cashBalances.filter((item) => item.accountId === account.id);
      const valueILS = sum(accountHoldings.map((item) => item.marketValueILS)) +
        sum(accountCash.filter((item) => item.currency === Currency.ILS).map((item) => item.balance)) +
        sum(accountCash.filter((item) => item.currency === Currency.USD).map((item) => item.balance * currentUsdIlsRate));
      const valueUSD = sum(accountHoldings.map((item) => item.marketValueUSD)) +
        sum(accountCash.filter((item) => item.currency === Currency.USD).map((item) => item.balance)) +
        sum(accountCash.filter((item) => item.currency === Currency.ILS).map((item) => safeDivide(item.balance, currentUsdIlsRate)));
      const accountCostBasis = sum(accountHoldings.map((item) => item.weightedAvgCost * item.totalQuantity));
      const accountPnl = sum(accountHoldings.map((item) => item.unrealizedPnlILS + item.realizedPnlILS));
      return {
        accountId: account.id,
        name: account.name,
        valueILS: round(valueILS),
        valueUSD: round(valueUSD),
        returnPercent: round(safeDivide(accountPnl, accountCostBasis) * 100),
      };
    });

    return {
      totalValueILS: round(totalValueILS),
      totalValueUSD: round(totalValueUSD),
      totalReturnPercent: round(safeDivide(totalReturnILS, investedCapital) * 100),
      totalReturnILS: round(totalReturnILS),
      realizedPnlILS: round(realizedPnlILS),
      unrealizedPnlILS: round(unrealizedPnlILS),
      realizedPnlUSD: round(realizedPnlUSD),
      unrealizedPnlUSD: round(unrealizedPnlUSD),
      cashBalanceILS: round(cashBalanceILS),
      cashBalanceUSD: round(cashBalanceUSD),
      todayChangePercent: 0,
      todayChangeILS: 0,
      accounts: accountSummaries,
    };
  }
}

export const returnsCalculator = new ReturnsCalculatorService();
