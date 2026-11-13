"""Interfaces pequenas e segregadas (ISP). Serviços dependem só delas (DIP)."""
from abc import ABC, abstractmethod
from typing import Generic, Optional, TypeVar

from app.models import Lead, Lesson

T = TypeVar("T")


class ListRepository(ABC, Generic[T]):
    @abstractmethod
    async def list(self) -> list[T]: ...


class SingletonRepository(ABC, Generic[T]):
    @abstractmethod
    async def get(self) -> Optional[T]: ...


class LessonRepository(ABC):
    @abstractmethod
    async def page(
        self, offset: int, limit: int, level: Optional[str] = None
    ) -> tuple[list[Lesson], int]: ...


class LeadRepository(ABC):
    @abstractmethod
    async def add(self, lead: Lead) -> str: ...

    async def ensure_indexes(self) -> None:
        """Hook opcional para criar índices. Padrão: nada."""
        return None
