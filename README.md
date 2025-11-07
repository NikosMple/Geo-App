# 🌍 Geo Quiz

### 🎮 [Live Preview → https://geo-app-muig.onrender.com/](https://geo-app-muig.onrender.com/)

A full-stack geography quiz app where players test their knowledge of **world capitals and flags** by continent and difficulty level and explore the world with an **interactive global map**.  
The app supports authentication with Firebase and saves user progress and statistics to Firestore.

---

## 🚀 Features

- 🔐 **Firebase Authentication** — Email/Password, Google, and Guest login  
- 🧭 **Two Quiz Modes** — Capitals & Flags  
- 🗺️ **Interactive World Map** — Explore countries, view flags, populations, and regions  
- 🌎 **Continent & Difficulty Selection**  
- 📊 **Score Tracking** — Saves results and history in Firestore  
- ⚡ **Modern UI** — Built with React, TailwindCSS, and animations  

---

## 🛠️ Tech Stack

**Frontend**
- React 18  
- React Router  
- TanStack Query  
- TailwindCSS  
- Framer Motion / React-Three  
- React Simple Maps & D3.js  
- Axios  

**Backend**
- Node.js + Express  
- Firebase Admin SDK  
- Helmet, CORS, express-rate-limit  

**Database**
- Firestore (user stats & profiles)  
- Static JSON files (quiz data)  

---

## 🧩 How It Works

1. Users authenticate via Firebase (web SDK).  
2. The frontend fetches quiz questions, stats, and map data via the Express backend.  
3. The backend serves quiz questions from JSON files and saves stats to Firestore.  
4. The interactive map visualizes global data (e.g., population, continent, flags).  
5. Each quiz session returns up to 10 randomized questions per continent/difficulty.  

---

## ⚙️ Getting Started

### Prerequisites
- Node.js **v18+**
- Firebase project with:
  - Web App config (for frontend)
  - Service Account key (for backend)
  - Firestore enabled

---

### 🖥️ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:

```ini
FIREBASE_SERVICE_ACCOUNT={"type":"service_account", ...}
```

Run the backend:

```bash
node server.js
```

➡️ Starts on http://localhost:3001

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `/frontend`:

```ini
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

Run the frontend:

```bash
npm run dev
```

➡️ Opens http://localhost:3000

---

## 🧩 Troubleshooting

- **Auth errors:** Ensure Firebase credentials and allowed domains are correct.
- **CORS issues:** Backend must allow http://localhost:3000.
- **Proxy issues:** Frontend API calls should be relative (e.g., `/api/...`).
- **Map not loading:** Check your internet connection — the map fetches data from external APIs.
- **Ports busy:** Stop other apps or change the default ports 3000/3001.
- **Firestore permission denied:** Ensure Firestore rules allow read/write for authenticated users.

---

## 💙 Credits

Built with ❤️ using React, Node.js, and Firebase by **Nikos Bletsas**.
