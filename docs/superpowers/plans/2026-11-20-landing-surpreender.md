# Landing "Surpreender" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar três peças na landing do Royal Futevôlei: movimento (entrada com bola, rótulo de cursor, scrub liso, preço fixo), quiz de nível com lead opcional e o comparador "erro vs. certo".

**Architecture:** Lógica pura em módulos pequenos testáveis com `node --test` (front) e `unittest` (back); views React finas que só ligam esses módulos ao DOM; `App.jsx` vira `App` (carregamento) + `Landing` (hooks e composição). Backend recebe dois campos opcionais no lead (`plan`, `source`) sem mudar o contrato existente.

**Tech Stack:** React 19, Vite, GSAP, Framer Motion (sem dependência nova), FastAPI, pymongo async, Django admin, Docker Compose.

**Spec:** `docs/superpowers/specs/2026-11-20-landing-surpreender-design.md`

## Global Constraints

- Sem dependência nova no front. Crescimento de JS: no máximo cerca de 15 KB gzip sobre os 172.113 bytes gzip atuais (teto 187.473 bytes).
- Não há `node_modules` local: o front só builda com `docker compose up -d --build`; app em `http://localhost:8000`. Abra com `?v=<n>` para furar o cache do navegador.
- Testes de front: `cd frontend && node --test "src/**/*.test.js"` (esperado `# fail 0`). Testes de back: `docker compose run --rm --entrypoint python -v "$PWD/backend:/app/backend" app -m unittest discover -s tests -t . -v` (esperado `OK`).
- Media query desktop existente (não alterar): `(min-width: 1024px) and (min-height: 660px) and (prefers-reduced-motion: no-preference)`.
- `Level` do lead: `iniciante` | `intermediario`. O plano recomendado viaja em `plan`. Lead idempotente por WhatsApp; limite de 5 POSTs por 60 s por IP em `/api/leads` (espaçar os testes manuais).
- Regras de movimento do taste-skill: sem tela de abertura ou loader, sem cursor substituído, sem biblioteca de scroll suave, sem texto descritivo embaixo de visuais, no máximo um loop por painel.
- Tokens: `--gold`, `--blue`, `--muted`, tom de erro `#ff8a8a`. Texto de interface em PT-BR; botões com verbo e objeto.
- Commits na `staging`, um ou mais por tarefa, com `git -c gc.auto=0 commit`, no estilo `Feat:`/`Fix:`/`Chore:` e terminando com a linha `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. **Sem push** até o cliente pedir.
- Textos técnicos de erro vs. certo são rascunho (`reviewed: false`) até o professor validar.

## Review Focus

Entradas e condições que o design não nomeia, da mais provável para a menos:

1. `sessionStorage` indisponível ou que lança erro (aba privada): o quiz funciona sem persistir. Fixado na Task 7.
2. Nome de plano editado no admin ou menos de 3 planos: `pickPlan` cai para a posição e, sem plano, devolve `null` sem quebrar a tela. Fixado na Task 7.
3. `site.whatsapp` vazio ou com símbolos: o link usa só dígitos; sem dígitos, devolve `null` e a tela usa `site.cta_url`. Fixado na Task 7.
4. Aba em segundo plano faz o `dt` do scrub explodir: o vídeo não pula nem passa do alvo. Fixado na Task 1.
5. Slider com valor `NaN`, fora de 0–100 ou tecla repetida: sempre dentro de 0–100. Fixado na Task 10.

---

### Task 1: Scrub suave por tempo

**Files:**
- Create: `frontend/src/controllers/scrubMath.js`
- Test: `frontend/src/controllers/scrubMath.test.js`
- Modify: `frontend/src/controllers/useScrubVideo.js`, `frontend/package.json` (script `"test": "node --test \"src/**/*.test.js\""`)

**Interfaces:**
- Produces: `SMOOTH_K = 14`; `smoothToward(current: number, target: number, dt: number, k = SMOOTH_K): number` com `dt` limitado a `[0, 0.1]`; `isSettled(current: number, target: number, eps = 0.0005): boolean`. `useScrubVideo(videoRef, targetRef, enabled)` mantém a assinatura.

- [ ] **Step 1: Escrever o teste que falha** (`node:test` + `node:assert/strict`)

```js
test("um quadro a 60 Hz anda cerca de 0,2085 do caminho", () => {
  assert.ok(Math.abs(smoothToward(0, 1, 1 / 60) - 0.2085) < 0.001);
});
test("dois meios passos igualam um passo inteiro", () => {
  const a = smoothToward(smoothToward(0, 1, 1 / 120), 1, 1 / 120);
  assert.ok(Math.abs(a - smoothToward(0, 1, 1 / 60)) < 1e-12);
});
test("aba em segundo plano (dt enorme) não pula nem passa do alvo", () => {
  const v = smoothToward(0, 1, 10);
  assert.ok(Math.abs(v - (1 - Math.exp(-1.4))) < 1e-9 && v < 1);
});
test("dt zero ou negativo devolve o valor atual", () => {
  assert.equal(smoothToward(0.3, 1, 0), 0.3);
  assert.equal(smoothToward(0.3, 1, -1), 0.3);
});
test("isSettled usa a tolerância", () => {
  assert.equal(isSettled(0.5, 0.50049), true);
  assert.equal(isSettled(0.5, 0.502), false);
});
```

- [ ] **Step 2: Rodar e ver falhar** — `cd frontend && node --test "src/**/*.test.js"`; esperado: falha por módulo `scrubMath.js` inexistente.
- [ ] **Step 3: Implementar `scrubMath.js`** com as assinaturas acima; passo `current + (target - current) * (1 - Math.exp(-dt * k))` depois de limitar `dt`.
- [ ] **Step 4: Rodar e ver passar** — mesmo comando; esperado `# fail 0`.
- [ ] **Step 5: Integrar em `useScrubVideo.js`:** trocar o `* 0.2` por `smoothToward` com `dt` calculado do timestamp do `requestAnimationFrame`; parar o laço quando `isSettled(current, targetRef.current)` e o vídeo não estiver em `seeking`; reiniciá-lo num listener `scroll` passivo (removido na limpeza). Manter o guard `video.seeking`, o desbloqueio de iOS e o limiar de seek de 0,012 s. Adicionar o script `test` ao `package.json`.
- [ ] **Step 6: Verificar no navegador.** `docker compose up -d --build`, abrir `http://localhost:8000/?v=1` em 1440x900. Instalar antes de rolar um contador de seeks: sobrescrever o setter de `HTMLMediaElement.prototype.currentTime` incrementando `window.__seeks`. Rolar o hero em 20 passos de `scrollTo` e ler `__seeks`; esperar 2 s parado e ler de novo. Esperado: `__seeks` cresce só durante a rolagem e fica igual após os 2 s; ao fim da rolagem do hero `video.currentTime >= video.duration - 0.1`; console sem erros.
- [ ] **Step 7: Commit** — `git add frontend/src/controllers frontend/package.json && git -c gc.auto=0 commit -m "Feat: Smooth hero scrub by time and sleep when idle"` (com a linha de coautoria).

### Task 2: Preço fixo nos planos

**Files:**
- Modify: `frontend/src/views/PlansStory.jsx` (remover `parsePrice`, `money` e a chamada `countTo` do preço; o import de `countTo` sai deste arquivo, `TeacherStory.jsx` continua usando)

**Interfaces:** nenhuma nova; `PlansStory({ plans })` inalterado.

- [ ] **Step 1: Provar a falha.** Em `http://localhost:8000/?v=2`, rodar no console uma sonda: buscar `/api/landing`, e para 8 posições de rolagem entre o início e o fim do `#planos` ler o texto de cada `.plan__price strong`. Esperado hoje: pelo menos uma amostra difere do preço da API (ex.: "R$ 12,74").
- [ ] **Step 2: Remover a contagem animada do preço.** O preço final fica no JSX; a entrada dos cartões, o selo de prova e o destaque do plano principal permanecem.
- [ ] **Step 3: Rebuild e repetir a sonda.** Esperado: todas as amostras iguais aos preços da API (R$ 27,90, R$ 35,90, R$ 65,90 no seed atual).
- [ ] **Step 4: Commit** — `Fix: Show final plan prices while scrolling`.

### Task 3: Entrada com bola

**Files:**
- Create: `frontend/src/models/intro.js`, `frontend/src/views/IntroBall.jsx`
- Test: `frontend/src/models/intro.test.js`
- Modify: `frontend/src/App.jsx` (renderizar `<IntroBall />` depois do `<Header />`), `frontend/src/styles/global.css`

**Interfaces:**
- Produces: `INTRO_KEY = "royal:intro"`; `shouldPlayIntro({ reducedMotion, scrollY, seen, hasCrown }): boolean` (verdadeiro só se `!reducedMotion && scrollY <= 80 && !seen && hasCrown`); `IntroBall()` sem props, renderiza `null` quando não toca.

- [ ] **Step 1: Teste que falha:** `shouldPlayIntro` verdadeiro no caso base `{ false, 0, false, true }`; falso com `reducedMotion: true`, com `scrollY: 81`, com `seen: true` e com `hasCrown: false`.
- [ ] **Step 2: Rodar e ver falhar** (módulo inexistente).
- [ ] **Step 3: Implementar `intro.js`.** Rodar e ver passar.
- [ ] **Step 4: Implementar `IntroBall.jsx`:** no `useEffect`, ler `sessionStorage` dentro de `try/catch`, localizar `.brand .crown`, decidir com `shouldPlayIntro` (`reducedMotion` de `matchMedia("(prefers-reduced-motion: reduce)")`). Se tocar, gravar `INTRO_KEY` e renderizar um SVG de bola (~28 px) em camada fixa; animar com `Element.animate` em cerca de 1000 ms: cai do topo até o centro da coroa, quica duas vezes com squash no contato, assenta e some em cerca de 200 ms enquanto a coroa dá um pulso (`scale` 1, 1,25, 1 em ~300 ms); desmontar ao terminar. CSS: `.intro-ball { position: fixed; left: 0; top: 0; z-index: 101; pointer-events: none; }` (acima da `.net`, que é 100) e `display: none` sob `prefers-reduced-motion: reduce`.
- [ ] **Step 5: Verificar no navegador.** `sessionStorage.clear(); location.reload()`; em até 1,2 s `document.querySelector(".intro-ball")` existe e `document.elementFromPoint(innerWidth / 2, innerHeight / 2)` não é a bola; após 1,6 s é `null`; novo reload não cria a bola. O `h1` do hero está visível desde o início (a bola não o cobre). Console sem erros.
- [ ] **Step 6: Commit** — `Feat: Add ball entrance that lands on the header crown`.

### Task 4: Rótulo de cursor

**Files:**
- Create: `frontend/src/models/cursor.js`, `frontend/src/views/CursorLabel.jsx`
- Test: `frontend/src/models/cursor.test.js`
- Modify: `frontend/src/App.jsx` (montar `<CursorLabel />` só com `useMediaQuery("(hover: hover) and (pointer: fine)")`), `frontend/src/views/LessonLanes.jsx` (`data-cursor="arraste"` em `.lane__view`), `frontend/src/styles/global.css`

**Interfaces:**
- Produces: `labelAt(target): string | null` (texto de `data-cursor` do ancestral mais próximo; `null` se `target` for nulo, não tiver `closest` ou não achar); `CursorLabel()` sem props; contrato de marcação `data-cursor="<texto>"`.

- [ ] **Step 1: Teste que falha** com objetos falsos: `labelAt(null) === null`; `labelAt({ closest: () => ({ dataset: { cursor: "arraste" } }) }) === "arraste"`; `labelAt({ closest: () => null }) === null`; `labelAt({}) === null`.
- [ ] **Step 2: Rodar e ver falhar. Step 3: implementar `cursor.js`. Step 4: ver passar.**
- [ ] **Step 5: Implementar `CursorLabel.jsx`:** um `div.cursor-label` (`aria-hidden`) que segue o ponteiro por `requestAnimationFrame` via `pointermove` global, mostra `labelAt(event.target)` e alterna `.is-on`; `pointerdown` aplica `.is-down`; sai ao deixar a janela. É passivo: não captura eventos. CSS: pílula dourada, texto escuro em caixa alta, deslocada do ponteiro, `z-index: 102`. O cursor nativo continua.
- [ ] **Step 6: Verificar no navegador** (1440x900): passar o mouse sobre uma faixa de aulas: `.cursor-label.is-on` existe com texto `arraste`; mover para o hero: sem `.is-on`; arrastar a faixa continua funcionando.
- [ ] **Step 7: Commit** — `Feat: Add contextual drag label for lesson lanes`.

### Task 5: Lead com `plan` e `source` (FastAPI e Mongo)

**Files:**
- Modify: `backend/app/models/lead.py`, `backend/app/repositories/mongo.py`
- Create: `backend/tests/__init__.py`, `backend/tests/test_lead_model.py`, `backend/tests/test_lead_repository.py`

**Interfaces:**
- Produces: `Source = Literal["landing", "quiz"]`; `LeadCreate.plan: Optional[str]` (padrão `None`, máx. 40) e `LeadCreate.source: Source = "landing"`; `Lead(LeadCreate)` com `created_at` e sem redefinir `source`. `MongoLeadRepository.add(lead: Lead) -> str`: documento novo guarda todos os campos; repetição do mesmo WhatsApp devolve o id existente; se `lead.source == "quiz"`, também faz `$set` de `plan` e `level` no existente; nunca altera os demais campos.

- [ ] **Step 1: Testes de modelo que falham** (`unittest.TestCase`): `LeadCreate(name="Ana", whatsapp="11999998888")` tem `source == "landing"` e `plan is None`; `source="x"` lança `ValidationError`; `plan` com 41 caracteres lança `ValidationError`; `source="quiz", plan="Completo"` é aceito.
- [ ] **Step 2: Testes de repositório que falham** (`IsolatedAsyncioTestCase`; Mongo do compose; banco `f"test_{uuid4().hex}"` apagado no `asyncTearDown`; `ensure_indexes()` no setup): (a) quiz novo guarda `plan` e `source == "quiz"`; (b) lead `landing` (nível `iniciante`) seguido de quiz do mesmo WhatsApp (nível `intermediario`, plano `Completo`) devolve o mesmo id, e o documento fica com `plan == "Completo"`, `level == "intermediario"`, `name` e `created_at` originais e `source == "landing"`; (c) quiz (`Premium`, `intermediario`) seguido de `landing` (`iniciante`) mantém `plan == "Premium"` e `level == "intermediario"`.
- [ ] **Step 3: Rodar e ver falhar** — comando de testes de back das Global Constraints; esperado: falhas por campos inexistentes.
- [ ] **Step 4: Implementar** o modelo e a regra do repositório. O Mongo proíbe o mesmo campo em `$set` e `$setOnInsert` no mesmo update: quando houver `$set`, o `$setOnInsert` não leva `plan` nem `level`.
- [ ] **Step 5: Rodar e ver passar** — esperado `OK`.
- [ ] **Step 6: Verificar a API.** `docker compose up -d --build`; `curl -s -w "\n%{http_code}\n" -X POST localhost:8000/api/leads -H 'Content-Type: application/json' -d '{"name":"Teste Quiz","whatsapp":"11999990001","level":"intermediario","plan":"Completo","source":"quiz"}'` retorna 201 com `id`; o mesmo corpo com `"source":"x"` retorna 422.
- [ ] **Step 7: Commit** — `Feat: Accept plan and source on leads and update quiz repeats`.

### Task 6: Django: campo `plan`, migração e admin

**Files:**
- Modify: `backend/cms/content/models.py` (classe `Lead`), `backend/cms/content/admin.py` (`LeadAdmin`)
- Create: `backend/cms/content/migrations/0004_lead_plan.py`

**Interfaces:**
- Produces: `Lead.plan = models.CharField("plano", max_length=40, blank=True, default="")`; `LeadAdmin` mostra e filtra por `plan` e `source`.

- [ ] **Step 1: Falha esperada.** Depois de adicionar o campo ao modelo: `docker compose exec -T app python manage.py makemigrations --check --dry-run` sai com código 1 ("Migrations for 'content'").
- [ ] **Step 2: Escrever a migração à mão** (`AddField` em `lead`, dependência `("content", "0003_fundamental")`) e ajustar o `LeadAdmin`.
- [ ] **Step 3: Verificar.** Rebuild; os logs do app mostram `Applying content.0004_lead_plan... OK`; `makemigrations --check --dry-run` responde `No changes detected`; `manage.py check` sem problemas; no shell do Django (módulo conforme `INSTALLED_APPS` em `backend/cms/settings.py`) o lead criado na Task 5 aparece com `plan == "Completo"` e `source == "quiz"`.
- [ ] **Step 4: Commit** — `Feat: Show lead plan in the Django admin`.

### Task 7: Modelo do quiz (lógica pura)

**Files:**
- Create: `frontend/src/models/quiz.js`
- Test: `frontend/src/models/quiz.test.js`

**Interfaces:**
- Produces:
  - `QUIZ_KEY = "royal:quiz"`.
  - `QUESTIONS`: `[{ id, title, options: [{ value, label }] }]` com `experiencia` ("Você já jogou futevôlei?": `0` Nunca jogei, `1` Já joguei algumas vezes, `2` Jogo toda semana), `controle` ("Você controla a bola com pé e peito?": `0` Ainda não, `1` Mais ou menos, `2` Com firmeza) e `objetivo` ("O que você quer agora?": `"sozinho"` Aprender sozinho com vídeo, `"evoluir"` Evoluir o meu jogo, `"presencial"` Treinar com o professor na areia).
  - `scoreQuiz({ experiencia, controle, objetivo }): { level, planKey }` — `level = "iniciante"` se `experiencia + controle <= 2`, senão `"intermediario"`; `planKey = "premium"` se `objetivo === "presencial"`, senão `"completo"` se `objetivo === "evoluir"` ou `level === "intermediario"`, senão `"essencial"`.
  - `pickPlan(plans: {id, name}[], planKey): plan | null` — acha por nome (sem diferenciar caixa); se não achar, por posição (`essencial` 0, `completo` 1, `premium` 2); sem plano, `null`.
  - `buildWhatsAppUrl({ whatsapp, level, plan }): string | null` — só dígitos em `whatsapp`; sem dígitos, `null`; texto `Oi! Fiz o quiz da Royal: nível ${Iniciante|Intermediário}. Quero o plano ${plan.name} (${plan.price}).` com `encodeURIComponent`, em `https://wa.me/<dígitos>?text=`.
  - `reasonFor(planKey): string` — `essencial`: "Você está começando e quer aprender no seu ritmo: o Essencial cobre os fundamentos em vídeo."; `completo`: "Você quer evoluir o jogo: o Completo libera o nível iniciante e o intermediário."; `premium`: "Você quer treinar na areia: o Premium soma uma aula presencial na Royal."
  - `readStored(storage, key): object | null` e `writeStored(storage, key, value): void` — nunca lançam; ignoram `null` e JSON inválido.

- [ ] **Step 1: Testes que falham:** `scoreQuiz` nos casos `(0,0,"sozinho")` → `iniciante`/`essencial`; `(1,1,"sozinho")` → `iniciante`/`essencial` (soma 2); `(2,1,"sozinho")` → `intermediario`/`completo`; `(0,0,"evoluir")` → `iniciante`/`completo`; `(2,2,"presencial")` → `intermediario`/`premium`; `(0,0,"presencial")` → `iniciante`/`premium`. `pickPlan`: acha `"completo"` por nome `"COMPLETO"`; com nomes trocados (`A`, `B`, `C`) devolve a posição certa; com lista vazia devolve `null`. `buildWhatsAppUrl({ whatsapp: "+55 (11) 99999-0000", level: "intermediario", plan: { name: "Completo", price: "R$ 35,90" } })` é exatamente `https://wa.me/5511999990000?text=` + `encodeURIComponent("Oi! Fiz o quiz da Royal: nível Intermediário. Quero o plano Completo (R$ 35,90).")`; com `whatsapp: ""` e `"abc"` devolve `null`. `readStored`/`writeStored` com um `storage` cujos métodos lançam: não lançam e `readStored` devolve `null`; ida e volta com um `storage` falso em memória devolve o objeto.
- [ ] **Step 2: Rodar e ver falhar. Step 3: implementar `quiz.js`. Step 4: ver passar** (`# fail 0`).
- [ ] **Step 5: Commit** — `Feat: Add quiz scoring, plan lookup and WhatsApp link model`.

### Task 8: Quiz na tela

**Files:**
- Create: `frontend/src/controllers/usePlanQuiz.js`, `frontend/src/views/PlanQuiz.jsx`
- Modify: `frontend/src/App.jsx` (separar em `App` — carregamento e erro — e `Landing({ data })` — hooks e composição; montar o quiz no segundo bloco `theme-sand`, depois de `<HowItWorks />`), `frontend/src/views/Header.jsx` (`LINKS` ganha `["#nivel", "Seu nível"]` antes de Planos), `frontend/src/styles/global.css`

**Interfaces:**
- Consumes: tudo de `models/quiz.js` (Task 7); `api.createLead(payload)`; Task 5.
- Produces: `usePlanQuiz(plans): { step: 0 | 1 | 2 | 3, answers, answer(id, value), back(), reset(), result: { level, planKey, plan } | null }` (passo 3 é o resultado; persiste em `sessionStorage` por `QUIZ_KEY` com `readStored`/`writeStored`); `PlanQuiz({ quiz, site })` com `id="nivel"`, que devolve `null` se não houver planos.

- [ ] **Step 1: Controller.** `usePlanQuiz` calcula `result` com `scoreQuiz` + `pickPlan` quando as três respostas existem; `answer` grava a resposta e avança o passo; `back` volta um passo; `reset` limpa respostas e storage.
- [ ] **Step 2: View.** Perguntas como `fieldset` com `input type="radio"` e rótulos visíveis; escolher avança sozinho após cerca de 250 ms; botão "Voltar"; indicador "n/3"; ao chegar no resultado, o foco vai para o título do resultado (`tabIndex={-1}`). Resultado: nome e preço do plano, `reasonFor`, botão "Chamar no WhatsApp" (`buildWhatsAppUrl`; se for `null`, usa `site.cta_url`), botão "Prefiro que me chamem" que abre um mini formulário (nome e WhatsApp) enviado com `api.createLead({ name, whatsapp, level, plan: plan.name, source: "quiz" })`, mensagem de sucesso no lugar do formulário e mensagem de erro do servidor quando falhar (inclusive o limite de taxa); botão "Refazer".
- [ ] **Step 3: Integrar** em `App.jsx` (uma única instância `usePlanQuiz(data.plans)` dentro de `Landing`) e no `Header`. CSS do quiz sem rolagem horizontal em 390 px e dentro de uma tela em 1440x900.
- [ ] **Step 4: Verificar no navegador** (`?v=8`, 1440x900 e 390x844): (Nunca jogei, Ainda não, Aprender sozinho) mostra Essencial e R$ 27,90; (Já joguei algumas vezes, Mais ou menos, Evoluir o meu jogo) mostra Completo; (Jogo toda semana, Com firmeza, Treinar com o professor na areia) mostra Premium. O `href` do WhatsApp começa em `https://wa.me/` e o texto decodificado bate com o modelo. Recarregar mantém o resultado; "Refazer" volta ao passo 0. Enviar o mini formulário mostra sucesso e o lead aparece no Mongo (`source: "quiz"`, `plan`) e no shell do Django. Console sem erros; `document.documentElement.scrollWidth === innerWidth` em 390.
- [ ] **Step 5: Commit** — `Feat: Add inline plan quiz with WhatsApp and optional lead capture`.

### Task 9: Destaque do plano indicado

**Files:**
- Modify: `frontend/src/views/Plans.jsx`, `frontend/src/views/PlansStory.jsx`, `frontend/src/App.jsx`, `frontend/src/styles/global.css`

**Interfaces:**
- Consumes: `quiz.result?.plan?.id` (Task 8).
- Produces: `PlanCard({ plan, pick = false })`; `Plans({ plans, recommended })`; `PlansStory({ plans, recommended })`, onde `recommended` é o `id` do plano indicado ou `undefined`.

- [ ] **Step 1: Implementar.** O cartão indicado ganha a classe `plan--pick` e um selo `span.plan__pick` com "Indicado para você" (canto superior direito, sem conflitar com `.plan__badge`); estilos de borda e selo **sem `transform`**; `recommended` não entra na chave que reconstrói a timeline do GSAP.
- [ ] **Step 2: Verificar.** Sem quiz feito: nenhum `.plan--pick`. Com resultado Completo: exatamente um `.plan--pick`, com o texto do selo, tanto na história presa (1440x900, ao fim do percurso) quanto no layout empilhado (390x844); a animação de entrada dos planos continua igual.
- [ ] **Step 3: Commit** — `Feat: Highlight the plan recommended by the quiz`.

### Task 10: Dados de erro vs. certo e `PlayDiagram` por props

**Files:**
- Create: `frontend/src/models/corrections.js`
- Test: `frontend/src/models/corrections.test.js`
- Modify: `frontend/src/views/PlayDiagram.jsx`, `frontend/src/styles/global.css`

**Interfaces:**
- Produces: `SHOW_DRAFTS = true`; `CORRECTIONS: [{ id, title, reviewed, erro: { text, path, players }, certo: { text, path, players } }]` com `id` em ordem `toque`, `defesa`, `saque`, `ataque`, todos `reviewed: false`; `visibleCorrections(items, showDrafts = SHOW_DRAFTS)` (só `reviewed` quando `showDrafts` é falso); `clampCut(value): number` (`NaN` vira 50; limita a 0–100); `stepCut(cut, key): number | null` (`ArrowLeft` −5, `ArrowRight` +5, `Home` 0, `End` 100, outra tecla `null`; resultado limitado a 0–100). `PlayDiagram` ganha as props opcionais `path`, `players`, `tone` (`"erro"` | `"certo"`), `once` e `runKey`; sem elas, o comportamento atual (prop `play`) não muda.
- Textos-rascunho (fixos): toque, erro "Pé duro e perna esticada: a bola quica longe e foge do controle." / certo "Perna relaxada e joelho flexionado: a bola amortece e sobe perto do corpo."; defesa, erro "Braços abertos e parado: a bola rebate para fora da quadra." / certo "Base baixa e braços firmes: a bola sobe alta, no meio, para o parceiro."; saque, erro "Golpe reto e baixo: a bola bate na rede." / certo "Golpe de baixo para cima, com arco alto: a bola passa a rede e cai na quadra."; ataque, erro "Contato sem salto nem tempo: a bola vai lenta e fácil de defender." / certo "Salto no tempo da bola e contato firme: a bola cai longe da defesa."
- Trajetórias: viewBox 200x120 (rede em x=100, areia em y=100). Erro e certo de um mesmo fundamento partem do mesmo ponto; no saque o erro termina na rede (x≈100, y entre 56 e 100) e o certo reaproveita o arco de `PLAYS.serve`; no ataque o erro termina na rede e o certo reaproveita `PLAYS.spike`; toque e defesa seguem o texto de cada lado.

- [ ] **Step 1: Testes que falham:** ids na ordem; textos e `path` não vazios, `path` começando com `M`, `players` com números entre 0 e 200; `reviewed === false` em todos; `visibleCorrections(CORRECTIONS, false)` é `[]` e `visibleCorrections(CORRECTIONS, true)` tem 4; `clampCut(NaN) === 50`, `clampCut(-3) === 0`, `clampCut(140) === 100`; `stepCut(50, "ArrowRight") === 55`, `stepCut(98, "ArrowRight") === 100`, `stepCut(3, "ArrowLeft") === 0`, `stepCut(50, "Home") === 0`, `stepCut(50, "End") === 100`, `stepCut(50, "a") === null`.
- [ ] **Step 2: Rodar e ver falhar. Step 3: implementar `corrections.js`. Step 4: ver passar.**
- [ ] **Step 5: Estender `PlayDiagram`** com as props novas: com `path`, usa esse caminho e `players` no lugar da chave `play`; `tone` acrescenta a classe `play--erro` ou `play--certo` (traço `#ff8a8a` ou `--gold`); com `once`, a bola roda uma vez (`animation-iteration-count: 1`, preenchimento `forwards`) e reinicia quando `runKey` muda (usar `runKey` como `key` do círculo).
- [ ] **Step 6: Verificar que nada regrediu.** Rebuild; nas faixas e nos fundamentos as bolas continuam animando (`getComputedStyle(document.querySelector(".lane .play__ball")).animationName === "rally"`) e a contagem de `.play` por seção é a mesma de antes.
- [ ] **Step 7: Commit** — `Feat: Add error vs correct data and explicit PlayDiagram paths`.

### Task 11: Seção erro vs. certo

**Files:**
- Create: `frontend/src/views/ErrorVsRight.jsx`, `frontend/src/controllers/useCompareSlider.js`
- Modify: `frontend/src/App.jsx` (renderizar `<ErrorVsRight />` logo depois do bloco do professor), `frontend/src/styles/global.css`

**Interfaces:**
- Consumes: `CORRECTIONS`, `visibleCorrections`, `clampCut`, `stepCut` (Task 10); `PlayDiagram` por props.
- Produces: `useCompareSlider(): { cut, setCut, trackRef, handleProps, sweep }` e `ErrorVsRight()` sem props, `id="correcao"`, que devolve `null` se `visibleCorrections` vier vazio.

- [ ] **Step 1: Controller.** `cut` começa em 50; pointer events só na divisória (captura do ponteiro; posição calculada contra `trackRef` e passada por `clampCut`); `handleProps` traz `role="slider"`, `tabIndex={0}`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-label="Comparar erro e jogada certa"` e `onKeyDown` com `stepCut`; `sweep()` faz a varredura 50, 35, 65, 50 uma vez.
- [ ] **Step 2: View.** Duas colunas (empilha no celular): à esquerda o título "Veja o erro. Veja o ajuste.", abas `role="tablist"` com setas e as frases do fundamento ativo rotuladas "Erro" e "Certo"; à direita os dois `PlayDiagram` sobrepostos, o "certo" por cima com `clip-path: inset(0 0 0 var(--cut))`, divisória com `data-cursor="arraste"` e `touch-action: none` **só nela**. Nenhum texto embaixo do visual. A bola de cada lado corre uma vez ao trocar de aba e ao soltar a divisória (`runKey`), e ao clicar no diagrama; sem loops. A varredura inicial dispara na primeira vez que a seção entra na tela (`IntersectionObserver`) e não roda sob `prefers-reduced-motion: reduce`.
- [ ] **Step 3: Verificar no navegador** (`?v=11`): em 1440x900 a seção cabe em uma tela (`offsetHeight <= innerHeight`); arrastar a divisória com `left_click_drag` altera `aria-valuenow`; com a divisória focada, `ArrowRight` aumenta de 5 em 5 e `Home`/`End` vão a 0/100; trocar de aba troca as frases e reinicia as bolas; em 390x844 não há rolagem horizontal e a divisória responde ao toque. Console sem erros.
- [ ] **Step 4: Commit** — `Feat: Add error vs correct comparison slider`.

### Task 12: Verificação final

**Files:** nenhum novo (corrigir o que a verificação achar).

- [ ] **Step 1: Testes.** Front: `cd frontend && npm test` (esperado `# fail 0`); back: comando das Global Constraints (esperado `OK`).
- [ ] **Step 2: Build limpo e peso.** `docker compose up -d --build`; `docker compose exec -T app sh -c 'gzip -c /app/frontend_dist/assets/index-*.js | wc -c'` deve ser menor ou igual a 187473.
- [ ] **Step 3: Navegador** em 1440x900 e 390x844: console sem erros, sem rolagem horizontal, a página percorre do topo ao rodapé sem elementos cortados; planos mostram sempre o preço final; quiz e slider funcionam de ponta a ponta.
- [ ] **Step 4: Movimento reduzido.** Rodar `impeccable motion-capture` sobre o cabeçalho da página com e sem `--reduced-motion` (`--out-dir .impeccable/review/motion/normal` e `.../reduced`): sem redução aparece a bola; com redução, nenhum quadro animado da bola, e o quiz e o slider seguem utilizáveis.
- [ ] **Step 5: Detector.** `"/Users/leonardogabrielbarbosademelo/.claude/skills/impeccable/scripts/impeccable" detect --json --changed`; corrigir cada achado e rodar de novo até vir vazio.
- [ ] **Step 6: Commit** das correções (se houver) — `Fix: Address final verification findings`. Relatar ao cliente o que foi e o que não foi verificado; não fazer push.
