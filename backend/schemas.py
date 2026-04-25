"""
Pydantic request/response schemas for all API routes.
"""
from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, Field
from pydantic.config import ConfigDict
from typing import Literal, Optional


# ─── Chat ────────────────────────────────────────────────────

class ChatContext(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    language: str = Field(default="en", pattern="^(en|hi|te|ta|kn|ml|mr|bn|gu)$")
    age: Optional[int] = Field(default=None, ge=18, le=120)
    location: Optional[str] = Field(default=None, min_length=2, max_length=120)
    first_time_voter: Optional[bool] = None


class ChatHistoryTurn(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    role: Literal["user", "model"]
    content: str = Field(..., min_length=1, max_length=1000)


class ChatRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    message: str = Field(..., min_length=1, max_length=1000)
    context: ChatContext = Field(default_factory=ChatContext)
    history: list[ChatHistoryTurn] = Field(default_factory=list, max_length=20)


class ChatResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    response: str
    language: str


# ─── Constituency ────────────────────────────────────────────

class ConstituencyRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)


class PollingBooth(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    id: str | int
    name: str
    address: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    distance: Optional[str] = None


class ConstituencyResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    constituency: str
    state: str
    formatted_address: str
    booths: list[PollingBooth]


# ─── Candidates ──────────────────────────────────────────────

class CandidateResponse(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

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
    model_config = ConfigDict(extra="forbid")

    status: str
    version: str
    services: dict[str, bool]


# ─── Firestore Data Models ──────────────────────────────────

class UserLocation(BaseModel):
    model_config = ConfigDict(extra="forbid")

    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    constituency: Optional[str] = Field(default=None, min_length=2, max_length=120)
    state: Optional[str] = Field(default=None, min_length=2, max_length=120)


class UserModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    id: str = Field(..., min_length=6, max_length=128)
    age: int = Field(..., ge=18, le=120)
    location: Optional[UserLocation] = None
    language: Literal["en", "hi", "te", "ta", "kn", "ml", "mr", "bn", "gu"]
    voter_status: Literal["first_time", "returning"]


class InteractionModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    uid: str = Field(..., min_length=6, max_length=128)
    query: str = Field(..., min_length=1, max_length=1000)
    response: str = Field(..., min_length=1, max_length=4000)
    timestamp: datetime
