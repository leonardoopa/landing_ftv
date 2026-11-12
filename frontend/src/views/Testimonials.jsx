import Reveal from "./Reveal";

export default function Testimonials({ items }) {
  if (!items.length) return null;
  return (
    <section className="section">
      <Reveal>
        <p className="eyebrow">Quem já treina</p>
        <h2 className="section-title">Resultado na areia.</h2>
      </Reveal>
      <div className="quotes">
        {items.map((t) => (
          <figure className="quote" key={t.id}>
            <blockquote>“{t.quote}”</blockquote>
            <figcaption>
              <span className="avatar" style={t.avatar_url ? { backgroundImage: `url(${t.avatar_url})` } : undefined}>
                {!t.avatar_url && t.name[0]}
              </span>
              <span><strong>{t.name}</strong><small>{t.role}</small></span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
