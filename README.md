# FolioFollow

**Portfolio tracking web app for Israeli investors.**

Track stocks, ETFs, mutual funds, and more across multiple brokerage accounts — with lot-level P&L tracking, multi-currency support (ILS/USD), and benchmark comparison.

---

## Overview

FolioFollow solves a common problem for self-directed investors in Israel: there's no easy way to track portfolio performance at the individual trade level, especially when dealing with:

- Multiple purchases of the same security at different prices
- Trading across multiple accounts (e.g., IBI SPARK, IBI SMART, Kupat Gemel)
- Multi-currency investments (ILS and USD)
- Tracking realized vs. unrealized gains

## Key Features (MVP — Phase 1)

- **Google Authentication** — Secure login via Firebase Auth
- **Multi-account support** — Track separate portfolios (IBI SPARK, IBI SMART, Kupat Gemel, etc.)
- **Transaction management** — Buy, sell, deposit, withdraw with full details
- **Lot-level tracking** — Every purchase is a separate lot with individual P&L
- **Return calculations** — Per-lot, per-security, and portfolio-level returns
- **Multi-currency** — ILS and USD with exchange rate tracking
- **Cash balance tracking** — ILS and USD balances with deposit/withdrawal history
- **Custom labels** — Personal nicknames and purpose tags (e.g., "for car", "for vacation")
- **Dashboard** — Quick overview + detailed trading table with filtering
- **Advanced dashboard** — Charts, visualizations, benchmark comparison (S&P 500, TA-35)
- **Dark Mode** — Default theme
- **Bilingual** — Hebrew (RTL) and English (LTR)

## Future Phases

- **Phase 2:** AI-powered trade confirmation parsing (image upload), auto price/FX feeds via API
- **Phase 3:** Tax calculations, trading fees, annual tax reports, data export

## Architecture

**API-First design** — The backend exposes a fully documented REST API. The React web app is one client; future Android/iOS apps will consume the same API.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  React Web  │     │  Android    │     │  iOS        │
│  (Phase 1)  │     │  (Future)   │     │  (Future)   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌──────▼──────┐
                    │  REST API   │
                    │  (Backend)  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Database   │
                    │  (Firebase) │
                    └─────────────┘
```

### Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Frontend       | React (TypeScript)                |
| Backend        | Node.js / Cloud Functions         |
| Database       | Firestore or Cloud SQL (PostgreSQL) |
| Auth           | Firebase Auth (Google Sign-In)    |
| Hosting        | Firebase Hosting                  |
| API Docs       | OpenAPI / Swagger                 |

## Project Structure

```
FolioFollow/
├── backend/          # API server — all business logic lives here
│   ├── src/          # Source code
│   └── tests/        # Unit and integration tests
├── frontend/         # React web client
│   ├── src/          # Source code
│   └── public/       # Static assets
├── shared/           # Shared types and constants (used by both)
│   ├── types/        # TypeScript interfaces/types
│   └── constants/    # Shared enums, config values
├── docs/             # Project documentation
│   ├── architecture/ # System design, data flow, decisions
│   ├── models/       # Data models and schemas
│   ├── api/          # API endpoints documentation
│   └── guides/       # Developer guides and setup instructions
└── README.md
```

## Branching Strategy

- **`main`** — Production-ready code. Only merged from `development` after testing.
- **`development`** — Active development branch. All feature branches merge here.

## Roles

| Role         | Capabilities                                              |
|--------------|-----------------------------------------------------------|
| Regular User | View dashboard, enter transactions, filter and sort data  |
| Admin        | All user capabilities + update market prices, manage securities, update exchange rates |

## Documentation

See the [`docs/`](./docs/) directory for:
- [Architecture Overview](./docs/architecture/ARCHITECTURE.md)
- [Data Models](./docs/models/DATA_MODELS.md)
- [API Reference](./docs/api/API_REFERENCE.md)
- [Getting Started Guide](./docs/guides/GETTING_STARTED.md)

## License

Private project. All rights reserved.

---

*Built with ❤️ for Israeli investors who want real visibility into their portfolio performance.*
