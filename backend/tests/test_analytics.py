import pytest
from analytics import log_interaction

@pytest.mark.asyncio
async def test_log_interaction_basic():
    """Test that logging interaction doesn't crash the system."""
    try:
        await log_interaction("What is voting?", "en", 25, "Delhi")
        success = True
    except Exception:
        success = False
    assert success is True

@pytest.mark.asyncio
async def test_log_interaction_none_values():
    """Test with None values for optional fields."""
    try:
        await log_interaction("Election dates", "hi", None, None)
        success = True
    except Exception:
        success = False
    assert success is True
