from pydantic_settings import BaseSettings
from pydantic_settings import SettingsConfigDict
from pydantic import SecretStr
from functools import lru_cache


class Settings(BaseSettings):
    gemini_api_key: SecretStr = SecretStr("")
    google_maps_api_key: SecretStr = SecretStr("")
    firebase_service_account_path: str = "./firebase-service-account.json"
    allowed_origins: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    @property
    def gemini_api_key_value(self) -> str:
        return self.gemini_api_key.get_secret_value().strip()

    @property
    def google_maps_api_key_value(self) -> str:
        return self.google_maps_api_key.get_secret_value().strip()

    @property
    def has_gemini_api_key(self) -> bool:
        return bool(self.gemini_api_key_value)

    @property
    def has_google_maps_api_key(self) -> bool:
        return bool(self.google_maps_api_key_value)


@lru_cache()
def get_settings() -> Settings:
    return Settings()
