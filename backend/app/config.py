"""Configuração central lida de variáveis de ambiente (.env)."""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    mongo_uri: str = "mongodb://mongo:27017"
    mongo_db: str = "landing_ftv"
    redis_url: str = "redis://redis:6379/0"
    cache_ttl: int = 300
    lead_rate_limit: int = 5
    lead_rate_window: int = 60
    whatsapp_number: str = "5511999999999"
    cors_origins: str = "http://localhost:5173"
    frontend_dist: str = "/app/frontend_dist"
    static_root: str = "/app/staticfiles"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
