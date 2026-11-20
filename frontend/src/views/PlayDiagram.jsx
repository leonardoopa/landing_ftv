// Diagrama de jogada (vista lateral da quadra): rede, areia, jogadores e a trajetória da bola.
const PLAYS = {
  serve: { d: "M24 80 C62 -10 150 -10 178 97", players: [24] },
  dig: { d: "M178 16 C140 30 92 70 46 92 C40 62 50 44 62 34", players: [46, 150] },
  set: { d: "M42 92 C54 22 104 20 130 58", players: [42, 134] },
  spike: { d: "M66 24 C112 30 152 66 172 97", players: [66, 168] },
  juggle: { d: "M100 96 C100 26 100 26 100 96 C100 52 100 52 100 96 C100 72 100 72 100 96", players: [100] },
  tactic: { d: "M58 78 C76 26 124 26 142 78", players: [58, 142] },
  base: { d: "M30 98 L66 98 L88 80 L128 80 L150 98 L176 98", players: [30] },
};

// escolhe a jogada pelo texto (título/categoria) da aula ou do fundamento
export function playFor(text = "") {
  const t = text.toLowerCase();
  if (t.includes("saque")) return "serve";
  if (/(recep|defesa|peixinho|bloqueio)/.test(t)) return "dig";
  if (t.includes("levantada")) return "set";
  if (/(chapa|ataque|paradinha)/.test(t)) return "spike";
  if (/(toque|domínio|dominio|cabeça|coxa|ombro)/.test(t)) return "juggle";
  if (/(tática|tatica|leitura|transição|transicao)/.test(t)) return "tactic";
  return "base";
}

function Player({ x }) {
  return (
    <g className="play__player" transform={`translate(${x} 100)`}>
      <circle cy="-27" r="4.6" />
      <path d="M0 -22V-9M0-9-5.5 0M0-9 5.5 0M0-18-7-11M0-18 7-11" />
    </g>
  );
}

export default function PlayDiagram({ play = "base", delay = 0 }) {
  const p = PLAYS[play] || PLAYS.base;
  return (
    <svg className="play" viewBox="0 0 200 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <rect className="play__sand" x="0" y="100" width="200" height="20" />
      <path className="play__net" d="M100 100V56M96 56H104" />
      <path className="play__mesh" d="M100 62H104M100 68H104M100 74H104M100 80H104M100 86H104M100 92H104" />
      {p.players.map((x) => <Player key={x} x={x} />)}
      <path className="play__path" d={p.d} />
      <circle className="play__ball" r="5" style={{ offsetPath: `path("${p.d}")`, animationDelay: `${delay}s` }} />
    </svg>
  );
}
