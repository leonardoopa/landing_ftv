# Landing "Surpreender": movimento, quiz de nível e erro vs. certo

Data: 2026-11-20. Status: aguardando aprovação. Nada deste documento foi implementado.

## Intenção e porquê

A landing do Royal Futevôlei (aulas em vídeo, planos de R$ 27,90 a R$ 65,90, venda por WhatsApp) já tem histórias presas ao scroll, faixas infinitas de aulas e diagramas de jogada. O pedido é torná-la mais dinâmica e com acabamento de trabalho sênior, sem sair do tema do futevôlei. Esta rodada cobre três peças pequenas e independentes:

1. **Movimento:** entrada com bola, rótulo de cursor contextual e scrub do hero mais liso, mais a correção do preço que conta durante o scroll.
2. **Quiz de nível:** três perguntas que recomendam um plano, destacam esse plano na seção de planos e levam ao WhatsApp, com captura de contato opcional.
3. **Erro vs. certo:** um slider que compara a trajetória errada e a certa de quatro fundamentos, sustentando a promessa de "correção de erros comuns".

O porquê das peças interativas é converter e provar o método, não só enfeitar: o quiz reduz a dúvida "qual plano é o meu" e o slider mostra a correção em vez de só prometê-la. O movimento existe para dar caráter à marca e fazer o hero parecer premium.

Skills que guiaram o design: `superpowers:brainstorming`, `impeccable` (um único momento autoral de movimento, sem modal desnecessário) e `design-taste-frontend` (regras de movimento).

## Metas, não-metas e anti-metas

**Metas**
- Entrada do hero com a bola que assenta na coroa do header, uma vez por sessão.
- Rótulo "arraste" que segue o mouse apenas sobre as áreas arrastáveis.
- Scrub do vídeo do hero independente da taxa de quadros do monitor e sem trabalho em repouso.
- Preço dos planos sempre correto na tela.
- Quiz inline que recomenda plano, destaca-o e abre WhatsApp com mensagem pronta; lead opcional gravado no admin.
- Erro vs. certo com slider de corte, quatro abas e acesso por teclado.

**Não-metas**
- Clipes novos para o hero: não há material. O clipe atual (`hero.mp4`, 464x784, 5,3 s) fica.
- Biblioteca de scroll suave (Lenis), cursor substituído, tela de abertura ou modal.
- Depoimentos, garantia e demais itens de prova social (ficam para outra rodada; ver `docs/MELHORIAS_LANDING.md`).
- Gerenciar os textos de erro vs. certo pelo admin.
- Trocar Framer Motion por CSS.

**Anti-metas** (falha mesmo que "funcione")
- Qualquer coisa que atrase o primeiro conteúdo ou o CTA.
- Publicar texto técnico de futevôlei que o professor não validou.
- Inventar dado, depoimento ou promessa.
- Quebrar o layout empilhado do celular ou o comportamento com movimento reduzido.
- Aumentar o JS em mais de cerca de 15 KB gzip (hoje 172 KB gzip), sem nenhuma dependência nova.

## Restrições

- Stack existente: React 19 e Vite, GSAP (histórias presas), Framer Motion, FastAPI, MongoDB, Django admin. Sem dependência nova.
- Desktop com histórias presas só quando a media query `DESK` vale (largura ≥ 1024, altura ≥ 660, sem redução de movimento); fora disso as seções são empilhadas.
- Não há `node_modules` local: o front só builda via `docker compose up -d --build`. A verificação é no container.
- O modelo `Level` do lead aceita só `iniciante` e `intermediario`. O plano recomendado viaja em campo próprio.
- O cadastro de lead é idempotente por WhatsApp (`$setOnInsert`, índice único) e tem limite de taxa por IP.
- Regras do taste-skill respeitadas: sem tela de abertura ou loader, sem cursor substituído, sem biblioteca de scroll suave, sem texto descritivo embaixo de visuais, no máximo um loop por painel. Desvios já aceitos pelo projeto: histórias presas e cartões que entram no scroll.

## Abordagens consideradas

**Movimento.** Há um caminho sensato. As versões originais pedidas (cursor-bola que substitui o ponteiro, entrada de 1 s como tela de abertura, scroll suave com Lenis) foram trocadas por versões que mantêm o objetivo e respeitam as regras, por decisão apresentada e aceita na conversa.

**Quiz.** Três opções:
- A) Só WhatsApp: sem mudança de backend, mas o contato se perde se a pessoa não enviar a mensagem.
- B) Captura obrigatória antes do resultado: garante contato, mas é atrito e derruba a conclusão.
- C) Resultado primeiro, captura opcional. **Escolhida pelo cliente.**
Descartado: modal (a tarefa não exige interromper) e quiz dentro do hero.

**Erro vs. certo.** Duas opções:
- Slider de corte: dois diagramas sobrepostos com divisória arrastável. **Escolhida.**
- Morph contínuo da trajetória: mais vistoso, mas os pontos intermediários não têm significado técnico.

## Peça 1: movimento

### Entrada com bola
- Um componente montado na raiz do app, com SVG da bola (cerca de 28 px) em camada fixa acima do header, `pointer-events: none` e `aria-hidden`.
- Animado com a Web Animations API. A bola cai do topo até a posição da coroa do header (`.brand .crown`, medida com `getBoundingClientRect` depois do layout), quica duas vezes com squash no contato, assenta e desaparece em cerca de 200 ms enquanto a coroa dá um pulso curto. Duração total perto de 1 s.
- Roda em paralelo com a entrada de letras do hero; nunca bloqueia nem esconde conteúdo.
- Só na primeira visita da sessão (chave em `sessionStorage`), só sem redução de movimento, e é pulada se a página abrir já rolada (`scrollY` acima de 80 px) ou se a coroa não for encontrada.

### Rótulo de cursor
- Um único elemento fixo (pílula dourada, texto pequeno em caixa alta) que segue o ponteiro por `requestAnimationFrame` e só aparece sobre elementos com `data-cursor`.
- Ouvinte global de `pointermove` com `closest("[data-cursor]")`, no mesmo padrão do spotlight existente.
- Só com `(hover: hover) and (pointer: fine)`. O cursor nativo continua visível.
- Marca `data-cursor="arraste"` nas faixas de aulas e na divisória do slider de erro vs. certo. O rótulo "play" ficou de fora: os cartões de aula ainda não reproduzem nada, e prometer play seria enganoso. Entra quando houver pré-visualização em vídeo.

### Scrub mais liso (`useScrubVideo.js`)
- Trocar a suavização por quadro (`current += (alvo - current) * 0.2`) por suavização por tempo: `current += (alvo - current) * (1 - exp(-dt * K))`, com K perto de 14, que reproduz a sensação atual a 60 Hz e a mantém em telas de 120 e 144 Hz.
- O laço `requestAnimationFrame` dorme quando a diferença entre alvo e atual fica desprezível e acorda no próximo evento de scroll, para não gastar CPU em repouso.
- Manter a regra de não enfileirar seeks (`video.seeking`) e o desbloqueio de iOS. O limiar mínimo de seek pode ser ajustado ao tempo de um quadro depois de medir o fps real do clipe.

### Preço fixo
- Em `PlansStory.jsx`, remover a contagem animada do preço (`countTo` sobre `.plan__price strong`). O preço final fica sempre no HTML. A entrada dos cartões e o selo de prova continuam. As contagens de estatística do professor ficam como estão.

## Peça 2: quiz de nível

### Posição e estado
- Nova seção `#nivel`, inline, dentro do segundo bloco claro (`theme-sand`), logo depois de "Como funciona" e antes dos planos, ocupando no máximo uma tela. O cabeçalho ganha o link "Seu nível".
- O resultado fica em estado no `App`, espelhado em `sessionStorage`, e chega às duas versões da seção de planos como `recommended`.
- Se a API não devolver planos, a seção do quiz não é renderizada. Abaixo de 900 px o menu continua oculto (pendência M1 do QA); o quiz é alcançado rolando.

### Perguntas e mapeamento (rascunho meu; o cliente pode editar o texto)
1. "Você já jogou futevôlei?": nunca / algumas vezes / toda semana (0, 1, 2 pontos).
2. "Você controla a bola com pé e peito?": ainda não / mais ou menos / com firmeza (0, 1, 2).
3. "O que você quer agora?": aprender sozinho com vídeo / evoluir o jogo / treinar com o professor na areia.

Regra determinística, sem IA:
- Nível: `iniciante` se a soma das perguntas 1 e 2 for no máximo 2; senão `intermediario`.
- Plano: se a pergunta 3 for "treinar com o professor", Premium; senão, se a resposta for "evoluir" ou o nível for `intermediario`, Completo; senão, Essencial.
- Os planos são achados pelo nome vindo da API; se o nome mudar no admin, cai para a posição (0, 1, 2).

Interação: escolha única, avança sozinha após cerca de 250 ms, botão de voltar, barra de passos, teclado e leitor de tela.

### Resultado
- Cartão com plano, preço (da API) e uma frase de motivo montada por modelo a partir das respostas. Nenhuma promessa nova.
- "Chamar no WhatsApp": link `https://wa.me/<site.whatsapp>?text=...` com nível, plano e preço.
- "Prefiro que me chamem": abre mini formulário (nome e WhatsApp) e envia o lead com `level`, `plan` e `source = "quiz"`; mostra confirmação no lugar. Também há "Refazer".
- Na seção de planos o plano indicado ganha selo "Indicado para você" e borda realçada, sem mudar o tamanho (a história presa já anima o destaque do plano principal).

### Backend e admin
- `LeadCreate` ganha `plan` (opcional, até 40 caracteres) e `source` (`landing` ou `quiz`, padrão `landing`); `Lead` herda e deixa de redefinir `source`.
- O repositório grava os dois campos. Como o cadastro é idempotente por WhatsApp, um contato repetido mantém o registro original. Chamada minha: no caso repetido, atualizar `plan` e `level` com o resultado mais recente do quiz (a intenção mais nova vale), sem tocar nos demais campos.
- Django: o modelo `Lead` já tem `source`; falta `plan`, com migração nova (0004) e coluna na listagem do admin.

## Peça 3: erro vs. certo

### Posição e layout
- Nova seção `#correcao`, escura, logo depois do professor e antes do bloco claro de benefícios. Uma tela no desktop.
- Duas colunas: à esquerda título ("Veja o erro. Veja o ajuste."), abas e as duas frases do fundamento ativo (erro e certo); à direita o diagrama com o slider. Nenhum texto fica sob o visual.
- No celular, empilha: título, abas, diagrama em largura total, frases.

### Conteúdo
- Quatro fundamentos, alinhados aos passos do hero: toque, defesa, saque e ataque. Cada um tem uma trajetória errada, uma certa e uma frase para cada lado.
- Rascunho de conteúdo em `frontend/src/models/corrections.js`, **com os textos técnicos marcados para validação do professor**. Em produção só entra texto validado; em `staging` pode ficar o rascunho. Gerenciar esse conteúdo pelo admin é não-meta.

### Mecânica
- `PlayDiagram` passa a aceitar trajetória, jogadores e tom ("erro" em tom quente, "certo" em dourado) por propriedades, além da chave atual.
- Os dois diagramas se sobrepõem no mesmo quadro; o "certo" fica por cima, cortado com `clip-path: inset(0 0 0 var(--cut))`. A divisória é um elemento com `role="slider"`, `aria-valuenow`, setas esquerda e direita (5% por passo) e Home/End. No toque e no mouse usa eventos de ponteiro; só a divisória captura o gesto, para o resto não bloquear o scroll vertical.
- Posição inicial 50%. Na primeira vez que a seção entra na tela, a divisória faz uma varredura curta (50, 35, 65, 50); sem redução de movimento.
- A bola de cada lado percorre a trajetória **uma vez** ao trocar de aba e ao soltar a divisória, nunca em laço (regra de no máximo um loop por painel). Clicar no diagrama repete.
- O rótulo de cursor "arraste" aparece sobre a divisória.

## O que fica para quem constrói

- Curvas de easing exatas, valores de squash, tamanhos e espaçamentos, seguindo os tokens atuais (`--gold`, `--blue`, `--muted`) e o tom de erro já usado nos formulários (`#ff8a8a`).
- Desenho das trajetórias errada e certa de cada fundamento, coerentes com o diagrama atual (viewBox 200x120, rede em x=100).
- Microtextos do quiz e do resultado, mantendo a linguagem do site (verbo e objeto nos botões).
- Medição do fps do clipe para calibrar o limiar do scrub.

## Verificação proposta

- Build pelo Docker sem erros; sem erros de console; sem rolagem horizontal em 1440x900 e 390x844.
- Teste com redução de movimento: sem entrada com bola, sem varredura, sem rótulo; quiz e slider continuam funcionais.
- Scrub: contar seeks por segundo e quadros perdidos num scroll roteirizado, antes e depois.
- Quiz: percorrer os caminhos que levam a cada plano, abrir o link do WhatsApp (texto correto), enviar lead e conferir no admin com `plan` e `source`; repetir o mesmo WhatsApp e conferir a regra de atualização; confirmar o limite de taxa.
- Slider: teclado, toque e mouse; abas; comportamento no celular.
- Rodar `impeccable detect --changed` ao final e tratar os achados.

## Ordem e entrega

1. Movimento e preço fixo.
2. Quiz, backend e admin.
3. Erro vs. certo.

Um ou mais commits por peça na `staging`; sem push antes de o cliente pedir.

## Riscos

- A entrada com bola competir com o carregamento: medir e cortar se piorar o primeiro conteúdo.
- A nova suavização do scrub mudar a sensação: comparar com a versão atual antes de aceitar.
- O destaque do plano indicado conflitar com a animação do GSAP em `PlansStory`: o selo e a borda não usam transformação.
- O rótulo de cursor atrapalhar o arrastar das faixas: ele é passivo e não captura eventos.
- Texto técnico publicado sem validação: tratado como anti-meta.

## Escolhas feitas por mim (para você conferir)

- Posições das seções `#nivel` e `#correcao`.
- Perguntas e regra de pontuação do quiz.
- Remover "play" do rótulo de cursor.
- No lead repetido, atualizar `plan` e `level`.
- Texto do erro e do certo como rascunho a validar.
- Conteúdo de erro vs. certo em arquivo do front, não no admin.
