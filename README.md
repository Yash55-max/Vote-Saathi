# 🗳️ VoteSaathi: Your Digital Election Companion

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI%20Assistant-4285F4?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![Google Maps](https://img.shields.io/badge/Google%20Maps-Geospatial-4285F4?style=for-the-badge&logo=google-maps)](https://mapsplatform.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**VoteSaathi** is a context-aware, accessible digital public utility designed to empower Indian citizens through the democratic process. It provides personalized election guidance, multi-language AI assistance, and real-time polling booth navigation to ensure no voter is left behind.

---

## 🚀 Key Features

### 🤖 AI-Powered "Saathi" Assistant
A context-aware chatbot powered by **Google Gemini** that provides authoritative voting guidance.
*   **Multilingual Support**: Available in English, Hindi, and Telugu (with support for 6+ more regional languages).
*   **Personalized Context**: Tailors advice based on the user's age, location, and voting history (First-time vs. Experienced).

### 📍 Real-Time Constituency Mapping
Integrated with **Google Maps API** for precise geospatial navigation.
*   **Polling Booth Locator**: Automatically detects the user's constituency and maps nearby polling stations with multi-marker visualization.
*   **Live Directions**: Provides exact coordinates and addresses for verified polling booths.

### ♿ Universal Accessibility Engine
Built with inclusivity at its core for elderly and differently-abled voters.
*   **Dynamic Themes**: Support for Light, Dark, and High-Contrast modes.
*   **Accessibility Toolbar**: One-click toggles for Dyslexia-friendly fonts, Text Scaling, and Screen Reader optimization.

### 📋 Official Resource Hub
*   **Direct Links**: Access to the ECI Voter Portal, 1950 Helpline, and Grievance portals.
*   **Personalized Reminders**: Set election dates and polling day alerts.

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

Made with ❤️ for Indian Voters.
