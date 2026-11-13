// MODEL (front): constantes e helpers de domínio.
export const LEVELS = [
  { value: "", label: "Todas" },
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
];

// Níveis reais (abas da história de scroll), com a promessa de cada um.
export const LEVEL_TABS = [
  { value: "iniciante", label: "Iniciante", text: "Do zero: postura, toque, recepção e saque." },
  { value: "intermediario", label: "Intermediário", text: "Ataque, defesa e tática para ganhar jogos." },
];

export const LEVEL_LABEL = Object.fromEntries(LEVELS.map((l) => [l.value, l.label]));

const COVERS = {
  Fundamentos: ["#2563ff", "#0b1d5c"],
  Toque: ["#38bdf8", "#1d4ed8"],
  Defesa: ["#1e3a8a", "#0ea5e9"],
  Saque: ["#f5c542", "#b45309"],
  Ataque: ["#f59e0b", "#1d4ed8"],
  "Tática": ["#6366f1", "#0b1d5c"],
  "Preparação": ["#0ea5e9", "#134e4a"],
};
const FALLBACK = Object.values(COVERS);

// cor estável por categoria (categorias novas caem num gradiente por hash)
export function coverFor(category = "") {
  let pair = COVERS[category];
  if (!pair) {
    let h = 0;
    for (const c of category) h = (h * 31 + c.charCodeAt(0)) % FALLBACK.length;
    pair = FALLBACK[h];
  }
  return `linear-gradient(140deg, ${pair[0]}, ${pair[1]})`;
}
