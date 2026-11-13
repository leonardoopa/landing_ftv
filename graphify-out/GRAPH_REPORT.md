# Graph Report - landing_ftv  (2026-11-12)

## Corpus Check
- Corpus is ~31,588 words - fits in a single context window. You may not need a graph.

## Summary
- 420 nodes · 932 edges · 16 communities (10 shown, 6 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Frontend Views and Scroll Stories
- Cache Abstraction
- Docker Stack and Animation Guide
- Landing and Lesson Services
- App Config and Startup
- Domain Models
- API Controllers and Container
- Redis Cache Implementation
- Frontend Dependencies
- Django Admin
- Content DB Router
- Mobile and Reduced Motion
- Entrypoint Script

## God Nodes (most connected - your core abstractions)
1. `react` - 21 edges
2. `Icon()` - 20 edges
3. `App()` - 19 edges
4. `Letters()` - 19 edges
5. `Container` - 18 edges
6. `CacheBackend` - 17 edges
7. `LandingService` - 15 edges
8. `LandingResponse` - 15 edges
9. `Reveal()` - 13 edges
10. `MongoModel` - 12 edges

## Surprising Connections (you probably didn't know these)
- `hero.mp4` --semantically_similar_to--> `hero.mp4 scroll-scrubbed video`  [INFERRED] [semantically similar]
  frontend/public/assets/README.md → README.md
- `Guia de animações de scroll (Money Flow reference)` --references--> `React + Vite + Framer Motion frontend`  [INFERRED]
  docs/ANIMACOES_SCROLL.md → README.md
- `Container` --uses--> `Settings`  [INFERRED]
  backend/app/container.py → backend/app/config.py
- `Container` --uses--> `Benefit`  [INFERRED]
  backend/app/container.py → backend/cms/content/models.py
- `Container` --uses--> `Faq`  [INFERRED]
  backend/app/container.py → backend/cms/content/models.py

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Docker Compose stack (app, mongo, redis)** — docker_compose_app, docker_compose_mongo, docker_compose_redis [EXTRACTED 1.00]
- **SOLID dependency inversion and cache decorator** — readme_container_py, readme_repository_interfaces, readme_cachedlandingservice, readme_mvc_solid_architecture [EXTRACTED 1.00]
- **Hero scroll-scrubbed video flow** — readme_hero_video, scripts_prepare_video, frontend_src_controllers_usescrubvideo, docs_animacoes_scroll_sticky_hero_equivalent [INFERRED 0.85]

## Communities (16 total, 6 thin omitted)

### Community 0 - "Frontend Views and Scroll Stories"
Cohesion: 0.07
Nodes (58): 3D depth (perspective, z, rotateX), Lenis smooth scroll (optional), Google Fonts (Anton, Inter), index.html (Royal Futevôlei entry), App(), useAnchorScroll(), useInfiniteLessons(), useLanding() (+50 more)

### Community 1 - "Cache Abstraction"
Cohesion: 0.06
Nodes (19): CacheBackend, LeadRepository, LessonRepository, ListRepository, SingletonRepository, MongoLeadRepository, MongoLessonRepository, MongoListRepository (+11 more)

### Community 2 - "Docker Stack and Animation Guide"
Cohesion: 0.06
Nodes (40): app service, cms_db volume, mongo service (mongo:7), mongo_data volume, redis service (redis:7-alpine), framer-motion, GSAP + ScrollTrigger, Guia de animações de scroll (Money Flow reference) (+32 more)

### Community 3 - "Landing and Lesson Services"
Cohesion: 0.07
Nodes (22): LandingResponse, Migration, Migration, Migration, Benefit, Meta, Faq, Meta (+14 more)

### Community 4 - "App Config and Startup"
Cohesion: 0.07
Nodes (4): get_settings(), Settings, _seed(), seed_all()

### Community 5 - "Domain Models"
Cohesion: 0.15
Nodes (11): Benefit, Faq, Fundamental, Lesson, MethodStep, MongoModel, Plan, SiteConfig (+3 more)

### Community 6 - "API Controllers and Container"
Cohesion: 0.13
Nodes (13): Container, _client_key(), _container(), create_lead(), get_landing(), get_lessons(), health(), landing_service() (+5 more)

### Community 7 - "Redis Cache Implementation"
Cohesion: 0.09
Nodes (4): RedisCache, ContentConfig, _invalidate(), on_content_change()

### Community 8 - "Frontend Dependencies"
Cohesion: 0.10
Nodes (20): dependencies, framer-motion, gsap, react, react-dom, devDependencies, vite, @vitejs/plugin-react (+12 more)

### Community 9 - "Django Admin"
Cohesion: 0.25
Nodes (10): BenefitAdmin, FaqAdmin, FundamentalAdmin, LeadAdmin, LessonAdmin, MethodStepAdmin, OrderableAdmin, PlanAdmin (+2 more)

## Knowledge Gaps
- **13 isolated node(s):** `mongo_data volume`, `Odometer counters (proposed)`, `3D depth (perspective, z, rotateX)`, `prefers-reduced-motion handling`, `Mobile strategy (no pins, flow layout)` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 127 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `React + Vite + Framer Motion frontend` connect `Docker Stack and Animation Guide` to `Frontend Views and Scroll Stories`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `Container` (e.g. with `Settings` and `Benefit`) actually correct?**
  _`Container` has 13 INFERRED edges - model-reasoned connections that need verification._
- **What connects `mongo_data volume`, `Odometer counters (proposed)`, `3D depth (perspective, z, rotateX)` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Views and Scroll Stories` be split into smaller, more focused modules?**
  _Cohesion score 0.06611759322809425 - nodes in this community are weakly interconnected._
- **Why does `Container` connect `API Controllers and Container` to `Cache Abstraction`, `Landing and Lesson Services`, `App Config and Startup`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `Cache Abstraction` be split into smaller, more focused modules?**
  _Cohesion score 0.059466848940533154 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Frontend Views and Scroll Stories` to `Frontend Dependencies`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._