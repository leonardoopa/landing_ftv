import { useEffect, useState } from "react";

// Layout "desktop com histórias de scroll": tela larga, alta o bastante e sem "reduzir movimento".
// Fora disso a página usa as seções empilhadas simples.
export const DESK = "(min-width: 1024px) and (min-height: 660px) and (prefers-reduced-motion: no-preference)";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}
