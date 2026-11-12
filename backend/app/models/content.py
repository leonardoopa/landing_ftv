"""MODEL (MVC): entidades de domínio. Sem dependência de banco ou HTTP."""
from typing import Any

from pydantic import AliasChoices, BaseModel, ConfigDict, Field, field_validator


class MongoModel(BaseModel):
    """Base: lê `_id` do Mongo (ou `id` do cache) e sempre expõe `id` string."""

    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    id: str = Field(default="", validation_alias=AliasChoices("_id", "id"))

    @field_validator("id", mode="before")
    @classmethod
    def _stringify_id(cls, value: Any) -> str:
        return str(value) if value is not None else ""


class SiteConfig(MongoModel):
    brand: str = "Areia Futevôlei"
    hero_eyebrow: str = ""
    hero_title: str = ""
    hero_subtitle: str = ""
    hero_video_url: str = ""
    hero_image_url: str = ""
    cta_label: str = "Quero minha aula experimental"
    cta_url: str = ""
    whatsapp: str = ""
    instagram: str = ""
    stats: list[dict[str, str]] = Field(default_factory=list)
    marquee: list[str] = Field(default_factory=list)


class MethodStep(MongoModel):
    title: str
    text: str
    tag: str = ""
    image_url: str = ""
    order: int = 0


class Benefit(MongoModel):
    title: str
    description: str
    icon: str = "ball"
    order: int = 0


class Plan(MongoModel):
    name: str
    badge: str = ""
    price_from: str = ""
    price: str
    installments: str = ""
    features: list[str] = Field(default_factory=list)
    highlight: bool = False
    cta_label: str = "Quero esse plano"
    cta_url: str = ""
    order: int = 0


class Testimonial(MongoModel):
    name: str
    role: str = ""
    quote: str
    avatar_url: str = ""
    order: int = 0


class Faq(MongoModel):
    question: str
    answer: str
    order: int = 0


class Lesson(MongoModel):
    title: str
    category: str
    level: str
    description: str = ""
    duration_min: int = 10
    cover_url: str = ""
    order: int = 0
