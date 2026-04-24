# 🗳️ VoteSaathi

> A context-aware Indian election assistant powered by **Gemini AI**, **Google Maps**, and **Firebase**.

---

## 📁 Project Structure

```
VoteSaathi/
├── frontend/          # Next.js 14 + Tailwind CSS (React)
│   └── src/
│       ├── app/       # All pages (App Router)
│       ├── lib/       # Firebase, Firestore helpers
│       ├── store/     # Zustand global state
│       ├── hooks/     # useAuth, useGeolocation
│       └── types/     # Shared TypeScript types
│
└── backend/           # Python FastAPI server
    ├── venv/          # Python virtual environment (created by setup.bat)
    ├── main.py        # FastAPI app entry point
    ├── gemini_service.py  # Gemini AI prompt engine
    ├── maps_service.py    # Google Maps integration
    ├── firebase_client.py # Firebase Admin SDK
    ├── schemas.py         # Pydantic request/response models
    ├── config.py          # Settings from .env
    └── requirements.txt   # Python dependencies
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend

# Windows
setup.bat

# macOS / Linux
bash setup.sh

# Copy and fill in env vars
copy .env.example .env

# Start server
venv\Scripts\activate       # Windows
python main.py
# → API running at http://localhost:8000
# → Swagger docs at http://localhost:8000/docs
```

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy and fill in env vars
copy .env.local.example .env.local

# Start dev server
npm run dev
# → App running at http://localhost:3000
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google AI Studio API key |
| `GOOGLE_MAPS_API_KEY` | Google Maps Platform API key |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Path to Firebase Admin service account JSON |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins |

### Frontend (`frontend/.env.local`)
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase project config (from Firebase console) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JS API key |
| `NEXT_PUBLIC_BACKEND_URL` | URL of the FastAPI backend (default: `http://localhost:8000`) |

---

## 🌐 Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/login` | Sign in |
| `/register` | Create account |
| `/onboarding` | 4-step profile setup |
| `/dashboard` | Feature hub |
| `/chat` | AI election assistant |
| `/voting-guide` | Step-by-step voting process |
| `/constituency` | Find polling booth + map |
| `/candidates` | List + compare candidates |
| `/reminders` | Set election reminders |
| `/settings` | Profile, language, privacy |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| State | Zustand (persisted) |
| Animation | Framer Motion |
| Backend | Python FastAPI + Uvicorn |
| AI | Google Gemini 1.5 Flash |
| Maps | Google Maps Geocoding + Places API |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Notifications | Firebase Cloud Messaging |
