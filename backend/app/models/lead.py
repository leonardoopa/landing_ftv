import re
from datetime import datetime, timezone
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

Level = Literal["iniciante", "intermediario"]
Source = Literal["landing", "quiz"]


class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    whatsapp: str
    email: Optional[EmailStr] = None
    level: Level = "iniciante"
    plan: Optional[str] = Field(default=None, max_length=40)
    source: Source = "landing"

    @field_validator("whatsapp")
    @classmethod
    def _digits_only(cls, value: str) -> str:
        digits = re.sub(r"\D", "", value)
        if not 10 <= len(digits) <= 13:
            raise ValueError("WhatsApp inválido")
        return digits


class Lead(LeadCreate):
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
