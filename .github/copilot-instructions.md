# Copilot instructions for FolioFollow

## Commands

There is no root workspace script. Run commands per package with `npm --prefix <package> ...`.

### Frontend (`frontend`)

- Dev server: `npm --prefix frontend run dev`
- Build: `npm --prefix frontend run build`
- Lint: `npm --prefix frontend run lint`

### Backend (`backend`)

- Dev server: `npm --prefix backend run dev`
- Build: `npm --prefix backend run build`
- Firebase Functions emulator: `npm --prefix backend run serve`

### Tests

- There is currently no automated test script in `frontend/package.json` or `backend/package.json`.
- `backend/tests/` exists but only contains `.gitkeep`, so there is no supported full-suite or single-test command yet.

## High-level architecture

- The repository is split into `frontend` (React + Vite + Ant Design + i18next), `backend` (Express + TypeScript on Firebase Functions), and `shared` (domain constants and types for the investment model).
- Production hosting is wired through `firebase.json`: static assets come from `frontend/dist`, and requests to `/api/v1/**` are rewritten to the `api` Cloud Function exported from `backend/src/functions.ts`.
- `backend/src/app.ts` exposes `GET /health` publicly, then mounts authenticated REST routes under `/api/v1` for auth, accounts, securities, exchange rates, transactions, lots, portfolio, cash, and admin operations.
- Firebase JWT validation happens in `backend/src/middleware/auth.ts`. Authenticated requests also call `userService.ensureUserProfile()`, so Firestore user documents are created and refreshed lazily as part of request handling.
- Firestore is not a client-side data source in this repo. `firestore.rules` denies all direct reads and writes, so application data is meant to flow through the backend API and Admin SDK only.
- Firestore collection entry points are centralized in `backend/src/services/baseService.ts`: `users`, `accounts`, `securities`, `exchangeRates`, `transactions`, `lots`, `lotSales`, and `cashBalances`.
- Transactions are the write-side source of truth. `backend/src/services/transactionService.ts` rebuilds derived `lots`, `lotSales`, and cash balances after every create/update/delete. `backend/src/services/portfolioService.ts` and `backend/src/services/returnsCalculator.ts` derive holdings and portfolio summaries from those collections plus current prices and FX rates.
- The frontend data layer is centralized in `frontend/src/services/httpClient.ts` and `frontend/src/services/api.ts`. Most pages import service helpers instead of calling `axios` directly.
- Auth bootstrapping lives in `frontend/src/store/AuthContext.tsx`: it wires Firebase Auth into the API client, fetches `/auth/me`, and can switch the app into demo mode.
- The route tree is defined in `frontend/src/App.tsx`: `/login` is public, `/`, `/transactions`, and `/analytics` render inside the protected layout, and `/admin` is additionally guarded by `ProtectedRoute requireAdmin`.
- Frontend boot happens in `frontend/src/main.tsx`, which sets `document.documentElement.dir = 'rtl'` and `lang = 'he'` before rendering React. Direction then stays in sync through i18next + Ant Design in `App.tsx`.
- Analytics is currently mixed-mode: `getHoldings()` and `getPortfolioSummary()` call the backend, but `getPortfolioHistory()` and `getBenchmarkData()` in `frontend/src/services/api.ts` still return mock data from `frontend/src/services/mockData.ts`.

## Key conventions

- Treat `package.json` files and current code as the source of truth for commands and runtime behavior. Some docs are stale; for example, `docs/guides/GETTING_STARTED.md` still says `npm start` for the frontend, but the actual script is `npm run dev`.
- Keep investment-domain models synchronized across three surfaces:
  - `shared/types/index.ts` and `shared/constants/index.ts`
  - `backend/src/shared/types.ts` and `backend/src/shared/constants.ts` for standalone/serverless backend builds
  - `frontend/types.ts`, which mirrors the model with string literal types instead of enums
- Preserve the API envelope pattern. Successful responses are wrapped as `{ data: ... }`; paginated transaction responses add `pagination`; errors flow through `AppError` and `errorHandler` as `{ error: { code, message } }`.
- Follow the established backend route structure in `backend/src/routes/*`: define `express-validator` checks in the route file, then `validate`, then `asyncHandler`, and keep business logic in services.
- Keep calculations on the backend. Lot matching, realized/unrealized P&L, FX conversion, and cash-balance updates are already handled in backend services and should not be reimplemented in React components.
- Keep new frontend data access inside `frontend/src/services/api.ts` and `frontend/src/services/httpClient.ts`. The existing exception is the auth bootstrap fetch in `AuthContext.tsx`; new feature work should generally not add ad hoc `fetch` or `axios` calls in pages.
- Default UX assumptions are project-specific: dark mode is the default theme, Hebrew (`he`) is the default language, and layout direction switches between RTL and LTR via i18next and Ant Design configuration in `frontend/src/App.tsx`.
- Reuse existing finance constants instead of hardcoding duplicates. Important examples live in `shared/constants/index.ts`, including default accounts (`IBI SPARK`, `IBI SMART`, `קופת גמל להשקעה`), benchmarks (`SP500`, `TA35`), and the default currency pair `USD/ILS`.
- User provisioning is implicit: the first authenticated user becomes admin in `backend/src/services/userService.ts`. Changes to auth flow or seed behavior can change who gets admin access.
- Local environment wiring assumes the frontend talks to `http://localhost:8080/api/v1` unless `VITE_API_URL` is overridden, and the backend default prefix is `/api/v1`. Keep new endpoints and local tooling aligned with that path instead of inventing alternate prefixes.
- `deploy.sh` only builds the frontend and deploys Firebase Hosting. Backend/API deployment is wired through Firebase Functions configuration in `firebase.json`, so changes that affect the API need the hosting + functions path, not just the shell script.
- Product-planning docs for future sessions live in `docs/product/PRD.md` and `docs/product/ROADMAP.md`. Use the PRD for intended scope and requirements, and use the roadmap for delivery status and next phases. When you make roadmap-level progress, update the roadmap's `Status snapshot` and `Progress log`.
