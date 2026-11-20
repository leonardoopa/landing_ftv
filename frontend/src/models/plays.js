// Trajetórias das jogadas (viewBox 200x120: rede em x=100, areia em y=100).
export const PLAYS = {
  serve: { d: "M24 80 C62 -10 150 -10 178 97", players: [24] },
  dig: { d: "M178 16 C140 30 92 70 46 92 C40 62 50 44 62 34", players: [46, 150] },
  set: { d: "M42 92 C54 22 104 20 130 58", players: [42, 134] },
  spike: { d: "M66 24 C112 30 152 66 172 97", players: [66, 168] },
  juggle: { d: "M100 96 C100 26 100 26 100 96 C100 52 100 52 100 96 C100 72 100 72 100 96", players: [100] },
  tactic: { d: "M58 78 C76 26 124 26 142 78", players: [58, 142] },
  base: { d: "M30 98 L66 98 L88 80 L128 80 L150 98 L176 98", players: [30] },
};
