import { useEffect } from "react";

// Links "#secao" que apontam para uma história de scroll param no ponto certo dela
// (data-anchor = fração do percurso), não no início, onde o conteúdo ainda não apareceu.
export function useAnchorScroll() {
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest?.('a[href^="#"]');
      if (!link) return;
      const target = document.getElementById(link.getAttribute("href").slice(1));
      if (!target || target.dataset.anchor === undefined) return;
      e.preventDefault();
      const travel = Math.max(0, target.offsetHeight - window.innerHeight);
      const top = target.getBoundingClientRect().top + window.scrollY + travel * Number(target.dataset.anchor);
      window.scrollTo({ top, behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}
