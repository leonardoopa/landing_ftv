// Texto do rótulo de cursor: valor de data-cursor do ancestral mais próximo do alvo.
export function labelAt(target) {
  const el = target?.closest?.("[data-cursor]");
  return el?.dataset?.cursor || null;
}
