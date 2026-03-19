import type {
  Account, Security, Transaction, Lot, CashBalance,
  ExchangeRate, PortfolioSummary, HoldingRow, LotDetail, User,
} from '../../types';

// ===== ACCOUNTS =====
export const mockAccounts: Account[] = [
  {
    id: 'acc_1',
    userId: 'user_demo',
    name: 'IBI SPARK',
    institution: 'IBI',
    type: 'brokerage',
    currency: 'ILS',
    notes: 'Israeli equities account',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2026-03-19T08:00:00Z',
  },
  {
    id: 'acc_2',
    userId: 'user_demo',
    name: 'IBI SMART',
    institution: 'IBI',
    type: 'brokerage',
    currency: 'USD',
    notes: 'US equities and ETFs',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2026-03-19T08:00:00Z',
  },
  {
    id: 'acc_3',
    userId: 'user_demo',
    name: 'קופת גמל להשקעה',
    institution: 'מיטב דש',
    type: 'pension',
    currency: 'ILS',
    notes: '',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2026-03-19T08:00:00Z',
  },
];

// ===== SECURITIES =====
export const mockSecurities: Security[] = [
  {
    id: 'sec_teva', symbol: 'TEVA', name: 'Teva Pharmaceutical', type: 'stock',
    exchange: 'TASE', currency: 'ILS', currentPrice: 6820, priceUpdatedAt: '2026-03-19T08:30:00Z',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2026-03-19T08:30:00Z',
  },
  {
    id: 'sec_nice', symbol: 'NICE', name: 'NICE Systems', type: 'stock',
    exchange: 'TASE', currency: 'ILS', currentPrice: 18540, priceUpdatedAt: '2026-03-19T08:30:00Z',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2026-03-19T08:30:00Z',
  },
  {
    id: 'sec_lumi', symbol: 'LUMI', name: 'Bank Leumi', type: 'stock',
    exchange: 'TASE', currency: 'ILS', currentPrice: 3456, priceUpdatedAt: '2026-03-19T08:30:00Z',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2026-03-19T08:30:00Z',
  },
  {
    id: 'sec_spy', symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'etf',
    exchange: 'NYSE', currency: 'USD', currentPrice: 572.30, priceUpdatedAt: '2026-03-18T21:00:00Z',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2026-03-18T21:00:00Z',
  },
  {
    id: 'sec_aapl', symbol: 'AAPL', name: 'Apple Inc.', type: 'stock',
    exchange: 'NASDAQ', currency: 'USD', currentPrice: 214.50, priceUpdatedAt: '2026-03-18T21:00:00Z',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2026-03-18T21:00:00Z',
  },
  {
    id: 'sec_msft', symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock',
    exchange: 'NASDAQ', currency: 'USD', currentPrice: 428.75, priceUpdatedAt: '2026-03-18T21:00:00Z',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2026-03-18T21:00:00Z',
  },
  {
    id: 'sec_nvda', symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'stock',
    exchange: 'NASDAQ', currency: 'USD', currentPrice: 890.20, priceUpdatedAt: '2026-03-18T21:00:00Z',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2026-03-18T21:00:00Z',
  },
  {
    id: 'sec_voo', symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'etf',
    exchange: 'NYSE', currency: 'USD', currentPrice: 526.10, priceUpdatedAt: '2026-03-18T21:00:00Z',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2026-03-18T21:00:00Z',
  },
  {
    id: 'sec_sgov', symbol: 'SGOV', name: 'iShares 0-3 Month Treasury', type: 'etf',
    exchange: 'NYSE', currency: 'USD', currentPrice: 100.48, priceUpdatedAt: '2026-03-18T21:00:00Z',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2026-03-18T21:00:00Z',
  },
  {
    id: 'sec_ta35', symbol: 'TA35', name: 'מדד ת"א 35', type: 'etf',
    exchange: 'TASE', currency: 'ILS', currentPrice: 2145, priceUpdatedAt: '2026-03-19T08:30:00Z',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2026-03-19T08:30:00Z',
  },
];

// ===== TRANSACTIONS =====
export const mockTransactions: Transaction[] = [
  // IBI SPARK — Israeli stocks
  { id: 'txn_1', userId: 'user_demo', accountId: 'acc_1', securityId: 'sec_teva', type: 'buy', quantity: 100, pricePerUnit: 5950, totalAmount: 595000, currency: 'ILS', date: '2025-04-10', nickname: 'טבע מניה', purpose: 'השקעה ארוכת טווח', notes: '', createdAt: '2025-04-10T10:00:00Z', updatedAt: '2025-04-10T10:00:00Z' },
  { id: 'txn_2', userId: 'user_demo', accountId: 'acc_1', securityId: 'sec_teva', type: 'buy', quantity: 50, pricePerUnit: 6200, totalAmount: 310000, currency: 'ILS', date: '2025-08-15', nickname: 'טבע מניה', purpose: 'השקעה ארוכת טווח', notes: 'הוספה', createdAt: '2025-08-15T10:00:00Z', updatedAt: '2025-08-15T10:00:00Z' },
  { id: 'txn_3', userId: 'user_demo', accountId: 'acc_1', securityId: 'sec_nice', type: 'buy', quantity: 30, pricePerUnit: 16800, totalAmount: 504000, currency: 'ILS', date: '2025-05-20', nickname: 'נייס', purpose: '', notes: '', createdAt: '2025-05-20T10:00:00Z', updatedAt: '2025-05-20T10:00:00Z' },
  { id: 'txn_4', userId: 'user_demo', accountId: 'acc_1', securityId: 'sec_lumi', type: 'buy', quantity: 200, pricePerUnit: 3100, totalAmount: 620000, currency: 'ILS', date: '2025-03-05', nickname: 'לאומי', purpose: 'דיבידנדים', notes: '', createdAt: '2025-03-05T10:00:00Z', updatedAt: '2025-03-05T10:00:00Z' },
  { id: 'txn_5', userId: 'user_demo', accountId: 'acc_1', securityId: 'sec_lumi', type: 'sell', quantity: 100, pricePerUnit: 3350, totalAmount: 335000, currency: 'ILS', date: '2025-11-20', nickname: 'לאומי', purpose: 'דיבידנדים', notes: 'מימוש חלקי', createdAt: '2025-11-20T10:00:00Z', updatedAt: '2025-11-20T10:00:00Z' },
  { id: 'txn_6', userId: 'user_demo', accountId: 'acc_1', type: 'deposit', quantity: 1, pricePerUnit: 50000, totalAmount: 50000, currency: 'ILS', date: '2025-03-01', notes: 'הפקדה ראשונית', createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-03-01T10:00:00Z' },

  // IBI SMART — US stocks
  { id: 'txn_7', userId: 'user_demo', accountId: 'acc_2', securityId: 'sec_spy', type: 'buy', quantity: 15, pricePerUnit: 520.50, totalAmount: 7807.50, currency: 'USD', exchangeRate: 3.68, date: '2025-06-15', nickname: 'S&P 500', purpose: 'core portfolio', notes: '', createdAt: '2025-06-15T10:00:00Z', updatedAt: '2025-06-15T10:00:00Z' },
  { id: 'txn_8', userId: 'user_demo', accountId: 'acc_2', securityId: 'sec_spy', type: 'buy', quantity: 10, pricePerUnit: 548.20, totalAmount: 5482.00, currency: 'USD', exchangeRate: 3.72, date: '2025-11-20', nickname: 'S&P 500', purpose: 'core portfolio', notes: '', createdAt: '2025-11-20T10:00:00Z', updatedAt: '2025-11-20T10:00:00Z' },
  { id: 'txn_9', userId: 'user_demo', accountId: 'acc_2', securityId: 'sec_aapl', type: 'buy', quantity: 25, pricePerUnit: 185.40, totalAmount: 4635.00, currency: 'USD', exchangeRate: 3.70, date: '2025-07-10', nickname: '', purpose: 'growth', notes: '', createdAt: '2025-07-10T10:00:00Z', updatedAt: '2025-07-10T10:00:00Z' },
  { id: 'txn_10', userId: 'user_demo', accountId: 'acc_2', securityId: 'sec_msft', type: 'buy', quantity: 12, pricePerUnit: 395.00, totalAmount: 4740.00, currency: 'USD', exchangeRate: 3.69, date: '2025-05-25', nickname: '', purpose: 'growth', notes: '', createdAt: '2025-05-25T10:00:00Z', updatedAt: '2025-05-25T10:00:00Z' },
  { id: 'txn_11', userId: 'user_demo', accountId: 'acc_2', securityId: 'sec_nvda', type: 'buy', quantity: 8, pricePerUnit: 720.00, totalAmount: 5760.00, currency: 'USD', exchangeRate: 3.71, date: '2025-08-01', nickname: '', purpose: 'growth', notes: '', createdAt: '2025-08-01T10:00:00Z', updatedAt: '2025-08-01T10:00:00Z' },
  { id: 'txn_12', userId: 'user_demo', accountId: 'acc_2', securityId: 'sec_sgov', type: 'buy', quantity: 50, pricePerUnit: 100.20, totalAmount: 5010.00, currency: 'USD', exchangeRate: 3.70, date: '2025-09-15', nickname: 'Cash equiv.', purpose: 'cash management', notes: '', createdAt: '2025-09-15T10:00:00Z', updatedAt: '2025-09-15T10:00:00Z' },
  { id: 'txn_13', userId: 'user_demo', accountId: 'acc_2', type: 'deposit', quantity: 1, pricePerUnit: 10000, totalAmount: 10000, currency: 'USD', exchangeRate: 3.68, date: '2025-06-01', notes: 'Initial deposit', createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z' },

  // קופת גמל להשקעה
  { id: 'txn_14', userId: 'user_demo', accountId: 'acc_3', securityId: 'sec_ta35', type: 'buy', quantity: 50, pricePerUnit: 1890, totalAmount: 94500, currency: 'ILS', date: '2025-04-01', nickname: 'מדד ת"א 35', purpose: 'פנסיה', notes: '', createdAt: '2025-04-01T10:00:00Z', updatedAt: '2025-04-01T10:00:00Z' },
  { id: 'txn_15', userId: 'user_demo', accountId: 'acc_3', securityId: 'sec_voo', type: 'buy', quantity: 20, pricePerUnit: 480.50, totalAmount: 9610.00, currency: 'USD', exchangeRate: 3.67, date: '2025-05-10', nickname: 'S&P 500', purpose: 'פנסיה', notes: '', createdAt: '2025-05-10T10:00:00Z', updatedAt: '2025-05-10T10:00:00Z' },
  { id: 'txn_16', userId: 'user_demo', accountId: 'acc_3', type: 'deposit', quantity: 1, pricePerUnit: 30000, totalAmount: 30000, currency: 'ILS', date: '2025-04-01', notes: 'הפקדה חודשית', createdAt: '2025-04-01T10:00:00Z', updatedAt: '2025-04-01T10:00:00Z' },

  // Additional transactions for variety
  { id: 'txn_17', userId: 'user_demo', accountId: 'acc_2', securityId: 'sec_aapl', type: 'sell', quantity: 10, pricePerUnit: 210.30, totalAmount: 2103.00, currency: 'USD', exchangeRate: 3.73, date: '2026-02-10', nickname: '', purpose: 'growth', notes: 'Partial profit taking', createdAt: '2026-02-10T10:00:00Z', updatedAt: '2026-02-10T10:00:00Z' },
  { id: 'txn_18', userId: 'user_demo', accountId: 'acc_1', securityId: 'sec_teva', type: 'buy', quantity: 30, pricePerUnit: 6500, totalAmount: 195000, currency: 'ILS', date: '2026-01-15', nickname: 'טבע מניה', purpose: 'השקעה ארוכת טווח', notes: 'הוספה שלישית', createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z' },
  { id: 'txn_19', userId: 'user_demo', accountId: 'acc_2', type: 'deposit', quantity: 1, pricePerUnit: 5000, totalAmount: 5000, currency: 'USD', exchangeRate: 3.71, date: '2025-12-01', notes: 'Additional funding', createdAt: '2025-12-01T10:00:00Z', updatedAt: '2025-12-01T10:00:00Z' },
  { id: 'txn_20', userId: 'user_demo', accountId: 'acc_1', type: 'deposit', quantity: 1, pricePerUnit: 100000, totalAmount: 100000, currency: 'ILS', date: '2025-06-15', notes: 'הפקדה נוספת', createdAt: '2025-06-15T10:00:00Z', updatedAt: '2025-06-15T10:00:00Z' },
];

// ===== LOTS =====
export const mockLots: Lot[] = [
  // TEVA lots
  { id: 'lot_1', userId: 'user_demo', accountId: 'acc_1', securityId: 'sec_teva', buyTransactionId: 'txn_1', quantityBought: 100, quantityRemaining: 100, costPerUnit: 5950, costCurrency: 'ILS', status: 'open', date: '2025-04-10', createdAt: '2025-04-10T10:00:00Z', updatedAt: '2025-04-10T10:00:00Z' },
  { id: 'lot_2', userId: 'user_demo', accountId: 'acc_1', securityId: 'sec_teva', buyTransactionId: 'txn_2', quantityBought: 50, quantityRemaining: 50, costPerUnit: 6200, costCurrency: 'ILS', status: 'open', date: '2025-08-15', createdAt: '2025-08-15T10:00:00Z', updatedAt: '2025-08-15T10:00:00Z' },
  { id: 'lot_3', userId: 'user_demo', accountId: 'acc_1', securityId: 'sec_teva', buyTransactionId: 'txn_18', quantityBought: 30, quantityRemaining: 30, costPerUnit: 6500, costCurrency: 'ILS', status: 'open', date: '2026-01-15', createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z' },
  // NICE lot
  { id: 'lot_4', userId: 'user_demo', accountId: 'acc_1', securityId: 'sec_nice', buyTransactionId: 'txn_3', quantityBought: 30, quantityRemaining: 30, costPerUnit: 16800, costCurrency: 'ILS', status: 'open', date: '2025-05-20', createdAt: '2025-05-20T10:00:00Z', updatedAt: '2025-05-20T10:00:00Z' },
  // LUMI lot (partially sold)
  { id: 'lot_5', userId: 'user_demo', accountId: 'acc_1', securityId: 'sec_lumi', buyTransactionId: 'txn_4', quantityBought: 200, quantityRemaining: 100, costPerUnit: 3100, costCurrency: 'ILS', status: 'partial', date: '2025-03-05', createdAt: '2025-03-05T10:00:00Z', updatedAt: '2025-11-20T10:00:00Z' },
  // SPY lots
  { id: 'lot_6', userId: 'user_demo', accountId: 'acc_2', securityId: 'sec_spy', buyTransactionId: 'txn_7', quantityBought: 15, quantityRemaining: 15, costPerUnit: 520.50, costCurrency: 'USD', exchangeRateAtBuy: 3.68, status: 'open', date: '2025-06-15', createdAt: '2025-06-15T10:00:00Z', updatedAt: '2025-06-15T10:00:00Z' },
  { id: 'lot_7', userId: 'user_demo', accountId: 'acc_2', securityId: 'sec_spy', buyTransactionId: 'txn_8', quantityBought: 10, quantityRemaining: 10, costPerUnit: 548.20, costCurrency: 'USD', exchangeRateAtBuy: 3.72, status: 'open', date: '2025-11-20', createdAt: '2025-11-20T10:00:00Z', updatedAt: '2025-11-20T10:00:00Z' },
  // AAPL lot (partially sold)
  { id: 'lot_8', userId: 'user_demo', accountId: 'acc_2', securityId: 'sec_aapl', buyTransactionId: 'txn_9', quantityBought: 25, quantityRemaining: 15, costPerUnit: 185.40, costCurrency: 'USD', exchangeRateAtBuy: 3.70, status: 'partial', date: '2025-07-10', createdAt: '2025-07-10T10:00:00Z', updatedAt: '2026-02-10T10:00:00Z' },
  // MSFT lot
  { id: 'lot_9', userId: 'user_demo', accountId: 'acc_2', securityId: 'sec_msft', buyTransactionId: 'txn_10', quantityBought: 12, quantityRemaining: 12, costPerUnit: 395.00, costCurrency: 'USD', exchangeRateAtBuy: 3.69, status: 'open', date: '2025-05-25', createdAt: '2025-05-25T10:00:00Z', updatedAt: '2025-05-25T10:00:00Z' },
  // NVDA lot
  { id: 'lot_10', userId: 'user_demo', accountId: 'acc_2', securityId: 'sec_nvda', buyTransactionId: 'txn_11', quantityBought: 8, quantityRemaining: 8, costPerUnit: 720.00, costCurrency: 'USD', exchangeRateAtBuy: 3.71, status: 'open', date: '2025-08-01', createdAt: '2025-08-01T10:00:00Z', updatedAt: '2025-08-01T10:00:00Z' },
  // SGOV lot
  { id: 'lot_11', userId: 'user_demo', accountId: 'acc_2', securityId: 'sec_sgov', buyTransactionId: 'txn_12', quantityBought: 50, quantityRemaining: 50, costPerUnit: 100.20, costCurrency: 'USD', exchangeRateAtBuy: 3.70, status: 'open', date: '2025-09-15', createdAt: '2025-09-15T10:00:00Z', updatedAt: '2025-09-15T10:00:00Z' },
  // TA35 lot
  { id: 'lot_12', userId: 'user_demo', accountId: 'acc_3', securityId: 'sec_ta35', buyTransactionId: 'txn_14', quantityBought: 50, quantityRemaining: 50, costPerUnit: 1890, costCurrency: 'ILS', status: 'open', date: '2025-04-01', createdAt: '2025-04-01T10:00:00Z', updatedAt: '2025-04-01T10:00:00Z' },
  // VOO lot
  { id: 'lot_13', userId: 'user_demo', accountId: 'acc_3', securityId: 'sec_voo', buyTransactionId: 'txn_15', quantityBought: 20, quantityRemaining: 20, costPerUnit: 480.50, costCurrency: 'USD', exchangeRateAtBuy: 3.67, status: 'open', date: '2025-05-10', createdAt: '2025-05-10T10:00:00Z', updatedAt: '2025-05-10T10:00:00Z' },
];

// ===== CASH BALANCES =====
export const mockCashBalances: CashBalance[] = [
  { id: 'cb_1', userId: 'user_demo', accountId: 'acc_1', currency: 'ILS', balance: 15200, updatedAt: '2026-03-19T08:00:00Z' },
  { id: 'cb_2', userId: 'user_demo', accountId: 'acc_2', currency: 'USD', balance: 1845.50, updatedAt: '2026-03-19T08:00:00Z' },
  { id: 'cb_3', userId: 'user_demo', accountId: 'acc_3', currency: 'ILS', balance: 4800, updatedAt: '2026-03-19T08:00:00Z' },
];

// ===== EXCHANGE RATES =====
export const mockExchangeRates: ExchangeRate[] = [
  { id: 'er_1', date: '2026-03-19', pair: 'USD/ILS', rate: 3.72, source: 'api', createdAt: '2026-03-19T08:00:00Z' },
  { id: 'er_2', date: '2026-03-18', pair: 'USD/ILS', rate: 3.71, source: 'api', createdAt: '2026-03-18T08:00:00Z' },
  { id: 'er_3', date: '2026-03-17', pair: 'USD/ILS', rate: 3.73, source: 'api', createdAt: '2026-03-17T08:00:00Z' },
  { id: 'er_4', date: '2026-03-14', pair: 'USD/ILS', rate: 3.70, source: 'api', createdAt: '2026-03-14T08:00:00Z' },
  { id: 'er_5', date: '2026-03-13', pair: 'USD/ILS', rate: 3.69, source: 'api', createdAt: '2026-03-13T08:00:00Z' },
  { id: 'er_6', date: '2026-02-28', pair: 'USD/ILS', rate: 3.71, source: 'api', createdAt: '2026-02-28T08:00:00Z' },
  { id: 'er_7', date: '2026-01-31', pair: 'USD/ILS', rate: 3.68, source: 'api', createdAt: '2026-01-31T08:00:00Z' },
  { id: 'er_8', date: '2025-12-31', pair: 'USD/ILS', rate: 3.72, source: 'api', createdAt: '2025-12-31T08:00:00Z' },
  { id: 'er_9', date: '2025-11-30', pair: 'USD/ILS', rate: 3.74, source: 'api', createdAt: '2025-11-30T08:00:00Z' },
  { id: 'er_10', date: '2025-10-31', pair: 'USD/ILS', rate: 3.70, source: 'api', createdAt: '2025-10-31T08:00:00Z' },
  { id: 'er_11', date: '2025-09-30', pair: 'USD/ILS', rate: 3.67, source: 'api', createdAt: '2025-09-30T08:00:00Z' },
  { id: 'er_12', date: '2025-08-31', pair: 'USD/ILS', rate: 3.69, source: 'api', createdAt: '2025-08-31T08:00:00Z' },
  { id: 'er_13', date: '2025-07-31', pair: 'USD/ILS', rate: 3.71, source: 'api', createdAt: '2025-07-31T08:00:00Z' },
  { id: 'er_14', date: '2025-06-30', pair: 'USD/ILS', rate: 3.68, source: 'api', createdAt: '2025-06-30T08:00:00Z' },
  { id: 'er_15', date: '2025-05-31', pair: 'USD/ILS', rate: 3.66, source: 'api', createdAt: '2025-05-31T08:00:00Z' },
  { id: 'er_16', date: '2025-04-30', pair: 'USD/ILS', rate: 3.65, source: 'api', createdAt: '2025-04-30T08:00:00Z' },
  { id: 'er_17', date: '2025-03-31', pair: 'USD/ILS', rate: 3.67, source: 'api', createdAt: '2025-03-31T08:00:00Z' },
];

const CURRENT_RATE = 3.72;

// ===== COMPUTED: PORTFOLIO SUMMARY =====
export const mockPortfolioSummary: PortfolioSummary = {
  totalValueILS: 251340,
  totalValueUSD: 67564,
  totalReturnPercent: 14.8,
  totalReturnILS: 32420,
  realizedPnlILS: 3430,
  unrealizedPnlILS: 28990,
  realizedPnlUSD: 922,
  unrealizedPnlUSD: 7793,
  cashBalanceILS: 20000,
  cashBalanceUSD: 1845.50,
  todayChangePercent: 0.65,
  todayChangeILS: 1625,
  accounts: [
    { accountId: 'acc_1', name: 'IBI SPARK', valueILS: 109820, valueUSD: 29521, returnPercent: 12.3 },
    { accountId: 'acc_2', name: 'IBI SMART', valueILS: 104770, valueUSD: 28164, returnPercent: 18.2 },
    { accountId: 'acc_3', name: 'קופת גמל להשקעה', valueILS: 36750, valueUSD: 9879, returnPercent: 11.5 },
  ],
};

// ===== COMPUTED: HOLDINGS =====
export const mockHoldings: HoldingRow[] = [
  {
    securityId: 'sec_teva', symbol: 'TEVA', name: 'Teva Pharmaceutical',
    nickname: 'טבע מניה', purpose: 'השקעה ארוכת טווח',
    accountId: 'acc_1', accountName: 'IBI SPARK',
    totalQuantity: 180, weightedAvgCost: 6108, currentPrice: 6820, currency: 'ILS',
    marketValueILS: 122760, marketValueUSD: 33000, unrealizedPnlILS: 128160 - 122760, unrealizedPnlPercent: 11.66,
    realizedPnlILS: 0,
    lots: [
      { id: 'lot_1', date: '2025-04-10', quantityBought: 100, quantityRemaining: 100, costPerUnit: 5950, currentPrice: 6820, returnPercent: 14.62, unrealizedPnl: 87000, status: 'open' },
      { id: 'lot_2', date: '2025-08-15', quantityBought: 50, quantityRemaining: 50, costPerUnit: 6200, currentPrice: 6820, returnPercent: 10.0, unrealizedPnl: 31000, status: 'open' },
      { id: 'lot_3', date: '2026-01-15', quantityBought: 30, quantityRemaining: 30, costPerUnit: 6500, currentPrice: 6820, returnPercent: 4.92, unrealizedPnl: 9600, status: 'open' },
    ],
  },
  {
    securityId: 'sec_nice', symbol: 'NICE', name: 'NICE Systems',
    nickname: 'נייס', purpose: '',
    accountId: 'acc_1', accountName: 'IBI SPARK',
    totalQuantity: 30, weightedAvgCost: 16800, currentPrice: 18540, currency: 'ILS',
    marketValueILS: 55620, marketValueUSD: 14951, unrealizedPnlILS: 52200, unrealizedPnlPercent: 10.36,
    realizedPnlILS: 0,
    lots: [
      { id: 'lot_4', date: '2025-05-20', quantityBought: 30, quantityRemaining: 30, costPerUnit: 16800, currentPrice: 18540, returnPercent: 10.36, unrealizedPnl: 52200, status: 'open' },
    ],
  },
  {
    securityId: 'sec_lumi', symbol: 'LUMI', name: 'Bank Leumi',
    nickname: 'לאומי', purpose: 'דיבידנדים',
    accountId: 'acc_1', accountName: 'IBI SPARK',
    totalQuantity: 100, weightedAvgCost: 3100, currentPrice: 3456, currency: 'ILS',
    marketValueILS: 34560, marketValueUSD: 9290, unrealizedPnlILS: 35600, unrealizedPnlPercent: 11.48,
    realizedPnlILS: 25000,
    lots: [
      { id: 'lot_5', date: '2025-03-05', quantityBought: 200, quantityRemaining: 100, costPerUnit: 3100, currentPrice: 3456, returnPercent: 11.48, unrealizedPnl: 35600, status: 'partial' },
    ],
  },
  {
    securityId: 'sec_spy', symbol: 'SPY', name: 'SPDR S&P 500 ETF',
    nickname: 'S&P 500', purpose: 'core portfolio',
    accountId: 'acc_2', accountName: 'IBI SMART',
    totalQuantity: 25, weightedAvgCost: 531.58, currentPrice: 572.30, currency: 'USD',
    marketValueILS: 53224, marketValueUSD: 14307.50, unrealizedPnlILS: 3770, unrealizedPnlPercent: 7.66,
    realizedPnlILS: 0,
    lots: [
      { id: 'lot_6', date: '2025-06-15', quantityBought: 15, quantityRemaining: 15, costPerUnit: 520.50, currentPrice: 572.30, returnPercent: 9.95, unrealizedPnl: 777, status: 'open' },
      { id: 'lot_7', date: '2025-11-20', quantityBought: 10, quantityRemaining: 10, costPerUnit: 548.20, currentPrice: 572.30, returnPercent: 4.39, unrealizedPnl: 241, status: 'open' },
    ],
  },
  {
    securityId: 'sec_aapl', symbol: 'AAPL', name: 'Apple Inc.',
    nickname: '', purpose: 'growth',
    accountId: 'acc_2', accountName: 'IBI SMART',
    totalQuantity: 15, weightedAvgCost: 185.40, currentPrice: 214.50, currency: 'USD',
    marketValueILS: 11969, marketValueUSD: 3217.50, unrealizedPnlILS: 1618, unrealizedPnlPercent: 15.70,
    realizedPnlILS: 923,
    lots: [
      { id: 'lot_8', date: '2025-07-10', quantityBought: 25, quantityRemaining: 15, costPerUnit: 185.40, currentPrice: 214.50, returnPercent: 15.70, unrealizedPnl: 436.50, status: 'partial' },
    ],
  },
  {
    securityId: 'sec_msft', symbol: 'MSFT', name: 'Microsoft Corp.',
    nickname: '', purpose: 'growth',
    accountId: 'acc_2', accountName: 'IBI SMART',
    totalQuantity: 12, weightedAvgCost: 395.00, currentPrice: 428.75, currency: 'USD',
    marketValueILS: 19131, marketValueUSD: 5145.00, unrealizedPnlILS: 1499, unrealizedPnlPercent: 8.54,
    realizedPnlILS: 0,
    lots: [
      { id: 'lot_9', date: '2025-05-25', quantityBought: 12, quantityRemaining: 12, costPerUnit: 395.00, currentPrice: 428.75, returnPercent: 8.54, unrealizedPnl: 405, status: 'open' },
    ],
  },
  {
    securityId: 'sec_nvda', symbol: 'NVDA', name: 'NVIDIA Corp.',
    nickname: '', purpose: 'growth',
    accountId: 'acc_2', accountName: 'IBI SMART',
    totalQuantity: 8, weightedAvgCost: 720.00, currentPrice: 890.20, currency: 'USD',
    marketValueILS: 26490, marketValueUSD: 7121.60, unrealizedPnlILS: 5028, unrealizedPnlPercent: 23.64,
    realizedPnlILS: 0,
    lots: [
      { id: 'lot_10', date: '2025-08-01', quantityBought: 8, quantityRemaining: 8, costPerUnit: 720.00, currentPrice: 890.20, returnPercent: 23.64, unrealizedPnl: 1361.60, status: 'open' },
    ],
  },
  {
    securityId: 'sec_sgov', symbol: 'SGOV', name: 'iShares 0-3 Month Treasury',
    nickname: 'Cash equiv.', purpose: 'cash management',
    accountId: 'acc_2', accountName: 'IBI SMART',
    totalQuantity: 50, weightedAvgCost: 100.20, currentPrice: 100.48, currency: 'USD',
    marketValueILS: 18689, marketValueUSD: 5024.00, unrealizedPnlILS: 52, unrealizedPnlPercent: 0.28,
    realizedPnlILS: 0,
    lots: [
      { id: 'lot_11', date: '2025-09-15', quantityBought: 50, quantityRemaining: 50, costPerUnit: 100.20, currentPrice: 100.48, returnPercent: 0.28, unrealizedPnl: 14, status: 'open' },
    ],
  },
  {
    securityId: 'sec_ta35', symbol: 'TA35', name: 'מדד ת"א 35',
    nickname: 'מדד ת"א 35', purpose: 'פנסיה',
    accountId: 'acc_3', accountName: 'קופת גמל להשקעה',
    totalQuantity: 50, weightedAvgCost: 1890, currentPrice: 2145, currency: 'ILS',
    marketValueILS: 10725, marketValueUSD: 2883, unrealizedPnlILS: 12750, unrealizedPnlPercent: 13.49,
    realizedPnlILS: 0,
    lots: [
      { id: 'lot_12', date: '2025-04-01', quantityBought: 50, quantityRemaining: 50, costPerUnit: 1890, currentPrice: 2145, returnPercent: 13.49, unrealizedPnl: 12750, status: 'open' },
    ],
  },
  {
    securityId: 'sec_voo', symbol: 'VOO', name: 'Vanguard S&P 500 ETF',
    nickname: 'S&P 500', purpose: 'פנסיה',
    accountId: 'acc_3', accountName: 'קופת גמל להשקעה',
    totalQuantity: 20, weightedAvgCost: 480.50, currentPrice: 526.10, currency: 'USD',
    marketValueILS: 39142, marketValueUSD: 10522.00, unrealizedPnlILS: 3387, unrealizedPnlPercent: 9.49,
    realizedPnlILS: 0,
    lots: [
      { id: 'lot_13', date: '2025-05-10', quantityBought: 20, quantityRemaining: 20, costPerUnit: 480.50, currentPrice: 526.10, returnPercent: 9.49, unrealizedPnl: 912, status: 'open' },
    ],
  },
];

// ===== PORTFOLIO HISTORY (12 months) =====
export const mockPortfolioHistory = [
  { date: '2025-04', valueILS: 165000, valueUSD: 45000 },
  { date: '2025-05', valueILS: 172000, valueUSD: 46900 },
  { date: '2025-06', valueILS: 185000, valueUSD: 50300 },
  { date: '2025-07', valueILS: 192000, valueUSD: 51800 },
  { date: '2025-08', valueILS: 198000, valueUSD: 53600 },
  { date: '2025-09', valueILS: 195000, valueUSD: 53100 },
  { date: '2025-10', valueILS: 208000, valueUSD: 56200 },
  { date: '2025-11', valueILS: 218000, valueUSD: 58300 },
  { date: '2025-12', valueILS: 225000, valueUSD: 60500 },
  { date: '2026-01', valueILS: 232000, valueUSD: 63000 },
  { date: '2026-02', valueILS: 243000, valueUSD: 65400 },
  { date: '2026-03', valueILS: 251340, valueUSD: 67564 },
];

// ===== BENCHMARK COMPARISON =====
export const mockBenchmarkData = [
  { date: '2025-04', portfolio: 0, sp500: 0, ta35: 0 },
  { date: '2025-05', portfolio: 4.2, sp500: 3.8, ta35: 2.5 },
  { date: '2025-06', portfolio: 12.1, sp500: 10.2, ta35: 7.1 },
  { date: '2025-07', portfolio: 16.4, sp500: 14.5, ta35: 9.8 },
  { date: '2025-08', portfolio: 20.0, sp500: 17.2, ta35: 12.1 },
  { date: '2025-09', portfolio: 18.2, sp500: 15.8, ta35: 10.5 },
  { date: '2025-10', portfolio: 26.1, sp500: 22.4, ta35: 15.2 },
  { date: '2025-11', portfolio: 32.1, sp500: 28.1, ta35: 18.7 },
  { date: '2025-12', portfolio: 36.4, sp500: 31.5, ta35: 21.3 },
  { date: '2026-01', portfolio: 40.6, sp500: 35.2, ta35: 24.8 },
  { date: '2026-02', portfolio: 47.3, sp500: 40.1, ta35: 28.2 },
  { date: '2026-03', portfolio: 52.3, sp500: 44.5, ta35: 31.5 },
];

// ===== MOCK USERS (admin view) =====
export const mockUsers: User[] = [
  { id: 'user_demo', email: 'gr06255@gmail.com', displayName: 'Demo User', photoURL: '', role: 'admin', language: 'he', createdAt: '2024-01-15T10:00:00Z', updatedAt: '2026-03-19T08:00:00Z' },
  { id: 'user_2', email: 'investor@example.com', displayName: 'משתמש לדוגמה', photoURL: '', role: 'user', language: 'he', createdAt: '2025-06-01T10:00:00Z', updatedAt: '2026-01-15T08:00:00Z' },
];
