// ============================================================
// FolioFollow — Frontend TypeScript Types
// Simplified from shared types to use string literals instead of enums
// for easier usage with mock data
// ============================================================

export type UserRole = 'user' | 'admin';
export type Currency = 'ILS' | 'USD';
export type TransactionType = 'buy' | 'sell' | 'deposit' | 'withdraw';
export type SecurityType = 'stock' | 'etf' | 'mutual_fund' | 'bond' | 'money_market' | 'other';
export type Exchange = 'TASE' | 'NYSE' | 'NASDAQ' | 'other';
export type AccountType = 'brokerage' | 'pension' | 'other';
export type LotStatus = 'open' | 'closed' | 'partial';
export type RateSource = 'manual' | 'api';

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export interface User extends Timestamps {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  language: 'he' | 'en';
}

export interface Account extends Timestamps {
  id: string;
  userId: string;
  name: string;
  institution: string;
  type: AccountType;
  currency: Currency;
  notes?: string;
}

export interface CreateAccountDTO {
  name: string;
  institution: string;
  type: AccountType;
  currency: Currency;
  notes?: string;
}

export interface Security extends Timestamps {
  id: string;
  symbol: string;
  name: string;
  type: SecurityType;
  exchange: Exchange;
  currency: Currency;
  currentPrice?: number;
  priceUpdatedAt?: string;
}

export interface CreateSecurityDTO {
  symbol: string;
  name: string;
  type: SecurityType;
  exchange: Exchange;
  currency: Currency;
}

export interface UpdatePriceDTO {
  price: number;
}

export interface Transaction extends Timestamps {
  id: string;
  userId: string;
  accountId: string;
  securityId?: string;
  type: TransactionType;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  currency: Currency;
  exchangeRate?: number;
  date: string;
  nickname?: string;
  purpose?: string;
  notes?: string;
}

export interface CreateTransactionDTO {
  accountId: string;
  securityId?: string;
  type: TransactionType;
  quantity: number;
  pricePerUnit: number;
  currency: Currency;
  exchangeRate?: number;
  date: string;
  nickname?: string;
  purpose?: string;
  notes?: string;
}

export interface Lot extends Timestamps {
  id: string;
  userId: string;
  accountId: string;
  securityId: string;
  buyTransactionId: string;
  quantityBought: number;
  quantityRemaining: number;
  costPerUnit: number;
  costCurrency: Currency;
  exchangeRateAtBuy?: number;
  status: LotStatus;
  date: string;
}

export interface CashBalance {
  id: string;
  userId: string;
  accountId: string;
  currency: Currency;
  balance: number;
  updatedAt: string;
}

export interface ExchangeRate {
  id: string;
  date: string;
  pair: string;
  rate: number;
  source: RateSource;
  updatedBy?: string;
  createdAt: string;
}

export interface CreateExchangeRateDTO {
  date: string;
  rate: number;
}

export interface PortfolioSummary {
  totalValueILS: number;
  totalValueUSD: number;
  totalReturnPercent: number;
  totalReturnILS: number;
  realizedPnlILS: number;
  unrealizedPnlILS: number;
  realizedPnlUSD: number;
  unrealizedPnlUSD: number;
  cashBalanceILS: number;
  cashBalanceUSD: number;
  todayChangePercent: number;
  todayChangeILS: number;
  accounts: AccountSummary[];
}

export interface AccountSummary {
  accountId: string;
  name: string;
  valueILS: number;
  valueUSD?: number;
  returnPercent: number;
}

export interface HoldingRow {
  securityId: string;
  symbol: string;
  name: string;
  nickname?: string;
  purpose?: string;
  accountId: string;
  accountName: string;
  totalQuantity: number;
  weightedAvgCost: number;
  currentPrice: number;
  currency: Currency;
  marketValueILS: number;
  marketValueUSD: number;
  unrealizedPnlILS: number;
  unrealizedPnlPercent: number;
  realizedPnlILS: number;
  lots: LotDetail[];
}

export interface LotDetail {
  id: string;
  date: string;
  quantityBought: number;
  quantityRemaining: number;
  costPerUnit: number;
  currentPrice: number;
  returnPercent: number;
  unrealizedPnl: number;
  status: LotStatus;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
