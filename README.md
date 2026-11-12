# landing_ftv

Landing page de aulas de futevôlei. Um comando sobe tudo.

## Rodar

```bash
cp .env.example .env
docker compose up -d --build
```

- Landing: http://localhost:8000
- API (Swagger): http://localhost:8000/docs
- Painel de conteúdo (Django admin): http://localhost:8000/admin — usuário e senha em `DJANGO_SUPERUSER_*` no `.env`

Troque `DJANGO_SECRET_KEY`, `DJANGO_SUPERUSER_PASSWORD` e `WHATSAPP_NUMBER` antes de publicar.

## Stack

| Peça | Papel |
|---|---|
| FastAPI | API pública (`/api/*`) e entrega do build React |
| Django | Painel `/admin` para editar o conteúdo e ver os leads (montado dentro do FastAPI) |
| MongoDB | Conteúdo da landing, aulas e leads |
| Redis | Cache das respostas da API e rate limit do formulário |
| SQLite | Só usuários/sessões do admin Django (volume `cms_db`) |
| React + Vite + Framer Motion | Frontend |

Um container (`app`) roda FastAPI + Django; `mongo` e `redis` são os outros dois serviços do compose.

## Arquitetura (MVC + SOLID)

```
backend/app/
  models/         Model: entidades de domínio (Pydantic)
  views/          View: contratos JSON de resposta
  controllers/    Controller: rotas HTTP, sem regra de negócio
  services/       Regras de negócio (landing, aulas, leads, rate limit)
  repositories/   Interfaces + implementação MongoDB
  cache/          Interface de cache + implementação Redis
  container.py    Composition root (injeção de dependências)
  seed/           Conteúdo inicial
backend/cms/      Projeto Django (admin) lendo as mesmas coleções do Mongo
frontend/src/
  models/  services/  controllers/ (hooks)  views/ (componentes)
```

- **S**: controller só trata HTTP, service só regra, repository só dados.
- **O**: cache entra como decorator (`CachedLandingService`), sem alterar o service original.
- **L / I**: interfaces pequenas (`ListRepository`, `LessonRepository`, `LeadRepository`, `CacheBackend`) com implementações intercambiáveis.
- **D**: services dependem das interfaces; só `container.py` conhece Mongo e Redis.

## API

| Rota | Descrição |
|---|---|
| `GET /api/landing` | Todo o conteúdo da página (cacheado) |
| `GET /api/lessons?cursor=0&limit=9&level=` | Página de aulas para o carrossel com carregamento infinito |
| `POST /api/leads` | Cadastro do formulário (limite de `LEAD_RATE_LIMIT` por `LEAD_RATE_WINDOW` segundos, por IP) |
| `GET /api/health` | Healthcheck |

Salvar qualquer conteúdo no admin limpa o cache do Redis na hora.

## Assets

Ficam em `frontend/public/assets/`:

- `hero.mp4`: vídeo do hero. Avança frame a frame conforme o scroll.
- `hero.jpg`: poster. Aparece sozinho (com zoom no scroll) enquanto não existe `hero.mp4`.
- `professor.jpg`: foto do professor.

Para preparar o vídeo, salve o original como `frontend/public/assets/hero-source.mp4` e rode:

```bash
sh scripts/prepare-video.sh
docker compose up -d --build
```

O script (ffmpeg via Docker) remove o áudio e grava todo frame como keyframe, o que deixa o avanço pelo scroll fluido.

## Desenvolvimento do frontend

```bash
cd frontend && npm install && npm run dev
```

O Vite (porta 5173) faz proxy de `/api` para o backend na 8000.
