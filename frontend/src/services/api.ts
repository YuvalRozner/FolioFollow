import type {
  Account,
  Security,
  Transaction,
  ExchangeRate,
  PortfolioSummary,
  HoldingRow,
  User,
  CashBalance,
  CreateTransactionDTO,
  CreateExchangeRateDTO,
  CreateSecurityDTO,
  Lot,
  UpdatePriceDTO,
} from '../../types';
import http from './httpClient';
import {
  mockAccounts,
  mockSecurities,
  mockTransactions,
  mockExchangeRates,
  mockPortfolioSummary,
  mockHoldings,
  mockCashBalances,
  mockUsers,
  mockPortfolioHistory,
  mockBenchmarkData,
  mockLots,
} from './mockData';

interface ApiEnvelope<T> {
  data: T;
}

interface PaginatedApiEnvelope<T> {
  data: T[];
  pagination?: Record<string, unknown>;
}

let _isDemoMode = false;

export function setDemoMode(demo: boolean) {
  _isDemoMode = demo;
}

function cloneMockData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function getData<T>(url: string, params?: Record<string, string | undefined>): Promise<T> {
  const response = await http.get<ApiEnvelope<T>>(url, { params });
  return response.data.data;
}

async function postData<TResponse, TRequest>(url: string, body: TRequest): Promise<TResponse> {
  const response = await http.post<ApiEnvelope<TResponse>>(url, body);
  return response.data.data;
}

async function putData<TResponse, TRequest>(url: string, body: TRequest): Promise<TResponse> {
  const response = await http.put<ApiEnvelope<TResponse>>(url, body);
  return response.data.data;
}

// ===== ACCOUNTS =====
export async function getAccounts(): Promise<Account[]> {
  if (_isDemoMode) {
    return cloneMockData(mockAccounts);
  }

  return getData<Account[]>('/accounts');
}

// ===== SECURITIES =====
export async function getSecurities(): Promise<Security[]> {
  if (_isDemoMode) {
    return cloneMockData(mockSecurities);
  }

  return getData<Security[]>('/securities');
}

export async function createSecurity(dto: CreateSecurityDTO): Promise<Security> {
  if (_isDemoMode) {
    const newSec: Security = {
      id: `sec_${Date.now()}`,
      ...dto,
      currentPrice: 0,
      priceUpdatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSecurities.push(newSec);
    return cloneMockData(newSec);
  }

  return postData<Security, CreateSecurityDTO>('/securities', dto);
}

export async function updateSecurityPrice(id: string, price: number): Promise<Security> {
  if (_isDemoMode) {
    const sec = mockSecurities.find(s => s.id === id);
    if (!sec) {
      throw new Error('Security not found');
    }
    sec.currentPrice = price;
    sec.priceUpdatedAt = new Date().toISOString();
    sec.updatedAt = new Date().toISOString();
    return cloneMockData(sec);
  }

  return putData<Security, UpdatePriceDTO>(`/securities/${id}/price`, { price });
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
  if (_isDemoMode) {
    let result = [...mockTransactions];
    if (filters?.accountId) result = result.filter(t => t.accountId === filters.accountId);
    if (filters?.type) result = result.filter(t => t.type === filters.type);
    if (filters?.securityId) result = result.filter(t => t.securityId === filters.securityId);
    if (filters?.currency) result = result.filter(t => t.currency === filters.currency);
    if (filters?.dateFrom) result = result.filter(t => t.date >= filters.dateFrom!);
    if (filters?.dateTo) result = result.filter(t => t.date <= filters.dateTo!);
    return cloneMockData(result.sort((a, b) => b.date.localeCompare(a.date)));
  }

  const response = await http.get<PaginatedApiEnvelope<Transaction>>('/transactions', { params: filters });
  return response.data.data;
}

export async function createTransaction(dto: CreateTransactionDTO): Promise<Transaction> {
  if (_isDemoMode) {
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
    return cloneMockData(newTxn);
  }

  return postData<Transaction, CreateTransactionDTO>('/transactions', dto);
}

// ===== PORTFOLIO =====
export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  if (_isDemoMode) {
    return cloneMockData(mockPortfolioSummary);
  }

  return getData<PortfolioSummary>('/portfolio/summary');
}

export async function getHoldings(): Promise<HoldingRow[]> {
  if (_isDemoMode) {
    return cloneMockData(mockHoldings);
  }

  return getData<HoldingRow[]>('/portfolio/holdings');
}

export async function getPortfolioHistory(): Promise<typeof mockPortfolioHistory> {
  return cloneMockData(mockPortfolioHistory);
}

export async function getBenchmarkData(): Promise<typeof mockBenchmarkData> {
  return cloneMockData(mockBenchmarkData);
}

// ===== LOTS =====
export async function getLots(filters?: {
  accountId?: string;
  securityId?: string;
  status?: string;
}): Promise<Lot[]> {
  if (_isDemoMode) {
    let result = [...mockLots];
    if (filters?.accountId) result = result.filter(l => l.accountId === filters.accountId);
    if (filters?.securityId) result = result.filter(l => l.securityId === filters.securityId);
    if (filters?.status) result = result.filter(l => l.status === filters.status);
    return cloneMockData(result);
  }

  return getData<Lot[]>('/lots', filters);
}

// ===== CASH =====
export async function getCashBalances(): Promise<CashBalance[]> {
  if (_isDemoMode) {
    return cloneMockData(mockCashBalances);
  }

  return getData<CashBalance[]>('/cash/balances');
}

// ===== EXCHANGE RATES =====
export async function getExchangeRates(): Promise<ExchangeRate[]> {
  if (_isDemoMode) {
    return cloneMockData(mockExchangeRates);
  }

  return getData<ExchangeRate[]>('/exchange-rates');
}

export async function getLatestExchangeRate(): Promise<ExchangeRate> {
  if (_isDemoMode) {
    return cloneMockData(mockExchangeRates[0]);
  }

  return getData<ExchangeRate>('/exchange-rates/latest');
}

export async function createExchangeRate(dto: CreateExchangeRateDTO): Promise<ExchangeRate> {
  if (_isDemoMode) {
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
    return cloneMockData(newRate);
  }

  return postData<ExchangeRate, CreateExchangeRateDTO>('/exchange-rates', dto);
}

// ===== ADMIN =====
export async function getUsers(): Promise<User[]> {
  if (_isDemoMode) {
    return cloneMockData(mockUsers);
  }

  return getData<User[]>('/admin/users');
}

export async function updateUserRole(userId: string, role: 'user' | 'admin'): Promise<User> {
  if (_isDemoMode) {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.role = role;
    user.updatedAt = new Date().toISOString();
    return cloneMockData(user);
  }

  return putData<User, { role: 'user' | 'admin' }>(`/admin/users/${userId}/role`, { role });
}

// ===== AUTH =====
export async function getCurrentUser(): Promise<User> {
  if (_isDemoMode) {
    return cloneMockData(mockUsers[0]);
  }

  return getData<User>('/auth/me');
}
