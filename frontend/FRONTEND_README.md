# FolioFollow Frontend

## Quick Start
```bash
cd frontend
npm install
npm run dev
```

## Build
```bash
npm run build
```
Output goes to `dist/` — deployable as static files.

## Architecture
- **React 19 + TypeScript** via Vite
- **Ant Design** — UI component library with full dark theme customization
- **Recharts** — Charts and data visualization
- **react-router-dom** — Client-side routing
- **i18next** — Internationalization (Hebrew RTL / English LTR)
- **dayjs** — Date handling

## Project Structure
```
src/
  components/     — Reusable UI components
    KpiCard.tsx         — Metric card with value + change indicator
    PnlBadge.tsx        — Green/red profit/loss badge
    CurrencyDisplay.tsx — Formatted currency display (₪ / $)
    LanguageToggle.tsx  — HE/EN language switcher
    Layout.tsx          — Main app layout (sidebar + navbar + footer)
    ProtectedRoute.tsx  — Auth guard wrapper
    TransactionForm.tsx — Add transaction modal form
  pages/
    LoginPage.tsx       — Login with Google / Demo mode
    DashboardPage.tsx   — KPI cards + Holdings table with expandable lots
    TransactionsPage.tsx — Full transaction history with filters
    AnalyticsPage.tsx   — Charts: portfolio value, benchmark, allocation, P&L
    AdminPage.tsx       — Securities, exchange rates, users management
  services/
    api.ts              — API service (returns mock data, swappable to real API)
    mockData.ts         — Realistic mock data (3 accounts, 10 securities, 20 txns)
  store/
    AuthContext.tsx      — Authentication context (Firebase-ready)
  i18n/
    he.json             — Hebrew translations
    en.json             — English translations
    index.ts            — i18n configuration
  styles/
    global.css          — Global styles, dark theme variables
  utils/
    format.ts           — Number, currency, date formatting utilities
```

## Design System
- Dark mode only (finance-oriented)
- Background: `#0d1117`, Surface: `#161b22`, Elevated: `#1c2128`
- Green (`#2ea043`) for profit, Red (`#f85149`) for loss
- Blue (`#1f6feb`) for links/actions
- Inter font family

## Mock Data
Realistic Israeli investor portfolio:
- 3 accounts: IBI SPARK (TASE), IBI SMART (US), קופת גמל להשקעה
- 10 securities: TEVA, NICE, LUMI, SPY, AAPL, MSFT, NVDA, VOO, SGOV, TA35
- 20 transactions across accounts
- Multiple lots per security
- Total portfolio ~₪251,000

## Swapping to Real API
Replace imports in `services/api.ts` from mock data to real axios calls.
The interface stays the same — all pages use the api service layer.
