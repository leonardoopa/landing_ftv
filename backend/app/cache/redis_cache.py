import json
import logging
from typing import Any

from redis.asyncio import Redis

from .base import CacheBackend

log = logging.getLogger(__name__)


class RedisCache(CacheBackend):
    """Cache Redis. Se o Redis cair, degrada para 'sem cache' em vez de quebrar."""

    def __init__(self, client: Redis):
        self._r = client

    async def get(self, key: str) -> Any | None:
        try:
            raw = await self._r.get(key)
            return json.loads(raw) if raw else None
        except Exception as exc:  # noqa: BLE001
            log.warning("cache get falhou: %s", exc)
            return None

    async def set(self, key: str, value: Any, ttl: int) -> None:
        try:
            await self._r.set(key, json.dumps(value, default=str), ex=ttl)
        except Exception as exc:  # noqa: BLE001
            log.warning("cache set falhou: %s", exc)

    async def delete_prefix(self, prefix: str) -> None:
        try:
            async for key in self._r.scan_iter(match=f"{prefix}*"):
                await self._r.delete(key)
        except Exception as exc:  # noqa: BLE001
            log.warning("cache delete falhou: %s", exc)

    async def hit(self, key: str, window: int) -> int:
        try:
            total = await self._r.incr(key)
            if total == 1:
                await self._r.expire(key, window)
            return int(total)
        except Exception as exc:  # noqa: BLE001
            log.warning("rate limit indisponível: %s", exc)
            return 0
