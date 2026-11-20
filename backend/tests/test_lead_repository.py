import os
import unittest
from uuid import uuid4

from pymongo import AsyncMongoClient

from app.models.lead import Lead
from app.repositories.mongo import MongoLeadRepository

MONGO_URL = os.environ.get("MONGO_URL") or os.environ.get("MONGODB_URL") or "mongodb://mongo:27017"


class LeadRepositoryTest(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.client = AsyncMongoClient(MONGO_URL)
        self.db = self.client[f"test_{uuid4().hex}"]
        self.repo = MongoLeadRepository(self.db)
        await self.repo.ensure_indexes()

    async def asyncTearDown(self):
        await self.client.drop_database(self.db.name)
        await self.client.close()

    def _lead(self, **kw):
        base = dict(name="Ana", whatsapp="11999998888")
        base.update(kw)
        return Lead(**base)

    async def test_new_quiz_stores_plan_and_source(self):
        lead_id = await self.repo.add(self._lead(source="quiz", plan="Completo"))
        doc = await self.db["leads"].find_one({"whatsapp": "11999998888"})
        self.assertEqual(str(doc["_id"]), lead_id)
        self.assertEqual(doc["plan"], "Completo")
        self.assertEqual(doc["source"], "quiz")

    async def test_landing_without_plan_stores_empty_string(self):
        await self.repo.add(self._lead())
        doc = await self.db["leads"].find_one({"whatsapp": "11999998888"})
        self.assertEqual(doc["plan"], "")

    async def test_quiz_repeat_updates_plan_and_level_only(self):
        first = await self.repo.add(self._lead(level="iniciante"))
        original = await self.db["leads"].find_one({"whatsapp": "11999998888"})
        second = await self.repo.add(
            self._lead(name="Outro", source="quiz", level="intermediario", plan="Completo")
        )
        self.assertEqual(first, second)
        doc = await self.db["leads"].find_one({"whatsapp": "11999998888"})
        self.assertEqual(doc["plan"], "Completo")
        self.assertEqual(doc["level"], "intermediario")
        self.assertEqual(doc["name"], "Ana")
        self.assertEqual(doc["created_at"], original["created_at"])
        self.assertEqual(doc["source"], "landing")

    async def test_landing_repeat_keeps_quiz_data(self):
        first = await self.repo.add(self._lead(source="quiz", level="intermediario", plan="Premium"))
        second = await self.repo.add(self._lead(level="iniciante"))
        self.assertEqual(first, second)
        doc = await self.db["leads"].find_one({"whatsapp": "11999998888"})
        self.assertEqual(doc["plan"], "Premium")
        self.assertEqual(doc["level"], "intermediario")
