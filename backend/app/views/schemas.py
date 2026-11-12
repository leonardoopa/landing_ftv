"""VIEW (MVC): contratos de resposta JSON expostos pela API."""
from typing import Optional

from pydantic import BaseModel

from app.models import Benefit, Faq, Lesson, MethodStep, Plan, SiteConfig, Testimonial


class LandingResponse(BaseModel):
    site: SiteConfig
    steps: list[MethodStep]
    benefits: list[Benefit]
    plans: list[Plan]
    testimonials: list[Testimonial]
    faqs: list[Faq]


class LessonPage(BaseModel):
    items: list[Lesson]
    next_cursor: Optional[int]
    total: int


class LeadAccepted(BaseModel):
    id: str
    message: str = "Recebemos seu contato! Falamos com você no WhatsApp."
