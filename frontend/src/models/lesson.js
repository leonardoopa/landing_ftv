// MODEL (front): constantes e helpers de domínio.
export const LEVELS = [
  { value: "", label: "Todas" },
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
];

export const LEVEL_LABEL = Object.fromEntries(LEVELS.map((l) => [l.value, l.label]));

const PALETTE = [
  ["#ff5a1f", "#ffb347"],
  ["#12d6c8", "#0a5c8f"],
  ["#f4d58d", "#d9822b"],
  ["#7c5cff", "#12d6c8"],
  ["#ff3d6e", "#ff9a3d"],
];

// cor estável por categoria
export function coverFor(category = "") {
  let h = 0;
  for (const c of category) h = (h * 31 + c.charCodeAt(0)) % PALETTE.length;
  const [a, b] = PALETTE[h];
  return `linear-gradient(135deg, ${a}, ${b})`;
}
