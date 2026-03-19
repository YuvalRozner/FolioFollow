# API Reference

## Overview

FolioFollow exposes a RESTful JSON API. All endpoints require authentication via Firebase JWT token in the `Authorization` header (except public health check).

**Base URL:** `https://api.foliofollow.app/v1` (production)

**Authentication:** `Authorization: Bearer <firebase-jwt-token>`

---

## Conventions

- All responses are JSON
- Dates are ISO 8601 format (`2026-03-19`)
- Timestamps are ISO 8601 with timezone (`2026-03-19T10:30:00Z`)
- Pagination: `?page=1&limit=20` (default limit: 50, max: 100)
- Sorting: `?sort=date&order=desc`
- Filtering: `?accountId=xxx&currency=USD`
- All monetary values are numbers (not strings)
- Error responses follow the format: `{ "error": { "code": "...", "message": "..." } }`

---

## Endpoints

### Auth

| Method | Endpoint         | Description            | Auth    |
|--------|------------------|------------------------|---------|
| GET    | `/auth/me`       | Get current user info  | Required|
| PUT    | `/auth/me`       | Update user profile    | Required|

---

### Accounts

| Method | Endpoint              | Description              | Auth    |
|--------|-----------------------|--------------------------|---------|
| GET    | `/accounts`           | List user's accounts     | Required|
| POST   | `/accounts`           | Create new account       | Required|
| GET    | `/accounts/:id`       | Get account details      | Required|
| PUT    | `/accounts/:id`       | Update account           | Required|
| DELETE | `/accounts/:id`       | Delete account           | Required|

---

### Securities (Shared)

| Method | Endpoint                  | Description                  | Auth    |
|--------|---------------------------|------------------------------|---------|
| GET    | `/securities`             | List all securities          | Required|
| GET    | `/securities/:id`         | Get security details         | Required|
| POST   | `/securities`             | Add new security             | Admin   |
| PUT    | `/securities/:id`         | Update security              | Admin   |
| PUT    | `/securities/:id/price`   | Update current price         | Admin   |
| POST   | `/securities/prices/bulk` | Bulk update prices           | Admin   |

---

### Transactions

| Method | Endpoint                | Description                | Auth    |
|--------|-------------------------|----------------------------|---------|
| GET    | `/transactions`         | List user's transactions   | Required|
| POST   | `/transactions`         | Create new transaction     | Required|
| GET    | `/transactions/:id`     | Get transaction details    | Required|
| PUT    | `/transactions/:id`     | Update transaction         | Required|
| DELETE | `/transactions/:id`     | Delete transaction         | Required|

**Query params for GET `/transactions`:**
- `accountId` — Filter by account
- `securityId` — Filter by security
- `type` — Filter by type (`buy`, `sell`, `deposit`, `withdraw`)
- `currency` — Filter by currency (`ILS`, `USD`)
- `purpose` — Filter by purpose tag
- `dateFrom` / `dateTo` — Date range
- `sort` / `order` — Sorting
- `page` / `limit` — Pagination

---

### Lots

| Method | Endpoint                     | Description                | Auth    |
|--------|------------------------------|----------------------------|---------|
| GET    | `/lots`                      | List user's lots           | Required|
| GET    | `/lots/:id`                  | Get lot details + P&L      | Required|
| GET    | `/lots/by-security/:secId`   | Get lots for a security    | Required|

---

### Portfolio

| Method | Endpoint                          | Description                        | Auth    |
|--------|-----------------------------------|------------------------------------|---------|
| GET    | `/portfolio/summary`              | Portfolio-level summary            | Required|
| GET    | `/portfolio/holdings`             | Current holdings with P&L          | Required|
| GET    | `/portfolio/returns`              | Return calculations                | Required|
| GET    | `/portfolio/benchmark`            | Benchmark comparison (S&P, TA-35)  | Required|
| GET    | `/portfolio/history`              | Portfolio value over time          | Required|

**Query params:**
- `accountId` — Filter by account (omit for all accounts combined)
- `currency` — Display currency (`ILS`, `USD`)
- `dateFrom` / `dateTo` — Date range for history

---

### Cash

| Method | Endpoint                  | Description                | Auth    |
|--------|---------------------------|----------------------------|---------|
| GET    | `/cash/balances`          | Get all cash balances      | Required|
| GET    | `/cash/history`           | Cash movement history      | Required|

---

### Exchange Rates

| Method | Endpoint                  | Description                | Auth    |
|--------|---------------------------|----------------------------|---------|
| GET    | `/exchange-rates`         | Get exchange rate history  | Required|
| GET    | `/exchange-rates/latest`  | Get latest rate            | Required|
| POST   | `/exchange-rates`         | Set exchange rate          | Admin   |

---

### Admin

| Method | Endpoint                  | Description                | Auth    |
|--------|---------------------------|----------------------------|---------|
| GET    | `/admin/users`            | List all users             | Admin   |
| PUT    | `/admin/users/:id/role`   | Change user role           | Admin   |

---

## Response Examples

### GET /portfolio/summary

```json
{
  "totalValueILS": 150000,
  "totalValueUSD": 41200,
  "totalReturnPercent": 12.5,
  "totalReturnILS": 16700,
  "realizedPnlILS": 5200,
  "unrealizedPnlILS": 11500,
  "cashBalanceILS": 3000,
  "cashBalanceUSD": 500,
  "todayChangePercent": 0.8,
  "todayChangeILS": 1200,
  "accounts": [
    {
      "accountId": "acc_1",
      "name": "IBI SPARK",
      "valueILS": 80000,
      "returnPercent": 15.2
    }
  ]
}
```

### GET /lots/by-security/:secId

```json
{
  "securityId": "sec_spy",
  "symbol": "SPY",
  "currentPrice": 520.50,
  "weightedAvgCost": 485.30,
  "totalReturnPercent": 7.25,
  "lots": [
    {
      "id": "lot_1",
      "date": "2025-06-15",
      "quantityBought": 10,
      "quantityRemaining": 10,
      "costPerUnit": 470.00,
      "currentValue": 5205.00,
      "returnPercent": 10.74,
      "unrealizedPnl": 505.00,
      "status": "open"
    },
    {
      "id": "lot_2",
      "date": "2025-11-20",
      "quantityBought": 5,
      "quantityRemaining": 5,
      "costPerUnit": 510.00,
      "currentValue": 2602.50,
      "returnPercent": 2.06,
      "unrealizedPnl": 52.50,
      "status": "open"
    }
  ]
}
```

---

## Error Codes

| Code | HTTP Status | Description                    |
|------|-------------|--------------------------------|
| `AUTH_REQUIRED`     | 401 | Missing or invalid JWT token |
| `FORBIDDEN`         | 403 | Insufficient permissions     |
| `NOT_FOUND`         | 404 | Resource not found           |
| `VALIDATION_ERROR`  | 400 | Invalid request data         |
| `DUPLICATE`         | 409 | Resource already exists      |
| `INTERNAL_ERROR`    | 500 | Server error                 |

---

## Rate Limiting

- 100 requests per minute per user
- Admin endpoints: 30 requests per minute

---

*This document will be expanded with full OpenAPI/Swagger spec as the API is implemented.*
