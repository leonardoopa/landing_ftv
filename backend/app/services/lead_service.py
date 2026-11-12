from fastapi import HTTPException, status

from app.cache import CacheBackend
from app.models import Lead, LeadCreate
from app.repositories import LeadRepository


class RateLimiter:
    """Limita requisições por chave (ex.: IP) numa janela, via cache."""

    def __init__(self, cache: CacheBackend, limit: int, window: int):
        self._cache, self._limit, self._window = cache, limit, window

    async def check(self, key: str) -> None:
        if await self._cache.hit(f"rl:{key}", self._window) > self._limit:
            raise HTTPException(
                status.HTTP_429_TOO_MANY_REQUESTS,
                "Muitas tentativas. Aguarde um minuto.",
            )


class LeadService:
    def __init__(self, repo: LeadRepository, limiter: RateLimiter):
        self._repo, self._limiter = repo, limiter

    async def register(self, payload: LeadCreate, client_key: str) -> str:
        await self._limiter.check(f"lead:{client_key}")
        return await self._repo.add(Lead(**payload.model_dump()))
