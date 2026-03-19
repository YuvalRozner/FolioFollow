// ============================================================
// FolioFollow — Shared Constants
// Used by both backend and frontend
// ============================================================

// --- Pagination ---
export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 100;

// --- Exchange Rate ---
export const DEFAULT_CURRENCY_PAIR = 'USD/ILS';

// --- Supported Exchanges ---
export const SUPPORTED_EXCHANGES = {
  TASE: { name: 'Tel Aviv Stock Exchange', currency: 'ILS', country: 'IL' },
  NYSE: { name: 'New York Stock Exchange', currency: 'USD', country: 'US' },
  NASDAQ: { name: 'NASDAQ', currency: 'USD', country: 'US' },
} as const;

// --- Default Accounts ---
export const DEFAULT_ACCOUNT_TEMPLATES = [
  { name: 'IBI SPARK', institution: 'IBI', type: 'brokerage' as const, currency: 'ILS' as const },
  { name: 'IBI SMART', institution: 'IBI', type: 'brokerage' as const, currency: 'USD' as const },
  { name: 'קופת גמל להשקעה', institution: '', type: 'pension' as const, currency: 'ILS' as const },
] as const;

// --- Benchmark Indices ---
export const BENCHMARKS = {
  SP500: { symbol: 'SPY', name: 'S&P 500', currency: 'USD' },
  TA35: { symbol: 'TA35', name: 'ת"א 35', currency: 'ILS' },
} as const;

// --- Rate Limiting ---
export const RATE_LIMITS = {
  USER_RPM: 100,    // requests per minute for regular users
  ADMIN_RPM: 30,    // requests per minute for admin endpoints
} as const;

// --- Validation ---
export const VALIDATION = {
  MAX_NICKNAME_LENGTH: 100,
  MAX_PURPOSE_LENGTH: 200,
  MAX_NOTES_LENGTH: 1000,
  MIN_QUANTITY: 0.0001,
  MIN_PRICE: 0,
  MAX_PRICE: 10_000_000,
  MIN_EXCHANGE_RATE: 0.01,
  MAX_EXCHANGE_RATE: 100,
} as const;

// --- i18n ---
export const SUPPORTED_LANGUAGES = ['he', 'en'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'he';
