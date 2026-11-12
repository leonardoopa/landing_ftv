# ---------- Stage 1: build do React ----------
FROM node:22-alpine AS frontend
WORKDIR /web
COPY frontend/package.json ./
RUN npm install --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

# ---------- Stage 2: FastAPI + Django ----------
FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY scripts/entrypoint.sh ./entrypoint.sh
COPY --from=frontend /web/dist ./frontend_dist
RUN chmod +x ./entrypoint.sh && mkdir -p /app/backend/db /app/staticfiles

WORKDIR /app/backend
EXPOSE 8000
ENTRYPOINT ["/app/entrypoint.sh"]
