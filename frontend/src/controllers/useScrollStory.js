import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
document.fonts?.ready.then(() => ScrollTrigger.refresh());

// Cria uma "história de scroll": timeline GSAP presa ao scroll da seção (scrub).
// A seção é alta e o palco fica preso por CSS (position: sticky); a timeline só anima.
// `build` recebe { tl, q, gsap } e é refeito quando `deps` mudam; tudo é revertido ao desmontar.
export function useScrollStory(sectionRef, build, deps = [], options = {}) {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const ctx = gsap.context((self) => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: options.onProgress ? (st) => options.onProgress(st.progress) : undefined,
        },
      });
      build({ tl, q: self.selector, gsap });
    }, section);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// Conta de `from` até `to` dentro da timeline e escreve o valor formatado no elemento.
export function countTo(tl, el, to, format, position, duration) {
  if (!el) return;
  const state = { v: 0 };
  el.textContent = format(0);
  tl.to(state, { v: to, duration, onUpdate: () => { el.textContent = format(state.v); } }, position);
}
