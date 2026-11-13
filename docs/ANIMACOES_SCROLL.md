# Guia de animações de scroll: referência Money Flow aplicada à landing FTV

Referência: https://landing-page-money-flow.vercel.app/
Nosso código: `frontend/src` (React 19, Vite 7, framer-motion 12).

## Limitação da investigação

A extensão do Chrome (mcp__claude-in-chrome) estava desconectada, então não foi possível rolar a página, tirar screenshots nem inspecionar `window`/DOM ao vivo. A análise foi feita lendo diretamente o que o servidor entrega: o `index.html` (59 KB), `/css/landing.css` (67 KB) e `/js/landing.js` (67 KB, não minificado e comentado). Isso dá os parâmetros exatos (durações, easings, comprimentos de pin, scrub), que são mais precisos do que a observação visual, mas não houve validação visual de sensação (ritmo, inércia). Os comprimentos de pin estão em px de scroll e os tempos são unidades de timeline GSAP (não segundos reais: o scrub mapeia a timeline inteira para o comprimento do pin). Antes de copiar valores, vale abrir a referência uma vez no navegador para comparar a sensação.

## 1. Resumo da referência

Bibliotecas: GSAP + ScrollTrigger, servidos localmente em `/vendor/gsap/gsap.min.js` e `ScrollTrigger.min.js`. Não há Lenis, Locomotive nem framer-motion: o scroll é o nativo do navegador (sem smooth scroll). Não usa CSS scroll-timeline. IntersectionObserver aparece só via o próprio ScrollTrigger (`onToggle`). PerformanceObserver é usado no boot (LCP).

Técnica geral:

- Layout "canvas": no desktop (`min-width:1024px` e `min-aspect-ratio:1/1`) cada seção é um canvas fixo de 1440x900 escalado para caber na viewport por `--fit = min(w/1440, h/900)`. Isso permite coordenar tudo em px de design e manter a composição idêntica em qualquer tela. No mobile/retrato, vira layout em fluxo normal com reveals simples.
- Cada seção tem 3 modos, escolhidos num único `gsap.matchMedia()`: `motion()` (desktop, pins + scrub), `still()` (desktop com prefers-reduced-motion: estado final estático) e `flow()` (mobile: estado final + reveals de uma vez).
- Cada história é uma `gsap.timeline` única com `scrollTrigger: { pin: true, scrub: 0.6, end: '+=N px' }`. Dentro, tudo é posicionado por label numérico (`tl.to(el, vars, 1.2)`), então o scroll é um "scrubber" de uma coreografia inteira.
- Cena 3D por CSS: `perspective` (900 a 2200px) no container, `transform-style: preserve-3d`, e animação de `z`, `rotationX/Y/Z`. Objetos 3D (celular, chave, cadeado) são extrudados empilhando fatias (`translateZ` a cada 3 a 6px).
- Detalhes: odômetro de dígitos (colunas 0 a 9 deslizando com `yPercent`), linha desenhada com `stroke-dashoffset`, donut com `stroke-dasharray`, barras com `scaleY`, setas de câmera (`#pan` e `#rig` movem o painel inteiro entre "focos").

Performance (padrões que valem copiar):

- Boot tardio: GSAP e a história só carregam depois do `load` e do LCP da imagem do hero (fallback de 1500 ms), o hero é completo só com HTML/CSS.
- Trabalho em tarefas curtas (`setTimeout(run, 0)` uma seção por vez), `ScrollTrigger.config({ ignoreMobileResize: true })`.
- Só `transform` e `opacity` (`autoAlpha`). `will-change: transform` só em `.live .wc`, classe ligada por ScrollTrigger `onToggle` apenas enquanto a seção está na tela. Loops idle (giro, brilho) ficam pausados fora da tela.
- `content-visibility: auto; contain-intrinsic-size: auto 100vh` nas seções abaixo da dobra.
- Um único listener de resize coalescido em rAF.
- Âncoras (`#id`) dentro de pins são interceptadas e convertidas para a posição de scroll correta (`ScrollTrigger.getAll()`, `pin-spacer`).

## 2. Inventário seção a seção da referência

Constantes: `PIN = { hero: 4400, panel: 2900, vault: 2000, steps: 1900 }` (px de scroll com a seção parada). Easing padrão das timelines: `power2.inOut`; entradas: `power3.out`; ênfase: `back.out(1.4 a 3)`. Scrub: 0.6 (0.8 no cofre, 0.5 no CTA final).

1. **Hero + "os 5 segundos" + "é só falar" (`#stage`, um único pin de 4400px, scrub 0.6).** Timeline de ~12 unidades. 0 a 1.2: textos do hero saem (`y:-80`, `autoAlpha:0`, `stagger:0.05`), nav sai (`y:-40`), gravura/avatar saem (`xPercent:40`), fundo escurece (`#night1` opacity 1), grade aparece, celular 3D sobe e gira (`rotationY:-42 -> -20`, `rotationX:12 -> 7`, `power3.inOut`, 1.0). Depois camadas A/B/C "explodem" para fora do celular (`z:90 a 170`, `x/y` de destino, 0.7, `power3.out`) com tags; os passos trocam com flip 3D (`rotationX:-60 -> 0` entra, `0 -> 70` sai, `y ±40/50`, 0.35 a 0.4). Barra de progresso `#fill` com `scaleX` linear. Marcas da timeline (`.on`) via `onUpdate` comparando `progress * duration`. Seção 3 (mesmo pin): camadas voltam ao celular, mensagens do chat "pulam" da tela (`z:140 -> 12`, `back.out(1.4)`) e as antigas sobem e somem (`y:'-=150'`). Giro contínuo do celular em `ease:'none'` até o fim do pin.
2. **Painel (`#stage4`, pin 2900, scrub 0.6, mais uma timeline "intro" com `start:'top 75%' end:'top 5%'`).** Um painel inclinado (`rotationX:46`, `scale:.56`) "levanta" e a câmera (`#pan`/`#rig`) passa por 4 focos (`F.top/mid/tx/end`). Cards entram com `autoAlpha` e `z:160 -> 1` (stagger 0.09). Odômetros (`modifiers: { yPercent: wrap }`, power3.out, +0.12 s por dígito), linha do gráfico por `stroke-dashoffset` (1.4, `none`) com `clipPath` crescendo junto, donut por `stroke-dasharray` por segmento, barras `scaleY:0 -> 1` com `transform-origin:50% 100%` (stagger 0.07), lista de transações com `z:120 -> 1` e novo item `back.out(1.3)`. Beats de texto acendem com barra lateral (`scaleY`) e corpo que abre (`height:'auto'`).
3. **Cofre/segurança (`#stage5`, pin 2000, scrub 0.8, intro `top 95%` a `top 10%`).** Chave 3D (fatias) entra, ticks e badges com `back.out(1.6)`, desliza no buraco da fechadura (`rotationY:38`), gira (`rotationX:-60`), argola fecha (`power4.in`), brilho + 8 faíscas (`scale 0 -> 1`, `rotation:90`, `back.out(3)`). Rosácea de 150 polylines SVG gira como camada (`rotation:0 -> 24`), sem repintar. Loops idle (giro 7 s linear, bob `sine.inOut` yoyo) pausados fora da tela e durante a inserção. Textura de grão só carrega perto da seção.
4. **3 passos (`#stage6`, pin 1900, scrub 0.6, intro `top 80%` a `top 5%`).** Três cards 3D entram em sequência com mocks que "executam" (formulário digitando, link abrindo, áudio).
5. **FAQ (`#stage7`, sem pin).** Mapa topográfico de fundo em parallax (`y:120 -> -140`, `rotation:-1.5 -> 1.5`, `scale:1.04 -> 1`, `start:'top bottom' end:'bottom top'`, scrub 0.6) e perguntas "caem" (`rotationX:-80 -> 0`, stagger 0.07, `power3.out`); lista `rotationX:14, y:80`. Acordeão com altura animada (instantâneo em reduced-motion).
6. **CTA final (`#stage8`, sem pin, `start:'top 95%' end:'top 12%'`, scrub 0.5).** Linha de gráfico sobe por `stroke-dashoffset` (1.0, `none`) com clip; manchete entra palavra por palavra (`y:70, rotationX:-80 -> 0`, 0.35, stagger 0.08 a 0.1, `power3.out`); sacola com notas e moedas (`scale:.3 -> 1, back.out(1.7)`, `bounce.out` nas pilhas, leque `scaleY` stagger 0.04); botão pulsa (`scale 1.05` yoyo). Loops de brilho/respiração pausados fora da tela.
7. **Reveal de uma vez (mobile/flow e blocos soltos).** `gsap.from(els, { autoAlpha:0, y:24, duration:0.6, ease:'power3.out', scrollTrigger:{ start:'top 88%', once:true } })`, só nos alvos ainda abaixo da dobra (evita "piscar" o que já está visível).
8. **Relógio vivo do celular, odômetro em modo flow, links âncora corrigidos.** Detalhes de acabamento (setInterval 15 s; odômetros disparam em `top 85%` `once`; clique em `a[href^="#"]` rola até `ScrollTrigger.start` do pin).

Total: 8 grupos, que somam cerca de 14 animações distintas (pin-story do hero, painel com câmera, cofre 3D, passos, parallax de fundo, queda de FAQ, CTA com linha/palavras/sacola, reveal once-only, odômetros, desenho de traço SVG, donut/barras, loops idle pausados, matchMedia desk/flow/reduce, âncoras em pin).

## 3. Comparativo com a nossa landing

Nossa landing (`frontend/src/views`): framer-motion, scroll nativo com `scroll-behavior: smooth` no CSS, sem biblioteca de scroll.

| Tema | Referência | Nossa landing | Situação |
|---|---|---|---|
| Hero pinado com scrub | Pin de 4400px, timeline GSAP | `Hero.jsx`: `section` com `height: 140 + steps*40 vh` e `.hero__stage { position: sticky }`, `useScroll` com offset `["start start","end end"]`, fases por `useMotionValueEvent` | Já temos (sticky nativo em vez de pin; equivalente) |
| Vídeo scrubbing | Não tem vídeo (celular 3D) | `useScrubVideo.js` com lerp 0.2, sem seek enfileirado, unlock iOS | Temos e é mais avançado que a referência |
| Texto letra por letra | Palavra por palavra no CTA (rotationX) | `Letters.jsx` (stagger 0.035, `y:"105%"`, `[0.22,1,0.36,1]`) | Temos (outro estilo: sem `rotationX` 3D) |
| Troca de passos com flip 3D | `rotationX -60 -> 0` | `Hero.jsx`: `AnimatePresence`, `y ±36`, 0.35 | Diferente (nosso é só slide vertical) |
| Frases scroll-driven + manifesto | Não há | `Pains.jsx` (Bubble + Word com opacity 0.16 -> 1) | Temos (extra nosso) |
| Scroll horizontal pinado | Não há | `Fundamentals.jsx` | Temos (extra nosso) |
| Reveal once-only | `y:24`, 0.6, `power3.out`, `top 88%` | `Reveal.jsx` (`y:40`, 0.7, `margin -80px`) | Temos, parâmetros próximos |
| Linha de timeline que enche | `stroke-dashoffset` linear | `HowItWorks.jsx` (`scaleY` com spring) | Temos |
| Parallax de imagem | Mapa de fundo `y 120 -> -140` | `Teacher.jsx` (`y -6% -> 6%`, scale 1.42), glow do hero | Temos, mais sutil |
| Marquee | Não identificado | `Ticker.jsx` (CSS 36 s linear) | Temos |
| Wordmark gigante no footer | Não há | `.footer__big` estático (gradiente) | Temos, mas estático (falta animar) |
| Dock/CTA flutuante | Não há | `Footer.jsx` (scroll listener + IntersectionObserver) | Temos |
| Odômetro / contadores | Colunas de dígitos por scroll | Stats do hero são texto estático | FALTA |
| Desenho de traço SVG / gráficos | Linha, donut, barras por scrub | Não há gráfico | FALTA (opcional) |
| Profundidade 3D (perspective, z, rotationX) | Em todas as cenas | Não há | FALTA (maior diferença de "feeling") |
| Timeline única coreografada | Uma timeline por seção | Várias `useTransform` espalhadas | Diferente |
| Smooth scroll (inércia) | Não usa | CSS `scroll-behavior: smooth` | Diferente (ver seção 5) |
| Parallax/queda em lista (FAQ) | `rotationX:-80 -> 0`, stagger 0.07 | `Faq.jsx` sem animação de entrada própria | FALTA (fácil) |
| Âncoras dentro de pins | Interceptadas, vão para `start` do pin | Âncoras nativas; `scroll-padding-top` | Risco: `#aulas`/`#planos` estão fora do hero, então hoje OK; atenção ao `Footer.show` |
| Reduced motion | `still()` estado final, sem pins/loops | Só desliga ticker/hint em CSS | FALTA nos componentes JS (ver 5) |
| Mobile | Layout próprio sem pins | Mesmos pins, vh grandes | Atenção (ver 5) |
| Idle loops pausados fora da tela | `live()` + `paused` | Ticker CSS sempre rodando | Pequeno ganho possível |
| Boot tardio | GSAP após LCP | Não aplicável (framer já no bundle) | Considerar `lazy` para seções abaixo da dobra |

Conclusão: já cobrimos quase todo o vocabulário 2D da referência (pin/sticky, scrub, reveal, texto por letra, parallax, timeline). A referência se diferencia por (a) profundidade 3D, (b) coreografia em timeline única com labels, (c) contadores/odômetros e traços SVG, (d) rigor de performance/reduced-motion/mobile. Nenhuma troca de biblioteca é necessária para atingir isso.

## 4. Passo a passo de implementação

Recomendação de biblioteca: continuar com framer-motion (já instalado, `useScroll`/`useTransform`/`useSpring` cobrem scrub; `useMotionValueEvent` cobre estados discretos). GSAP+ScrollTrigger só se vocês quiserem timelines com muitos labels (como a referência, ~12 passos coordenados por pin); para a escala atual da FTV, seria +~100 KB e uma segunda biblioteca de animação, sem ganho proporcional. Única dependência nova que recomendo avaliar: Lenis (seção 5), opcional.

Convenção para todos os passos: `useScroll({ target, offset })` retorna `scrollYProgress` 0..1; cada animação vira `useTransform(progress, [a, b], [from, to], { ease })`. Animar apenas `transform` e `opacity`.

### Passo 1. Hook utilitário de timeline por faixas (base de tudo)

Para reproduzir "labels numéricos" da referência sem GSAP, crie `frontend/src/controllers/useBeat.js`:

```js
import { useTransform } from "framer-motion";
import { cubicBezier } from "framer-motion";

export const easeOut = cubicBezier(0.22, 1, 0.36, 1);   // power3.out aproximado
export const easeInOut = cubicBezier(0.65, 0, 0.35, 1); // power2.inOut aproximado

// Mapeia uma faixa [a, b] do progresso para [from, to], com clamp e easing.
export function useBeat(progress, [a, b], [from, to], ease = easeInOut) {
  return useTransform(progress, [a, b], [from, to], { ease, clamp: true });
}
```

Valores: cada beat dura 0.05 a 0.12 do progresso do pin (equivalente a 0.3 a 0.7 unidades de uma timeline de ~6).

### Passo 2. Flip 3D na troca de passos do hero (`Hero.jsx`, `Letters.jsx`)

Referência: entrada `rotationX:-60 -> 0, y:40 -> 0, 0.4 s, power3.out`; saída `rotationX:0 -> 70, y:0 -> -50, 0.35 s, power2.in`. No `Hero.jsx`, onde está `initial/animate/exit` dos passos:

```jsx
<motion.div key={phase} className="hero__step"
  style={{ transformPerspective: 900, transformOrigin: "50% 100%" }}
  initial={{ opacity: 0, rotateX: -60, y: 40 }}
  animate={{ opacity: 1, rotateX: 0, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
  exit={{ opacity: 0, rotateX: 70, y: -50, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } }}>
```

Mantenha `.hero__swap` com `overflow: visible` e `perspective` no pai (`.hero__swap { perspective: 900px }`) para o efeito funcionar. Não faça isso em `.hero__stage` inteiro (custo).

### Passo 3. Saída do hero ao começar o scroll (`Hero.jsx`)

Referência: nos primeiros ~10% do pin, textos saem com `y:-80`, `autoAlpha:0`, `stagger 0.05`. Aqui isso conflita com as fases (fase 0 é o título). Sugestão: aplicar só à `hero__cta` e `hero__stats`:

```jsx
const outY = useTransform(scrollYProgress, [0.02, 0.12], [0, -80]);
const outO = useTransform(scrollYProgress, [0.02, 0.1], [1, 0]);
// <ul className="hero__stats"> -> <motion.ul style={{ y: outY, opacity: outO }}>
// <div className="hero__cta">   -> <motion.div style={{ y: outY, opacity: outO }}>
```

Com `stagger` simulado deslocando o range em +0.02 no segundo elemento.

### Passo 4. Odômetro nas estatísticas do hero (novo `views/Odometer.jsx`)

Referência: coluna com dígitos 0..9(+0), `yPercent = -digit * (100/11)`, voltas extras por dígito (`(1+idx)*10+digit`), `power3.out`, duração `1 + idx*0.12`, disparo em `top 85%` once. Em framer-motion:

```jsx
import { animate, useInView, useMotionValue, useTransform, motion } from "framer-motion";
import { useEffect, useRef } from "react";

function Reel({ digit, laps, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const y = useMotionValue(0);
  const pct = useTransform(y, (v) => `${-(v % 10) * (100 / 11)}%`); // wrap
  useEffect(() => {
    if (!inView) return;
    const c = animate(y, laps * 10 + digit, { duration: 1 + delay, ease: [0.22, 1, 0.36, 1] });
    return c.stop;
  }, [inView]);
  return (
    <span ref={ref} className="reel" aria-hidden="true">
      <motion.span style={{ y: pct, display: "block" }}>
        {Array.from({ length: 11 }, (_, n) => <b key={n}>{n % 10}</b>)}
      </motion.span>
    </span>
  );
}
```

CSS: `.reel { display:inline-block; height:1em; overflow:hidden; line-height:1 } .reel b { display:block; height:1em }`. Use `<span className="sr-only">{value}</span>` para acessibilidade. Aplique em `Hero.jsx` (`site.stats`), apenas nos dígitos; mantenha sufixos ("+", "%") fora do reel. Se o valor for texto não numérico, renderize como está.

### Passo 5. Wordmark do footer animada (`Footer.jsx`, `.footer__big`)

Referência de CTA final: palavras entram com `y:70, rotationX:-80 -> 0`, 0.35, stagger 0.08, e a seção "termina" quando seu topo chega a 12% da viewport (`start:'top 95%' end:'top 12%'`, scrub 0.5). Aplique scrub nas letras do wordmark:

```jsx
const ref = useRef(null);
const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 12%"] });
// para cada letra i de n: 
// const a = (i / n) * 0.6; const y = useTransform(scrollYProgress, [a, a + 0.25], ["70%", "0%"]);
```

Como hooks não podem estar em loop, crie um subcomponente `<WordmarkLetter progress i n ch />`. Com `perspective:800px` em `.footer__big` e `rotateX` de -80 a 0, o resultado fica idêntico ao da referência. Mantenha `aria-hidden`.

### Passo 6. FAQ cai em cascata (`Faq.jsx`)

Referência: `.qa { rotationX:-80 -> 0, autoAlpha 0 -> 1, 0.4, stagger 0.07, power3.out }`, lista `rotationX:14, y:80 -> 0`, 0.8, scrub no intro. Equivalente simples (sem scrub), usando `variants` com `staggerChildren: 0.07`:

```jsx
const list = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, rotateX: -80 }, show: { opacity: 1, rotateX: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };
// <motion.ul variants={list} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} style={{ perspective: 900 }}>
```

### Passo 7. Parallax de fundo em seções soltas (`Teacher.jsx`, `Plans.jsx`, `Faq.jsx`)

Referência (mapa do FAQ): `y:120 -> -140`, `rotation:-1.5 -> 1.5`, `scale:1.04 -> 1`, trigger `start:'top bottom' end:'bottom top'`. Implementação:

```jsx
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
const y = useTransform(scrollYProgress, [0, 1], [120, -140]);
const r = useTransform(scrollYProgress, [0, 1], [-1.5, 1.5]);
const s = useTransform(scrollYProgress, [0, 1], [1.04, 1]);
// <motion.div className="bg-art" aria-hidden style={{ y, rotate: r, scale: s }} />
```

Coloque a textura (ex.: ondas/areia, SVG) como `position:absolute; inset:-10%` atrás do conteúdo. Nosso `Teacher.jsx` já faz algo semelhante (`photoY ±6%`): para ficar parecido com a referência, aumente para `["-10%","10%"]` só se a foto tiver margem.

### Passo 8. Profundidade 3D nos cartões de Fundamentals (`Fundamentals.jsx`)

Referência: cards entram com `z:160 -> 1` e `autoAlpha 0.15 -> 1`, stagger 0.09, `power3.out`; o card em foco sobe `z:70`. Aqui, cada `li.fund` pode reagir à posição relativa ao centro:

```jsx
// dentro de um subcomponente <Fund progress={smooth} index total travel>:
const center = index / (total - 1);                        // posição do card no progresso
const d = useTransform(progress, (p) => Math.abs(p - center)); // distância ao foco
const z = useTransform(d, [0, 0.25], [60, 0]);
const o = useTransform(d, [0, 0.4], [1, 0.45]);
// style={{ z, opacity: o }}  e  .funds__viewport { perspective: 1200px }
```

Isso reproduz o "card em foco avança". Atenção: `z` em framer-motion aplica `translateZ`; precisa de `perspective` no pai e `transform-style: preserve-3d` se houver filhos 3D.

### Passo 9. Desenho de traço SVG (opcional, ex.: no `HowItWorks.jsx`)

Referência: `stroke-dashoffset: LEN -> 0`, `ease:'none'`, ligado direto ao progresso. Em framer-motion use `pathLength`:

```jsx
const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
<motion.path d="..." style={{ pathLength: scrollYProgress }} stroke="var(--gold)" fill="none" />
```

Nossa linha vertical (`scaleY` com spring) já faz o mesmo efeito. Só adote se quiserem uma linha curva (por exemplo, a trilha de uma bola de futevôlei conectando os 4 passos).

### Passo 10. Loops idle que pausam fora da tela (`Ticker.jsx`, `Hero.jsx`)

Referência: `live()` liga/desliga `.live` e `paused()` com ScrollTrigger `onToggle`. Em CSS puro:

```jsx
const ref = useRef(null);
const on = useInView(ref, { margin: "100px" });
// <div className="ticker" ref={ref} data-live={on}>
// .ticker[data-live="false"] .ticker__track { animation-play-state: paused; }
```

E `will-change: transform` só quando `data-live="true"` (a referência só promove camada enquanto visível).

### Passo 11. Padronizar parâmetros do `Reveal.jsx`

Alinhar com o padrão da referência (`y:24`, 0.6, `power3.out`, `top 88%`) sem quebrar usos atuais: `y = 28`, `duration: 0.6`, `viewport={{ once: true, margin: "0px 0px -12% 0px" }}`. A margem de -12% equivale ao `top 88%`. Para evitar "piscar" itens já visíveis no carregamento, use `initial={false}` quando o elemento já estiver acima da dobra (o `Reveal` hoje pode piscar em telas altas; testar).

### Passo 12. Âncoras com pins (`Header.jsx`, `Footer.jsx`)

Nossos pins são `position: sticky` dentro de seções altas, então `scroll-padding-top` basta para `#aulas`/`#planos`. Se algum dia um link apontar para dentro do hero, a posição de destino é `hero.offsetTop + fase * hero.offsetHeight`, calculada em JS, como a referência faz com `ANCHOR`.

## 5. Setup global

**Smooth scroll.** A referência não usa Lenis; nós temos `scroll-behavior: smooth` em `html` (só afeta saltos por âncora/scrollTo, não a roda do mouse). Recomendação: manter assim. Lenis só vale a pena se quiserem inércia na rolagem da roda; custo: ~3 KB, mas integra com `useScroll` do framer-motion sem ajuste (Lenis mantém `window.scrollY`), exige desativar `scroll-behavior: smooth`, e piora a sensação de scrub de vídeo em alguns trackpads. Se adotar:

```js
// controllers/useLenis.js
import Lenis from "lenis";
import { useEffect } from "react";
export function useLenis() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3), smoothWheel: true });
    let raf; const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);
}
```

Chame em `App.jsx` e troque `scroll-behavior: smooth` por `auto`. Para âncoras use `lenis.scrollTo(el, { offset: -header })`. Decisão sugerida: não adicionar por ora; testar antes e depois com o scrub de vídeo.

**prefers-reduced-motion.** A referência troca pins por quadros estáticos. Aqui, use `useReducedMotion()` do framer-motion:

- `Letters`: se reduzido, renderizar o texto sem variants.
- `Reveal`: `initial={false}` e `transition={{ duration: 0 }}`.
- `Hero`: não mudar a altura de scroll para 140+vh; renderizar passo 1 fixo, sem scrub do vídeo (`enabled=false` em `useScrubVideo`, mostrar poster).
- `Fundamentals`: trocar o pin por `overflow-x: auto` (scroll horizontal nativo) e `height:auto`.
- `Pains`: manifesto com opacidade 1 e bolhas visíveis.
- CSS: manter o bloco `@media (prefers-reduced-motion: reduce)` já existente e acrescentar `.letters *, .reel * { transition: none !important }`.

**Mobile.** A referência abandona pins no mobile (layout em fluxo, reveals once). Faça o mesmo de forma proporcional: em `max-width: 900px` reduzir a altura dos pins (hero `100 + steps*28 vh`, funds `100 + items*12 vh`), desligar profundidade 3D (Passos 2 e 8) e o parallax (Passo 7), e usar `100svh` (já usado) para evitar saltos da barra de URL. Considere um hook `useIsDesktop()` com `matchMedia('(min-width:1024px) and (min-aspect-ratio:1/1)')` para escolher entre versão scroll-driven e reveal simples, como o `matchMedia` da referência.

**Performance.**

- Animar só `transform`/`opacity` (nossos `useTransform` já fazem; evitar `height`, `top`, `filter: blur` animado).
- `will-change: transform` apenas em elementos que se movem a cada frame (`.funds__track`, `.pain`, cartões do Passo 8), idealmente só enquanto visíveis (Passo 10). Não colocar em tudo.
- `content-visibility: auto; contain-intrinsic-size: auto 100vh` em `Benefits`, `HowItWorks`, `Plans`, `Faq`, `Footer` (seções abaixo da dobra e sem pin; não use em seções com `useScroll target`, pois mudaria medidas; teste antes).
- Evitar layout thrash: `Fundamentals.measure` lê `scrollWidth` no resize; use `ResizeObserver` em vez de `resize` e agrupe leituras antes de escritas. `Footer` roda `setShow` em todo `scroll`: já é `passive`, mas prefira `useMotionValueEvent(scrollY)` e só chame `setShow` quando o valor booleano mudar.
- `backdrop-filter` em `.pain` e `.ticker` é caro durante scroll; manter só se o FPS estiver bom no mobile médio.
- Vídeo do hero: manter o `useScrubVideo` (lerp 0.2). Para melhor seek, o vídeo deve ter keyframes frequentes (`ffmpeg -g 1` ou `-g 2`), o que o script `scripts/` do projeto pode já tratar.
- Carregar abaixo da dobra com `React.lazy` + `Suspense` (a referência só carrega GSAP depois do LCP).

## 6. Checklist de verificação e ordem de execução

Ordem sugerida (do menor risco/maior retorno ao maior):

1. Passo 11 (Reveal) e Passo 6 (FAQ): 30 min, sem risco.
2. Passo 10 (pausar loops fora da tela) e ajustes de performance do `Footer` e `Fundamentals` (seção 5).
3. Reduced motion completo (seção 5): faça cedo, antes de adicionar mais movimento.
4. Passo 4 (odômetro nos stats): efeito de maior impacto visual por custo.
5. Passo 5 (wordmark do footer com scrub).
6. Passo 2 (flip 3D dos passos do hero) e Passo 3 (saída dos CTAs).
7. Passo 7 (parallax de fundo) e Passo 8 (profundidade nos fundamentos).
8. Mobile: `useIsDesktop` e alturas reduzidas.
9. Passo 9 (traço SVG) e Lenis: só se a sensação pedir.

Checklist de verificação:

- [ ] `npm run build` em `frontend/` sem warnings novos; tamanho do bundle praticamente igual (nenhuma lib nova no caminho recomendado).
- [ ] Chrome DevTools > Performance: rolar a página inteira em 4x CPU throttling, sem long tasks acima de 50 ms por frame e sem "Layout" recorrente durante o scroll.
- [ ] Rendering > Paint flashing: só as camadas animadas piscam.
- [ ] Rolar para cima e para baixo: toda animação scrubbed é reversível e sem estados presos (Passos 2, 3, 5, 8).
- [ ] Recarregar no meio da página: elementos `Reveal`/`Letters` já visíveis não piscam nem ficam invisíveis.
- [ ] Emulação `prefers-reduced-motion: reduce`: nenhum pin, loop ou movimento; conteúdo completo e legível.
- [ ] Mobile (iPhone Safari real ou emulação 390x844): sem salto na barra de URL, hero rola de forma fluida, vídeo avança (unlock iOS), Fundamentals usável.
- [ ] Redimensionar a janela: `Fundamentals` recalcula o deslocamento, hero mantém proporção.
- [ ] Âncoras do menu (`#aulas`, `#professor`, `#planos`) pousam sem ficar sob o header.
- [ ] Teclado/leitor de tela: textos de `Letters` e odômetros expõem o texto completo (`aria-label`/`sr-only`).
- [ ] Lighthouse mobile: LCP e CLS iguais ou melhores que antes (nenhum conteúdo deslocado por animação).
