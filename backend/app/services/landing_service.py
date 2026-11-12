import asyncio
from abc import ABC, abstractmethod

from app.cache import CacheBackend
from app.models import Benefit, Faq, Fundamental, MethodStep, Plan, SiteConfig, Testimonial
from app.repositories import ListRepository, SingletonRepository
from app.views import LandingResponse

LANDING_CACHE_KEY = "landing:v2"


class LandingProvider(ABC):
    @abstractmethod
    async def get_landing(self) -> LandingResponse: ...


class LandingService(LandingProvider):
    """Monta o payload da landing a partir dos repositórios."""

    def __init__(
        self,
        site: SingletonRepository[SiteConfig],
        steps: ListRepository[MethodStep],
        fundamentals: ListRepository[Fundamental],
        benefits: ListRepository[Benefit],
        plans: ListRepository[Plan],
        testimonials: ListRepository[Testimonial],
        faqs: ListRepository[Faq],
    ):
        self._site, self._steps, self._benefits = site, steps, benefits
        self._plans, self._testimonials, self._faqs = plans, testimonials, faqs
        self._fundamentals = fundamentals

    async def get_landing(self) -> LandingResponse:
        site, steps, benefits, plans, testimonials, faqs, fundamentals = await asyncio.gather(
            self._site.get(),
            self._steps.list(),
            self._benefits.list(),
            self._plans.list(),
            self._testimonials.list(),
            self._faqs.list(),
            self._fundamentals.list(),
        )
        return LandingResponse(
            site=site or SiteConfig(),
            steps=steps,
            fundamentals=fundamentals,
            benefits=benefits,
            plans=plans,
            testimonials=testimonials,
            faqs=faqs,
        )


class CachedLandingService(LandingProvider):
    """Decorator (OCP): adiciona cache sem alterar LandingService."""

    def __init__(self, inner: LandingProvider, cache: CacheBackend, ttl: int):
        self._inner, self._cache, self._ttl = inner, cache, ttl

    async def get_landing(self) -> LandingResponse:
        async def produce() -> dict:
            return (await self._inner.get_landing()).model_dump()

        data = await self._cache.remember(LANDING_CACHE_KEY, self._ttl, produce)
        return LandingResponse.model_validate(data)
