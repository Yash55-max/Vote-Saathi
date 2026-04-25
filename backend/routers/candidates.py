from fastapi import APIRouter
from schemas import CandidateResponse
from cache import TTLCache
import logging

router = APIRouter(prefix="/api/candidates", tags=["Candidates"])
log = logging.getLogger("votesaathi")

_candidate_cache: TTLCache[list[CandidateResponse]] = TTLCache(ttl_seconds=120, max_items=128)

MOCK_CANDIDATES = [
    {"id": 1, "name": "G. Kishan Reddy", "party": "Bharatiya Janata Party", "party_short": "BJP", "constituency": "Secunderabad", "age": 61, "education": "Post Graduate", "assets": "₹3.2 Cr", "criminal_cases": 0},
    {"id": 2, "name": "Danam Nagender", "party": "Indian National Congress", "party_short": "INC", "constituency": "Secunderabad", "age": 64, "education": "Graduate", "assets": "₹8.7 Cr", "criminal_cases": 1},
    {"id": 3, "name": "P. Vinod Kumar Reddy", "party": "Bharat Rashtra Samithi", "party_short": "BRS", "constituency": "Secunderabad", "age": 52, "education": "Post Graduate", "assets": "₹12.1 Cr", "criminal_cases": 0},
    {"id": 4, "name": "S. Ramesh", "party": "Bahujan Samaj Party", "party_short": "BSP", "constituency": "Secunderabad", "age": 45, "education": "Graduate", "assets": "₹0.8 Cr", "criminal_cases": 0},
    {"id": 5, "name": "V. Anand", "party": "Aam Aadmi Party", "party_short": "AAP", "constituency": "Hyderabad", "age": 38, "education": "Post Graduate", "assets": "₹1.2 Cr", "criminal_cases": 0},
    {"id": 6, "name": "K. Chandrashekar Rao", "party": "Bharat Rashtra Samithi", "party_short": "BRS", "constituency": "Hyderabad", "age": 69, "education": "Graduate", "assets": "₹25.4 Cr", "criminal_cases": 2},
]

@router.get("", response_model=list[CandidateResponse])
async def get_candidates(constituency: str | None = None):
    """
    Return candidate list, optionally filtered by constituency.
    """
    cache_key = (constituency or "ALL").strip().lower()
    cached = _candidate_cache.get(cache_key)
    if cached is not None:
        return cached

    candidates = MOCK_CANDIDATES
    if constituency:
        needle = constituency.strip().lower()
        candidates = [c for c in candidates if c["constituency"].lower() == needle]

    result = [CandidateResponse(**c) for c in candidates]
    _candidate_cache.set(cache_key, result)
    return result
