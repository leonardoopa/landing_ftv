import { useRef, useState } from "react";
import { useInfiniteLessons } from "../controllers/useInfiniteLessons";
import { coverFor, LEVELS, LEVEL_LABEL } from "../models/lesson";
import Icon from "./Icons";
import Reveal from "./Reveal";

export function Card({ lesson, index }) {
  const cover = lesson.cover_url ? `url(${lesson.cover_url}) center/cover` : coverFor(lesson.category);
  return (
    <article className="lesson">
      <div className="lesson__cover" style={{ background: cover }}>
        <span className="lesson__n">{String(index + 1).padStart(2, "0")}</span>
        <span className="lesson__play"><Icon name="play" size={18} /></span>
        <span className="lesson__cat">{lesson.category}</span>
      </div>
      <div className="lesson__body">
        <div className="lesson__meta">
          <span className={`lvl lvl--${lesson.level}`}>{LEVEL_LABEL[lesson.level]}</span>
          <span>{lesson.duration_min} min</span>
        </div>
        <h3>{lesson.title}</h3>
        <p>{lesson.description}</p>
      </div>
    </article>
  );
}

// Carrossel horizontal com carregamento infinito: não alonga a página.
export default function Lessons() {
  const [level, setLevel] = useState("");
  const railRef = useRef(null);
  const { items, loading, done, error, total, sentinelRef, retry } = useInfiniteLessons(level, railRef);

  const slide = (dir) => railRef.current?.scrollBy({ left: dir * railRef.current.clientWidth * 0.8, behavior: "smooth" });
  const pick = (value) => { setLevel(value); railRef.current?.scrollTo({ left: 0 }); };

  return (
    <section id="aulas" className="section lessons">
      <Reveal className="lessons__head">
        <div>
          <p className="eyebrow">O que você vai aprender</p>
          <h2 className="section-title">{total ? `${total} aulas.` : "Aulas."} Direto ao ponto.</h2>
        </div>
        <div className="lessons__tools">
          <div className="filters" role="tablist">
            {LEVELS.map((l) => (
              <button key={l.value} role="tab" aria-selected={level === l.value}
                className={`filter ${level === l.value ? "is-on" : ""}`} onClick={() => pick(l.value)}>
                {l.label}
              </button>
            ))}
          </div>
          <div className="arrows">
            <button aria-label="Aulas anteriores" onClick={() => slide(-1)}><Icon name="arrow" size={20} /></button>
            <button aria-label="Próximas aulas" onClick={() => slide(1)}><Icon name="arrow" size={20} /></button>
          </div>
        </div>
      </Reveal>

      <div className="rail" ref={railRef}>
        {items.map((l, i) => <Card key={l.id} lesson={l} index={i} />)}
        {loading && Array.from({ length: 3 }).map((_, i) => <div key={`s${i}`} className="lesson lesson--skeleton" />)}
        {!done && !error && <div ref={sentinelRef} className="sentinel" aria-hidden="true" />}
        {done && (
          <a className="lesson lesson--cta" href="#planos">
            <strong>Quer todas?</strong>
            <span>Ver planos <Icon name="arrow" size={18} /></span>
          </a>
        )}
      </div>
      {error && (
        <p className="notice">Não foi possível carregar as aulas. <button className="link" onClick={retry}>Tentar de novo</button></p>
      )}
    </section>
  );
}
