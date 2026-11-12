from abc import ABC, abstractmethod
from typing import Optional

from app.cache import CacheBackend
from app.repositories import LessonRepository
from app.views import LessonPage


class LessonProvider(ABC):
    @abstractmethod
    async def get_page(
        self, cursor: int, limit: int, level: Optional[str]
    ) -> LessonPage: ...


class LessonService(LessonProvider):
    """Paginação por cursor (offset) para o scroll infinito."""

    def __init__(self, repo: LessonRepository):
        self._repo = repo

    async def get_page(self, cursor: int, limit: int, level: Optional[str]) -> LessonPage:
        items, total = await self._repo.page(cursor, limit, level)
        nxt = cursor + len(items)
        return LessonPage(
            items=items,
            next_cursor=nxt if items and nxt < total else None,
            total=total,
        )


class CachedLessonService(LessonProvider):
    def __init__(self, inner: LessonProvider, cache: CacheBackend, ttl: int):
        self._inner, self._cache, self._ttl = inner, cache, ttl

    async def get_page(self, cursor: int, limit: int, level: Optional[str]) -> LessonPage:
        key = f"lessons:{level or 'all'}:{cursor}:{limit}"

        async def produce() -> dict:
            return (await self._inner.get_page(cursor, limit, level)).model_dump()

        return LessonPage.model_validate(await self._cache.remember(key, self._ttl, produce))
