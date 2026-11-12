import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def _env(name, default=""):
    return os.environ.get(name, default)


SECRET_KEY = _env("DJANGO_SECRET_KEY", "dev-insecure-key")
DEBUG = _env("DJANGO_DEBUG", "0") == "1"
ALLOWED_HOSTS = [h.strip() for h in _env("DJANGO_ALLOWED_HOSTS", "*").split(",")]
CSRF_TRUSTED_ORIGINS = [o for o in _env("DJANGO_CSRF_TRUSTED_ORIGINS", "").split(",") if o]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "cms.content.apps.ContentConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

ROOT_URLCONF = "cms.urls"
WSGI_APPLICATION = "cms.wsgi.application"

TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]

DATABASES = {
    # auth, sessões e log do admin
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": _env("DJANGO_SQLITE_PATH", str(BASE_DIR / "db" / "cms.sqlite3")),
    },
    # conteúdo da landing (mesmas coleções lidas pela API FastAPI)
    "content": {
        "ENGINE": "django_mongodb_backend",
        "HOST": _env("MONGO_URI", "mongodb://mongo:27017"),
        "NAME": _env("MONGO_DB", "landing_ftv"),
    },
}
DATABASE_ROUTERS = ["cms.routers.ContentRouter"]
DEFAULT_AUTO_FIELD = "django.db.models.AutoField"

LANGUAGE_CODE = "pt-br"
TIME_ZONE = "America/Sao_Paulo"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/cms-static/"
STATIC_ROOT = _env("STATIC_ROOT", "/app/staticfiles")

# Header do proxy/uvicorn; o admin roda atrás do FastAPI em /admin.
USE_X_FORWARDED_HOST = True

REDIS_URL = _env("REDIS_URL", "redis://redis:6379/0")
