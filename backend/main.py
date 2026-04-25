"""
VoteSaathi Backend — FastAPI Application
----------------------------------------
Refactored with modular routers and Google Cloud Logging integration.
"""
from __future__ import annotations

import os
import sys
os.environ.setdefault("PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION", "python")

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import get_settings
from schemas import HealthResponse
from routers import chat, location, candidates

# --- Google Cloud Logging Integration ---
try:
    import google.cloud.logging
    client = google.cloud.logging.Client()
    client.setup_logging()
    logging.info("✅ Google Cloud Logging initialized")
except Exception as e:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
    logging.warning(f"⚠️ Google Cloud Logging failed: {e}. Falling back to standard logging.")

log = logging.getLogger("votesaathi")
settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("🚀 VoteSaathi backend starting…")
    yield
    log.info("👋 VoteSaathi backend shutting down…")

app = FastAPI(
    title="VoteSaathi API",
    description="Backend API for VoteSaathi — Indian Election AI Assistant",
    version="1.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global Exception Handler ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    log.error(f"Unhandled error on {request.url}: {exc}", exc_info=True)
    return JSONResponse(status_code=500, content={"detail": "Internal server error. Please try again."})

# --- Health Check ---
@app.get("/", response_model=HealthResponse, tags=["Health"])
async def health_check():
    return HealthResponse(
        status="ok",
        version="1.1.0",
        services={
            "gemini": settings.has_gemini_api_key,
            "maps": settings.has_google_maps_api_key,
            "logging": "google-cloud" if "google.cloud.logging" in sys.modules else "standard"
        },
    )

# --- Include Routers ---
app.include_router(chat.router)
app.include_router(location.router)
app.include_router(candidates.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
