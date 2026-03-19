# Codebase Overview

> This document is designed to help AI agents and new developers quickly understand the FolioFollow project structure and make effective contributions.

---

## What is FolioFollow?

A portfolio tracking web application for Israeli investors. Users can track their investments across multiple brokerage accounts, with lot-level P&L tracking, multi-currency support (ILS/USD), and benchmark comparison.

---

## Project Structure

```
FolioFollow/
├── backend/              # REST API server (Node.js/TypeScript)
│   ├── src/              # Source code
│   │   ├── routes/       # Express route handlers
│   │   ├── services/     # Business logic layer
│   │   ├── models/       # Data access layer
│   │   ├── middleware/    # Auth, validation, error handling
│   │   ├── utils/        # Shared utilities
│   │   └── config/       # Configuration and environment
│   └── tests/            # Tests (mirrors src/ structure)
│
├── frontend/             # React web app (TypeScript)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page-level components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API client calls
│   │   ├── store/        # State management
│   │   ├── i18n/         # Internationalization (he/en)
│   │   ├── styles/       # Global styles, theme
│   │   └── utils/        # Frontend utilities
│   └── public/           # Static assets
│
├── shared/               # Shared between backend and frontend
│   ├── types/            # TypeScript interfaces
│   └── constants/        # Enums, config values
│
├── docs/                 # Documentation
│   ├── architecture/     # System design docs
│   ├── models/           # Data model docs
│   ├── api/              # API endpoint docs
│   └── guides/           # Developer setup guides
│
└── README.md             # Project overview
```

---

## Key Concepts

### Lot Tracking
Every buy transaction creates a **Lot** — a record of that specific purchase with its price, quantity, and date. When the user sells, the system allocates the sale to specific lots via **LotSale** records. This enables per-purchase return tracking.

### Multi-Currency
Transactions can be in ILS or USD. Exchange rates are recorded per transaction. All P&L can be calculated in either currency.

### Accounts
Users can have multiple accounts (e.g., "IBI SPARK" for TASE, "IBI SMART" for US). Each account holds its own transactions, lots, and cash balances.

### Roles
- **User:** Can manage their own transactions and view their portfolio
- **Admin:** Can also update shared market data (security prices, exchange rates)

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| API-First | Future Android/iOS clients use the same backend |
| All logic in backend | Consistent calculations across all clients |
| Firebase Auth | Secure JWT-based auth, works on all platforms |
| Shared types | TypeScript interfaces used by both backend and frontend for type safety |

---

## How to Make Changes

1. **New API endpoint:** Add route in `backend/src/routes/`, service in `backend/src/services/`, update `docs/api/API_REFERENCE.md`
2. **New UI page:** Add page component in `frontend/src/pages/`, add route, call API via `frontend/src/services/`
3. **New data model:** Define type in `shared/types/`, add model in `backend/src/models/`, update `docs/models/DATA_MODELS.md`
4. **Business logic change:** Always in `backend/src/services/` — never in frontend

---

## Important Files

| File | Purpose |
|------|---------|
| `docs/architecture/ARCHITECTURE.md` | System design and data flow |
| `docs/models/DATA_MODELS.md` | All entity schemas |
| `docs/api/API_REFERENCE.md` | Full API endpoint documentation |
| `shared/types/` | TypeScript interfaces (source of truth for data shapes) |
| `backend/src/services/returnsCalculator` | Core P&L calculation logic |
