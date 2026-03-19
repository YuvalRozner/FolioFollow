# FolioFollow Roadmap

> Imported from `FolioFollow_Roadmap.docx` and normalized into markdown so agents can update progress easily.
> Source version: 1.0 (March 2026).

## How to update this roadmap

- Update the `Status snapshot` table first when a phase changes state.
- Add a row to the `Progress log` for roadmap-level progress or major releases.
- Keep the detailed sections below aligned with actual delivery status.

## Status snapshot

| Phase | Status | Notes |
| --- | --- | --- |
| Phase 1: Foundation & MVP | Completed | Core architecture, backend, frontend, and first deploy |
| Phase 2: Core UX & Data Management | Completed | Dark mode, i18n, demo mode, RBAC, onboarding, and hotfixes |
| Phase 3: Data Automation & Intelligence | Planned | Next major phase |
| Phase 4: Advanced Features | Planned | Export, dividends, imports, alerts, attribution |
| Phase 5: Mobile & Scale | Planned | Mobile apps, PWA, sharing, tax reporting, advanced analytics |

## Near-term focus

- Replace mock analytics history data with real backend portfolio snapshots.
- Replace mock benchmark data with real benchmark/index ingestion.
- Automate security price updates and USD/ILS exchange-rate ingestion.

## Progress log

| Date | Update | Notes |
| --- | --- | --- |
| 2026-03-19 | Imported roadmap into repository | Converted from DOCX to markdown for easier agent updates |

## Detailed roadmap

# 1. Executive Summary

FolioFollow is a personal investment portfolio tracking web application purpose-built for Israeli investors who hold securities on both the Tel Aviv Stock Exchange (TASE) and US exchanges. The application provides dual-currency (ILS/USD) portfolio management with lot-level tracking, realized and unrealized profit-and-loss calculations, and multi-account support.

The project is currently in its MVP stage with core functionality live and accessible at https://foliofollow.web.app. Two major development phases have been completed, delivering a fully functional portfolio tracker with dark mode UI, bilingual support (Hebrew RTL / English LTR), demo mode, role-based access control, and comprehensive account management.

Looking ahead, the roadmap focuses on data automation and intelligence (Phase 3), advanced features such as data export and dividend tracking (Phase 4), and mobile expansion with tax reporting capabilities (Phase 5). This document provides a comprehensive overview of all completed work, current status, and future plans.

# 2. Project Timeline Overview

## 2.1 Development History

FolioFollow progressed from initial project inception through architecture design, full backend and frontend implementation, to a production deployment on Firebase Hosting — all within a structured, phase-driven development process.

| Milestone | Description |
| --- | --- |
| Project Inception | Initial project structure, architecture design, and documentation |
| Backend Complete | Full REST API with 9 route groups, FIFO lot tracking, dual-currency P&L, deployed as Firebase Cloud Function v2 |
| Frontend Complete | React 19 application with 5 pages, 6 chart types, dark mode, bilingual UI |
| First Deploy | Production deployment to Firebase Hosting with CDN, live at foliofollow.web.app |
| Phase 2 Complete | Dark mode, i18n, demo mode, RBAC, account management CRUD, onboarding wizard, hotfixes |
| Current State | MVP stable in production. Planning Phase 3: Data Automation & Intelligence |

## 2.2 Development Methodology

FolioFollow employs an AI-led development team with parallel agents, each operating with a distinct git committer identity:

- Lead-Architect — Project architecture, documentation, and code reviews

- Backend-Dev — Node.js/Express API, Firebase Cloud Functions, business logic

- Frontend-Dev — React UI, Ant Design components, charts, i18n

The project maintains two primary branches: main (production) and development (active development). Code reviews are performed between phases, and Firebase deployment is managed by the project owner.

# 3. Phase 1: Foundation & MVP  ✓ COMPLETED

Phase 1 established the complete technical foundation and delivered a functional minimum viable product. Every item listed below has been fully implemented and deployed to production.

## 3.1 Project Architecture

- Complete architecture design and documentation

- RESTful API-first design (versioned under /api/v1) for future mobile app support

- Firebase project setup: Authentication, Firestore, Hosting, Cloud Functions v2

- Region configuration: europe-west1 (functions), europe-west3 (Firestore)

- Blaze (pay-as-you-go) plan for production workloads

## 3.2 Backend API

The backend is built with Node.js + Express 5 + TypeScript and deployed as a Firebase Cloud Function v2 (Gen 2). It includes all 9 route groups with comprehensive business logic.

### Route Groups

| Route Group | Endpoints |
| --- | --- |
| Auth | GET /auth/me (auto-creates user on first login), PUT /auth/language |
| Accounts | Full CRUD — list, create, get, update, delete (with cascade) |
| Securities | Global catalog — list, get, create, update, price update, bulk price update (admin only) |
| Transactions | List with filters, create (auto lot/cash), get, update, delete (reverses lot/cash) |
| Portfolio | Summary (total value, P&L, cash, account breakdown), Holdings with lot details |
| Lots | List with filters (accountId, securityId, status), by-security, get single |
| Cash | Balances (optional account filter), cash transaction history |
| Exchange Rates | List (date range), latest rate, add rate (admin only) |
| Admin | List all users, change user role (admin only) |

### Business Logic

- FIFO Lot Tracking: Automatic lot creation on buy transactions, FIFO-based lot consumption on sell transactions

- Auto-Cash Adjustment: Cash balances automatically adjusted on deposits, withdrawals, buys, and sells

- Dual-Currency P&L: All values calculated in both ILS and USD using stored exchange rates

- Request Logging: Correlation IDs for request tracing across the entire API

- Error Handling: Structured error responses with user-visible messages

## 3.3 Frontend Application

The frontend is built with React 19 + Vite + TypeScript + Ant Design 6, with Recharts for data visualization, i18next for internationalization, react-router-dom for routing, and axios for API communication.

### Pages

- LoginPage: Google Sign-In integration with Demo Mode button for exploring the app without authentication

- DashboardPage: 6 KPI cards (total value, return, daily change, unrealized P&L, realized P&L, cash balance), holdings table with expandable lot details, search and filter by account/purpose

- TransactionsPage: Transaction list with filters (account, type, security, currency), add transaction modal with validation

- AnalyticsPage: 6 chart types — portfolio value over time (area), benchmark comparison (line), allocation by security (pie), account breakdown (pie), purpose breakdown (bar), P&L by security (bar)

- AdminPage: 4 tabs — Accounts (CRUD), Securities (CRUD + price update), Exchange Rates (CRUD), Users (role management)

## 3.4 Firebase Integration

- Authentication: Google provider with automatic user profile creation on first login

- Firestore Database: 8 collections — users, accounts, securities, transactions, lots, lotSales, cashBalances, exchangeRates

- Cloud Functions v2: Gen 2 deployment with improved performance and concurrency

- Firebase Hosting: CDN-backed hosting with automatic SSL

## 3.5 Database Configuration

- Composite Indexes: 8 Firestore composite indexes covering all query patterns for optimal performance

- Security Rules: Deny-all Firestore rules — all data access goes through Admin SDK in Cloud Functions, ensuring maximum security

# 4. Phase 2: Core UX & Data Management  ✓ COMPLETED

Phase 2 focused on refining the user experience, adding internationalization, and ensuring production stability. All items have been completed and deployed.

## 4.1 Dark Mode UI

A GitHub-inspired dark theme (#0d1117 background) was implemented across the entire application, providing a comfortable viewing experience for extended use. All components, charts, and tables are fully themed.

## 4.2 Bilingual Support

Full internationalization using i18next with Hebrew (RTL) and English (LTR) support. The entire UI — including labels, messages, tooltips, and form placeholders — is translated. Layout direction switches automatically based on the selected language.

## 4.3 Demo Mode

A comprehensive demo mode with mock data allows users to explore the full application experience without authentication or backend connectivity. The demo includes sample portfolios, transactions, and analytics data.

## 4.4 Role-Based Access Control

- Two roles: admin and user

- Auto-admin: The first user to sign up automatically receives the admin role

- Admin capabilities include managing securities, exchange rates, and user roles

- Regular users can manage their own accounts, transactions, and view their portfolio

## 4.5 Account Management CRUD

Full create, read, update, and delete operations for investment accounts. Users can manage brokerage, pension, and other account types with institution details, currency settings, and notes.

## 4.6 Getting Started Onboarding

An onboarding wizard on the Dashboard guides new users through the essential first steps: creating their first account, adding securities, recording their first transaction, and understanding the dashboard KPIs.

## 4.7 Production Hotfixes

Several critical issues were identified and resolved after the initial production deployment:

- Admin Role Assignment Fix: Corrected the auto-admin logic for the first registered user

- API URL Routing Fix: Resolved production API URL configuration for proper Cloud Functions routing

- Error Handling Improvements: Enhanced error messages and user-visible feedback throughout the application

- Form Instance Fix: Separated form instances for Add and Edit modals to prevent state contamination between operations

- Firestore Index Creation: Deployed all required composite indexes for production query patterns

# 5. Phase 3: Data Automation & Intelligence  ⟳ PLANNED

Status: Not yet implemented. This phase represents the next major development effort, targeted for Q2–Q3 2026.

Phase 3 will transform FolioFollow from a manual-entry system into an intelligent, data-driven platform by automating the most tedious aspects of portfolio management.

## 5.1 Automatic Price Fetching

- Integration with TASE (Tel Aviv Stock Exchange) API for Israeli securities pricing

- Integration with Yahoo Finance API (or equivalent) for US exchange securities

- Scheduled price updates with configurable frequency

- Manual override capability for corrections or unlisted securities

- Price history storage for time-series analysis

## 5.2 Automatic Exchange Rate Fetching

- Integration with Bank of Israel (BOI) API for official USD/ILS rates

- Fallback to European Central Bank (ECB) for additional currency pairs

- Daily rate capture with historical rate storage

- Automatic application to portfolio calculations

## 5.3 Portfolio History & Time-Series

- Backend endpoint for storing daily portfolio snapshots

- Historical portfolio value tracking over time

- Replace current mock data on the Analytics page with real historical data

- Support for date-range queries and aggregation periods

## 5.4 Real Benchmark Comparison

- Fetch real benchmark index data (TA-125, S&P 500, etc.)

- Replace mock benchmark data on the Analytics page

- Side-by-side portfolio vs. benchmark performance visualization

- Customizable benchmark selection per account or portfolio

### Estimated Timeline

Q2–Q3 2026

# 6. Phase 4: Advanced Features  ○ PLANNED

Status: Not yet implemented. Planned for Q3–Q4 2026.

Phase 4 expands FolioFollow's capabilities with features that streamline data entry and provide deeper analytical insights.

## 6.1 Data Export

- Export portfolio holdings and transaction history to CSV format

- Excel (XLSX) export with formatted worksheets and summary sheets

- Configurable date ranges and account filters for exports

- PDF report generation for portfolio summaries

## 6.2 Dividend Tracking & Reinvestment

- New transaction type: dividend income

- Automatic association of dividends with the originating security

- Dividend reinvestment plan (DRIP) tracking

- Dividend yield calculations and income projections

## 6.3 Transaction Import

- CSV upload with column mapping for common broker export formats

- Broker statement parsing for major Israeli and US brokerages

- Duplicate detection and conflict resolution

- Batch review and approval workflow before committing imports

## 6.4 Notifications & Alerts

- Push notifications for significant portfolio value changes

- Price target alerts — notify when a security reaches a specified price

- Daily/weekly portfolio summary emails

- Configurable alert thresholds and notification channels

## 6.5 Recurring Transactions

- Template-based recurring transaction creation

- Support for regular investment plans (monthly purchases)

- Automatic transaction generation with manual confirmation

## 6.6 Performance Attribution

- Analytics for understanding which securities drive portfolio returns

- Sector-based and asset-class-based attribution

- Currency impact analysis (ILS vs. USD contribution)

## 6.7 Security Search & Auto-Complete

- Search for securities with auto-complete from market databases

- Automatic population of security metadata (name, exchange, type, currency)

- Reduce manual data entry errors for security creation

### Estimated Timeline

Q3–Q4 2026

# 7. Phase 5: Mobile & Scale  ○ PLANNED

Status: Not yet implemented. Planned for 2027.

Phase 5 extends FolioFollow beyond the web browser and adds features for advanced users and multi-user households.

## 7.1 Mobile Applications

- Native Android and iOS applications

- Architecture is already API-first, enabling straightforward mobile client development

- Core features: portfolio view, transaction entry, push notifications

- Mobile-optimized charts and KPI displays

## 7.2 PWA & Offline Support

- Progressive Web App capabilities for the existing web application

- Offline data caching for portfolio viewing without connectivity

- Background sync for offline transaction entry

## 7.3 Multi-User & Family Sharing

- Household/family account grouping

- Shared portfolio views across family members

- Per-user permissions within shared accounts

- Consolidated family net worth dashboard

## 7.4 Tax Reporting

- Israeli capital gains tax summary for annual tax filing

- Automatic calculation of taxable events (lot sales, dividends)

- Support for Israeli tax rules (linear vs. non-linear calculation methods)

- Exportable tax reports compatible with Israeli Tax Authority requirements

## 7.5 Advanced Analytics

- Correlation analysis between portfolio securities

- Risk metrics: portfolio volatility, beta, Value at Risk (VaR)

- Sharpe ratio and risk-adjusted return calculations

- Monte Carlo simulation for portfolio projections

### Estimated Timeline

2027

# 8. Technical Debt & Improvements

The following items represent known technical debt and areas requiring improvement. Addressing these will improve reliability, developer velocity, and user experience.

| Item | Description |
| --- | --- |
| Portfolio History Endpoint | Currently returns mock data. Requires implementation of daily snapshot storage and real time-series queries. |
| Benchmark Comparison | Analytics page displays mock benchmark data. Needs integration with real market index APIs. |
| Price Updates | Security prices are manually entered by the admin. Automation via market APIs is critical for usability. |
| Exchange Rate Entry | Exchange rates are manually entered. Automation via Bank of Israel API is needed. |
| Automated Testing | No unit tests, integration tests, or end-to-end tests exist. Test coverage is needed across both backend and frontend. |
| CI/CD Pipeline | Deployment is manual via Firebase CLI. A CI/CD pipeline (GitHub Actions or similar) should automate testing and deployment. |

# 9. Architecture Decisions & Rationale

The following key architectural decisions were made during the project's inception and have proven effective through two completed phases.

### Firebase Platform

Serverless architecture with auto-scaling, integrated authentication, real-time database capabilities, generous free tier, and unified deployment. Eliminates server management overhead entirely.

### Cloud Functions v2 (Gen 2)

Gen 2 Cloud Functions offer improved performance, better concurrency handling (up to 1000 concurrent requests per instance), and longer timeout limits compared to Gen 1.

### API-First Design

All functionality is exposed through a versioned REST API (/api/v1). This future-proofs the architecture for mobile app development without requiring backend changes.

### Firestore over Realtime Database

Firestore provides richer query capabilities (composite queries, inequality filters), better horizontal scaling, and a more structured data model compared to the legacy Realtime Database.

### React 19 + Vite

React 19 provides the latest features including concurrent rendering. Vite offers significantly faster development builds and hot module replacement compared to alternatives like Create React App.

### Ant Design 6

A comprehensive, enterprise-grade component library with excellent RTL (right-to-left) support — critical for Hebrew UI. Reduces custom component development significantly.

### Deny-All Firestore Rules

All client access to Firestore is blocked. Data access occurs exclusively through the Admin SDK in Cloud Functions, providing maximum security and centralized business logic enforcement.

# 10. Risk Assessment

The following risks have been identified along with their current mitigation strategies.

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Firebase Vendor Lock-in | Medium | High | API abstraction layer isolates business logic from Firebase-specific SDKs. Migration path to other cloud providers is feasible. |
| Manual Data Entry Fatigue | High | High | Phase 3 automation (price fetching, exchange rates) will reduce manual entry by ~80%. Transaction import in Phase 4. |
| Single-Developer Bottleneck | Medium | Medium | Mitigated by AI development team with parallel agents. Clear documentation enables onboarding of additional contributors. |
| Market Data API Costs | Medium | Medium | Research needed for Phase 3. Free-tier APIs (Yahoo Finance, BOI) will be prioritized. Budget allocation for paid APIs as fallback. |
| Israeli Tax Regulation Complexity | Low | High | Professional tax consultation required before Phase 5 tax reporting implementation. Regulation changes may require ongoing maintenance. |

# 11. Success Metrics & KPIs

Each phase has defined success criteria to measure progress and validate that development efforts are delivering value.

## 11.1 MVP (Phases 1 & 2) — Achieved ✓

- Functional portfolio tracking with manual data entry

- Dual-currency P&L calculations accurate to the lot level

- Full CRUD operations for all entities (accounts, securities, transactions, exchange rates)

- Stable production deployment with no critical bugs

- Bilingual UI with RTL support functioning correctly

## 11.2 Phase 3 — Target Metrics

- Automated price and exchange rate updates reduce manual data entry by 80%

- Portfolio history stores daily snapshots with less than 1-minute data staleness

- Real benchmark comparison data available for at least TA-125 and S&P 500 indexes

- Analytics page displays real data (no more mock data)

## 11.3 Phase 4 — Target Metrics

- Transaction import covers 90% of common Israeli and US broker export formats

- Data export available in CSV and Excel formats for all major data views

- Dividend tracking captures and categorizes 100% of dividend events

- User receives at least one automated notification per week (if enabled)

## 11.4 Phase 5 — Target Metrics

- Mobile app adoption: available on both Android and iOS app stores

- Multi-user household support enables family portfolio consolidation

- Tax reporting generates an accurate capital gains summary for Israeli annual filing

- Advanced analytics provide Sharpe ratio and risk metrics with daily recalculation

# 12. Current Status Summary

The following table provides a comprehensive overview of all features across all phases, with their current implementation status.

| Feature | Status | Phase | Notes |
| --- | --- | --- | --- |
| Project architecture & documentation | Done ✓ | Phase 1 | Complete design docs, API specs |
| Backend API — Auth routes | Done ✓ | Phase 1 | Login, profile, language preference |
| Backend API — Accounts CRUD | Done ✓ | Phase 1 | List, create, get, update, delete |
| Backend API — Securities management | Done ✓ | Phase 1 | CRUD + price updates + bulk prices |
| Backend API — Transactions | Done ✓ | Phase 1 | CRUD + auto lot/cash processing |
| Backend API — Portfolio summary | Done ✓ | Phase 1 | Value, P&L, cash, account breakdown |
| Backend API — Lots tracking | Done ✓ | Phase 1 | FIFO lot creation and consumption |
| Backend API — Cash balances | Done ✓ | Phase 1 | Auto-adjusted on all transactions |
| Backend API — Exchange rates | Done ✓ | Phase 1 | CRUD, latest rate, date filtering |
| Backend API — Admin routes | Done ✓ | Phase 1 | User management, role changes |
| Request logging & correlation IDs | Done ✓ | Phase 1 | Structured logging across API |
| Error handling framework | Done ✓ | Phase 1 | Structured responses, user messages |
| Frontend — LoginPage | Done ✓ | Phase 1 | Google Sign-In + Demo Mode |
| Frontend — DashboardPage | Done ✓ | Phase 1 | 6 KPI cards, holdings table, lots |
| Frontend — TransactionsPage | Done ✓ | Phase 1 | Filters, add modal, validation |
| Frontend — AnalyticsPage | Done ✓ | Phase 1 | 6 chart types (area, line, pie, bar) |
| Frontend — AdminPage | Done ✓ | Phase 1 | 4 tabs: Accounts, Securities, Rates, Users |
| Firebase Authentication | Done ✓ | Phase 1 | Google provider, auto user creation |
| Firestore database (8 collections) | Done ✓ | Phase 1 | Full data model implemented |
| Cloud Functions v2 deployment | Done ✓ | Phase 1 | Gen 2, europe-west1 region |
| Firebase Hosting + CDN | Done ✓ | Phase 1 | Live at foliofollow.web.app |
| Firestore composite indexes (8) | Done ✓ | Phase 1 | All query patterns covered |
| Firestore security rules | Done ✓ | Phase 1 | Deny-all, Admin SDK only |
| Dark mode UI | Done ✓ | Phase 2 | #0d1117 GitHub-inspired theme |
| Bilingual support (Hebrew/English) | Done ✓ | Phase 2 | i18next, RTL/LTR auto-switch |
| Demo mode with mock data | Done ✓ | Phase 2 | Full app experience, no auth needed |
| Role-based access control | Done ✓ | Phase 2 | Admin/user roles, auto-admin first user |
| Account management CRUD | Done ✓ | Phase 2 | Create, edit, delete accounts |
| Getting Started onboarding | Done ✓ | Phase 2 | Dashboard wizard for new users |
| Production hotfixes (5 fixes) | Done ✓ | Phase 2 | Admin role, API URL, forms, indexes |
| Automatic price fetching | Planned ⟳ | Phase 3 | TASE, Yahoo Finance integration |
| Automatic exchange rate fetching | Planned ⟳ | Phase 3 | Bank of Israel, ECB APIs |
| Portfolio history storage | Planned ⟳ | Phase 3 | Daily snapshots, time-series queries |
| Real benchmark comparison | Planned ⟳ | Phase 3 | TA-125, S&P 500 real data |
| Data export (CSV/Excel) | Planned ○ | Phase 4 | Portfolio and transaction exports |
| Dividend tracking | Planned ○ | Phase 4 | Income tracking, DRIP support |
| Transaction import (CSV) | Planned ○ | Phase 4 | Broker statement parsing |
| Notifications & alerts | Planned ○ | Phase 4 | Price targets, portfolio changes |
| Recurring transactions | Planned ○ | Phase 4 | Templates for regular investments |
| Performance attribution | Planned ○ | Phase 4 | Return attribution analytics |
| Security search auto-complete | Planned ○ | Phase 4 | Market database lookup |
| Mobile apps (Android/iOS) | Planned ○ | Phase 5 | API-first architecture ready |
| PWA / offline support | Planned ○ | Phase 5 | Offline caching, background sync |
| Multi-user / family sharing | Planned ○ | Phase 5 | Household portfolios |
| Tax reporting (Israeli) | Planned ○ | Phase 5 | Capital gains summary |
| Advanced analytics | Planned ○ | Phase 5 | Sharpe ratio, risk metrics, VaR |

## Legend

- Done ✓ — Feature is fully implemented and deployed to production (green rows)

- Planned ⟳ — Next in the development queue, targeted for near-term implementation (yellow rows)

- Planned ○ — On the roadmap for future development (gray rows)
