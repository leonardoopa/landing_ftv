// MODEL (front): constantes e helpers de domínio.
export const LEVELS = [
  { value: "", label: "Todas" },
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
];

export const LEVEL_LABEL = Object.fromEntries(LEVELS.map((l) => [l.value, l.label]));

const COVERS = {
  Fundamentos: ["#f4d58d", "#d9822b"],
  Toque: ["#12d6c8", "#0a5c8f"],
  Defesa: ["#3d7bff", "#12d6c8"],
  Saque: ["#ff9a3d", "#ff3d6e"],
  Ataque: ["#ff5a1f", "#ffb347"],
  "Tática": ["#7c5cff", "#12d6c8"],
  "Preparação": ["#2ecc71", "#0a5c8f"],
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
  return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
}
