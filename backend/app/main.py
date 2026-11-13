"""Entrypoint ASGI: FastAPI (API + React estático) com Django (CMS) montado em /admin."""
import os
from contextlib import asynccontextmanager
from pathlib import Path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cms.settings")

from a2wsgi import WSGIMiddleware  # noqa: E402
from django.core.wsgi import get_wsgi_application  # noqa: E402
from fastapi import FastAPI  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from fastapi.staticfiles import StaticFiles  # noqa: E402

from app.config import get_settings  # noqa: E402
from app.container import Container  # noqa: E402
from app.controllers import router  # noqa: E402
from app.seed import seed_all  # noqa: E402

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    container = Container(settings)
    app.state.container = container
    await seed_all(container.db, settings.whatsapp_number)
    await container.lead_repo.ensure_indexes()
    yield
    await container.close()


app = FastAPI(title="Landing Futevôlei API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
app.include_router(router)

# Django CMS (admin) — arquivos estáticos do admin + app WSGI
if Path(settings.static_root).exists():
    app.mount("/cms-static", StaticFiles(directory=settings.static_root), name="cms-static")
app.mount("/admin", WSGIMiddleware(get_wsgi_application()))

# React build (deve ser o último mount)
if Path(settings.frontend_dist).exists():
    app.mount("/", StaticFiles(directory=settings.frontend_dist, html=True), name="frontend")
