import { useEffect, useState } from "react";

const LINKS = [
  ["#metodo", "Método"],
  ["#aulas", "Aulas"],
  ["#planos", "Planos"],
  ["#faq", "Dúvidas"],
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
      <a href="#top" className="brand">{site.brand}</a>
      <nav className="nav">
        {LINKS.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <a className="btn btn--sm" href="#matricula">Aula experimental</a>
    </header>
  );
}
