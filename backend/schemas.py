"""
Pydantic request/response schemas for all API routes.
"""
from __future__ import annotations

from pydantic import BaseModel, Field
from typing import Optional


# ─── Chat ────────────────────────────────────────────────────

class ChatContext(BaseModel):
    language: str = Field(default="en", pattern="^(en|hi|te)$")
    age: Optional[int] = Field(default=None, ge=18, le=120)
    location: Optional[str] = None
    first_time_voter: Optional[bool] = None


class ChatHistoryTurn(BaseModel):
    role: str   # "user" or "model"
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    context: ChatContext = Field(default_factory=ChatContext)
    history: list[ChatHistoryTurn] = Field(default_factory=list)


class ChatResponse(BaseModel):
    response: str
    language: str


# ─── Constituency ────────────────────────────────────────────

class ConstituencyRequest(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)


class PollingBooth(BaseModel):
    id: str | int
    name: str
    address: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    distance: Optional[str] = None


class ConstituencyResponse(BaseModel):
    constituency: str
    state: str
    formatted_address: str
    booths: list[PollingBooth]


# ─── Candidates ──────────────────────────────────────────────

class CandidateResponse(BaseModel):
    id: int
    name: str
    party: str
    party_short: str
    constituency: str
    age: int
    education: str
    assets: str
    criminal_cases: int


# ─── Health ──────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str
    version: str
    services: dict[str, bool]
