## Geo-Quiz Application Documentation

This document provides a complete, up-to-date reference for the Geo-Quiz project: setup, configuration, architecture, APIs, data flow, and troubleshooting.

## Table of Contents

1.  High-Level Overview
2.  Local Development Setup
3.  Project Structure
4.  Backend Architecture
    - Data Storage
    - API Endpoints & Routing
    - Services
    - Security & Validation
5.  Frontend Architecture
    - Routing
    - Pages and Components
    - State and Data Flow
    - Authentication
6.  Application Flow (User Journey)
7.  Data Models and JSON Formats
8.  Environment Variables
9.  Deployment Notes
10. Troubleshooting

---

## 1. High-Level Overview

The app is a full-stack quiz game with a React frontend and a Node.js (Express) backend.

- **Backend**: Serves quiz questions from JSON files and validates answers.
- **Frontend**: Handles UI for selecting and playing quizzes, authentication, and showing results.

The two communicate via REST endpoints under the `/api` namespace.

---

## 2. Local Development Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Install and run
- Backend
  - Navigate to `backend/`
  - Install: `npm i`
  - Run: `npm run dev` (or `node server.js`)
  - Server URL: `http://localhost:3001`

- Frontend
  - Navigate to `frontend/`
  - Install: `npm i`
  - Run: `npm run start`
  - App URL: `http://localhost:3000`

The frontend `package.json` includes a proxy to `http://localhost:3001`, so calls to `/api/*` are forwarded to the backend during development.

---

## 3. Project Structure

```
geo/
  backend/
    data/
      capitals/*.json
      flags/*.json
    routes/quiz.js
    services/dataService.js
    server.js
    package.json
  frontend/
    src/
      api/api.js
      App.jsx
      hooks/useAuth.js
      services/FirebaseInit.js
      services/firebaseService.js
      Pages/
        Dashboard.jsx
        LoginScreen.jsx
        quiz/
          ChooseContinent.jsx
          DifficultyLevels.jsx
          CapitalsQuiz.jsx
          FlagsQuiz.jsx
          Score.jsx
    package.json
  DOCUMENTATION.md
```

---

## 4. Backend Architecture

The backend is an Express server exposing quiz endpoints and reading data from JSON.

### Data Storage
- Static JSON under `backend/data/` grouped by game mode and continent:
  - `data/capitals/*.json`
  - `data/flags/*.json`

### API Endpoints & Routing
All routes are mounted under `/api` in `backend/server.js`. Main router: `backend/routes/quiz.js`.

- `GET /api/continents`
  - Returns the available continents by listing `data/capitals/*.json`.

- `GET /api/countries`
  - Returns the contents of `backend/all.json` (auxiliary list of countries).

- `GET /api/capitals/:continent/:difficulty`
  - Returns up to 10 questions filtered by `difficulty` (`easy|medium|hard|random`).
  - `random` shuffles all questions before slicing to 10.

- `POST /api/capitals/check`
  - Body: `{ continent, question, userAnswer }`
  - Returns `{ isCorrect, correctAnswer, explanation }`.

- `GET /api/flags/:continent/:difficulty`
  - Returns up to 10 flag questions filtered by `difficulty` (or shuffled for `random`).

- `POST /api/flags/check`
  - Body: `{ continent, country_code, userAnswer }`
  - Returns `{ isCorrect, correctAnswer, explanation }`.

### Services
`backend/services/dataService.js` provides the data access layer with in-memory caching:
- `loadQuestions(continent)` → capitals
- `loadFlagQuestion(continent)` → flags
- `getAvailableContinents()` → list from `data/capitals/`
- `getAvailableCountries()` → parse `all.json`

### Security & Validation
- `helmet` is used for basic security headers.
- `cors` is configured to allow `http://localhost:3000` and `http://localhost:3001` during development.
- Input validation in handlers (e.g., validating `continent`, allowed `difficulty`).

---

## 5. Frontend Architecture

SPA built with React 18 and React Router. Backend communication via Axios (`frontend/src/api/api.js`).

### Routing
Defined in `frontend/src/App.jsx` with protected routes via `components/auth/ProtectedRoute.jsx` and `AuthProvider` from `hooks/useAuth.js`.

- Public routes
  - `/` → `Dashboard`
  - `/login` → `LoginScreen`

- Protected routes
  - `/score` → `Score`
  - Capitals flow
    - `/capitals/choose-continent` → `ChooseContinent gameMode="capitals"`
    - `/capitals/difficulty/:continent` → `DifficultyLevels gameMode="capitals"`
    - `/quiz/capitals/:continent/:difficulty` → `CapitalsQuiz`
  - Flags flow
    - `/flags/choose-continent` → `ChooseContinent gameMode="flags"`
    - `/flags/difficulty/:continent` → `DifficultyLevels gameMode="flags"`
    - `/quiz/flags/:continent/:difficulty` → `FlagsQuiz`

### Pages and Components
- Pages
  - `Dashboard.jsx`: Entry point to select game mode.
  - `LoginScreen.jsx`: Email/password, Google popup login, and guest login.
  - `ChooseContinent.jsx`, `DifficultyLevels.jsx`: Reusable for both game modes via `gameMode` prop.
  - `CapitalsQuiz.jsx`, `FlagsQuiz.jsx`: Fetch questions, handle timer and answers.
  - `Score.jsx`: Displays results and actions.

- Components
  - `components/ui/Timer.jsx`, `components/ui/LaunchButton.jsx`
  - `components/auth/ProtectedRoute.jsx`: Guards protected routes.

### State and Data Flow
- Local component state via React hooks.
- Navigation state (via `react-router-dom`) passes quiz context (score, continent, difficulty, gameMode) to `Score.jsx`.
- API client `src/api/api.js` wraps Axios calls to backend endpoints.

### Authentication
Firebase Web SDK initialized in `services/FirebaseInit.js` using environment variables. Helper methods in `services/firebaseService.js`:
- Email/password register and login
- Google sign-in via popup
- Anonymous guest login
- Profile management and stats in Firestore (`users`, `gameSessions` collections)

Auth context in `hooks/useAuth.js` exposes `login`, `register`, `loginWithGoogle`, `loginAsGuest`, and `user` state; `ProtectedRoute` uses it to guard routes.

---

## 6. Application Flow (User Journey)

### Starting a Quiz
1. User lands on `Dashboard.jsx` and selects Capitals or Flags.
2. App routes to `ChooseContinent` with `gameMode` set.
3. User selects a continent → routes to `DifficultyLevels` for that game mode.
4. User selects difficulty → routes to `/quiz/<mode>/<continent>/<difficulty>`.

### Playing the Quiz
1. Quiz component loads questions via `api.js` (GET request to backend).
2. User selects an answer → component calls `check` endpoint (POST).
3. Backend responds with correctness and the correct answer; UI updates score and feedback.

### Finishing and Scoring
1. After last question, component navigates to `/score` with state `{ score, totalQuestions, continent, difficulty, gameMode }`.
2. `Score.jsx` renders the summary and allows replay or difficulty change while preserving the mode/continent.

---

## 7. Data Models and JSON Formats

### Capitals question (data/capitals/<continent>.json)
```json
{
  "question": "What is the capital of France?",
  "answer": "Paris",
  "options": ["Paris", "Lyon", "Marseille", "Nice"],
  "difficulty": "easy",
  "explanation": "Paris is the capital and most populous city of France."
}
```

### Flags question (data/flags/<continent>.json)
```json
{
  "country_code": "FR",
  "answer": "France",
  "options": ["France", "Italy", "Belgium", "Spain"],
  "difficulty": "easy",
  "explanation": "The French flag is blue, white, and red."
}
```

---

## 8. Environment Variables

### Backend (`backend/.env`)
Not strictly required for local JSON reading; included packages (`dotenv`, `mongoose`) allow future DB usage. For current endpoints, none are required by default.

### Frontend (`frontend/.env`)
Firebase configuration expected as environment variables (prefixed with `REACT_APP_`):
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

Create `frontend/.env.local` with these keys for local development.

---

## 9. Deployment Notes

- Serve the built frontend (CRA build) behind a web server or CDN.
- Host the backend as a Node service (ensure `helmet` and strict CORS in production).
- Set `CORS` origin to your deployed frontend domain(s).
- Provide production Firebase environment variables to the frontend build environment.

---

## 10. Troubleshooting

- Frontend cannot reach backend
  - Ensure backend is running on `3001` and frontend proxy is set to `http://localhost:3001` in `frontend/package.json`.
  - Check browser console/network tab for failed requests to `/api/*`.

- 404 on quiz endpoints
  - Verify continent filename exists in `backend/data/capitals` or `backend/data/flags` (e.g., `asia.json`).
  - Ensure you are using one of the allowed difficulties: `easy`, `medium`, `hard`, `random`.

- Firebase auth fails
  - Confirm `.env` variables match Firebase project settings and the domain is authorized in Firebase Console.
  - Popup blocked: allow popups or use a different browser.

- Incorrect or missing questions
  - Validate JSON structure and `difficulty` fields; backend slices to 10 items after filtering.

---

This documentation reflects the current codebase and endpoints in `backend/routes/quiz.js`, the data access layer in `backend/services/dataService.js`, and the frontend routing and API usage in `frontend/src`.


