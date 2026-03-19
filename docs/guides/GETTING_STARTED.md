# Getting Started

## Prerequisites

- **Node.js** 18+ and npm/yarn
- **Git**
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Google Cloud** account with a Firebase project

---

## Initial Setup

### 1. Clone the repository

```bash
git clone https://github.com/YuvalRozner/FolioFollow.git
cd FolioFollow
```

### 2. Switch to the development branch

```bash
git checkout development
```

### 3. Set up Firebase

```bash
firebase login
firebase init
```

Select:
- Firestore (or Cloud SQL)
- Functions
- Hosting

### 4. Environment variables

Create `.env` files in both `backend/` and `frontend/`:

**backend/.env**
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT=path/to/service-account.json
PORT=3001
```

**frontend/.env**
```
REACT_APP_API_URL=http://localhost:3001/v1
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
```

### 5. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 6. Start development servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm start
```

---

## Branching Workflow

1. Always work from the `development` branch
2. Create feature branches: `git checkout -b feature/your-feature`
3. When done, merge back to `development`
4. Only merge `development` → `main` for production releases

---

## Project Conventions

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Meaningful variable/function names
- JSDoc comments on all public functions

### Commits
- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- Example: `feat: add lot-level return calculation`

### Documentation
- Update relevant MD files in `docs/` when adding/changing features
- Keep API_REFERENCE.md in sync with actual endpoints
- Add inline code comments for complex business logic

---

## Deployment

### Development environment
```bash
firebase deploy --only hosting,functions --project dev
```

### Production environment
```bash
git checkout main
git merge development
firebase deploy --only hosting,functions --project prod
```

---

*Detailed deployment instructions will be added as the project progresses.*
