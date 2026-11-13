#!/bin/sh
set -e

echo "[entrypoint] migrate (auth/sessões -> SQLite)"
python manage.py migrate --noinput
echo "[entrypoint] migrate (conteúdo -> MongoDB)"
python manage.py migrate content --database content --noinput
python manage.py collectstatic --noinput >/dev/null

# Cria o superusuário a partir das variáveis DJANGO_SUPERUSER_* (se ainda não existe)
python manage.py createsuperuser --noinput 2>/dev/null || echo "[entrypoint] superusuário já existe"

echo "[entrypoint] subindo FastAPI (proxy confiável: FORWARDED_ALLOW_IPS=${FORWARDED_ALLOW_IPS:-127.0.0.1})"
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
