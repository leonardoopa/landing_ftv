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
    msg = quote("Oi! Quero as videoaulas de futevôlei da Royal.")
    wa_url = f"https://wa.me/{whatsapp_number}?text={msg}"

    await _seed(db, "site_config", [{
        "brand": "Royal Futevôlei",
        "hero_eyebrow": "Videoaulas de futevôlei · iniciante e intermediário",
        "hero_title": "Domine a bola. Domine a areia.",
        "hero_subtitle": "Do primeiro toque à cortada, em aulas de 5 a 10 minutos.",
        "hero_video_url": "/assets/hero.mp4",
        "hero_image_url": "/assets/hero.jpg",
        "cta_label": "Ver planos",
        "cta_url": wa_url,
        "whatsapp": whatsapp_number,
        "instagram": "https://instagram.com/",
        "stats": [
            {"value": "+200", "label": "alunos"},
            {"value": "5-10", "label": "min por aula"},
            {"value": "Vitalício", "label": "acesso"},
        ],
        "marquee": ["Toque", "Recepção", "Saque", "Levantada", "Chapa", "Cortada", "Defesa", "Tática 2x2"],
        "teacher_name": "Seu professor na Royal",
        "teacher_role": "Professor de futevôlei",
        "teacher_bio": "Quem grava as videoaulas é quem ensina na areia. O mesmo método dos treinos presenciais da Royal, passo a passo, do primeiro toque à cortada.",
        "teacher_photo_url": "/assets/professor.jpg",
    }])

    await _seed(db, "method_steps", [
        {"title": t, "text": x, "tag": g, "image_url": "", "order": i, "active": True}
        for i, (t, x, g) in enumerate(data.STEPS)
    ])
    await _seed(db, "fundamentals", [
        {"title": t, "text": x, "tag": g, "order": i, "active": True}
        for i, (t, x, g) in enumerate(data.FUNDAMENTALS)
    ])
    await _seed(db, "benefits", [
        {"title": t, "description": d, "icon": ic, "order": i, "active": True}
        for i, (t, d, ic) in enumerate(data.BENEFITS)
    ])
    await _seed(db, "plans", [
        {**p, "cta_url": wa_url, "order": i, "active": True}
        for i, p in enumerate(data.PLANS)
    ])
    if data.TESTIMONIALS:
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
