// Constante de suavização (1/s): maior = segue o alvo mais rápido.
export const SMOOTH_K = 14;

// Aproxima `current` de `target` de forma independente da taxa de quadros.
export function smoothToward(current, target, dt, k = SMOOTH_K) {
  const step = Math.min(0.1, Math.max(0, dt));
  return current + (target - current) * (1 - Math.exp(-step * k));
}

export function isSettled(current, target, eps = 0.0005) {
  return Math.abs(target - current) <= eps;
}
