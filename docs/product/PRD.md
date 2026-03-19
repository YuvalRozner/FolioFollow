# FolioFollow Product Requirements Document

> Imported from `FolioFollow_PRD.docx` and converted to repository-native markdown for future agent use.
> Source version: 1.0 (March 2026).

## How to use this document

- Use this as the canonical product-scope reference for goals, personas, functional requirements, non-functional requirements, and planned capabilities.
- When the PRD and the running code differ, treat the codebase as the source of truth for current implementation status and use the PRD for intent and product direction.

# 1. Executive Summary

FolioFollow is a personal investment portfolio tracking web application purpose-built for Israeli investors who hold securities on both the Tel Aviv Stock Exchange (TASE) and US exchanges (NYSE, NASDAQ). The application addresses the unique challenges faced by Israeli investors managing multi-exchange, multi-currency portfolios.

The platform delivers dual-currency portfolio management in Israeli New Shekel (ILS) and US Dollar (USD), featuring lot-level tracking, realized and unrealized profit & loss (P&L) calculations, FIFO-based sell allocation, and multi-account support. Users can manage brokerage accounts, pension funds, and other investment vehicles from a single, unified dashboard.

FolioFollow features a modern dark-mode interface inspired by GitHub's design language, with full bilingual support for Hebrew (right-to-left) and English (left-to-right). The application is built on a robust API-first architecture using Firebase services, enabling future mobile app expansion.

Core value propositions include:

- Unified view of TASE and US exchange holdings with automatic ILS/USD conversion

- Lot-level cost basis tracking with automatic FIFO sell allocation

- Real-time unrealized and realized P&L calculations across all accounts

- Multi-account management (brokerage, pension, other investment accounts)

- Comprehensive bilingual interface (Hebrew RTL / English LTR)

- Getting Started onboarding wizard and Demo Mode for seamless user experience

# 2. Product Vision & Goals

## 2.1 Vision Statement

To become the go-to personal investment portfolio tracker for Israeli investors, providing institutional-grade portfolio analytics with consumer-friendly simplicity — enabling every Israeli investor to understand their true portfolio performance across exchanges and currencies.

## 2.2 Key Objectives

- Deliver a reliable, intuitive portfolio tracking solution for Israeli retail investors managing dual-exchange portfolios.

- Provide accurate lot-level cost basis tracking and P&L calculations in both ILS and USD.

- Support full bilingual operation (Hebrew RTL / English LTR) with a premium dark-mode design.

- Establish an API-first architecture enabling future mobile apps and third-party integrations.

- Maintain simplicity for individual investors while building toward advisor-level features.

## 2.3 Target Users

The primary target audience is Israeli individual investors who hold securities on both TASE and US exchanges. These users currently lack a unified tool that handles the complexity of multi-currency, multi-exchange portfolio tracking with proper lot-level accounting and ILS/USD conversion.

## 2.4 Success Metrics

| Metric | Target | Measurement |
| --- | --- | --- |
| Monthly Active Users (MAU) | 500+ within 6 months of launch | Firebase Analytics |
| User Retention (30-day) | >60% | Cohort analysis |
| Portfolio Data Accuracy | 100% P&L calculation correctness | Automated test suite |
| Page Load Time | <2 seconds (p95) | Firebase Performance Monitoring |
| Onboarding Completion | >75% complete Getting Started wizard | Event tracking |
| Demo-to-Signup Conversion | >20% | Funnel analytics |

# 3. User Personas

## 3.1 Primary Persona — Yoni, the Multi-Exchange Investor

| Attribute | Details |
| --- | --- |
| Age | 32 |
| Location | Tel Aviv, Israel |
| Occupation | Software engineer at a mid-size tech company |
| Investment Experience | 5 years of active investing |
| Portfolio Size | ₪350,000 across 3 accounts |
| Accounts | IBI brokerage (TASE), Interactive Brokers (US), Altshuler Shaham pension |
| Holdings | 15 TASE stocks/ETFs, 8 US stocks, 2 US ETFs |

Pain Points:

- No single tool shows his entire portfolio with accurate cost basis across TASE and US exchanges

- Manually tracking lots and calculating realized/unrealized P&L in spreadsheets is error-prone and time-consuming

- Converting between ILS and USD for performance calculation requires checking exchange rates manually

- Existing portfolio trackers are either US-only or lack lot-level tracking

Goals:

- See total portfolio value in ILS at a glance, with breakdowns by account and security

- Understand true cost basis per lot and per security, including currency conversion effects

- Track realized gains for tax planning purposes

- Minimal data entry — quick transaction logging with automatic lot creation

## 3.2 Secondary Persona — Sarah, the Financial Advisor (Future)

| Attribute | Details |
| --- | --- |
| Age | 45 |
| Location | Herzliya, Israel |
| Occupation | Independent financial advisor, IFA certified |
| Clients | 25 individual clients with diverse portfolios |
| Primary Need | Consolidated view of client portfolios for advisory sessions |

Pain Points:

- Switching between multiple platforms to review different client holdings

- No consolidated reporting across TASE + US for client meetings

- Manual P&L calculations for tax advisory

Goals:

- Multi-client portfolio management from a single dashboard

- Generate portfolio reports for client advisory sessions

- Track performance attribution and benchmark comparison

Note: Multi-client advisor features are planned for a future release. The current MVP focuses on individual investor functionality.

# 4. Functional Requirements

This section details all functional requirements for FolioFollow. Each requirement is assigned a unique identifier for traceability.

## 4.1 Authentication

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-001 | System shall support Google Sign-In via Firebase Authentication as the primary authentication method. | Must |
| FR-002 | System shall provide a Demo Mode that allows users to explore the full application with mock data without authentication. | Must |
| FR-003 | On first login, the system shall automatically create a user profile with default role 'user' and detect browser language preference. | Must |
| FR-004 | The first user to register shall automatically receive the 'admin' role. | Must |
| FR-005 | All API endpoints shall require a valid Firebase Auth Bearer token (except demo mode). | Must |
| FR-006 | System shall support GET /auth/me to retrieve the current user profile. | Must |
| FR-007 | System shall support PUT /auth/language to update the user's language preference (he/en). | Must |

## 4.2 Account Management

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-010 | Users shall be able to create investment accounts with name, institution, type, currency, and optional notes. | Must |
| FR-011 | Account types shall include: Brokerage, Pension, and Other. | Must |
| FR-012 | Each account shall be associated with a primary currency (ILS or USD). | Must |
| FR-013 | Users shall be able to view, update, and delete their accounts. | Must |
| FR-014 | Deleting an account shall cascade-delete all associated transactions, lots, lot sales, and cash balances. | Must |
| FR-015 | Users shall only see and manage their own accounts (enforced server-side via userId filtering). | Must |
| FR-016 | Admin users shall manage all accounts through the Admin panel. | Should |

## 4.3 Securities Management

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-020 | Securities shall be maintained as a global catalog accessible to all users. | Must |
| FR-021 | Each security shall have: symbol, name, type, exchange, currency, currentPrice, and priceUpdatedAt. | Must |
| FR-022 | Security types shall include: Stock, ETF, Mutual Fund, Bond, Money Market, and Other. | Must |
| FR-023 | Supported exchanges shall include: TASE, NYSE, NASDAQ, and Other. | Must |
| FR-024 | Only admin users shall be able to create, update, or delete securities. | Must |
| FR-025 | Admin users shall be able to update individual security prices via PUT /securities/:id/price. | Must |
| FR-026 | Admin users shall be able to perform bulk price updates via POST /securities/prices/bulk. | Must |
| FR-027 | All users shall be able to read/list securities. | Must |

## 4.4 Transaction Management

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-030 | Users shall be able to create transactions of types: Buy, Sell, Deposit, and Withdraw. | Must |
| FR-031 | Buy transactions shall require: accountId, securityId, quantity, pricePerUnit, date, and optional exchangeRate. | Must |
| FR-032 | Sell transactions shall require the same fields as Buy and shall automatically consume lots using FIFO order. | Must |
| FR-033 | Deposit and Withdraw transactions shall require: accountId, totalAmount, currency, and date. | Must |
| FR-034 | Creating a Buy transaction shall automatically create a new lot record. | Must |
| FR-035 | Creating a Sell transaction shall automatically consume open lots in FIFO order, creating lotSale records. | Must |
| FR-036 | All transactions shall automatically adjust the corresponding cash balance for the account and currency. | Must |
| FR-037 | Transactions shall support filtering by accountId, type, securityId, currency, date range, and pagination. | Must |
| FR-038 | Deleting a transaction shall reverse all associated lot and cash balance effects. | Must |
| FR-039 | Transactions may include optional nickname, purpose, and notes fields for categorization. | Should |

## 4.5 Portfolio Dashboard

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-040 | Dashboard shall display 6 KPI cards: Total Value, Total Return, Daily Change, Unrealized P&L, Realized P&L, and Cash Balance. | Must |
| FR-041 | Dashboard shall display a holdings table showing each security with current value, cost basis, unrealized P&L, weight, and lot count. | Must |
| FR-042 | Holdings table rows shall be expandable to show individual lot details (quantity, cost per unit, current value, unrealized P&L, status). | Must |
| FR-043 | Dashboard shall support filtering by account and by purpose/nickname. | Must |
| FR-044 | Dashboard shall display a Getting Started onboarding wizard for new users who have not yet created accounts or transactions. | Must |
| FR-045 | All monetary values shall be displayed with appropriate currency formatting (₪ for ILS, $ for USD). | Must |
| FR-046 | KPI cards shall show values in the user's preferred display currency with conversion using the latest exchange rate. | Should |

## 4.6 Analytics

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-050 | Analytics page shall display a portfolio value over time area chart. | Must |
| FR-051 | Analytics page shall display a benchmark comparison line chart. | Should |
| FR-052 | Analytics page shall display allocation by security pie chart. | Must |
| FR-053 | Analytics page shall display account breakdown pie chart. | Must |
| FR-054 | Analytics page shall display purpose breakdown bar chart. | Must |
| FR-055 | Analytics page shall display P&L by security bar chart. | Must |
| FR-056 | Charts shall be interactive with tooltips and responsive to screen size. | Must |

## 4.7 Lot Tracking

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-060 | System shall automatically create a lot record when a Buy transaction is created. | Must |
| FR-061 | Each lot shall track: quantityBought, quantityRemaining, costPerUnit, costCurrency, exchangeRateAtBuy, status, and date. | Must |
| FR-062 | Lot status shall be one of: Open (fully unsold), Partial (partially sold), or Closed (fully sold). | Must |
| FR-063 | When a Sell transaction is created, the system shall consume lots in FIFO (First-In, First-Out) order. | Must |
| FR-064 | Each lot consumption shall create a lotSale record capturing: quantitySold, salePricePerUnit, and realizedPnlILS/USD. | Must |
| FR-065 | Users shall be able to view lots filtered by account, security, or status. | Must |
| FR-066 | Lot details shall be viewable in the expandable holdings table on the Dashboard. | Must |

## 4.8 Cash Management

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-070 | System shall maintain cash balances per account per currency. | Must |
| FR-071 | Cash balances shall be automatically adjusted when transactions are created: deposits add, withdrawals subtract, buys subtract, sells add. | Must |
| FR-072 | Users shall be able to view current cash balances with optional account filter. | Must |
| FR-073 | Users shall be able to view cash transaction history. | Must |
| FR-074 | Cash balances shall be included in portfolio total value calculations. | Must |

## 4.9 Exchange Rate Management

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-080 | System shall store USD/ILS exchange rates with date, rate, and source. | Must |
| FR-081 | Admin users shall be able to manually add exchange rates. | Must |
| FR-082 | System shall provide the latest available exchange rate for currency conversions. | Must |
| FR-083 | Exchange rates shall support filtering by date range. | Must |
| FR-084 | Exchange rate source shall be recorded as 'manual' or 'api' for future automation. | Must |

## 4.10 User & Admin Management

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-090 | System shall support two roles: 'admin' and 'user'. | Must |
| FR-091 | Admin users shall have access to the Admin panel with tabs: Accounts, Securities, Exchange Rates, and Users. | Must |
| FR-092 | Admin users shall be able to view all registered users. | Must |
| FR-093 | Admin users shall be able to change a user's role between 'admin' and 'user'. | Must |
| FR-094 | Role-based access control shall be enforced server-side on all protected endpoints. | Must |

## 4.11 Internationalization

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-100 | Application shall support two languages: Hebrew and English. | Must |
| FR-101 | Hebrew mode shall render the entire UI in right-to-left (RTL) layout. | Must |
| FR-102 | English mode shall render the entire UI in left-to-right (LTR) layout. | Must |
| FR-103 | Language switching shall be available from the application header without page reload. | Must |
| FR-104 | User language preference shall be persisted server-side and applied on subsequent logins. | Must |
| FR-105 | All UI text, labels, messages, and placeholders shall be translatable via i18next. | Must |

## 4.12 Onboarding

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-110 | New users shall see a Getting Started wizard on the Dashboard when they have no accounts or transactions. | Must |
| FR-111 | The wizard shall guide users through: creating an account, adding an exchange rate, adding a security (admin), and logging their first transaction. | Must |
| FR-112 | Each wizard step shall track completion status and show progress indicators. | Must |
| FR-113 | Demo Mode shall provide a complete app experience with pre-populated mock data. | Must |

# 5. Non-Functional Requirements

## 5.1 Performance

- API response time: <500ms for standard CRUD operations (p95)

- Dashboard load time: <2 seconds including portfolio calculations (p95)

- Frontend bundle size: optimized via Vite tree-shaking and code splitting

- Support up to 1,000 concurrent users without degradation

- Firestore read operations optimized with composite indexes for all common query patterns

## 5.2 Security

- All API access requires valid Firebase Authentication Bearer token

- Firestore security rules set to deny-all — no direct client-to-database access

- All data access routed through server-side API using Firebase Admin SDK

- Role-based access control enforced server-side (admin endpoints validate user role)

- HTTPS enforced on all connections via Firebase Hosting CDN

- User data isolation: users can only access their own accounts, transactions, lots, and cash balances

- Request logging with correlation IDs for audit trail

## 5.3 Scalability

- Firebase Cloud Functions v2 (Gen 2) with automatic scaling based on request volume

- Cloud Firestore with automatic horizontal scaling — no capacity planning required

- Firebase Hosting with global CDN for static asset delivery

- API-first architecture enables future mobile apps (Android/iOS) without backend changes

- Stateless API design supports horizontal scaling of function instances

## 5.4 Accessibility

- WCAG 2.1 Level AA compliance targeted for all interactive elements

- Keyboard navigation support throughout the application

- Proper ARIA labels on interactive components

- Sufficient color contrast ratios in dark mode design

- Screen reader compatible table structures

## 5.5 Browser Support

| Browser | Minimum Version | Support Level |
| --- | --- | --- |
| Google Chrome | 100+ | Full support |
| Mozilla Firefox | 100+ | Full support |
| Microsoft Edge | 100+ | Full support |
| Safari | 15+ | Full support |
| Mobile Chrome (Android) | 100+ | Responsive support |
| Mobile Safari (iOS) | 15+ | Responsive support |

## 5.6 Localization

- Full Hebrew (RTL) and English (LTR) support with i18next framework

- All date formatting respects locale (DD/MM/YYYY for Hebrew, MM/DD/YYYY for English)

- Number formatting with locale-appropriate thousand separators and decimal points

- Currency formatting: ₪ prefix for ILS, $ prefix for USD

- Ant Design 6 locale providers for component-level localization

# 6. Technical Architecture

## 6.1 System Overview

FolioFollow follows a three-tier architecture with a React single-page application frontend, a Node.js/Express RESTful API backend deployed as a Firebase Cloud Function, and Cloud Firestore as the database layer. All components are hosted within the Firebase ecosystem for simplified operations and deployment.

The architectural flow is as follows:

- User accesses the web application via Firebase Hosting (global CDN).

- React frontend authenticates user via Firebase Authentication (Google Sign-In).

- Frontend sends API requests with Firebase Auth Bearer token to /api/v1/* endpoints.

- Firebase Hosting rewrites /api/* requests to the Cloud Function (europe-west1).

- Express API validates the token, authorizes the request, and performs business logic.

- Backend accesses Cloud Firestore (europe-west3) via Firebase Admin SDK.

- Response is returned to the frontend for rendering.

## 6.2 Tech Stack Details

### 6.2.1 Backend

| Component | Technology | Details |
| --- | --- | --- |
| Runtime | Node.js | LTS version, TypeScript compiled |
| Framework | Express 5 | RESTful API with middleware pipeline |
| Language | TypeScript | Strict mode, full type safety |
| Deployment | Firebase Cloud Function v2 (Gen 2) | Region: europe-west1, auto-scaling |
| Database SDK | Firebase Admin SDK | Server-side Firestore access, bypasses security rules |
| Auth Validation | Firebase Admin Auth | Token verification middleware |

### 6.2.2 Frontend

| Component | Technology | Details |
| --- | --- | --- |
| Framework | React 19 | Functional components, hooks |
| Build Tool | Vite | Fast HMR, optimized production builds |
| Language | TypeScript | Strict mode |
| UI Library | Ant Design 6 | Component library with RTL support |
| Charts | Recharts | Declarative chart components |
| i18n | i18next + react-i18next | Hebrew (RTL) / English (LTR) |
| Routing | react-router-dom (HashRouter) | Client-side routing for static hosting |
| HTTP Client | axios | API requests with auth interceptor |

### 6.2.3 Infrastructure

| Service | Firebase Product | Configuration |
| --- | --- | --- |
| Database | Cloud Firestore | Region: europe-west3, composite indexes |
| Authentication | Firebase Authentication | Google Sign-In provider |
| Hosting | Firebase Hosting | Global CDN, HTTPS, rewrite rules |
| Functions | Cloud Functions v2 | Gen 2, europe-west1, Node.js runtime |
| Plan | Blaze (Pay-as-you-go) | Usage-based pricing |

## 6.3 API Architecture

The API follows RESTful conventions with versioned endpoints under /api/v1. All endpoints require Firebase Authentication Bearer token. The API uses standard HTTP methods (GET, POST, PUT, DELETE) and returns JSON responses with appropriate HTTP status codes.

Key architectural decisions:

- Versioned API (/api/v1) for backward compatibility during future updates

- Bearer token authentication on all endpoints

- Server-side userId injection from token (users cannot spoof identity)

- Pagination support with limit/offset on list endpoints

- Consistent error response format with user-visible messages

- Request logging with correlation IDs for debugging

- Middleware pipeline: CORS → Auth → Route Handler → Error Handler

# 7. API Reference

All endpoints are prefixed with /api/v1 and require a Firebase Auth Bearer token unless noted otherwise.

## 7.1 Authentication

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | /auth/me | Get current user profile; auto-creates on first login | Required |
| PUT | /auth/language | Update user language preference (he/en) | Required |

## 7.2 Accounts

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | /accounts | List user's accounts | Required |
| POST | /accounts | Create new account | Required |
| GET | /accounts/:id | Get single account | Required |
| PUT | /accounts/:id | Update account | Required |
| DELETE | /accounts/:id | Delete account (cascades) | Required |

## 7.3 Securities

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | /securities | List all securities | Required |
| GET | /securities/:id | Get single security | Required |
| POST | /securities | Create security | Admin |
| PUT | /securities/:id | Update security | Admin |
| PUT | /securities/:id/price | Update security price | Admin |
| POST | /securities/prices/bulk | Bulk update prices | Admin |

## 7.4 Transactions

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | /transactions | List with filters (accountId, type, securityId, currency, dateFrom, dateTo, pagination) | Required |
| POST | /transactions | Create transaction (auto lot creation/FIFO sell, auto cash adjustment) | Required |
| GET | /transactions/:id | Get single transaction | Required |
| PUT | /transactions/:id | Update transaction | Required |
| DELETE | /transactions/:id | Delete transaction (reverses lot/cash effects) | Required |

## 7.5 Portfolio

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | /portfolio/summary | Portfolio summary (total value, P&L, cash, account breakdown); optional accountId filter | Required |
| GET | /portfolio/holdings | Holdings with lot details, per-security P&L | Required |

## 7.6 Lots

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | /lots | List with filters (accountId, securityId, status) | Required |
| GET | /lots/by-security/:securityId | Get lots for specific security | Required |
| GET | /lots/:id | Get single lot | Required |

## 7.7 Cash

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | /cash/balances | Cash balances with optional accountId filter | Required |
| GET | /cash/history | Cash transaction history | Required |

## 7.8 Exchange Rates

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | /exchange-rates | List rates with optional dateFrom/dateTo | Required |
| GET | /exchange-rates/latest | Get latest USD/ILS rate | Required |
| POST | /exchange-rates | Add new exchange rate | Admin |

## 7.9 Admin

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | /admin/users | List all registered users | Admin |
| PUT | /admin/users/:id/role | Change user role (admin/user) | Admin |

# 8. Data Model

FolioFollow uses Cloud Firestore as its database, organized into 8 top-level collections. All data access is performed server-side via Firebase Admin SDK. Client-side Firestore rules are set to deny-all.

## 8.1 users

Stores registered user profiles. Created automatically on first login.

| Field | Type | Description |
| --- | --- | --- |
| id | string | Document ID (Firebase Auth UID) |
| email | string | User's email address from Google account |
| displayName | string | User's display name from Google account |
| photoURL | string | User's profile photo URL from Google account |
| role | string (enum) | 'user' or 'admin' — first user auto-assigned admin |
| language | string (enum) | 'he' (Hebrew) or 'en' (English) — UI language preference |

## 8.2 accounts

Investment accounts belonging to individual users.

| Field | Type | Description |
| --- | --- | --- |
| id | string | Auto-generated document ID |
| userId | string | Owner's user ID (foreign key to users) |
| name | string | Account display name (e.g., 'IBI Brokerage') |
| institution | string | Financial institution name |
| type | string (enum) | 'brokerage', 'pension', or 'other' |
| currency | string (enum) | Primary currency: 'ILS' or 'USD' |
| notes | string (optional) | Free-text notes about the account |

## 8.3 securities

Global securities catalog, managed by admin users.

| Field | Type | Description |
| --- | --- | --- |
| id | string | Auto-generated document ID |
| symbol | string | Ticker symbol (e.g., 'AAPL', 'TEVA.TA') |
| name | string | Security full name |
| type | string (enum) | 'stock', 'etf', 'mutual_fund', 'bond', 'money_market', 'other' |
| exchange | string (enum) | 'TASE', 'NYSE', 'NASDAQ', 'other' |
| currency | string | Trading currency ('ILS' or 'USD') |
| currentPrice | number | Latest known price |
| priceUpdatedAt | timestamp | When the price was last updated |

## 8.4 transactions

All user transactions across accounts.

| Field | Type | Description |
| --- | --- | --- |
| id | string | Auto-generated document ID |
| userId | string | Owner's user ID |
| accountId | string | Associated account ID |
| securityId | string (optional) | Associated security ID (null for deposit/withdraw) |
| type | string (enum) | 'buy', 'sell', 'deposit', 'withdraw' |
| quantity | number | Number of units (for buy/sell) |
| pricePerUnit | number | Price per unit at transaction time |
| totalAmount | number | Total transaction amount |
| currency | string | Transaction currency |
| exchangeRate | number (optional) | USD/ILS rate at transaction time |
| date | timestamp | Transaction date |
| nickname | string (optional) | Custom label for categorization |
| purpose | string (optional) | Investment purpose/goal |
| notes | string (optional) | Free-text notes |

## 8.5 lots

Individual purchase lots for cost-basis tracking.

| Field | Type | Description |
| --- | --- | --- |
| id | string | Auto-generated document ID |
| userId | string | Owner's user ID |
| accountId | string | Associated account ID |
| securityId | string | Associated security ID |
| buyTransactionId | string | Reference to the originating buy transaction |
| quantityBought | number | Original quantity purchased |
| quantityRemaining | number | Remaining unsold quantity |
| costPerUnit | number | Original cost per unit |
| costCurrency | string | Currency of the cost basis |
| exchangeRateAtBuy | number (optional) | USD/ILS rate at purchase time |
| status | string (enum) | 'open', 'closed', or 'partial' |
| date | timestamp | Purchase date |

## 8.6 lotSales

Records of lot consumption during sell transactions, used for realized P&L calculation.

| Field | Type | Description |
| --- | --- | --- |
| id | string | Auto-generated document ID |
| lotId | string | Reference to the consumed lot |
| sellTransactionId | string | Reference to the sell transaction |
| quantitySold | number | Quantity sold from this lot |
| salePricePerUnit | number | Sale price per unit |
| saleCurrency | string | Currency of the sale |
| exchangeRateAtSell | number (optional) | USD/ILS rate at sale time |
| realizedPnlILS | number | Realized P&L in ILS |
| realizedPnlUSD | number (optional) | Realized P&L in USD |
| date | timestamp | Sale date |
| userId | string | Owner's user ID |
| accountId | string | Associated account ID |

## 8.7 cashBalances

Current cash balances per account per currency.

| Field | Type | Description |
| --- | --- | --- |
| id | string | Auto-generated document ID |
| userId | string | Owner's user ID |
| accountId | string | Associated account ID |
| currency | string | Currency of the balance ('ILS' or 'USD') |
| balance | number | Current cash balance amount |
| updatedAt | timestamp | Last update timestamp |

## 8.8 exchangeRates

Historical USD/ILS exchange rates for currency conversion.

| Field | Type | Description |
| --- | --- | --- |
| id | string | Auto-generated document ID |
| date | timestamp | Rate date |
| pair | string | Currency pair (currently only 'USD/ILS') |
| rate | number | Exchange rate value |
| source | string (enum) | 'manual' or 'api' |
| updatedBy | string (optional) | Admin user ID who entered the rate |
| createdAt | timestamp | Record creation timestamp |

# 9. UI/UX Design Specifications

## 9.1 Design System

FolioFollow employs a dark-mode-first design inspired by GitHub's dark theme (#0d1117 background). The interface uses Ant Design 6 as the component library foundation, customized with the application's color palette and typography.

Primary Background: #0d1117 (GitHub dark)

Surface/Card Background: #161b22

Border Color: #30363d

Primary Text: #e6edf3

Secondary Text: #8b949e

Accent Color: Ant Design blue (customized)

## 9.2 Bilingual Layout

The application implements full bidirectional (BiDi) support:

- Hebrew mode: complete RTL layout — navigation, tables, charts, forms all mirrored

- English mode: standard LTR layout

- Language toggle in the application header for instant switching

- i18next with react-i18next for all translatable strings

- Ant Design ConfigProvider with RTL direction support

- CSS logical properties (margin-inline-start, padding-inline-end) for layout consistency

## 9.3 Page Specifications

### 9.3.1 Login Page

- Centered login card with FolioFollow branding

- Google Sign-In button (primary CTA)

- Demo Mode button (secondary CTA)

- Language toggle (Hebrew/English)

- Brief product description

### 9.3.2 Dashboard Page

- 6 KPI cards in a responsive grid (3×2 on desktop, 2×3 on tablet, 1×6 on mobile)

- Holdings table with sortable columns: Security, Quantity, Avg Cost, Current Price, Value, Unrealized P&L, Weight

- Expandable rows showing individual lot details

- Filter bar: account selector, search, purpose filter

- Getting Started wizard overlay for new users

### 9.3.3 Transactions Page

- Transaction list in a table format with pagination

- Filter bar: account, type (buy/sell/deposit/withdraw), security, currency, date range

- 'Add Transaction' button opening a modal form

- Transaction modal with dynamic fields based on type selection

### 9.3.4 Analytics Page

- Portfolio value over time area chart (full width)

- Benchmark comparison line chart

- 2×2 grid: Allocation pie, Account breakdown pie, Purpose bar, P&L bar

- All charts built with Recharts, responsive, with tooltips

### 9.3.5 Admin Page (Admin Only)

- Tab navigation: Accounts, Securities, Exchange Rates, Users

- Accounts tab: CRUD table for all accounts

- Securities tab: CRUD table with inline price update

- Exchange Rates tab: rate history table with add-rate form

- Users tab: user list with role toggle

## 9.4 Responsive Design

| Breakpoint | Width | Layout |
| --- | --- | --- |
| Desktop | ≥1200px | Full sidebar navigation, 3-column KPI grid, full tables |
| Tablet | 768–1199px | Collapsed sidebar, 2-column KPI grid, scrollable tables |
| Mobile | <768px | Bottom navigation, single-column layout, card-based lists |

# 10. Business Logic

## 10.1 Lot Tracking Logic

The lot tracking system is the core of FolioFollow's cost-basis accounting. It operates automatically based on transaction events.

Buy Transaction → Lot Creation:

- User creates a Buy transaction for Security X, Quantity 100, Price $50.

- System creates a new lot record: quantityBought=100, quantityRemaining=100, costPerUnit=$50, status='open'.

- System adjusts cash balance: subtract $5,000 from the account's USD cash.

Sell Transaction → FIFO Lot Consumption:

- User creates a Sell transaction for Security X, Quantity 60, Price $65.

- System identifies open/partial lots for Security X in the account, sorted by date (oldest first = FIFO).

- System consumes lots in order: if the oldest lot has 100 remaining, 60 units are consumed from it.

- System creates a lotSale record: quantitySold=60, salePricePerUnit=$65, realizedPnl calculated.

- Lot is updated: quantityRemaining=40, status='partial'.

- System adjusts cash balance: add $3,900 to the account's USD cash.

## 10.2 Cash Tracking Logic

Cash balances are maintained per account per currency and are automatically adjusted on every transaction:

| Transaction Type | Cash Effect |
| --- | --- |
| Deposit | Increase cash balance by totalAmount in the transaction's currency |
| Withdraw | Decrease cash balance by totalAmount in the transaction's currency |
| Buy | Decrease cash balance by (quantity × pricePerUnit) in the security's currency |
| Sell | Increase cash balance by (quantity × pricePerUnit) in the security's currency |

## 10.3 Currency Conversion

FolioFollow operates in dual-currency mode (ILS/USD). Currency conversion follows these rules:

- The latest available USD/ILS exchange rate is used for portfolio-level calculations

- Transaction-level exchange rates are optionally recorded at the time of the transaction

- Portfolio total value is calculated by converting all USD-denominated holdings to ILS using the latest rate

- Realized P&L is calculated in the security's native currency and converted to ILS using the exchange rate at the time of sale

- Unrealized P&L uses the latest exchange rate for conversion

## 10.4 Returns Calculation

Returns are calculated using the weighted average cost method:

- Unrealized P&L per lot = (currentPrice - costPerUnit) × quantityRemaining

- Unrealized P&L per security = sum of unrealized P&L across all open/partial lots

- Realized P&L per sale = (salePricePerUnit - lot.costPerUnit) × quantitySold

- Total Return = Unrealized P&L + Realized P&L (portfolio-level aggregation)

- Return percentage = Total Return / Total Cost Basis × 100

## 10.5 Auto-Admin Assignment

When the first user signs up via Google Sign-In, the system automatically assigns them the 'admin' role. All subsequent users receive the default 'user' role. Admins can promote other users to admin via the Admin panel.

## 10.6 Demo Mode

Demo Mode provides a complete application experience without backend connectivity:

- Pre-populated mock data includes: 3 accounts, 15+ securities (TASE + US), 30+ transactions, lots, and cash balances

- All CRUD operations work against in-memory mock data stores

- Charts display realistic sample data

- Users can explore all features including the Admin panel

- A banner indicates Demo Mode is active throughout the experience

# 11. Future Requirements (Planned)

The following features are planned for future releases. The current architecture has been designed to accommodate these requirements with minimal refactoring.

## 11.1 High Priority (Next Release)

| Feature | Description | Complexity |
| --- | --- | --- |
| Portfolio History | Backend storage and endpoint for portfolio value snapshots over time; replace current mock data on Analytics page | Medium |
| Benchmark Comparison | Fetch and store benchmark data (TA-125, S&P 500) for comparison charts | Medium |
| Auto Price Fetching | Automatic security price updates from market data APIs (Yahoo Finance, TASE API) | Medium |
| Auto Exchange Rates | Fetch USD/ILS rates automatically from Bank of Israel (BOI) or ECB APIs | Low |
| Data Export | Export portfolio data, transactions, and reports to CSV/Excel formats | Low |

## 11.2 Medium Priority

| Feature | Description | Complexity |
| --- | --- | --- |
| Dividend Tracking | Track dividend payments, reinvestment, and yield calculations | Medium |
| Transaction Import | Bulk import transactions from CSV files (broker export compatibility) | Medium |
| Push Notifications | Price target alerts, large move notifications, portfolio milestone alerts | Medium |
| Security Auto-Complete | Search securities from market databases with auto-complete suggestions | Medium |
| Tax Reporting | Israeli capital gains tax summary report (short-term vs long-term, inflationary adjustments) | High |

## 11.3 Long-Term Vision

| Feature | Description | Complexity |
| --- | --- | --- |
| Mobile Apps | Native Android and iOS apps — API-first architecture is already in place | High |
| Family Sharing | Multi-user household accounts with shared portfolio visibility | High |
| PWA / Offline | Progressive Web App with offline data access and sync | Medium |
| Recurring Templates | Templates for periodic transactions (monthly pension contributions, etc.) | Low |
| Performance Attribution | Advanced analytics: sector attribution, currency impact, risk metrics | High |

# 12. Assumptions & Constraints

## 12.1 Assumptions

- Users have a Google account for authentication (Gmail, Google Workspace, etc.).

- Users are comfortable manually entering transactions (automated import is a future feature).

- An admin user will maintain the securities catalog and update prices until automated fetching is implemented.

- An admin user will manually enter exchange rates until automated fetching from BOI/ECB is implemented.

- Users primarily access the application via desktop or tablet web browsers.

- Internet connectivity is required for all operations (no offline mode in MVP).

- The application will initially serve individual investors, not institutional or advisory use cases.

## 12.2 Constraints

- Firebase Ecosystem Lock-in: The application is built entirely on Firebase services. Migrating to a different cloud provider would require significant effort. This is acceptable for the MVP phase given the development velocity and cost advantages.

- Manual Price Entry: Until market data API integration is built, security prices must be manually updated by admin users. This limits real-time accuracy.

- Single-User Model: The current data model supports individual user portfolios only. Multi-user sharing (family, advisor-client) requires data model extensions.

- Admin-Managed Securities: The securities catalog is global and admin-managed. Users cannot add their own securities, ensuring data quality but limiting flexibility.

- Google Sign-In Only: Authentication is limited to Google accounts. Users without Google accounts cannot use the application (except Demo Mode).

- No Real-Time Data: Portfolio values reflect the last manually-updated prices, not live market data.

## 12.3 Dependencies

- Firebase Authentication service availability

- Cloud Firestore service availability (europe-west3 region)

- Cloud Functions v2 runtime availability (europe-west1 region)

- Firebase Hosting CDN availability

- Google Sign-In OAuth service availability

# 13. Glossary

| Term | Definition |
| --- | --- |
| TASE | Tel Aviv Stock Exchange — Israel's primary securities exchange |
| ILS | Israeli New Shekel — the official currency of Israel |
| USD | United States Dollar |
| Lot | A discrete purchase of a security at a specific price and date, used for cost-basis tracking |
| FIFO | First-In, First-Out — a method of consuming lots where the oldest purchase is sold first |
| P&L | Profit & Loss — the financial gain or loss on an investment |
| Unrealized P&L | Paper gain or loss on open positions (not yet sold) |
| Realized P&L | Actual gain or loss from completed sales |
| KPI | Key Performance Indicator — a measurable metric displayed on the dashboard |
| RTL | Right-to-Left — text direction used for Hebrew and Arabic languages |
| LTR | Left-to-Right — text direction used for English and most European languages |
| i18n | Internationalization — the process of designing software for multiple languages and regions |
| CRUD | Create, Read, Update, Delete — the four basic data operations |
| REST | Representational State Transfer — an architectural style for web APIs |
| CDN | Content Delivery Network — a geographically distributed network for fast content delivery |
| SDK | Software Development Kit — a set of tools and libraries for building applications |
| OAuth | Open Authorization — a standard protocol for secure delegated access |
| JWT | JSON Web Token — a compact token format used for authentication |
| MVP | Minimum Viable Product — the initial product release with core features |
| PWA | Progressive Web App — a web application with native-like capabilities |
| BiDi | Bidirectional — text that mixes RTL and LTR content |
| HMR | Hot Module Replacement — instant code updates during development without page reload |
| Gen 2 | Second generation of Firebase Cloud Functions with improved performance and features |
