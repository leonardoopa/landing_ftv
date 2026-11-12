"""Popula o Mongo na primeira subida (idempotente: só insere se a coleção está vazia)."""
import logging
from urllib.parse import quote

from pymongo.asynchronous.database import AsyncDatabase

from . import data

log = logging.getLogger(__name__)


async def _seed(db: AsyncDatabase, name: str, docs: list[dict]) -> None:
    if await db[name].count_documents({}) == 0:
        await db[name].insert_many(docs)
        log.info("seed: %s (%d)", name, len(docs))


async def seed_all(db: AsyncDatabase, whatsapp_number: str) -> None:
    msg = quote("Oi! Quero fazer uma aula experimental de futevôlei.")
    wa_url = f"https://wa.me/{whatsapp_number}?text={msg}"

    await _seed(db, "site_config", [{
        "brand": "Areia Futevôlei",
        "hero_eyebrow": "Aulas de futevôlei online e na areia",
        "hero_title": "Domine a bola. Domine a areia.",
        "hero_subtitle": "Do primeiro toque à cortada. Fundamentos, técnica e tática em aulas curtas para você evoluir de verdade.",
        "hero_video_url": "/assets/hero.mp4",
        "hero_image_url": "/assets/hero.jpg",
        "cta_label": "Quero minha aula experimental",
        "cta_url": wa_url,
        "whatsapp": whatsapp_number,
        "instagram": "https://instagram.com/",
        "stats": [
            {"value": "30", "label": "videoaulas"},
            {"value": "3", "label": "níveis"},
            {"value": "15", "label": "dias de garantia"},
        ],
        "marquee": ["Toque", "Manchete", "Saque", "Chapa", "Cortada", "Defesa", "Bicicleta", "Tática 2x2"],
    }])

    await _seed(db, "method_steps", [
        {"title": t, "text": x, "tag": g, "image_url": "", "order": i, "active": True}
        for i, (_, t, x, g) in enumerate(data.STEPS)
    ])
    await _seed(db, "benefits", [
        {"title": t, "description": d, "icon": ic, "order": i, "active": True}
        for i, (t, d, ic) in enumerate(data.BENEFITS)
    ])
    await _seed(db, "plans", [
        {**p, "cta_url": wa_url, "order": i, "active": True}
        for i, p in enumerate(data.PLANS)
    ])
    await _seed(db, "testimonials", [
        {"name": n, "role": r, "quote": q, "avatar_url": "", "order": i, "active": True}
        for i, (n, r, q) in enumerate(data.TESTIMONIALS)
    ])
    await _seed(db, "faqs", [
        {"question": q, "answer": a, "order": i, "active": True}
        for i, (q, a) in enumerate(data.FAQS)
    ])
    await _seed(db, "lessons", [
        {"title": t, "category": c, "level": lv, "description": d, "duration_min": m,
         "cover_url": "", "order": i, "active": True}
        for i, (t, c, lv, d, m) in enumerate(data.LESSONS)
    ])
