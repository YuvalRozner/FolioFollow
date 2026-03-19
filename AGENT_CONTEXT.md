# Agent Context — FolioFollow

## Project Summary
Portfolio tracking web app for Israeli investors. API-first architecture.

## Tech Stack
- **Backend:** Node.js + Express + TypeScript, Firebase Admin SDK, Firestore
- **Frontend:** React + TypeScript, Ant Design, Recharts, i18next
- **Auth:** Firebase Auth (Google Sign-In), JWT validation
- **DB:** Firestore (NoSQL)
- **Hosting:** Firebase Hosting (frontend), Cloud Functions or Cloud Run (backend)

## Key Files
- Shared types: `shared/types/index.ts`
- Shared constants: `shared/constants/index.ts`
- Architecture: `docs/architecture/ARCHITECTURE.md`
- Data models: `docs/models/DATA_MODELS.md`
- API reference: `docs/api/API_REFERENCE.md`

## Git Workflow
- Work on `development` branch
- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- Each agent has its own Git author name

## Design Requirements
- Dark Mode as default
- Bilingual: Hebrew (RTL) + English (LTR) via i18next
- Modern, professional, with rich charts and visualizations
- Responsive (mobile + desktop)
