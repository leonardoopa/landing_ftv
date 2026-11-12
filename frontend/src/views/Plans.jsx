import Icon from "./Icons";
import Reveal from "./Reveal";

export default function Plans({ plans }) {
  return (
    <section id="planos" className="section plans">
      <Reveal className="plans__head">
        <p className="eyebrow">Planos</p>
        <h2 className="section-title">Escolha e comece hoje.</h2>
        <p className="section-lead">Pagamento único. Acesso vitalício.</p>
      </Reveal>
      <div className="plans__grid">
        {plans.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08} className={`plan ${p.highlight ? "plan--hl" : ""}`}>
            {p.badge && <span className="plan__badge">{p.badge}</span>}
            <h3>{p.name}</h3>
            <div className="plan__price">
              {p.price_from && <s>{p.price_from}</s>}
              <strong>{p.price}</strong>
              <small>{p.installments}</small>
            </div>
            {p.proof && <p className="plan__proof"><i />{p.proof}</p>}
            <ul>
              {p.features.map((f) => <li key={f}><Icon name="check" size={18} />{f}</li>)}
            </ul>
            <a className={`btn ${p.highlight ? "" : "btn--ghost"}`} href={p.cta_url} target="_blank" rel="noreferrer">
              {p.cta_label} <Icon name="arrow" size={18} />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
