# Melhorias da landing: auditoria, pesquisa e ideias

Data: 2026-11-20. Branch `staging` (HEAD `7b66310`). Status: levantamento de ideias, nada implementado.

## Objetivo

Deixar a landing "impecável", com cara de trabalho sênior, e criar animações novas sem sair do tema (aulas de futevôlei). Este documento reúne o que a auditoria encontrou, o que a concorrência e a pesquisa mostram, as ideias ordenadas por retorno e uma proposta de fases.

Ferramentas usadas na análise: skills `superpowers:brainstorming`, `impeccable` e `design-taste-frontend` (taste-skill), auditoria no navegador em 1440x900, pesquisa na web e leitura de duas páginas concorrentes.

Observação de método: o taste-skill desaconselha cartões que aparecem ao rolar e scroll preso. O pedido do projeto prevalece, então as histórias presas de fundamentos, professor e planos ficam.

## O que a auditoria encontrou

1. **A maior lacuna é prova, não animação.**
   - Não há depoimento na página. O `frontend/src/App.jsx` nem renderiza `testimonials`, embora a API e o admin tenham o modelo.
   - O professor aparece como "Seu professor na Royal", sem nome nem títulos.
   - Não existe aula-amostra.
   - Hoje a única prova são os selos "+200 vendas" e "+15 alunos hoje treinam na Royal".
2. **Preço errado durante o scroll.** A seção de planos conta o preço de 0 até o valor enquanto você rola. Numa captura, o plano Completo apareceu como "R$ 12,74". Quem para de rolar nesse ponto lê um preço falso, justamente onde decide a compra.
3. **Peso.**
   - JS: 510 KB (172 KB gzip), por causa de Framer Motion e GSAP juntos. CSS: 27 KB.
   - Vídeo do hero: 2,4 MB, 464x784, com a marca "SPORTS". Pixeliza em tela grande e é só um clipe de 5,3 s.
4. **Pendências do QA (`docs/QA_STAGING.md`) que continuam abertas.**
   - M1: abaixo de 900px a navegação some e não há menu alternativo.
   - M3: `prefers-reduced-motion` respeitado só em parte (o hero segue preso e com vídeo controlado pelo scroll; faltam `MotionConfig reducedMotion="user"` e a trava do ScrollTrigger).
   - M2: hero cortado em celular deitado (não há media query por altura).
   - M4: o dock de compra continua visível sobre o rodapé.
5. **Fluxo de compra.** Todos os CTAs abrem o WhatsApp. Funciona para o Premium (aula presencial), mas é atrito para um produto de R$ 27,90 a R$ 35,90. Ainda não foi discutido; ver "Em aberto".

## O que a concorrência faz

Leitura parcial, feita por um agente de busca sobre o texto extraído das páginas. Vale abrir as duas para confirmar.

| | +130 Aulas (escolaesportiva) | Águia Academy (Hotmart) |
|---|---|---|
| Oferta | Completo R$ 39,90 (de R$ 59,90) ou 6x R$ 7,49; Básico R$ 19,90; 5 bônus | Preço não aparece no texto extraído |
| Garantia | 15 dias, repetida em planos, bloco próprio e FAQ | Não encontrada |
| Prova social | Nenhuma: sem depoimentos, sem professor identificado | "Hexacampeão mundial Anderson Águia" e selo "Bem Avaliado" |
| CTAs | Cerca de 10 (9 vão para `#planos`), pop-up de saída com desconto | Sem botão visível no texto |
| Amostra em vídeo | Não | Não |
| Fraquezas | Urgência permanente ("só hoje"), parcelas que somam mais que o preço à vista, 130 vs 150 aulas, link do plano básico quebrado | Descrição longa e genérica, sem lista de aulas |

Conclusão: nenhum dos dois mostra prova real nem aula de amostra. Quem fizer isso primeiro ganha vantagem. A concorrente vende volume (130+ aulas por R$ 39,90); a nossa oferta tem 22 aulas de 5 a 10 minutos, então o diferencial a mostrar é método, nível, correção e o professor, não preço.

Oferta atual para comparação: Essencial R$ 27,90, Completo R$ 35,90, Premium R$ 65,90, acesso vitalício, sem garantia declarada.

## O que a pesquisa indica

**Conversão (Brasil)**
- Os prazos de garantia mais comuns são 7 e 30 dias. A Hotmart afirma que os 7 dias são direito do consumidor em compra online, não cortesia do vendedor ([Hotmart](https://hotmart.com/pt-br/blog/o-que-e-landing-page), [Hotmart](https://hotmart.com/pt-br/blog/ferramentas-landing-page)). Confirmar o enquadramento legal antes de escrever o texto.
- A garantia costuma ficar na página de vendas e sumir no checkout, onde a dúvida aparece ([HeroSpark](https://herospark.com/guias/checkout-que-converte)). Repetir perto do CTA e do dock.
- Repetir o CTA em pelo menos três pontos e dar destaque visual à garantia ([Hotmart](https://hotmart.com/pt-br/blog/pagina-de-vendas)).
- Depoimentos de cerca de quatro a cinco frases, com resultado real ([SendPulse](https://sendpulse.com/br/blog/landing-page-do-curso-online-design-redacao-e-exemplos)).
- Os percentuais de aumento de conversão citados por blogs de plataformas de curso não foram verificados e não foram usados aqui.

**Scroll e animação**
- Lenis junto com GSAP ScrollTrigger é o padrão para scroll suave em 2026; o Lenis é sincronizado com o ticker do GSAP e desligado com `prefers-reduced-motion` ([guia](https://www.hontran.dev/blog/nextjs-smooth-scroll-gsap-lenis)).
- Animações de scroll em CSS (`animation-timeline: view()`) estão disponíveis em Chrome e Edge 115, Safari e Firefox 159, e a [web.dev](https://web.dev/blog/web-platform-10-2026) as classifica como Baseline. As fontes divergem sobre a versão do Safari, então confirmar no MDN ou Can I Use antes de depender ([guia do WebKit](https://www.webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/)).

**Inspiração**
- Listas de sites de esporte: [DesignRush](https://www.designrush.com/trends/best-sports-websites). Nenhuma fonte explicou scrubbing de vídeo; essa técnica já existe no hero.

## Ideias, por retorno

### Provar (depende de material do cliente)

1. **Professor com nome, títulos e fotos em ação.** Troca o placeholder. Precisa de nome, 2 ou 3 títulos ou experiências verificáveis e 2 ou 3 fotos em ação.
2. **Parede de prints reais de WhatsApp.** Terceira faixa infinita reaproveitando `LessonLanes` e `useMarquee`. Nada inventado: sem material, a seção fica oculta.
3. **Aula-amostra grátis de 1 a 2 minutos**, em troca do WhatsApp (captura de lead). Nenhum concorrente lido tem.
4. **Garantia visível e preço fixo.** Garantia repetida junto ao CTA e ao dock. Preço sem contagem animada. "De R$ X por R$ Y" só se existir preço de referência real. O prazo da garantia (7 dias ou mais) é decisão do cliente.

### Surpreender (sem material)

5. **Quiz "Qual seu nível?"** Três perguntas, recomenda o plano e abre o WhatsApp com mensagem pronta. Dinâmico e ajuda a converter.
6. **"Erro vs. certo".** Slider que arrasta entre duas trajetórias do diagrama de jogada (`PlayDiagram`). Depois troca pelos vídeos reais. Dá corpo à promessa de correção de erros comuns.
7. **Cursor em forma de bola** (só desktop com mouse). Vira "play" sobre os cartões de aula e "arraste" sobre as faixas. Desligado em toque e com movimento reduzido.
8. **Entrada de 1 segundo.** A bola quica e assenta na coroa da marca. Só na primeira visita e ignorada com movimento reduzido.
9. **Scroll suave (Lenis + GSAP)**, só desktop. Faz o vídeo do hero andar mais liso. Riscos a testar: âncoras (`useAnchorScroll`) e as seções presas.
10. **Hero com um clipe por passo** (saque, defesa, chapa, ataque), em alta resolução e sem marca. Hoje é um único clipe. Precisa de material.

### Base técnica

11. **Tirar o Framer Motion.** Trocar `Reveal`, `Letters`, `ScrollProgress` e a rolagem de `Fundamentals` por CSS de scroll (com fallback sem animação). GSAP continua nas histórias presas. Meta proposta: JS abaixo de 250 KB e Lighthouse mobile de 95 ou mais, medindo antes e depois.
12. **Fechar as pendências do QA:** menu colapsável no celular (M1), reduced-motion completo (M3), hero em celular deitado com `@media (max-height: 500px)` (M2) e dock escondido no rodapé (M4).
13. **SEO e compartilhamento:** `og:image`, `og:title` e JSON-LD `Course` com `Offer`.

## Proposta de fases

- **Fase 1, sem material do cliente:** 4 (preço fixo e espaço para a garantia), 5, 6, 7, 8, 9, 11, 12 e 13.
- **Fase 2, com material do cliente:** 1, 2, 3 e 10. Os componentes podem ser preparados na fase 1 e ficar ocultos até haver conteúdo real.

Se o cliente já tiver o material, a ordem muda: prova primeiro (1 a 4), depois o resto.

## Em aberto

- Que material real está disponível: nome e títulos do professor, prints de depoimentos de alunos, uma aula-amostra, mais clipes de vídeo? Sem nada disso, começa-se pela fase 1.
- Prazo da garantia: 7 dias ou mais.
- Fluxo de pagamento (ainda não discutido): hoje todos os CTAs abrem o WhatsApp; decidir se entra link de pagamento ou Pix para os planos de menor valor.

## Fontes

- [Hotmart: garantia e direito do consumidor](https://hotmart.com/pt-br/blog/o-que-e-landing-page)
- [Hotmart: prazos de garantia](https://hotmart.com/pt-br/blog/ferramentas-landing-page)
- [Hotmart: página de vendas e CTAs](https://hotmart.com/pt-br/blog/pagina-de-vendas)
- [HeroSpark: checkout que converte](https://herospark.com/guias/checkout-que-converte)
- [SendPulse: landing page de curso online](https://sendpulse.com/br/blog/landing-page-do-curso-online-design-redacao-e-exemplos)
- [web.dev: novidades da plataforma em outubro de 2026](https://web.dev/blog/web-platform-10-2026)
- [WebKit: guia de scroll-driven animations](https://www.webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/)
- [Lenis + GSAP em 2026](https://www.hontran.dev/blog/nextjs-smooth-scroll-gsap-lenis)
- [Águia Academy (Hotmart)](https://hotmart.com/pt-br/marketplace/produtos/team-aguia-pro/M61620133W)
- [+130 Aulas de Futevôlei](https://mais130aulasdefutevolei.escolaesportiva.com/)
- [DesignRush: melhores sites de esporte](https://www.designrush.com/trends/best-sports-websites)
