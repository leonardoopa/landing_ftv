"""Abstração de cache (DIP): serviços dependem disto, não do Redis."""
from abc import ABC, abstractmethod
from typing import Any, Awaitable, Callable


class CacheBackend(ABC):
    @abstractmethod
    async def get(self, key: str) -> Any | None: ...

    @abstractmethod
    async def set(self, key: str, value: Any, ttl: int) -> None: ...

    @abstractmethod
    async def delete_prefix(self, prefix: str) -> None: ...

    @abstractmethod
    async def hit(self, key: str, window: int) -> int:
        """Incrementa contador com expiração. Retorna o total na janela."""

    async def remember(
        self, key: str, ttl: int, producer: Callable[[], Awaitable[Any]]
    ) -> Any:
        cached = await self.get(key)
        if cached is not None:
            return cached
        value = await producer()
        await self.set(key, value, ttl)
        return value
