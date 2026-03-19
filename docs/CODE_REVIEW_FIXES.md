# Code Review Fixes

## Critical fixes

### C4: env.ts error type
- Replaced `badRequest(...)` with `throw new Error(...)` in `backend/src/config/env.ts` for missing required environment variables.
- Removed the `badRequest` import because it is no longer used in that file.

### C3: LotSale type missing fields
- Added `userId: string;` and `accountId: string;` to the `LotSale` interface in `shared/types/index.ts`.

### C3 part 2: Remove hidden lotSales query failures
- Removed `.catch(() => null)` from lotSales queries in `backend/src/services/portfolioService.ts`.
- Removed `.catch(() => null)` from lotSales queries in `backend/src/services/lotService.ts`.
- Updated the lotSales mappings in both files to use the now-complete `LotSale` type.

### C2: Account deletion cascade
- Added cascade deletion in `backend/src/services/accountService.ts` for related transactions, lots, lotSales, and cashBalances before deleting the account document.
- Used chunked Firestore batches with a maximum of 499 delete operations per batch.

### C1: Chunked batches in rebuildDerivedState
- Refactored `backend/src/services/transactionService.ts` `rebuildDerivedState()` to:
  - load existing lots and lotSales with explicit user/account filters,
  - delete old derived docs in chunked batches of up to 499 operations,
  - queue new lot and lotSale writes in memory,
  - write derived docs back in chunked batches of up to 499 operations.

## Major fixes

### M1: CORS wildcard
- Changed `backend/src/config/env.ts` so `corsOrigin` is required through `required('CORS_ORIGIN', fallback)` instead of defaulting to `'*'`.
- Added a development-only fallback of `http://localhost:5173`.

### M4: Null safety in portfolioService
- Replaced non-null assertions on `securityMap.get()` and `accountMap.get()` in `backend/src/services/portfolioService.ts`.
- Added `console.warn(...)` and skipped orphaned holding groups when the related security or account is missing.

### M5: Exchange rate fallback
- Changed `backend/src/services/exchangeRateService.ts` `getLatestRateValue()` to throw an error when no exchange rate exists instead of returning `1`.

### m1: normalizeDate validation
- Added invalid-date validation in `backend/src/utils/date.ts`.
- `normalizeDate()` now throws `badRequest('Invalid date')` when the supplied date string cannot be parsed.

### m4: Hardcoded OR text
- Replaced hardcoded `OR` with `{t('auth.or')}` in `frontend/src/pages/LoginPage.tsx`.
- Added `auth.or` to `frontend/src/i18n/en.json` and `frontend/src/i18n/he.json`.

## Verification
- Backend compile check passed: `cd /home/user/workspace/FolioFollow/backend && npx tsc --noEmit`
- Frontend compile check passed: `cd /home/user/workspace/FolioFollow/frontend && npx tsc -b`
