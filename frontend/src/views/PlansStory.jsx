import { useRef } from "react";
import { useScrollStory } from "../controllers/useScrollStory";
import Letters from "./Letters";
import { PlanCard } from "./Plans";

// História presa: os planos entram um a um e o destaque cresce; o preço já nasce final.
export default function PlansStory({ plans }) {
  const ref = useRef(null);
  const key = plans.map((p) => p.id + p.price).join("|");

  useScrollStory(ref, ({ tl, q }) => {
    const cards = q(".plan");
    const step = 0.62 / Math.max(1, cards.length);
    const mid = (cards.length - 1) / 2;

    cards.forEach((card, i) => {
      const at = 0.04 + i * step;
      const side = Math.sign(i - mid); // -1 esquerda, 0 centro, 1 direita
      const hl = card.classList.contains("plan--hl");
      tl.fromTo(card,
        { autoAlpha: 0, x: side * 160, y: side === 0 ? 180 : 60, rotate: side * 5, scale: 0.85 },
        { autoAlpha: 1, x: 0, y: 0, rotate: 0, scale: 1, duration: step * 0.9, ease: "power3.out" }, at);
      const proof = card.querySelector(".plan__proof");
      if (proof) tl.fromTo(proof, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.08, ease: "back.out(2)" }, 0.7 + i * 0.03);
      if (hl) tl.to(card, { scale: 1.04, duration: 0.14, ease: "power2.inOut" }, 0.78);
      else tl.to(card, { scale: 0.97, duration: 0.14, ease: "power2.inOut" }, 0.78);
    });
  }, [key]);

  return (
    <section id="planos" className="pstory" ref={ref} data-anchor="1" style={{ height: "250vh" }}>
      <div className="pstory__stage">
        <div className="pstory__inner">
          <div className="plans__head">
            <h2 className="section-title"><Letters inView text="Escolha e comece hoje." /></h2>
            <p className="section-lead">Pagamento único. Acesso vitalício.</p>
          </div>
          <div className="plans__grid">
            {plans.map((p) => (
              <div key={p.id} className={`plan ${p.highlight ? "plan--hl" : ""}`}><PlanCard plan={p} /></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
