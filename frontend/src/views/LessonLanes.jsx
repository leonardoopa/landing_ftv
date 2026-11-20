import { useRef } from "react";
import { useLessonsByLevel } from "../controllers/useLessonsByLevel";
import { useMarquee } from "../controllers/useMarquee";
import { LEVEL_TABS } from "../models/lesson";
import Icon from "./Icons";
import { Card } from "./Lessons";
import Letters from "./Letters";

const LEVELS = LEVEL_TABS.map((t) => t.value);

function Lane({ tab, lessons, dir, speed }) {
  const viewRef = useRef(null);
  const trackRef = useRef(null);
  // ready: a faixa só existe depois que as aulas chegam; sem isso o efeito roda com refs nulos e nunca reanexa
  useMarquee(viewRef, trackRef, { dir, speed, ready: lessons.length > 0 });
  if (!lessons.length) return null;
  // duas cópias: a faixa volta ao início sem emenda
  const loop = [...lessons, ...lessons];
  return (
    <div className="lane">
      <div className="lane__label">
        <strong>{tab.label}</strong>
        <span>{lessons.length} aulas · {tab.text}</span>
      </div>
      <div className="lane__view" data-cursor="arraste" ref={viewRef}>
        <div className="lane__track" ref={trackRef}>
          {loop.map((l, i) => (
            <Card key={`${l.id}-${i}`} lesson={l} index={i % lessons.length} delay={(i % 7) * 0.35} hidden={i >= lessons.length} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Duas faixas infinitas, uma de cada lado da "rede": o scroll da página acelera as duas.
export default function LessonLanes() {
  const byLevel = useLessonsByLevel(LEVELS);
  const total = byLevel ? LEVELS.reduce((n, l) => n + byLevel[l].length, 0) : 0;
  return (
    <section id="aulas" className="lanes">
      <div className="lanes__head">
        <h2 className="section-title"><Letters inView text={`${total || ""} aulas. Direto ao ponto.`.trim()} /></h2>
        <a className="btn" href="#planos">Quero todas <Icon name="arrow" size={20} /></a>
      </div>
      <p className="lanes__hint">Arraste. Role a página para acelerar.</p>
      {LEVEL_TABS.map((t, i) => (
        <Lane key={t.value} tab={t} lessons={byLevel?.[t.value] || []} dir={i % 2 === 0 ? -1 : 1} speed={i % 2 === 0 ? 36 : 30} />
      ))}
    </section>
  );
}
