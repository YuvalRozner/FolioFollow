# Data Models

## Overview

This document describes the core data entities in FolioFollow. All models include standard audit fields (`createdAt`, `updatedAt`).

---

## User

Represents a registered user. Synced from Firebase Auth.

| Field       | Type     | Description                          |
|-------------|----------|--------------------------------------|
| id          | string   | Firebase Auth UID                    |
| email       | string   | User email (from Google)             |
| displayName | string   | Display name (from Google)           |
| photoURL    | string?  | Profile photo URL                    |
| role        | enum     | `user` \| `admin`                    |
| language    | enum     | `he` \| `en` — preferred language    |
| createdAt   | timestamp| Registration date                    |
| updatedAt   | timestamp| Last profile update                  |

---

## Account

A brokerage/investment account belonging to a user.

| Field       | Type     | Description                          |
|-------------|----------|--------------------------------------|
| id          | string   | Auto-generated ID                    |
| userId      | string   | FK → User.id                         |
| name        | string   | Account name (e.g., "IBI SPARK")     |
| institution | string   | Brokerage/institution name           |
| type        | enum     | `brokerage` \| `pension` \| `other`  |
| currency    | enum     | Primary currency: `ILS` \| `USD`     |
| notes       | string?  | Optional notes                       |
| createdAt   | timestamp|                                      |
| updatedAt   | timestamp|                                      |

---

## Security

A financial instrument (stock, ETF, mutual fund, etc.). Shared across all users.

| Field        | Type     | Description                          |
|--------------|----------|--------------------------------------|
| id           | string   | Auto-generated ID                    |
| symbol       | string   | Ticker symbol (e.g., "SPY", "TEVA")  |
| name         | string   | Official name                        |
| type         | enum     | `stock` \| `etf` \| `mutual_fund` \| `bond` \| `money_market` \| `other` |
| exchange     | enum     | `TASE` \| `NYSE` \| `NASDAQ` \| `other` |
| currency     | enum     | `ILS` \| `USD`                       |
| currentPrice | number?  | Latest known price (updated by admin)|
| priceUpdatedAt| timestamp?| When the price was last updated    |
| createdAt    | timestamp|                                      |
| updatedAt    | timestamp|                                      |

---

## Transaction

A single trade or cash movement.

| Field        | Type     | Description                          |
|--------------|----------|--------------------------------------|
| id           | string   | Auto-generated ID                    |
| userId       | string   | FK → User.id                         |
| accountId    | string   | FK → Account.id                      |
| securityId   | string?  | FK → Security.id (null for deposits/withdrawals) |
| type         | enum     | `buy` \| `sell` \| `deposit` \| `withdraw` |
| quantity     | number   | Number of units (for buy/sell)       |
| pricePerUnit | number   | Price per unit at execution          |
| totalAmount  | number   | Total transaction value              |
| currency     | enum     | `ILS` \| `USD`                       |
| exchangeRate | number?  | USD/ILS rate at time of transaction  |
| date         | date     | Execution date                       |
| nickname     | string?  | User's personal name for this holding|
| purpose      | string?  | Purpose tag (e.g., "for car")        |
| notes        | string?  | Free-text notes                      |
| createdAt    | timestamp|                                      |
| updatedAt    | timestamp|                                      |

---

## Lot

Represents a specific purchase lot for tracking individual trade performance.

| Field            | Type     | Description                          |
|------------------|----------|--------------------------------------|
| id               | string   | Auto-generated ID                    |
| userId           | string   | FK → User.id                         |
| accountId        | string   | FK → Account.id                      |
| securityId       | string   | FK → Security.id                     |
| buyTransactionId | string   | FK → Transaction.id (the buy)        |
| quantityBought   | number   | Original quantity purchased          |
| quantityRemaining| number   | Remaining quantity (after partial sells) |
| costPerUnit      | number   | Purchase price per unit              |
| costCurrency     | enum     | `ILS` \| `USD`                       |
| exchangeRateAtBuy| number?  | USD/ILS rate at purchase             |
| status           | enum     | `open` \| `closed` \| `partial`      |
| date             | date     | Purchase date                        |
| createdAt        | timestamp|                                      |
| updatedAt        | timestamp|                                      |

---

## LotSale

Links a sell transaction to the lots it drew from.

| Field            | Type     | Description                          |
|------------------|----------|--------------------------------------|
| id               | string   | Auto-generated ID                    |
| lotId            | string   | FK → Lot.id                          |
| sellTransactionId| string   | FK → Transaction.id (the sell)       |
| quantitySold     | number   | How many units from this lot         |
| salePricePerUnit | number   | Sell price per unit                  |
| saleCurrency     | enum     | `ILS` \| `USD`                       |
| exchangeRateAtSell| number? | USD/ILS rate at sale                 |
| realizedPnlILS   | number   | Profit/loss in ILS                   |
| realizedPnlUSD   | number?  | Profit/loss in USD                   |
| date             | date     | Sale date                            |
| createdAt        | timestamp|                                      |

---

## CashBalance

Tracks cash balances per account per currency.

| Field       | Type     | Description                          |
|-------------|----------|--------------------------------------|
| id          | string   | Auto-generated ID                    |
| userId      | string   | FK → User.id                         |
| accountId   | string   | FK → Account.id                      |
| currency    | enum     | `ILS` \| `USD`                       |
| balance     | number   | Current balance                      |
| updatedAt   | timestamp| Last balance update                  |

---

## ExchangeRate

Historical exchange rate records. Managed by admin.

| Field       | Type     | Description                          |
|-------------|----------|--------------------------------------|
| id          | string   | Auto-generated ID                    |
| date        | date     | Rate date                            |
| pair        | string   | Always `USD/ILS` for now             |
| rate        | number   | Exchange rate                        |
| source      | enum     | `manual` \| `api`                    |
| updatedBy   | string?  | Admin user ID (if manual)            |
| createdAt   | timestamp|                                      |

---

## Entity Relationship Diagram

```
User (1) ──── (N) Account
User (1) ──── (N) Transaction
User (1) ──── (N) Lot

Account (1) ──── (N) Transaction
Account (1) ──── (N) Lot
Account (1) ──── (N) CashBalance

Security (1) ──── (N) Transaction
Security (1) ──── (N) Lot

Transaction (1:buy) ──── (1) Lot
Transaction (1:sell) ──── (N) LotSale

Lot (1) ──── (N) LotSale
```

---

## Notes

- **Security** is a shared entity — not per-user. All users see the same securities and prices.
- **ExchangeRate** is also shared — admin updates it for everyone.
- **Lot** is always created from a buy transaction. Sell transactions create **LotSale** records.
- **CashBalance** is a running balance, updated on every deposit/withdraw/buy/sell.
