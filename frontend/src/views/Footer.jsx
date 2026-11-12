import { useEffect, useState } from "react";
import { Crown } from "./Header";
import Icon from "./Icons";

export default function Footer({ site, plan }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    // aparece depois do hero e some enquanto os planos estão na tela
    let overPlans = false;
    const hero = document.querySelector(".hero");
    const start = () => (hero ? hero.offsetHeight - window.innerHeight * 0.4 : window.innerHeight * 0.8);
    const on = () => setShow(!overPlans && window.scrollY > start());
    const plans = document.querySelector("#planos");
    const io = new IntersectionObserver(([e]) => { overPlans = e.isIntersecting; on(); }, { threshold: 0.15 });
    if (plans) io.observe(plans);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); io.disconnect(); };
  }, []);

  return (
    <footer className="footer">
      <div className="footer__big" aria-hidden="true">{site.brand}</div>
      <div className="footer__row">
        <span className="brand"><Crown />{site.brand}</span>
        <p>© {new Date().getFullYear()} {site.brand}</p>
        {site.instagram && <a href={site.instagram} target="_blank" rel="noreferrer">Instagram</a>}
      </div>

      {plan && (
        <div className={`dock ${show ? "is-on" : ""}`}>
          <span><strong>{plan.name} · {plan.price}</strong><small>{plan.proof || plan.installments}</small></span>
          <a className="btn btn--sm" href="#planos">{site.cta_label}</a>
        </div>
      )}
      <a className="whats" href={site.cta_url} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp">
        <Icon name="whatsapp" size={26} />
      </a>
    </footer>
  );
}
