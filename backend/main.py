"""
VoteSaathi Backend — FastAPI Application
----------------------------------------
Routes:
  GET  /               → Health check
  POST /api/chat       → Gemini AI chat (context-aware)
  POST /api/constituency → Reverse geocode + polling booths
  GET  /api/candidates → Candidate list
"""
from __future__ import annotations

# ── Python 3.14 compatibility: force pure-Python protobuf BEFORE any imports ──
import os
os.environ.setdefault("PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION", "python")

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import get_settings
from schemas import (
    ChatRequest,
    ChatResponse,
    ConstituencyRequest,
    ConstituencyResponse,
    PollingBooth,
    CandidateResponse,
    HealthResponse,
)
import gemini_service
import maps_service

# ─── Config ──────────────────────────────────────────────────

settings = get_settings()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("votesaathi")

# ─── Mock candidate data (replace with Firestore/ECI API) ────

MOCK_CANDIDATES: list[dict] = [
    {"id": 1, "name": "G. Kishan Reddy",     "party": "Bharatiya Janata Party",  "party_short": "BJP", "constituency": "Secunderabad", "age": 61, "education": "Post Graduate",  "assets": "₹3.2 Cr",  "criminal_cases": 0},
    {"id": 2, "name": "Danam Nagender",       "party": "Indian National Congress", "party_short": "INC", "constituency": "Secunderabad", "age": 64, "education": "Graduate",        "assets": "₹8.7 Cr",  "criminal_cases": 1},
    {"id": 3, "name": "P. Vinod Kumar Reddy", "party": "Bharat Rashtra Samithi",  "party_short": "BRS", "constituency": "Secunderabad", "age": 52, "education": "Post Graduate",  "assets": "₹12.1 Cr", "criminal_cases": 0},
    {"id": 4, "name": "S. Ramesh",            "party": "Bahujan Samaj Party",      "party_short": "BSP", "constituency": "Secunderabad", "age": 45, "education": "Graduate",        "assets": "₹0.8 Cr",  "criminal_cases": 0},
    {"id": 5, "name": "V. Anand",             "party": "Aam Aadmi Party",          "party_short": "AAP", "constituency": "Hyderabad",    "age": 38, "education": "Post Graduate",  "assets": "₹1.2 Cr",  "criminal_cases": 0},
    {"id": 6, "name": "K. Chandrashekar Rao", "party": "Bharat Rashtra Samithi",  "party_short": "BRS", "constituency": "Hyderabad",    "age": 69, "education": "Graduate",        "assets": "₹25.4 Cr", "criminal_cases": 2},
]

# ─── Lifespan ─────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("🚀 VoteSaathi backend starting…")
    # Optionally init Firebase here
    # try:
    #     from firebase_client import init_firebase
    #     init_firebase()
    #     log.info("✅ Firebase initialized")
    # except Exception as e:
    #     log.warning(f"⚠️  Firebase not initialized: {e}")
    yield
    log.info("👋 VoteSaathi backend shutting down…")


# ─── App ─────────────────────────────────────────────────────

app = FastAPI(
    title="VoteSaathi API",
    description="Backend API for VoteSaathi — Indian Election AI Assistant",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Global error handler ─────────────────────────────────────

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    log.error(f"Unhandled error on {request.url}: {exc}", exc_info=True)
    return JSONResponse(status_code=500, content={"detail": "Internal server error. Please try again."})


# ─── Routes ──────────────────────────────────────────────────

@app.get("/", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint."""
    gemini_ok = bool(settings.gemini_api_key)
    maps_ok   = bool(settings.google_maps_api_key)
    return HealthResponse(
        status="ok",
        version="1.0.0",
        services={"gemini": gemini_ok, "maps": maps_ok},
    )


@app.post("/api/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(body: ChatRequest):
    """
    Send a message to the VoteSaathi AI assistant.

    The Gemini model receives full user context (age, location, language,
    first-time voter status) injected into the system prompt, ensuring
    personalized, relevant responses.
    """
    if not settings.gemini_api_key:
        raise HTTPException(
            status_code=503,
            detail="Gemini API key not configured. Set GEMINI_API_KEY in .env"
        )

    # Sanitise input
    message = body.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    ctx = body.context
    history = [{"role": t.role, "content": t.content} for t in body.history]

    log.info(f"Chat request | lang={ctx.language} age={ctx.age} loc={ctx.location}")

    try:
        response_text = await gemini_service.get_ai_response(
            message=message,
            language=ctx.language,
            age=ctx.age,
            location=ctx.location,
            first_time_voter=ctx.first_time_voter,
            chat_history=history,
        )
    except Exception as e:
        log.error(f"Gemini API error: {e}")
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")

    return ChatResponse(response=response_text, language=ctx.language)


@app.post("/api/constituency", response_model=ConstituencyResponse, tags=["Location"])
async def get_constituency(body: ConstituencyRequest):
    """
    Reverse geocode lat/lng → constituency + nearest polling booths.
    """
    if not settings.google_maps_api_key:
        # Return mock data when Maps API key is not configured
        log.warning("Maps API key not set — returning mock constituency data.")
        return ConstituencyResponse(
            constituency="Secunderabad",
            state="Telangana",
            formatted_address="Secunderabad, Hyderabad, Telangana, India",
            booths=[
                PollingBooth(id=1, name="Govt. High School, MG Road",     address="MG Road, Secunderabad",           lat=body.lat, lng=body.lng),
                PollingBooth(id=2, name="Municipal Corporation Building",  address="Clock Tower, Secunderabad",       lat=body.lat, lng=body.lng),
                PollingBooth(id=3, name="Community Hall, Trimulgherry",    address="Trimulgherry, Secunderabad",      lat=body.lat, lng=body.lng),
            ],
        )

    try:
        geocode_result = await maps_service.reverse_geocode(body.lat, body.lng)
        raw_booths     = await maps_service.find_polling_booths(body.lat, body.lng)
    except Exception as e:
        log.error(f"Maps API error: {e}")
        raise HTTPException(status_code=502, detail=f"Maps service error: {str(e)}")

    booths = [
        PollingBooth(
            id=b.get("id", i),
            name=b.get("name", f"Booth {i+1}"),
            address=b.get("address", ""),
            lat=b.get("lat"),
            lng=b.get("lng"),
        )
        for i, b in enumerate(raw_booths)
    ]

    return ConstituencyResponse(
        constituency=geocode_result["constituency"],
        state=geocode_result["state"],
        formatted_address=geocode_result["formatted_address"],
        booths=booths,
    )


@app.get("/api/candidates", response_model=list[CandidateResponse], tags=["Candidates"])
async def get_candidates(constituency: str | None = None):
    """
    Return candidate list, optionally filtered by constituency.
    """
    candidates = MOCK_CANDIDATES
    if constituency:
        candidates = [c for c in candidates if c["constituency"].lower() == constituency.lower()]
    return [CandidateResponse(**c) for c in candidates]


# ─── Entry point ─────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
