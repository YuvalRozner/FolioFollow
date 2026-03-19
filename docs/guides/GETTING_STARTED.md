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
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
PORT=8080
```

**frontend/.env**
```
VITE_API_URL=http://localhost:8080/api/v1
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

### 5. Install dependencies

```bash
npm --prefix backend install
npm --prefix frontend install
```

### 6. Start development servers

```bash
# Terminal 1 — Backend
npm --prefix backend run dev

# Terminal 2 — Frontend
npm --prefix frontend run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api/v1`

If `localhost:8080` is already occupied, use:

```powershell
# Terminal 1 — Backend
$env:PORT='8081'
npm --prefix backend run dev

# Terminal 2 — Frontend
$env:VITE_API_URL='http://localhost:8081/api/v1'
npm --prefix frontend run dev -- --port 5173 --strictPort
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
