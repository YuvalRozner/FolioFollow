Backend API server completed in /home/user/workspace/FolioFollow/backend.

What was added:
- Node.js + TypeScript backend project setup with package.json, tsconfig.json, and .env.example
- Firebase Admin config with emulator-friendly initialization
- Express middleware for auth, admin checks, validation, error handling, and request logging
- Services for users, accounts, securities, exchange rates, transactions, lots, returns calculation, portfolio, and cash
- Full route layer for auth, accounts, securities, exchange rates, transactions, lots, portfolio, cash, and admin
- Health endpoint and API mounting under /api/v1

Important implementation notes:
- User profile auto-creation on first authenticated request
- Row-level access enforced in service methods for user-owned resources
- Transaction rebuild logic recalculates lots, lot sales, and cash balances per account from transaction history
- FIFO lot allocation for sells
- Portfolio and lot return calculations implemented in services/returnsCalculator.ts
- TypeScript compile check passed with: npx tsc --noEmit

Files of interest:
- /home/user/workspace/FolioFollow/backend/src/index.ts
- /home/user/workspace/FolioFollow/backend/src/config/*
- /home/user/workspace/FolioFollow/backend/src/middleware/*
- /home/user/workspace/FolioFollow/backend/src/routes/*
- /home/user/workspace/FolioFollow/backend/src/services/*
