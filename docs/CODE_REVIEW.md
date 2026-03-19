# FolioFollow MVP — Code Review Report

**Reviewer:** Senior Code Review Agent  
**Date:** 2026-03-19  
**Scope:** Full codebase — backend, frontend, shared types  

---

## Summary

| Severity   | Count |
|------------|-------|
| CRITICAL   | 4     |
| MAJOR      | 10    |
| MINOR      | 8     |
| SUGGESTION | 7     |

The project is well-structured with clean separation of concerns, consistent API response formatting, good i18n/RTL support, and solid TypeScript typing. The main risks lie in **security** (missing auth middleware on certain routes, CORS wildcard default), **data integrity** (Firestore batch size limits, account deletion without cascade), **calculation logic** (return-percent mixing currencies), and **frontend mock-only state** (no real API integration path).

---

## CRITICAL Issues

### C1. Firestore Batch 500-Document Limit Can Silently Corrupt State

**File:** `backend/src/services/transactionService.ts`, lines 103–192  
**Problem:** `rebuildDerivedState()` uses a single Firestore `WriteBatch` to delete all existing lots/lotSales and recreate them. Firestore batches have a hard limit of 500 operations. For accounts with many transactions, this will throw at `batch.commit()`, leaving the account in a partially-deleted state with no lots or cash balances.

**Impact:** Data loss — lots and cash balances deleted, but new ones not written.

**Fix:**
```typescript
// transactionService.ts — replace single batch with chunked batches
async rebuildDerivedState(userId: string, accountId: string): Promise<void> {
  const snapshot = await collections.transactions()
    .where('userId', '==', userId)
    .where('accountId', '==', accountId)
    .get();
  const transactions = snapshot.docs
    .map((doc) => ({ ...(doc.data() as Transaction), id: doc.id }))
    .sort(compareTransactions);

  const existingLots = await collections.lots()
    .where('userId', '==', userId)
    .where('accountId', '==', accountId)
    .get();
  const existingSales = await collections.lotSales()
    .where('accountId', '==', accountId)
    .get()
    .catch(() => null);

  // Phase 1: Delete existing lots and sales in chunked batches
  const deleteDocs = [
    ...existingLots.docs.map((d) => collections.lots().doc(d.id)),
    ...(existingSales?.docs.map((d) => collections.lotSales().doc(d.id)) ?? []),
  ];
  for (let i = 0; i < deleteDocs.length; i += 499) {
    const chunk = deleteDocs.slice(i, i + 499);
    const deleteBatch = collections.transactions().firestore.batch();
    chunk.forEach((ref) => deleteBatch.delete(ref));
    await deleteBatch.commit();
  }

  // Phase 2: Build new lots/sales (same logic as before)
  const balances: Record<Currency, number> = { [Currency.ILS]: 0, [Currency.USD]: 0 };
  const openLots: Lot[] = [];
  const newLotDocs: { ref: FirebaseFirestore.DocumentReference; data: any }[] = [];
  const newSaleDocs: { ref: FirebaseFirestore.DocumentReference; data: any }[] = [];

  for (const tx of transactions) {
    // ... same switch logic, but push to newLotDocs/newSaleDocs arrays instead of batch ...
  }

  // Phase 3: Write new docs in chunked batches
  const allWrites = [
    ...newLotDocs.map(({ ref, data }) => ({ ref, data, op: 'set' as const })),
    ...newSaleDocs.map(({ ref, data }) => ({ ref, data, op: 'set' as const })),
  ];
  // Also include lot updates (status changes)
  for (const lot of openLots) {
    allWrites.push({
      ref: collections.lots().doc(lot.id),
      data: lot,
      op: 'set' as const,
    });
  }

  for (let i = 0; i < allWrites.length; i += 499) {
    const chunk = allWrites.slice(i, i + 499);
    const writeBatch = collections.transactions().firestore.batch();
    chunk.forEach(({ ref, data }) => writeBatch.set(ref, data, { merge: true }));
    await writeBatch.commit();
  }

  await cashService.replaceBalances(userId, accountId, balances);
}
```

---

### C2. Account Deletion Does Not Cascade — Orphaned Data

**File:** `backend/src/services/accountService.ts`, lines 38–41  
**Problem:** `delete()` only deletes the account document. It does not delete related transactions, lots, lotSales, or cashBalances. This leaves orphaned data that will cause crashes in `portfolioService.getHoldings()` (line 37: `securityMap.get(groupSecurityId)!` will be undefined if orphan lots reference deleted accounts).

**Fix:**
```typescript
async delete(userId: string, accountId: string): Promise<void> {
  await this.getById(userId, accountId); // verify ownership

  // Delete related data
  const txnSnapshot = await collections.transactions()
    .where('userId', '==', userId)
    .where('accountId', '==', accountId)
    .get();
  const lotSnapshot = await collections.lots()
    .where('userId', '==', userId)
    .where('accountId', '==', accountId)
    .get();
  const saleSnapshot = await collections.lotSales()
    .where('accountId', '==', accountId)
    .get()
    .catch(() => ({ docs: [] }));
  const cashSnapshot = await collections.cashBalances()
    .where('userId', '==', userId)
    .where('accountId', '==', accountId)
    .get();

  const allDocs = [
    ...txnSnapshot.docs,
    ...lotSnapshot.docs,
    ...saleSnapshot.docs,
    ...cashSnapshot.docs,
  ];

  // Chunk deletes to stay under batch limit
  for (let i = 0; i < allDocs.length; i += 499) {
    const batch = collections.accounts().firestore.batch();
    allDocs.slice(i, i + 499).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }

  await collections.accounts().doc(accountId).delete();
}
```

---

### C3. `lotSales` Collection Missing `userId` Index — Query Fails Silently

**File:** `backend/src/services/portfolioService.ts`, line 19; `lotService.ts`, line 33  
**Problem:** Both services query `lotSales` with `.where('userId', '==', userId)`, but the `LotSale` interface (shared/types, lines 177–189) does **not** include `userId`. The field is only added in `transactionService.ts` line 163 as a type assertion (`LotSale & { accountId: string; userId: string }`). This means:
1. The shared type is incomplete — consumers expect `userId` but the type doesn't declare it.
2. The `.catch(() => null)` in both files silently swallows Firestore index errors, returning empty data.

**Fix (shared/types/index.ts):**
```typescript
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
  // Add these fields:
  userId: string;
  accountId: string;
}
```

Also remove the `.catch(() => null)` patterns that hide real errors, or replace with proper error logging:
```typescript
// portfolioService.ts line 19 — remove .catch(() => null)
collections.lotSales().where('userId', '==', userId).get(),
```

---

### C4. `badRequest` Used for Missing Environment Variables — Wrong Error Type

**File:** `backend/src/config/env.ts`, line 9  
**Problem:** Throws `badRequest(...)` (HTTP 400) for missing environment variables. This error is caught by `errorHandler` and returns a 400 to the client with the env variable name exposed, leaking internal configuration details. A missing env var is a server configuration error, not a client error.

**Fix:**
```typescript
const required = (name: string, fallback?: string): string => {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};
```

---

## MAJOR Issues

### M1. CORS Wildcard in Production

**File:** `backend/src/config/env.ts`, line 23; `backend/src/index.ts`, line 21  
**Problem:** `corsOrigin` defaults to `'*'`, and the CORS middleware translates `'*'` to `true` (allow all origins). In production, this allows any website to make authenticated API requests.

**Fix:**
```typescript
// env.ts — remove default wildcard
corsOrigin: required('CORS_ORIGIN'),
```

---

### M2. `SecurityService.list()` Fetches All Securities for Search

**File:** `backend/src/services/securityService.ts`, lines 8–14  
**Problem:** Loads the entire `securities` collection into memory, then filters client-side. As the securities catalog grows, this becomes increasingly expensive and slow.

**Fix:** For MVP this is acceptable if the catalog is small (<100), but add a TODO and consider Firestore full-text search alternatives (Algolia, or composite queries with `>=` / `<=` prefix matching).

---

### M3. `TransactionService.list()` Loads All User Transactions Into Memory

**File:** `backend/src/services/transactionService.ts`, lines 14–43  
**Problem:** Fetches **all** transactions for a user, applies filtering and sorting in-memory, then paginates. For users with hundreds of transactions this is inefficient and will degrade.

**Fix:** Push filters to Firestore queries where possible (accountId, type, date range are all queryable). Only fall back to in-memory for filters Firestore can't handle (multi-field sorting with inequality filters).

---

### M4. `PortfolioService.getHoldings()` Crashes When Security or Account Is Missing

**File:** `backend/src/services/portfolioService.ts`, lines 37–38  
**Problem:** Uses non-null assertion `securityMap.get(groupSecurityId)!` and `accountMap.get(groupAccountId)!`. If a lot references a deleted security or account, this throws a runtime error crashing the entire portfolio endpoint.

**Fix:**
```typescript
const security = securityMap.get(groupSecurityId);
const account = accountMap.get(groupAccountId);
if (!security || !account) {
  console.warn(`Orphaned lot data: security=${groupSecurityId}, account=${groupAccountId}`);
  return null; // skip this holding group
}
```
Then filter nulls: `.filter(Boolean) as HoldingRow[]`.

---

### M5. `exchangeRateService.getLatestRateValue()` Falls Back to 1 — Silently Incorrect

**File:** `backend/src/services/exchangeRateService.ts`, lines 23–26  
**Problem:** If no exchange rate exists in the database, returns `1`. For USD/ILS, this would mean $1 = ₪1, causing all USD-denominated holdings to show wildly incorrect ILS values. This is a silent data corruption.

**Fix:**
```typescript
async getLatestRateValue(): Promise<number> {
  const latest = await this.latest();
  if (!latest) {
    throw new AppError(503, 'NO_EXCHANGE_RATE', 'No exchange rate data available. Please add a USD/ILS rate.');
  }
  return latest.rate;
}
```

---

### M6. Frontend AuthContext Uses Mock Login Only — No Real Firebase Auth

**File:** `frontend/src/store/AuthContext.tsx`, lines 30–43  
**Problem:** `loginWithGoogle` simulates a login with `setTimeout(500)` and uses `mockUsers[0]`. There is no actual Firebase Auth integration. The `isAdmin: true` in `loginDemo()` (line 50) means any demo user has full admin access.

**Impact:** No real authentication exists on the frontend. This is expected for an MVP demo but must be flagged for production readiness.

**Fix (for production):**
```typescript
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const loginWithGoogle = useCallback(async () => {
  setState(prev => ({ ...prev, loading: true }));
  const firebaseAuth = getAuth();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(firebaseAuth, provider);
  const token = await result.user.getIdToken();
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const { data: user } = await response.json();
  setState({
    user,
    isAuthenticated: true,
    isAdmin: user.role === 'admin',
    isDemo: false,
    loading: false,
  });
}, []);
```

---

### M7. Frontend API Service Has No Error Handling

**File:** `frontend/src/services/api.ts`, entire file  
**Problem:** All API functions return mock data with `await delay()`. When switching to real HTTP calls, there is no error handling, no try/catch, no error state propagation. Pages calling these functions (e.g., `DashboardPage.tsx` line 30–38) also have no try/catch.

**Fix (example for DashboardPage):**
```typescript
const loadData = async () => {
  setLoading(true);
  try {
    const [summaryData, holdingsData] = await Promise.all([
      getPortfolioSummary(),
      getHoldings(),
    ]);
    setSummary(summaryData);
    setHoldings(holdingsData);
  } catch (error) {
    message.error(t('common.error'));
    console.error('Failed to load dashboard data:', error);
  } finally {
    setLoading(false);
  }
};
```

---

### M8. `updateSecurityPrice` Returns `sec!` When Security Not Found

**File:** `frontend/src/services/api.ts`, lines 45–53  
**Problem:** `updateSecurityPrice` returns `sec!` — if the security is not found in the mock array, this returns `undefined` cast as `Security`, which will cause downstream crashes.

**Fix:**
```typescript
export async function updateSecurityPrice(id: string, price: number): Promise<Security> {
  await delay();
  const sec = mockSecurities.find(s => s.id === id);
  if (!sec) throw new Error(`Security ${id} not found`);
  sec.currentPrice = price;
  sec.priceUpdatedAt = new Date().toISOString();
  return sec;
}
```
Same pattern applies to `updateUserRole` (line 149–153).

---

### M9. Return Percentage Calculation Mixes ILS and USD Cost Bases

**File:** `backend/src/services/returnsCalculator.ts`, lines 32, 68  
**Problem:** `calculateLot` computes `returnPercent` as `(currentPrice - costPerUnit) / costPerUnit * 100`. This is correct **only** when the security's currency matches the lot's `costCurrency`. If a user buys a USD security but records cost in a different currency denomination, the return percentage would be meaningless.

Additionally in `calculateSecurity` (line 68), `totalReturnPercent` uses `(totalUnrealizedPnlILS + totalRealizedPnlILS) / totalCostBasis * 100`. But `totalCostBasis` is in the security's native currency, while PnL values are in ILS. This mixes currencies.

**Fix:** Ensure `totalReturnPercent` uses the same currency for both numerator and denominator:
```typescript
// Use ILS-denominated cost basis for ILS return
const totalCostBasisILS = sum(lots.map((lot) => {
  const costInNative = lot.costPerUnit * lot.quantityRemaining;
  return lot.costCurrency === Currency.USD ? costInNative * currentUsdIlsRate : costInNative;
}));
const totalReturnPercent = safeDivide(totalUnrealizedPnlILS + totalRealizedPnlILS, totalCostBasisILS) * 100;
```

---

### M10. `TransactionsPage` and `TransactionForm` Import Directly From `mockData`

**File:** `frontend/src/pages/TransactionsPage.tsx`, line 9; `frontend/src/components/TransactionForm.tsx`, line 7  
**Problem:** These components import `mockAccounts` and `mockSecurities` directly from `mockData.ts` instead of fetching through the API service layer. This creates a hard coupling to mock data that will break when switching to real API calls.

**Fix:** Fetch accounts and securities via the API service, or lift them into shared state/context:
```typescript
// TransactionsPage.tsx
const [accounts, setAccounts] = useState<Account[]>([]);
const [securities, setSecurities] = useState<Security[]>([]);

useEffect(() => {
  Promise.all([getAccounts(), getSecurities()]).then(([acc, sec]) => {
    setAccounts(acc);
    setSecurities(sec);
  });
}, []);
```

---

## MINOR Issues

### m1. `normalizeDate` Can Return `Invalid Date`

**File:** `backend/src/utils/date.ts`, line 2  
**Problem:** `new Date(value).toISOString()` throws `RangeError: Invalid time value` if `value` is not a valid date string. No validation.

**Fix:**
```typescript
export const normalizeDate = (value: string): string => {
  const date = new Date(value);
  if (isNaN(date.getTime())) throw badRequest(`Invalid date: ${value}`);
  return date.toISOString().slice(0, 10);
};
```

---

### m2. Missing `aria-label` on Key Interactive Elements

**File:** `frontend/src/components/Layout.tsx`, lines 149–153; `LoginPage.tsx`  
**Problem:** The sidebar collapse button, notification bell, and language toggle have no `aria-label`. Screen readers won't understand their purpose.

**Fix:** Add `aria-label` to buttons:
```tsx
<Button aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} ... />
<Button aria-label="Notifications" ... />
```

---

### m3. `LanguageToggle` Doesn't Persist Language Preference

**File:** `frontend/src/components/LanguageToggle.tsx`, lines 8–13  
**Problem:** Language change is only applied to `i18n` and `document.dir`. On page refresh, it resets to Hebrew (the default in `i18n/index.ts`). The backend has `updateLanguage()` but it's never called.

**Fix:** Persist to `localStorage` and sync with backend:
```typescript
const toggleLanguage = () => {
  const newLang = currentLang === 'he' ? 'en' : 'he';
  i18n.changeLanguage(newLang);
  document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
  document.documentElement.lang = newLang;
  localStorage.setItem('language', newLang);
  // TODO: call updateLanguage API when backend integration is ready
};
```

And in `i18n/index.ts`:
```typescript
lng: localStorage.getItem('language') || 'he',
```

---

### m4. Hardcoded "OR" Divider Text Not Translated

**File:** `frontend/src/pages/LoginPage.tsx`, line 97  
**Problem:** The `<Divider>` contains hardcoded English text `"OR"` that is not translated.

**Fix:**
```tsx
<Divider style={{ borderColor: '#30363d', margin: '4px 0' }}>
  <span style={{ color: '#484f58', fontSize: 12 }}>{t('auth.or') || 'OR'}</span>
</Divider>
```
Add `"or": "או"` to `he.json` and `"or": "OR"` to `en.json` under the `auth` key.

---

### m5. Hardcoded Strings in AdminPage

**File:** `frontend/src/pages/AdminPage.tsx`, lines 59, 68, 159, 160, 199, 265  
**Problem:** Several strings are not translated: `'Security added'`, `'Price updated'`, `'Rate added'`, `'Role updated'`, `'Update Price'`, `'Currency'`, `'User'`, `'Admin'`.

**Fix:** Replace with `t()` calls using appropriate i18n keys.

---

### m6. `DashboardPage.loadData` Not Wrapped in `useCallback`

**File:** `frontend/src/pages/DashboardPage.tsx`, lines 30–39  
**Problem:** `loadData` is recreated on every render. Although it's only called in `useEffect` with `[]` deps, it triggers an ESLint `exhaustive-deps` warning and can cause subtle bugs if deps change.

**Fix:**
```typescript
const loadData = useCallback(async () => {
  setLoading(true);
  const [summaryData, holdingsData] = await Promise.all([
    getPortfolioSummary(),
    getHoldings(),
  ]);
  setSummary(summaryData);
  setHoldings(holdingsData);
  setLoading(false);
}, []);

useEffect(() => { loadData(); }, [loadData]);
```

---

### m7. `AnalyticsPage` `dateRange` Filter Is Not Applied

**File:** `frontend/src/pages/AnalyticsPage.tsx`, lines 38, 97  
**Problem:** The `dateRange` state is set by the select dropdown but never used to filter data. Changing the date range has no visible effect.

**Fix:** Apply the filter to the data arrays before rendering:
```typescript
const filterByDateRange = useCallback((data: { date: string }[]) => {
  if (dateRange === 'all') return data;
  const now = new Date();
  const monthsMap: Record<string, number> = { '3m': 3, '6m': 6, '12m': 12 };
  // ... implement date filtering
}, [dateRange]);
```

---

### m8. Duplicate Type Definitions: `frontend/types.ts` vs `shared/types/index.ts`

**File:** `frontend/types.ts` (entire file)  
**Problem:** The frontend maintains its own copy of all type definitions instead of importing from `shared/types/index.ts`. This creates a drift risk — changes to shared types won't be reflected in the frontend types.

**Fix:** Configure the frontend `tsconfig.json` to resolve `@shared/types` and import from the shared package:
```json
// tsconfig.app.json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["../shared/*"]
    }
  }
}
```

---

## SUGGESTIONS

### S1. Add Request Body Size Limit

**File:** `backend/src/index.ts`, line 22  
**Suggestion:** `express.json()` has no size limit. Add `express.json({ limit: '1mb' })` to prevent large payload attacks.

---

### S2. Add Rate Limiting Middleware

**File:** `backend/src/index.ts`  
**Suggestion:** Constants define `RATE_LIMITS.USER_RPM` and `ADMIN_RPM` (shared/constants), but no rate limiting middleware is implemented. Consider `express-rate-limit`.

---

### S3. Consistent Use of `docToData` Helper

**File:** `backend/src/utils/firestore.ts`  
**Suggestion:** The `docToData<T>()` helper is defined but never used. All services manually spread `doc.data() as T` with `id: doc.id`. Using `docToData` would centralize Timestamp conversion and ensure consistent handling.

---

### S4. Add `noUncheckedIndexedAccess` to tsconfig

**File:** `backend/tsconfig.json`  
**Suggestion:** Enable `noUncheckedIndexedAccess: true` to catch potential undefined values from array/object indexing at compile time.

---

### S5. Use Firestore Transactions for Writes That Require Consistency

**File:** `backend/src/services/transactionService.ts`  
**Suggestion:** `rebuildDerivedState` reads and writes multiple collections. Using Firestore transactions instead of batches would ensure consistency if concurrent requests modify the same account.

---

### S6. Frontend `mockData.ts` Should Not Be Mutable

**File:** `frontend/src/services/mockData.ts`  
**Suggestion:** Mock data arrays are exported as `const` but their contents are mutated (e.g., `mockSecurities.push(newSec)` in `api.ts` line 41). This causes state to persist across renders without React's knowledge. Use immutable patterns or a state store.

---

### S7. Add `key` Props to Dynamic Lists

**File:** `frontend/src/pages/AnalyticsPage.tsx`, line 176  
**Suggestion:** Pie chart `Cell` elements use `key={index}` which is fragile. Use a stable key from the data item.

---

## Positive Highlights

1. **Clean shared type system** — Well-defined DTOs, enums, and response wrappers in `shared/types`.
2. **Consistent API response format** — All endpoints return `{ data: T }` or `{ data, pagination }`.
3. **Good error hierarchy** — `AppError` with factory functions (`badRequest`, `notFound`, etc.) and centralized `errorHandler`.
4. **Strong i18n** — All user-facing strings use `t()`, both Hebrew and English files are complete and consistent.
5. **RTL-aware layout** — Uses Ant Design's `direction` prop, logical properties (`insetInlineStart`, `marginInlineStart`), and a `numeric-value` class for LTR numbers in RTL contexts.
6. **FIFO lot allocation** — The sell logic correctly sorts matching lots by date (FIFO) and handles partial fills.
7. **Express `asyncHandler`** — Properly catches async errors and forwards to error middleware.
8. **Well-designed `returnsCalculator`** — Separated from service layer, pure calculation logic with no side effects.

---

## Priority Fix Order

1. **C4** — Quick fix, change error type for env vars (5 min)
2. **C3** — Add `userId`/`accountId` to `LotSale` type, remove `.catch(() => null)` (15 min)
3. **M1** — Remove CORS wildcard default (5 min)
4. **M5** — Change exchange rate fallback from `1` to an error (5 min)
5. **M4** — Add null checks in `portfolioService.getHoldings()` (10 min)
6. **C2** — Cascade delete on account removal (30 min)
7. **C1** — Chunked batch operations (45 min)
8. **M9** — Fix currency-mixed return percentage (20 min)
9. **M7** — Add error handling to frontend API calls (30 min)
10. **M10** — Decouple frontend from direct mock imports (20 min)
