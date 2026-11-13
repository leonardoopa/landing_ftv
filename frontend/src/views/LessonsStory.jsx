import { useRef, useState } from "react";
import { useLessonsByLevel } from "../controllers/useLessonsByLevel";
import { useScrollStory } from "../controllers/useScrollStory";
import { LEVEL_TABS } from "../models/lesson";
import Icon from "./Icons";
import { Card } from "./Lessons";
import Letters from "./Letters";

const LEVELS = LEVEL_TABS.map((t) => t.value);

// História presa: o scroll troca a aba do nível e faz as aulas daquele nível passarem ao lado.
export default function LessonsStory() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const byLevel = useLessonsByLevel(LEVELS);
  const count = LEVELS.length;
  const totalLessons = byLevel ? LEVELS.reduce((n, l) => n + byLevel[l].length, 0) : 0;

  useScrollStory(ref, ({ tl, q }) => {
    const seg = 1 / count;
    const cols = q(".lstory__col");
    const fills = q(".tab__fill");
    cols.forEach((col, i) => {
      const at = i * seg;
      const overflow = () => -Math.max(0, col.scrollHeight - col.parentElement.clientHeight);
      if (i > 0) tl.fromTo(col, { autoAlpha: 0, yPercent: 6 }, { autoAlpha: 1, yPercent: 0, duration: seg * 0.12 }, at);
      tl.fromTo(col, { y: 0 }, { y: overflow, duration: seg * 0.8 }, at + seg * 0.12);
      if (i < count - 1) tl.to(col, { autoAlpha: 0, duration: seg * 0.08 }, at + seg * 0.92);
      if (fills[i]) tl.fromTo(fills[i], { scaleX: 0 }, { scaleX: 1, duration: seg }, at);
    });
  }, [count, totalLessons], {
    onProgress: (p) => setActive(Math.min(count - 1, Math.floor(p * count))),
  });

  const goTo = (i) => {
    const el = ref.current;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + travel * (i / count) + 4, behavior: "smooth" });
  };

  return (
    <section id="aulas" className="lstory" ref={ref} data-anchor="0" style={{ height: `${100 + count * 110}vh` }}>
      <div className="lstory__stage">
        <div className="lstory__side">
          <p className="eyebrow">O que você vai aprender</p>
          <h2 className="section-title">
            <Letters inView text={`${totalLessons || ""} aulas. Direto ao ponto.`.trim()} />
          </h2>
          <ol className="tabs">
            {LEVEL_TABS.map((t, i) => (
              <li key={t.value}>
                <button className={`tab ${active === i ? "is-on" : ""}`} onClick={() => goTo(i)} aria-pressed={active === i}>
                  <span className="tab__top"><strong>{t.label}</strong><em>{byLevel ? `${byLevel[t.value].length} aulas` : ""}</em></span>
                  <span className="tab__text">{t.text}</span>
                  <i className="tab__fill" />
                </button>
              </li>
            ))}
          </ol>
          <a className="btn" href="#planos">Quero todas <Icon name="arrow" size={20} /></a>
        </div>

        <div className="lstory__view">
          {LEVEL_TABS.map((t) => (
            <div className="lstory__col" key={t.value}>
              {(byLevel?.[t.value] || []).map((l, i) => <Card key={l.id} lesson={l} index={i} />)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
