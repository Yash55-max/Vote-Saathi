from pydantic import SecretStr
from fastapi.testclient import TestClient

import main as app_main

client = TestClient(app_main.app)


def test_health_endpoint_returns_service_flags() -> None:
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "services" in data
    assert "gemini" in data["services"]
    assert "maps" in data["services"]


def test_chat_rejects_empty_message() -> None:
    app_main.settings.gemini_api_key = SecretStr("test-key")

    response = client.post(
        "/api/chat",
        json={"message": "   ", "context": {"language": "en"}, "history": []},
    )

    assert response.status_code == 422


def test_chat_accepts_valid_request(monkeypatch) -> None:
    async def _fake_ai_response(**kwargs):
        return "This is a mock reply"

    app_main.settings.gemini_api_key = SecretStr("test-key")
    monkeypatch.setattr(app_main.gemini_service, "get_ai_response", _fake_ai_response)

    response = client.post(
        "/api/chat",
        json={
            "message": "How do I register?",
            "context": {
                "language": "en",
                "age": 20,
                "location": "Hyderabad",
                "first_time_voter": True,
            },
            "history": [{"role": "user", "content": "hello"}],
        },
    )

    assert response.status_code == 200
    assert response.json()["response"] == "This is a mock reply"


def test_chat_edge_case_rejects_oversized_message() -> None:
    response = client.post(
        "/api/chat",
        json={"message": "x" * 1001, "context": {"language": "en"}, "history": []},
    )
    assert response.status_code == 422


def test_chat_edge_case_rejects_invalid_history_role() -> None:
    response = client.post(
        "/api/chat",
        json={
            "message": "hello",
            "context": {"language": "en"},
            "history": [{"role": "assistant", "content": "invalid role"}],
        },
    )
    assert response.status_code == 422


def test_constituency_returns_mock_when_key_missing() -> None:
    app_main.settings.google_maps_api_key = SecretStr("")

    response = client.post("/api/constituency", json={"lat": 17.385, "lng": 78.4867})

    assert response.status_code == 200
    data = response.json()
    assert "booths" in data
    assert len(data["booths"]) > 0


def test_constituency_uses_maps_service_when_key_present(monkeypatch) -> None:
    async def _fake_reverse(lat: float, lng: float):
        return {
            "constituency": "Hyderabad",
            "state": "Telangana",
            "formatted_address": "Hyderabad, Telangana, India",
        }

    async def _fake_booths(lat: float, lng: float):
        return [
            {
                "id": "booth-1",
                "name": "Govt School",
                "address": "Main Road",
                "lat": lat,
                "lng": lng,
            }
        ]

    app_main.settings.google_maps_api_key = SecretStr("maps-key")
    monkeypatch.setattr(app_main.maps_service, "reverse_geocode", _fake_reverse)
    monkeypatch.setattr(app_main.maps_service, "find_polling_booths", _fake_booths)

    response = client.post("/api/constituency", json={"lat": 17.385, "lng": 78.4867})

    assert response.status_code == 200
    data = response.json()
    assert data["constituency"] == "Hyderabad"
    assert data["booths"][0]["name"] == "Govt School"


def test_constituency_edge_case_invalid_coordinates() -> None:
    response = client.post("/api/constituency", json={"lat": 95, "lng": 180})
    assert response.status_code == 422


def test_candidates_filter_by_constituency() -> None:
    response = client.get("/api/candidates", params={"constituency": "Secunderabad"})
    assert response.status_code == 200
    data = response.json()
    assert all(item["constituency"] == "Secunderabad" for item in data)
