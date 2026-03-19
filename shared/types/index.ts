// ============================================================
// FolioFollow — Shared TypeScript Types
// Used by both backend and frontend for type safety
// ============================================================

// --- Enums ---

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum Currency {
  ILS = 'ILS',
  USD = 'USD',
}

export enum TransactionType {
  BUY = 'buy',
  SELL = 'sell',
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export enum SecurityType {
  STOCK = 'stock',
  ETF = 'etf',
  MUTUAL_FUND = 'mutual_fund',
  BOND = 'bond',
  MONEY_MARKET = 'money_market',
  OTHER = 'other',
}

export enum Exchange {
  TASE = 'TASE',
  NYSE = 'NYSE',
  NASDAQ = 'NASDAQ',
  OTHER = 'other',
}

export enum AccountType {
  BROKERAGE = 'brokerage',
  PENSION = 'pension',
  OTHER = 'other',
}

export enum LotStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  PARTIAL = 'partial',
}

export enum RateSource {
  MANUAL = 'manual',
  API = 'api',
}

// --- Base ---

export interface Timestamps {
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// --- User ---

export interface User extends Timestamps {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  language: 'he' | 'en';
}

// --- Account ---

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

// --- Security ---

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

export interface BulkUpdatePricesDTO {
  updates: Array<{ securityId: string; price: number }>;
}

// --- Transaction ---

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
  date: string; // ISO 8601 date
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

// --- Lot ---

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

// --- LotSale ---

export interface LotSale {
  id: string;
  lotId: string;
  sellTransactionId: string;
  quantitySold: number;
  salePricePerUnit: number;
  saleCurrency: Currency;
  exchangeRateAtSell?: number;
  realizedPnlILS: number;
  realizedPnlUSD?: number;
  date: string;
  createdAt: string;
  userId: string;
  accountId: string;
}

// --- Cash Balance ---

export interface CashBalance {
  id: string;
  userId: string;
  accountId: string;
  currency: Currency;
  balance: number;
  updatedAt: string;
}

// --- Exchange Rate ---

export interface ExchangeRate {
  id: string;
  date: string;
  pair: string; // 'USD/ILS'
  rate: number;
  source: RateSource;
  updatedBy?: string;
  createdAt: string;
}

export interface CreateExchangeRateDTO {
  date: string;
  rate: number;
}

// --- Portfolio Response Types ---

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
  valueUSD: number;
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

// --- API Response Wrappers ---

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// --- Query Params ---

export interface TransactionQueryParams {
  accountId?: string;
  securityId?: string;
  type?: TransactionType;
  currency?: Currency;
  purpose?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PortfolioQueryParams {
  accountId?: string;
  currency?: Currency;
  dateFrom?: string;
  dateTo?: string;
}
