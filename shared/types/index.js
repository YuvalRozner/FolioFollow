"use strict";
// ============================================================
// FolioFollow — Shared TypeScript Types
// Used by both backend and frontend for type safety
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateSource = exports.LotStatus = exports.AccountType = exports.Exchange = exports.SecurityType = exports.TransactionType = exports.Currency = exports.UserRole = void 0;
// --- Enums ---
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var Currency;
(function (Currency) {
    Currency["ILS"] = "ILS";
    Currency["USD"] = "USD";
})(Currency || (exports.Currency = Currency = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["BUY"] = "buy";
    TransactionType["SELL"] = "sell";
    TransactionType["DEPOSIT"] = "deposit";
    TransactionType["WITHDRAW"] = "withdraw";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var SecurityType;
(function (SecurityType) {
    SecurityType["STOCK"] = "stock";
    SecurityType["ETF"] = "etf";
    SecurityType["MUTUAL_FUND"] = "mutual_fund";
    SecurityType["BOND"] = "bond";
    SecurityType["MONEY_MARKET"] = "money_market";
    SecurityType["OTHER"] = "other";
})(SecurityType || (exports.SecurityType = SecurityType = {}));
var Exchange;
(function (Exchange) {
    Exchange["TASE"] = "TASE";
    Exchange["NYSE"] = "NYSE";
    Exchange["NASDAQ"] = "NASDAQ";
    Exchange["OTHER"] = "other";
})(Exchange || (exports.Exchange = Exchange = {}));
var AccountType;
(function (AccountType) {
    AccountType["BROKERAGE"] = "brokerage";
    AccountType["PENSION"] = "pension";
    AccountType["OTHER"] = "other";
})(AccountType || (exports.AccountType = AccountType = {}));
var LotStatus;
(function (LotStatus) {
    LotStatus["OPEN"] = "open";
    LotStatus["CLOSED"] = "closed";
    LotStatus["PARTIAL"] = "partial";
})(LotStatus || (exports.LotStatus = LotStatus = {}));
var RateSource;
(function (RateSource) {
    RateSource["MANUAL"] = "manual";
    RateSource["API"] = "api";
})(RateSource || (exports.RateSource = RateSource = {}));
