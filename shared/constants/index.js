"use strict";
// ============================================================
// FolioFollow — Shared Constants
// Used by both backend and frontend
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LANGUAGE = exports.SUPPORTED_LANGUAGES = exports.VALIDATION = exports.RATE_LIMITS = exports.BENCHMARKS = exports.DEFAULT_ACCOUNT_TEMPLATES = exports.SUPPORTED_EXCHANGES = exports.DEFAULT_CURRENCY_PAIR = exports.MAX_PAGE_SIZE = exports.DEFAULT_PAGE_SIZE = void 0;
// --- Pagination ---
exports.DEFAULT_PAGE_SIZE = 50;
exports.MAX_PAGE_SIZE = 100;
// --- Exchange Rate ---
exports.DEFAULT_CURRENCY_PAIR = 'USD/ILS';
// --- Supported Exchanges ---
exports.SUPPORTED_EXCHANGES = {
    TASE: { name: 'Tel Aviv Stock Exchange', currency: 'ILS', country: 'IL' },
    NYSE: { name: 'New York Stock Exchange', currency: 'USD', country: 'US' },
    NASDAQ: { name: 'NASDAQ', currency: 'USD', country: 'US' },
};
// --- Default Accounts ---
exports.DEFAULT_ACCOUNT_TEMPLATES = [
    { name: 'IBI SPARK', institution: 'IBI', type: 'brokerage', currency: 'ILS' },
    { name: 'IBI SMART', institution: 'IBI', type: 'brokerage', currency: 'USD' },
    { name: 'קופת גמל להשקעה', institution: '', type: 'pension', currency: 'ILS' },
];
// --- Benchmark Indices ---
exports.BENCHMARKS = {
    SP500: { symbol: 'SPY', name: 'S&P 500', currency: 'USD' },
    TA35: { symbol: 'TA35', name: 'ת"א 35', currency: 'ILS' },
};
// --- Rate Limiting ---
exports.RATE_LIMITS = {
    USER_RPM: 100, // requests per minute for regular users
    ADMIN_RPM: 30, // requests per minute for admin endpoints
};
// --- Validation ---
exports.VALIDATION = {
    MAX_NICKNAME_LENGTH: 100,
    MAX_PURPOSE_LENGTH: 200,
    MAX_NOTES_LENGTH: 1000,
    MIN_QUANTITY: 0.0001,
    MIN_PRICE: 0,
    MAX_PRICE: 10000000,
    MIN_EXCHANGE_RATE: 0.01,
    MAX_EXCHANGE_RATE: 100,
};
// --- i18n ---
exports.SUPPORTED_LANGUAGES = ['he', 'en'];
exports.DEFAULT_LANGUAGE = 'he';
