/**
 * API Service Layer
 * Uses mock data for demo mode. Swap to real axios calls when backend is deployed.
 */
import type {
  Account, Security, Transaction, ExchangeRate,
  PortfolioSummary, HoldingRow, User, CashBalance,
  CreateTransactionDTO, CreateExchangeRateDTO, CreateSecurityDTO,
} from '../../types';
import {
  mockAccounts, mockSecurities, mockTransactions, mockExchangeRates,
  mockPortfolioSummary, mockHoldings, mockCashBalances, mockUsers,
  mockPortfolioHistory, mockBenchmarkData, mockLots,
} from './mockData';

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ===== ACCOUNTS =====
export async function getAccounts(): Promise<Account[]> {
  await delay();
  return mockAccounts;
}

// ===== SECURITIES =====
export async function getSecurities(): Promise<Security[]> {
  await delay();
  return mockSecurities;
}

export async function createSecurity(dto: CreateSecurityDTO): Promise<Security> {
  await delay();
  const newSec: Security = {
    id: `sec_${Date.now()}`,
    ...dto,
    currentPrice: 0,
    priceUpdatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockSecurities.push(newSec);
  return newSec;
}

export async function updateSecurityPrice(id: string, price: number): Promise<Security> {
  await delay();
  const sec = mockSecurities.find(s => s.id === id);
  if (sec) {
    sec.currentPrice = price;
    sec.priceUpdatedAt = new Date().toISOString();
  }
  return sec!;
}

// ===== TRANSACTIONS =====
export async function getTransactions(filters?: {
  accountId?: string;
  type?: string;
  securityId?: string;
  currency?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<Transaction[]> {
  await delay();
  let result = [...mockTransactions];
  if (filters?.accountId) result = result.filter(t => t.accountId === filters.accountId);
  if (filters?.type) result = result.filter(t => t.type === filters.type);
  if (filters?.securityId) result = result.filter(t => t.securityId === filters.securityId);
  if (filters?.currency) result = result.filter(t => t.currency === filters.currency);
  if (filters?.dateFrom) result = result.filter(t => t.date >= filters.dateFrom!);
  if (filters?.dateTo) result = result.filter(t => t.date <= filters.dateTo!);
  return result.sort((a, b) => b.date.localeCompare(a.date));
}

export async function createTransaction(dto: CreateTransactionDTO): Promise<Transaction> {
  await delay();
  const totalAmount = dto.quantity * dto.pricePerUnit;
  const newTxn: Transaction = {
    id: `txn_${Date.now()}`,
    userId: 'user_demo',
    ...dto,
    totalAmount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockTransactions.push(newTxn);
  return newTxn;
}

// ===== PORTFOLIO =====
export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  await delay();
  return mockPortfolioSummary;
}

export async function getHoldings(): Promise<HoldingRow[]> {
  await delay();
  return mockHoldings;
}

export async function getPortfolioHistory(): Promise<typeof mockPortfolioHistory> {
  await delay();
  return mockPortfolioHistory;
}

export async function getBenchmarkData(): Promise<typeof mockBenchmarkData> {
  await delay();
  return mockBenchmarkData;
}

// ===== CASH =====
export async function getCashBalances(): Promise<CashBalance[]> {
  await delay();
  return mockCashBalances;
}

// ===== EXCHANGE RATES =====
export async function getExchangeRates(): Promise<ExchangeRate[]> {
  await delay();
  return mockExchangeRates;
}

export async function getLatestExchangeRate(): Promise<ExchangeRate> {
  await delay();
  return mockExchangeRates[0];
}

export async function createExchangeRate(dto: CreateExchangeRateDTO): Promise<ExchangeRate> {
  await delay();
  const newRate: ExchangeRate = {
    id: `er_${Date.now()}`,
    date: dto.date,
    pair: 'USD/ILS',
    rate: dto.rate,
    source: 'manual',
    updatedBy: 'user_demo',
    createdAt: new Date().toISOString(),
  };
  mockExchangeRates.unshift(newRate);
  return newRate;
}

// ===== ADMIN =====
export async function getUsers(): Promise<User[]> {
  await delay();
  return mockUsers;
}

export async function updateUserRole(userId: string, role: 'user' | 'admin'): Promise<User> {
  await delay();
  const user = mockUsers.find(u => u.id === userId);
  if (user) user.role = role;
  return user!;
}

// ===== AUTH =====
export async function getCurrentUser(): Promise<User> {
  await delay();
  return mockUsers[0];
}
