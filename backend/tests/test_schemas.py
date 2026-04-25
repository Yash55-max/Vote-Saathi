from datetime import UTC, datetime

import pytest
from pydantic import ValidationError

from schemas import ChatHistoryTurn, ChatRequest, InteractionModel, UserLocation, UserModel


def test_chat_history_role_validation() -> None:
    with pytest.raises(ValidationError):
        ChatHistoryTurn(role="assistant", content="hello")


def test_chat_request_limits_history_count() -> None:
    history = [{"role": "user", "content": "q"}] * 21
    with pytest.raises(ValidationError):
        ChatRequest(message="hello", history=history)


def test_user_model_data_contract() -> None:
    model = UserModel(
        id="user-123456",
        age=24,
        location=UserLocation(lat=17.385, lng=78.4867, constituency="Hyderabad", state="Telangana"),
        language="en",
        voter_status="first_time",
    )

    assert model.id == "user-123456"
    assert model.voter_status == "first_time"


def test_interaction_model_requires_timestamp() -> None:
    model = InteractionModel(
        uid="user-123456",
        query="Where is my polling booth?",
        response="Your nearest booth is ...",
        timestamp=datetime.now(UTC),
    )

    assert model.query
    assert model.response
