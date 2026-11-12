import { useState } from "react";
import { motion } from "framer-motion";
import { useInfiniteLessons } from "../controllers/useInfiniteLessons";
import { coverFor, LEVELS, LEVEL_LABEL } from "../models/lesson";
import Icon from "./Icons";
import Reveal from "./Reveal";

function Card({ lesson, index }) {
  return (
    <motion.article
      className="lesson"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -8 }}
    >
      <div className="lesson__cover" style={{ background: lesson.cover_url ? `url(${lesson.cover_url}) center/cover` : coverFor(lesson.category) }}>
        <span className="lesson__cat">{lesson.category}</span>
        <span className="lesson__play"><Icon name="play" size={22} /></span>
      </div>
      <div className="lesson__body">
        <div className="lesson__meta">
          <span className={`lvl lvl--${lesson.level}`}>{LEVEL_LABEL[lesson.level]}</span>
          <span>{lesson.duration_min} min</span>
        </div>
        <h3>{lesson.title}</h3>
        <p>{lesson.description}</p>
      </div>
    </motion.article>
  );
}

export default function Lessons({ site }) {
  const [level, setLevel] = useState("");
  const { items, loading, done, error, total, sentinelRef, retry } = useInfiniteLessons(level);

  return (
    <section id="aulas" className="section lessons">
      <Reveal>
        <p className="eyebrow">Biblioteca de aulas</p>
        <h2 className="section-title">Role. Tem muito jogo aqui dentro.</h2>
        <p className="section-lead">{total ? `${total} aulas` : "Aulas"} organizadas por nível. Continue descendo: elas carregam sozinhas.</p>
      </Reveal>

      <div className="filters" role="tablist">
        {LEVELS.map((l) => (
          <button key={l.value} role="tab" aria-selected={level === l.value}
            className={`filter ${level === l.value ? "is-on" : ""}`} onClick={() => setLevel(l.value)}>
            {l.label}
          </button>
        ))}
      </div>

      <div className="lessons__grid">
        {items.map((l, i) => <Card key={l.id} lesson={l} index={i} />)}
        {loading && Array.from({ length: 3 }).map((_, i) => <div key={`s${i}`} className="lesson lesson--skeleton" />)}
      </div>

      {error && (
        <div className="notice">
          Não foi possível carregar as aulas. <button className="link" onClick={retry}>Tentar de novo</button>
        </div>
      )}
      {!done && !error && <div ref={sentinelRef} className="sentinel" aria-hidden="true" />}
      {done && (
        <Reveal className="lessons__end">
          <p>Você chegou ao fim da lista. Agora é com você, na areia.</p>
          <a className="btn" href={site.cta_url} target="_blank" rel="noreferrer">{site.cta_label} <Icon name="arrow" size={20} /></a>
        </Reveal>
      )}
    </section>
  );
}
