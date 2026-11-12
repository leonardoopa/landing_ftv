import re
from datetime import datetime, timezone
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

Level = Literal["iniciante", "intermediario"]


class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    whatsapp: str
    email: Optional[EmailStr] = None
    level: Level = "iniciante"

    @field_validator("whatsapp")
    @classmethod
    def _digits_only(cls, value: str) -> str:
        digits = re.sub(r"\D", "", value)
        if not 10 <= len(digits) <= 13:
            raise ValueError("WhatsApp inválido")
        return digits


class Lead(LeadCreate):
    source: str = "landing"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
