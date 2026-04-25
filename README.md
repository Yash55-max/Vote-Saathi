# 🗳️ VoteSaathi: Your Digital Election Companion

[![CI](https://github.com/Yash55-max/Vote-Saathi/actions/workflows/ci.yml/badge.svg)](https://github.com/Yash55-max/Vote-Saathi/actions/workflows/ci.yml)
[![Backend Lint](https://img.shields.io/badge/Backend%20Lint-Ruff-2ea44f?style=for-the-badge&logo=python&logoColor=white)](.github/workflows/ci.yml)
[![Coverage](https://codecov.io/gh/Yash55-max/Vote-Saathi/branch/main/graph/badge.svg)](https://codecov.io/gh/Yash55-max/Vote-Saathi)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI%20Assistant-4285F4?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![Google Maps](https://img.shields.io/badge/Google%20Maps-Geospatial-4285F4?style=for-the-badge&logo=google-maps)](https://mapsplatform.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**VoteSaathi** is a context-aware, accessible digital public utility designed to empower Indian citizens through the democratic process. It provides personalized election guidance, multi-language AI assistance, and real-time polling booth navigation to ensure no voter is left behind.

---

## 🎯 Project Overview

### 🏗️ Chosen Vertical
**Civic Tech & Digital Public Infrastructure (DPI)**  
VoteSaathi is positioned as a digital public utility designed to bridge the information gap in the Indian electoral process, specifically targeting first-time voters, elderly citizens, and differently-abled individuals.

### 🧠 Approach and Logic
The project follows a **"Context-First"** architecture:
- **Personalised Logic**: Instead of a generic FAQ, the system uses the user's profile (Age, Voter Status, Location) to calibrate Gemini's responses. An 18-year-old is guided through registration, while a 70-year-old is informed about "Vote from Home" facilities.
- **Multilingual Foundation**: Logic is abstracted to support India's linguistic diversity, using Gemini's native translation capabilities paired with verified electoral datasets.
- **Geospatial Discovery**: Mapping logic translates raw coordinates into actionable directions to the nearest verified polling booths.

### 🛠️ How the Solution Works
1. **User Profiling**: Users authenticate via Firebase and provide minimal demographic data.
2. **AI Interaction**: Queries sent to the **Ask Saathi** assistant are processed by a FastAPI backend. We use **Google Gemini** with a specialised System Instruction that restricts it to authoritative ECI sources, preventing AI hallucinations.
3. **Dynamic Resource Hub**: The dashboard dynamically fetches resources (Form 6, Voter Slip downloads) based on the current election cycle state.
4. **Accessibility Engine**: A custom-built engine intercepts the DOM to apply real-time accessibility transformations (Dyslexia fonts, contrast shifts) without page reloads.

### 📝 Assumptions Made
- **Internet Access**: The platform assumes users have at least a 3G/4G connection for real-time AI and Map rendering.
- **Location Permissions**: Assumes users will grant location access for accurate constituency mapping.
- **Verified Sources**: Assumes that information provided via the "Ask Saathi" assistant is cross-referenced with official ECI guidelines provided in the prompt context.

---


## 🚀 Key Features

### 🤖 AI-Powered "Saathi" Assistant
A context-aware chatbot powered by **Google Gemini** that provides authoritative voting guidance.
*   **Multilingual Support**: Available in English, Hindi, and Telugu (with support for 6+ more regional languages).
*   **Personalised Context**: Tailors advice based on the user's age, location, and voting history (First-time vs. Experienced).

### 📍 Real-Time Constituency Mapping
Integrated with **Google Maps API** for precise geospatial navigation.
*   **Polling Booth Locator**: Automatically detects the user's constituency and maps nearby polling stations with multi-marker visualisation.
*   **Live Directions**: Provides exact coordinates and addresses for verified polling booths.

### ♿ Universal Accessibility Engine
Built with inclusivity at its core for elderly and differently-abled voters.
*   **Dynamic Themes**: Support for Light, Dark, and High-Contrast modes.
*   **Accessibility Toolbar**: One-click toggles for Dyslexia-friendly fonts, Text Scaling, and Screen Reader optimisation.

### 📋 Official Resource Hub
*   **Direct Links**: Access to the ECI Voter Portal, 1950 Helpline, and Grievance portals.
*   **Personalised Reminders**: Set election dates and polling day alerts.

---

## 📸 Project Gallery

### 📊 Citizen Dashboard (Demo Mode)
![Dashboard Overview](screenshots/dashboard.png)

### 👥 Candidate Profiles
![Candidate List](screenshots/candidates.png)

### 🤖 AI-Powered "Ask Saathi" Assistant
![AI Assistant Chat](screenshots/ai_assistant.png)

### ♿ Universal Accessibility Engine (High Contrast)
![Accessibility Mode](screenshots/accessibility.png)

---


## 🛠️ Technical Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: FastAPI (Python), Pydantic, Uvicorn.
- **AI/ML**: Google Gemini (generative-ai SDK).
- **Cloud Services**: Firebase (Auth, Firestore), Google Cloud Platform (GCP).
- **APIs**: Google Maps JavaScript API, Reverse Geocoding API, Places API.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Google Cloud API Key (Gemini & Maps)
- Firebase Project Credentials

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Configure your .env file with API keys
python main.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Configure your .env.local with Firebase & Backend URL
npm run dev
```

---

## 🏛️ Digital Public Utility
VoteSaathi is designed to be a **Digital Public Infrastructure (DPI)** component, prioritizing privacy, security, and accessibility for all Indian citizens.

---

## 2.4 Data Model

### User
- `id`
- `age`
- `location`
- `language`
- `voter_status`

### Interaction
- `query`
- `response`
- `timestamp`

The backend enforces these structures through Pydantic models and frontend types.

## 2.5 Security

- Firebase security rules are defined in `firebase.rules` with per-user ownership checks.
- API keys are loaded server-side as secret values in backend settings.
- Request payloads are validated with strict schemas (`extra = forbid`, typed literals, and field bounds).

## 2.6 Performance

- Backend response caching for candidate lists and maps lookups (TTL cache).
- Optimized Firestore interaction query limits to prevent excessive reads.
- Lazy-loaded Google Maps marker UI in the constituency page to reduce initial bundle cost.

## 2.7 Testing

- Unit tests: schema/data-model validation in `backend/tests/test_schemas.py`.
- Integration tests: API endpoints and service wiring in `backend/tests/test_api.py`.
- Edge cases: empty/oversized chat input, invalid history role, and invalid coordinates.

Made with ❤️ for Indian Voters.
