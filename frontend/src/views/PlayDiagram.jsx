// Diagrama de jogada (vista lateral da quadra): rede, areia, jogadores e a trajetória da bola.
import { PLAYS } from "../models/plays.js";

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

// `path`/`players` substituem a jogada de `play`; `tone` colore (erro/certo); `once` roda a bola uma vez e reinicia com `runKey`.
export default function PlayDiagram({ play = "base", delay = 0, path, players, tone, once = false, runKey }) {
  const base = PLAYS[play] || PLAYS.base;
  const d = path || base.d;
  const xs = path ? players || [] : players || base.players;
  const cls = ["play", tone && `play--${tone}`, once && "play--once"].filter(Boolean).join(" ");
  return (
    <svg className={cls} viewBox="0 0 200 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <rect className="play__sand" x="0" y="100" width="200" height="20" />
      <path className="play__net" d="M100 100V56M96 56H104" />
      <path className="play__mesh" d="M100 62H104M100 68H104M100 74H104M100 80H104M100 86H104M100 92H104" />
      {xs.map((x) => <Player key={x} x={x} />)}
      <path className="play__path" d={d} />
      <circle key={runKey} className="play__ball" r="5" style={{ offsetPath: `path("${d}")`, animationDelay: `${delay}s` }} />
    </svg>
  );
}
