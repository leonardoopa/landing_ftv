"""Implementações MongoDB (pymongo async) das interfaces de repositório."""
from typing import Generic, Optional, Type, TypeVar

from pymongo.asynchronous.database import AsyncDatabase

from app.models import Lead, Lesson

from .base import LeadRepository, LessonRepository, ListRepository, SingletonRepository

T = TypeVar("T")

ACTIVE = {"active": True}
BY_ORDER = [("order", 1), ("_id", 1)]


class MongoListRepository(ListRepository[T], Generic[T]):
    def __init__(self, db: AsyncDatabase, collection: str, model: Type[T]):
        self._col = db[collection]
        self._model = model

    async def list(self) -> list[T]:
        cursor = self._col.find(ACTIVE).sort(BY_ORDER)
        return [self._model.model_validate(doc) async for doc in cursor]


class MongoSingletonRepository(SingletonRepository[T], Generic[T]):
    def __init__(self, db: AsyncDatabase, collection: str, model: Type[T]):
        self._col = db[collection]
        self._model = model

    async def get(self) -> Optional[T]:
        doc = await self._col.find_one({})
        return self._model.model_validate(doc) if doc else None


class MongoLessonRepository(LessonRepository):
    def __init__(self, db: AsyncDatabase):
        self._col = db["lessons"]

    async def page(
        self, offset: int, limit: int, level: Optional[str] = None
    ) -> tuple[list[Lesson], int]:
        query = dict(ACTIVE)
        if level:
            query["level"] = level
        total = await self._col.count_documents(query)
        cursor = self._col.find(query).sort(BY_ORDER).skip(offset).limit(limit)
        return [Lesson.model_validate(doc) async for doc in cursor], total


class MongoLeadRepository(LeadRepository):
    def __init__(self, db: AsyncDatabase):
        self._col = db["leads"]

    async def add(self, lead: Lead) -> str:
        data = lead.model_dump(mode="python")
        data["email"] = str(data["email"]) if data.get("email") else ""
        result = await self._col.insert_one(data)
        return str(result.inserted_id)
