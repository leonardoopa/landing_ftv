import { PLAYS } from "./plays.js";

// Rascunhos ainda não revisados pelo professor: visíveis enquanto SHOW_DRAFTS for true.
export const SHOW_DRAFTS = true;

export const CORRECTIONS = [
  {
    id: "toque",
    title: "Toque",
    reviewed: false,
    erro: {
      text: "Pé duro e perna esticada: a bola quica longe e foge do controle.",
      path: "M60 88 C90 62 130 60 156 98 C164 86 174 84 184 96",
      players: [60],
    },
    certo: {
      text: "Perna relaxada e joelho flexionado: a bola amortece e sobe perto do corpo.",
      path: "M60 88 C58 56 66 44 72 42",
      players: [60],
    },
  },
  {
    id: "defesa",
    title: "Defesa",
    reviewed: false,
    erro: {
      text: "Braços abertos e parado: a bola rebate para fora da quadra.",
      path: "M46 92 C30 50 10 40 2 70",
      players: [46, 150],
    },
    certo: {
      text: "Base baixa e braços firmes: a bola sobe alta, no meio, para o parceiro.",
      path: "M46 92 C52 20 120 14 148 78",
      players: [46, 150],
    },
  },
  {
    id: "saque",
    title: "Saque",
    reviewed: false,
    erro: {
      text: "Golpe reto e baixo: a bola bate na rede.",
      path: "M24 80 C50 72 80 68 100 72",
      players: PLAYS.serve.players,
    },
    certo: {
      text: "Golpe de baixo para cima, com arco alto: a bola passa a rede e cai na quadra.",
      path: PLAYS.serve.d,
      players: PLAYS.serve.players,
    },
  },
  {
    id: "ataque",
    title: "Ataque",
    reviewed: false,
    erro: {
      text: "Contato sem salto nem tempo: a bola vai lenta e fácil de defender.",
      path: "M66 24 C80 34 92 46 100 62",
      players: PLAYS.spike.players,
    },
    certo: {
      text: "Salto no tempo da bola e contato firme: a bola cai longe da defesa.",
      path: PLAYS.spike.d,
      players: PLAYS.spike.players,
    },
  },
];

export function visibleCorrections(items, showDrafts = SHOW_DRAFTS) {
  return showDrafts ? items : items.filter((i) => i.reviewed);
}

export function clampCut(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 50;
  return Math.min(100, Math.max(0, n));
}

export function stepCut(cut, key) {
  if (key === "ArrowLeft") return clampCut(cut - 5);
  if (key === "ArrowRight") return clampCut(cut + 5);
  if (key === "Home") return 0;
  if (key === "End") return 100;
  return null;
}
