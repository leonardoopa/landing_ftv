import Icon from "./Icons";
import Reveal from "./Reveal";
import Letters from "./Letters";

export default function Benefits({ benefits }) {
  if (!benefits.length) return null;
  return (
    <section className="section">
      <Reveal>
        <p className="eyebrow">Por que funciona</p>
        <h2 className="section-title"><Letters inView text="Feito para quem quer jogar de verdade." /></h2>
      </Reveal>
      <div className="benefits">
        {benefits.map((b, i) => (
          <Reveal key={b.id} delay={(i % 3) * 0.08} className="benefit">
            <span className="benefit__icon"><Icon name={b.icon} size={26} /></span>
            <h3>{b.title}</h3>
            <p>{b.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
