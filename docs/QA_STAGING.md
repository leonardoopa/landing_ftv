# QA da branch staging

## Ambiente testado

- Repositório: landing_ftv, branch `staging`, commit `4a75356` (já estava atualizada, `git pull` não trouxe nada novo). Nenhum arquivo de código foi alterado.
- Subida: `docker compose up -d --build` com o `.env` já existente. App em http://localhost:8000 (FastAPI servindo o build React, Django admin em `/admin`, MongoDB 7, Redis 7).
- Data do teste: 12-13/11/2026, macOS, Google Chrome headless.
- Ferramenta de navegador: a extensão Claude in Chrome não conectou (3 tentativas: `tabs_context_mcp`, `tabs_create_mcp`, `list_connected_browsers` retornou lista vazia). Como alternativa usei `playwright-core` instalado fora do projeto (scratchpad), dirigindo o Chrome do sistema em modo headless. Os testes de scroll usaram `scrollTo` e `mouse.wheel`, não um dedo real em touch.
- Viewports: 1440x900, 1280x600, 1024x768, 768x1024, 390x844, 360x640 e landscape 844x390.
- Screenshots em `docs/qa-screenshots/` (76 arquivos, prefixos `desk-`, `m390-`, `m360-`, `t768-`, `d1024x768-`, `d1280x600-`, `land844x390-`). O número no nome é o scrollY.

## Resumo

Nenhum bug crítico. A landing carrega sem erros de console nem requests 4xx/5xx inesperados, não tem overflow horizontal em nenhum viewport testado, os pins soltam no ponto certo, o formulário funciona (sucesso, erro, rate limit) e o build do frontend passa. Os problemas mais relevantes são de segurança leve no backend (rate limit contornável por `X-Forwarded-For`, leads duplicados aceitos), `prefers-reduced-motion` só parcialmente respeitado, ausência de menu de navegação no mobile e corte do hero em celular deitado.

Contagem: crítico 0, alto 3, médio 5, baixo 9.

## Bugs

### Crítico

Nenhum.

### Alto

**A1. Rate limit do formulário contornável com `X-Forwarded-For`.**
Reprodução: dispare 5 POSTs em `/api/leads` até receber 429; envie o próximo com `-H 'X-Forwarded-For: 9.9.9.9'` e recebe 201. O uvicorn roda com `--proxy-headers --forwarded-allow-ips="*"` e o `_client_key` confia cegamente no primeiro valor do cabeçalho.
Arquivos prováveis: `backend/app/controllers/api.py:28-32` (`_client_key`), `scripts/entrypoint.sh` (última linha, `--forwarded-allow-ips="*"`).
Viewport: n/a (API).
Correção: confiar em `X-Forwarded-For` somente quando houver proxy conhecido (restringir `forwarded-allow-ips` ao IP do proxy) e usar `request.client.host` caso contrário; considerar também limite por WhatsApp.

**A2. Mesmo lead pode ser cadastrado infinitas vezes.**
Reprodução: POST `/api/leads` com o mesmo `name` e `whatsapp` duas vezes; ambos retornam 201 com ids diferentes. Não há deduplicação por WhatsApp. Combinado com A1, permite poluir a coleção de leads sem limite.
Arquivos prováveis: `backend/app/services/lead_service.py`, repositório de leads em `backend/app/repositories/`.
Correção: índice único (ou upsert) por número normalizado e resposta idempotente.

**A3. Sem lockfile e sem testes/lint.**
`frontend/package.json` usa ranges (`^`) e o Dockerfile copia só o `package.json`, então cada build pode instalar versões diferentes (reprodutibilidade e risco de supply chain). Também não existem `package-lock.json`, testes (frontend e backend), nem lint. Classifiquei como alto por afetar a confiança de qualquer deploy a partir da staging.
Arquivos: `Dockerfile:4-6`, `frontend/package.json`.
Correção: commitar `package-lock.json` e usar `npm ci`; adicionar ao menos smoke tests da API (pytest) e ESLint.

### Médio

**M1. Navegação some no mobile/tablet, sem menu alternativo.**
Em `max-width: 900px` o `.nav` recebe `display: none` e não há botão hambúrguer. Só sobra o CTA "Ver planos". Quem quer ir direto a Professor, Aulas ou Dúvidas precisa rolar tudo. Viewports: 390, 360, 768, 844x390.
Arquivo: `frontend/src/styles/global.css:293`, `frontend/src/views/Header.jsx`.
Correção: menu colapsável (botão com `aria-expanded`).

**M2. Hero cortado em celular deitado (844x390).**
Reprodução: abrir em 844x390 e rolar até o hero. O stage tem altura fixa de `100svh` com `overflow: hidden`, o conteúdo (título, subtítulo, CTAs, estatísticas) é mais alto que 390px e o botão "Ver planos" e as estatísticas ficam cortados e inacessíveis durante o pin. Screenshot: `land844x390-300.jpg`.
Arquivo: `frontend/src/styles/global.css:64` e regra mobile na linha 294.
Correção: reduzir paddings/tamanhos com `@media (max-height: 500px)` ou deixar de pinar o hero em telas baixas.

**M3. `prefers-reduced-motion` só parcialmente respeitado.**
Com `reducedMotion: reduce` a página troca as histórias das aulas, professor e planos por seções empilhadas (bom), mas o hero continua pinado com vídeo "scrubado", cartões animados por GSAP, letras animadas pelo Framer Motion e Reveal continuam ativos. O CSS só desliga o ticker, a dica e o pulse dos planos. Pelo código não há `useReducedMotion` nem checagem em `Letters`, `Reveal`, `Hero` ou `Fundamentals`.
Arquivos: `frontend/src/views/Hero.jsx`, `Letters.jsx`, `Reveal.jsx`, `Fundamentals.jsx`, `frontend/src/styles/global.css:321-324`.
Correção: `MotionConfig reducedMotion="user"` na raiz, e criar o ScrollTrigger só quando a mídia permitir.

**M4. Dock fixo ("Completo · R$ 50,00") e botão de WhatsApp cobrem conteúdo no fim da página.**
Reprodução: rolar até o rodapé em qualquer viewport. O dock continua visível sobre o rodapé e, no mobile, cobre o texto de copyright e o link Instagram (`m390-10400.jpg`); o botão de WhatsApp também fica sobre as estatísticas do hero e sobre cartões de aula no mobile. No desktop o dock fica sobre o rodapé e sobre o conteúdo de "Como funciona" (`desk-14400.jpg`).
Arquivos: `frontend/src/views/Footer.jsx:8-18` (só esconde sobre `#planos`), `frontend/src/styles/global.css:270,274,311`.
Correção: esconder o dock também sobre o rodapé e o formulário; reservar `padding-bottom` no rodapé do tamanho do dock.

**M5. Todos os CTAs de plano levam à mesma mensagem genérica de WhatsApp, com número e Instagram placeholders.**
Os três botões "Quero o Essencial/Completo/Premium" apontam para o mesmo `wa.me/5511999999999?text=Oi! Quero as videoaulas...`, sem citar o plano. O número `5511999999999` e `https://instagram.com/` são valores de exemplo (o README manda trocar antes de publicar). Não bloqueia staging, mas o plano escolhido se perde.
Arquivos: dados em `backend/app/seed/`, `frontend/src/views/PlansStory.jsx` e `Plans.jsx`.
Correção: montar o texto da mensagem com o nome do plano; validar em CI que `WHATSAPP_NUMBER` não é o placeholder em produção.

### Baixo

**B1. Texto dos títulos animados sem espaços para quem copia/lê o DOM.** `Letters.jsx` usa `aria-label` em um `<span>` genérico (leitores de tela podem ignorar) e as palavras são `inline-block` sem nó de texto de espaço: `innerText` do h1 retorna "DOMINEABOLA.DOMINEAAREIA." e o `textContent` dos h2 também sai sem espaços. Afeta copiar/colar, buscas na página e possivelmente SEO. Correção: colocar o `aria-label` no próprio `h1/h2` (ou usar texto visualmente oculto) e manter um espaço real entre as palavras. Arquivo: `frontend/src/views/Letters.jsx:15-21`.

**B2. Sem "pular para o conteúdo".** Não há skip link; com a navegação do header o teclado percorre 6 itens antes do hero. Foco visível existe (outline nativo `auto`), formulário tem outline próprio.

**B3. Erro de validação do formulário é genérico.** Qualquer 422 vira "Confira os dados informados." (`frontend/src/services/api.js:14`), e o campo WhatsApp não tem `pattern`/`minLength`, então "abc" passa na validação do navegador e só falha no servidor. Correção: `pattern`/`inputMode` e mensagens por campo.

**B4. Resposta 422 devolve o input enviado.** Os erros do Pydantic ecoam o valor (inclusive 5 mil caracteres no teste de limite do nome). Não é vulnerabilidade por si, mas aumenta payload e expõe dados em logs de proxies. Correção: handler customizado que remova `input`.

**B5. 429 sem cabeçalho `Retry-After`.** A mensagem fala em "um minuto" mas a resposta não informa o tempo. Arquivo: serviço de rate limit em `backend/app/services/`.

**B6. Alvos de toque abaixo de 44px.** No mobile: logo 180x32, "Ver planos" do header 109x41, filtros Todas/Iniciante/Intermediário 42px de altura, setas do carrossel 42x42, "Ver planos" do dock 96x38, link Instagram 65x21. Nenhum é crítico, mas ficam abaixo da recomendação. No desktop, links do menu têm 22px de altura.

**B7. Textos muito pequenos.** Existem fontes de 10,5 a 11,8 px (eyebrows, tags, rótulos de estatística). Abaixo do confortável em telas pequenas.

**B8. Cartão do hero cortado em 1280x600.** Em desktop com altura menor que 660px o layout empilhado das demais seções entra, mas o hero mantém a composição desktop e o cartão "Chapa e cortada" (passo 4) fica cortado na borda direita e sobreposto (`d1280x600-1200.jpg`). Arquivo: `frontend/src/styles/global.css:283-290` (offsets em `%` e `right` negativos do `.hero__card`).

**B9. Sem cabeçalhos de cache.** `index.html`, `/assets/*` e a API não enviam `Cache-Control` (só `etag`). O vídeo de 2,4 MB e o poster são rebaixados/revalidados a cada visita; `index.html` pode ficar velho após deploy se um CDN for colocado na frente. Também: bundle JS de 505 kB (aviso do Vite sobre chunk maior que 500 kB) e fontes carregadas do Google Fonts (dependência externa, afeta privacidade/LGPD e primeira renderização).

## O que passou

- API: `GET /api/health` 200; `GET /api/landing` 200 (site, steps, fundamentals, benefits, plans, testimonials vazio, faqs); `GET /api/lessons` com paginação por cursor, total 22 e filtro `level`; limites inválidos (`cursor=-1`, `limit=0`, `limit=9999`, `level=xyz`) retornam 422; rota inexistente 404; `/docs` e `/openapi.json` 200. Não existe `/api/fundamentals` (fundamentos vêm dentro de `/api/landing`).
- `POST /api/leads`: payload válido 201; vazio, nome curto, WhatsApp inválido, JSON malformado, corpo não JSON e nome com 5 mil caracteres retornam 422; nome com `<script>` é aceito e armazenado como texto (o React escapa na saída, não há leitura desses leads na landing); rate limit 5 por 60 s retorna 429 com mensagem em português; requisições inválidas não consomem a cota.
- Redis: chaves `landing:v2`, `lessons:*` e `rl:lead:*` criadas, com TTL. Mongo: leads gravados (removi os 11 leads de teste que criei, nomes "QA ...", "Ana QA" e o do `<script>`).
- Admin Django: `/admin/` redireciona para `/admin/login/`, a página de login carrega e os estáticos em `/cms-static/` respondem 200. Não fiz login (por regra não li credenciais), então CRUD e invalidação de cache ao salvar não foram testados.
- Desktop 1440x900: página de 14 770 px; hero com scrub de vídeo avança conforme o scroll (vídeo 5,3 s, `muted`, `playsinline`, `preload=auto`, readyState 4), legendas e cartões trocam por passo; fundamentos pinados com trilho horizontal; histórias de aulas, professor e planos pinam e soltam no ponto certo; contadores animam; nenhum salto de pin (150 passos de wheel de 100 px, nenhum deslocamento anormal); FAQ abre por teclado com `aria-expanded`; todas as âncoras do header (`#aulas`, `#professor`, `#planos`, `#duvidas`, `#top`) chegam ao ponto correto; trocar de 1440 para 800 e voltar alterna entre layout pinado e empilhado sem quebrar nem perder posição de forma grave.
- Console: zero erros e warnings (os únicos registros foram os 422/429 provocados de propósito). Nenhuma requisição falha, nenhum 404 de asset.
- Overflow horizontal: nenhum (`scrollWidth == clientWidth`) em 1440, 1280x600, 1024x768, 768x1024, 844x390, 390x844 e 360x640.
- A11y: `lang="pt-BR"`, `title` e `meta description`, todas as imagens com `alt`, nenhum botão/link sem nome, foco visível, `main` presente, `aria-live` no retorno do formulário (`role="status"` e `role="alert"`), `viewport` correto, `100svh` usado nos stages (sem o problema clássico de 100vh no mobile).
- Mobile (390 e 360): hero com vídeo de fundo em tela cheia, texto na base, sem cartões; carrossel de fundamentos por swipe; seções empilhadas; dock reposicionado ao lado do WhatsApp; formulário legível.
- Build: `npm install && npm run build` (feito em cópia fora do repositório) passa, 466 módulos, 0 vulnerabilidades no `npm audit`; aviso apenas sobre chunk de 505 kB. `python -m compileall` do backend sem erros.

## O que não foi possível testar

- Extensão Chrome não conectou: não testei em Chrome real com janela visível, nem com `read_page`/`find` da extensão. Os resultados vêm do Chrome headless via Playwright.
- Touch real e fluidez/jank de scroll em dispositivos físicos (iOS Safari incluso, em especial o seek do vídeo, que depende do `play()` inicial). Emulei viewport e touch, mas headless não mede FPS de forma fiel.
- Login no admin Django, edição de conteúdo e a invalidação do cache Redis ao salvar.
- Contraste medido por ferramenta (WCAG): apenas inspeção visual; o menu do header sobre fundo claro ficou com texto cinza sobre barra escura translúcida, aceitável mas a verificar.
- Lint e testes automatizados: não existem no projeto.
- Landscape além do 844x390 e telas de tablet em 1024x1366 retrato.

## Observações de ambiente

- Durante o teste o git mostrou ` M .gitignore` e um diretório `.github/` não rastreado que eu não criei (provavelmente mudanças do usuário em paralelo); não mexi neles.
- Ao final parei apenas o container `app`. Os containers `mongo` e `redis` já estavam rodando antes do teste e foram mantidos como encontrei.
