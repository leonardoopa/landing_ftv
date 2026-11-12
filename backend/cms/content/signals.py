"""Invalida o cache Redis da API sempre que o conteúdo muda no admin."""
import logging

import redis
from django.conf import settings
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from . import models

log = logging.getLogger(__name__)
CONTENT_MODELS = (
    models.SiteConfig, models.MethodStep, models.Fundamental, models.Benefit, models.Plan,
    models.Testimonial, models.Faq, models.Lesson,
)


def _invalidate() -> None:
    try:
        client = redis.Redis.from_url(settings.REDIS_URL)
        for prefix in ("landing:", "lessons:"):
            for key in client.scan_iter(match=f"{prefix}*"):
                client.delete(key)
    except Exception as exc:  # noqa: BLE001
        log.warning("não foi possível invalidar cache: %s", exc)


@receiver(post_save)
@receiver(post_delete)
def on_content_change(sender, **kwargs):
    if sender in CONTENT_MODELS:
        _invalidate()
