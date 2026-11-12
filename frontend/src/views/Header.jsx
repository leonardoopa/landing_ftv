import { useEffect, useState } from "react";

const LINKS = [
  ["#aulas", "Aulas"],
  ["#professor", "Professor"],
  ["#planos", "Planos"],
  ["#duvidas", "Dúvidas"],
];

export default function Header({ site }) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`header ${solid ? "is-solid" : ""}`}>
      <a href="#top" className="brand"><Crown />{site.brand}</a>
      <nav className="nav">
        {LINKS.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <a className="btn btn--sm" href="#planos">{site.cta_label}</a>
    </header>
  );
}

export function Crown({ size = 22 }) {
  return (
    <svg className="crown" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 18h18l1.5-10-5.5 4L12 4 7 12 1.500 8z" fill="currentColor" />
    </svg>
  );
}
