"""CONTROLLER (MVC): rotas HTTP finas. Delegam toda regra aos serviços."""
from typing import Optional

from fastapi import APIRouter, Depends, Query, Request, status

from app.container import Container
from app.models import LeadCreate
from app.services import LandingProvider, LeadService, LessonProvider
from app.views import LandingResponse, LeadAccepted, LessonPage

router = APIRouter(prefix="/api")


def _container(request: Request) -> Container:
    return request.app.state.container


def landing_service(c: Container = Depends(_container)) -> LandingProvider:
    return c.landing


def lesson_service(c: Container = Depends(_container)) -> LessonProvider:
    return c.lessons


def lead_service(c: Container = Depends(_container)) -> LeadService:
    return c.leads


def _client_key(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@router.get("/health")
async def health() -> dict:
    return {"status": "ok"}


@router.get("/landing", response_model=LandingResponse)
async def get_landing(svc: LandingProvider = Depends(landing_service)):
    return await svc.get_landing()


@router.get("/lessons", response_model=LessonPage)
async def get_lessons(
    cursor: int = Query(0, ge=0),
    limit: int = Query(9, ge=1, le=30),
    level: Optional[str] = Query(None, pattern="^(iniciante|intermediario)$"),
    svc: LessonProvider = Depends(lesson_service),
):
    return await svc.get_page(cursor, limit, level)


@router.post("/leads", response_model=LeadAccepted, status_code=status.HTTP_201_CREATED)
async def create_lead(
    payload: LeadCreate,
    request: Request,
    svc: LeadService = Depends(lead_service),
):
    lead_id = await svc.register(payload, _client_key(request))
    return LeadAccepted(id=lead_id)
