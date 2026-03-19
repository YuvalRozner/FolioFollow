# Architecture Overview

## Design Principles

### API-First
The backend is a standalone REST API server. Every feature is exposed as an API endpoint first. The React web app is just one consumer — future Android/iOS clients will use the same API without any backend changes.

### Separation of Concerns
- **Backend** — All business logic, calculations, data validation, and authorization
- **Frontend** — Presentation only. No business logic. Calls the API for everything.
- **Shared** — TypeScript types and constants used by both backend and frontend

### Security First
- Firebase Auth with JWT tokens for all API calls
- Row-level security — users can only access their own data
- Admin role for market data management
- All financial data encrypted in transit (HTTPS) and at rest

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Clients                            │
│                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  │  React   │    │ Android  │    │   iOS    │          │
│  │  Web App │    │  (Future) │    │ (Future) │          │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘          │
│       │               │               │                 │
└───────┼───────────────┼───────────────┼─────────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │ HTTPS + JWT
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend API                          │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Auth         │  │ Transactions │  │ Market Data  │  │
│  │ Middleware   │  │ Service      │  │ Service      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Portfolio    │  │ Returns      │  │ Cash         │  │
│  │ Service      │  │ Calculator   │  │ Service      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │  Firestore / │  │  Firebase    │                     │
│  │  Cloud SQL   │  │  Auth        │                     │
│  └──────────────┘  └──────────────┘                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Backend Services

### Auth Middleware
- Validates Firebase JWT tokens on every request
- Extracts user ID and role (user/admin)
- Enforces row-level data access

### Transactions Service
- CRUD operations for buy/sell/deposit/withdrawal transactions
- Validates transaction data (amounts, dates, currencies)
- Links transactions to lots

### Portfolio Service
- Manages user accounts (IBI SPARK, IBI SMART, Kupat Gemel, etc.)
- Aggregates holdings across accounts
- Supports filtering by account, security, purpose tag

### Returns Calculator
- **Lot-level:** % return since purchase, absolute P&L (ILS + USD)
- **Security-level:** Weighted average cost, total return, realized/unrealized P&L
- **Portfolio-level:** Total return, total realized/unrealized P&L, benchmark comparison
- All calculations happen server-side — never in the frontend

### Market Data Service
- Admin-only endpoints to update current prices and exchange rates
- Shared across all users (market prices are global)
- Future: auto-fetch from external APIs

### Cash Service
- Tracks ILS and USD cash balances per account
- Records deposit/withdrawal history
- Calculates available cash

---

## Authentication Flow

```
Client                    Firebase Auth              Backend API
  │                           │                          │
  │── Sign in with Google ───▶│                          │
  │◀── JWT Token ────────────│                          │
  │                           │                          │
  │── API Request + JWT ─────────────────────────────────▶│
  │                           │     Verify JWT ◀─────────│
  │                           │─────────────────────────▶│
  │◀── Response ─────────────────────────────────────────│
```

---

## Data Flow: Adding a Transaction

```
1. User fills form in frontend
2. Frontend sends POST /api/transactions with JWT
3. Backend validates JWT → extracts userId
4. Backend validates transaction data
5. Backend creates new lot (for buy) or assigns to existing lots (for sell)
6. Backend updates cash balances
7. Backend recalculates portfolio metrics
8. Backend returns updated data
9. Frontend displays updated portfolio
```

---

## Deployment Strategy

- **Frontend:** Firebase Hosting (static files, CDN)
- **Backend:** Firebase Cloud Functions or Cloud Run
- **Database:** Firestore (NoSQL) or Cloud SQL (PostgreSQL)
- **Environments:** Production (main branch) and Development (development branch)

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API-First | REST API | Enables future mobile clients without backend changes |
| Auth | Firebase Auth (Google) | Built-in security, easy Google Sign-In, JWT tokens work across platforms |
| Hosting | Google Cloud | User preference, integrated ecosystem, good security defaults |
| Business logic location | Backend only | Consistent calculations regardless of client, easier to maintain |
| Market data | Shared across users | Prices are universal; only admin updates them |
