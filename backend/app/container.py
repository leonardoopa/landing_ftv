"""Composition root: único lugar que conhece as implementações concretas."""
from pymongo import AsyncMongoClient
from redis.asyncio import Redis

from app.cache import CacheBackend, RedisCache
from app.config import Settings
from app.models import Benefit, Faq, Fundamental, MethodStep, Plan, SiteConfig, Testimonial
from app.repositories import (
    MongoLeadRepository,
    MongoLessonRepository,
    MongoListRepository,
    MongoSingletonRepository,
)
from app.services import (
    CachedLandingService,
    CachedLessonService,
    LandingProvider,
    LandingService,
    LeadService,
    LessonProvider,
    LessonService,
    RateLimiter,
)


class Container:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.mongo = AsyncMongoClient(settings.mongo_uri)
        self.db = self.mongo[settings.mongo_db]
        self.redis = Redis.from_url(settings.redis_url, decode_responses=True)
        self.cache: CacheBackend = RedisCache(self.redis)

        self.landing: LandingProvider = CachedLandingService(
            LandingService(
                MongoSingletonRepository(self.db, "site_config", SiteConfig),
                MongoListRepository(self.db, "method_steps", MethodStep),
                MongoListRepository(self.db, "fundamentals", Fundamental),
                MongoListRepository(self.db, "benefits", Benefit),
                MongoListRepository(self.db, "plans", Plan),
                MongoListRepository(self.db, "testimonials", Testimonial),
                MongoListRepository(self.db, "faqs", Faq),
            ),
            self.cache,
            settings.cache_ttl,
        )
        self.lessons: LessonProvider = CachedLessonService(
            LessonService(MongoLessonRepository(self.db)),
            self.cache,
            settings.cache_ttl,
        )
        self.lead_repo = MongoLeadRepository(self.db)
        self.leads = LeadService(
            self.lead_repo,
            RateLimiter(self.cache, settings.lead_rate_limit, settings.lead_rate_window),
        )

    async def close(self) -> None:
        await self.mongo.close()
        await self.redis.aclose()
