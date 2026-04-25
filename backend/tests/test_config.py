import os

from config import get_settings


def test_settings_secret_flags(monkeypatch) -> None:
    monkeypatch.setenv('GEMINI_API_KEY', 'abc123')
    monkeypatch.setenv('GOOGLE_MAPS_API_KEY', '')

    get_settings.cache_clear()
    settings = get_settings()

    assert settings.has_gemini_api_key is True
    assert settings.gemini_api_key_value == 'abc123'
    assert settings.has_google_maps_api_key is False

    get_settings.cache_clear()


def test_allowed_origins_parsing(monkeypatch) -> None:
    monkeypatch.setenv('ALLOWED_ORIGINS', 'http://localhost:3000, https://example.com ')

    get_settings.cache_clear()
    settings = get_settings()

    assert settings.origins_list == ['http://localhost:3000', 'https://example.com']

    get_settings.cache_clear()
