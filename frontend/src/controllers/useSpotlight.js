import { useEffect } from "react";

// Luz que segue o mouse dentro de cartões marcados com data-spot (só ajusta duas variáveis CSS).
export function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return undefined;
    let raf = 0;
    const on = (e) => {
      const el = e.target.closest?.("[data-spot]");
      if (!el) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    document.addEventListener("pointermove", on, { passive: true });
    return () => { document.removeEventListener("pointermove", on); cancelAnimationFrame(raf); };
  }, []);
}
