import { useCallback, useEffect, useRef, useState } from "react";
import { useCompareSlider } from "../controllers/useCompareSlider";
import { CORRECTIONS, visibleCorrections } from "../models/corrections.js";
import Icon from "./Icons";
import PlayDiagram from "./PlayDiagram";

const TAB_KEYS = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -1, ArrowDown: 1 };

function Cross() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

// Erro e jogada certa no mesmo quadro: o "certo" fica por cima, cortado pela divisória.
export default function ErrorVsRight() {
  const items = visibleCorrections(CORRECTIONS);
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0);
  const replay = useCallback(() => setRun((r) => r + 1), []);
  const { cut, trackRef, handleProps, sweep } = useCompareSlider({ onRelease: replay });
  const sectionRef = useRef(null);
  const tabsRef = useRef([]);

  // primeira entrada na tela: varredura da divisória e as bolas correm
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      replay();
      sweep();
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [replay, sweep]);

  if (!items.length) return null;
  const c = items[Math.min(active, items.length - 1)];

  const select = (i) => {
    if (i === active) return;
    setActive(i);
    replay();
  };

  const onTabKey = (e) => {
    let i = null;
    if (e.key in TAB_KEYS) i = (active + TAB_KEYS[e.key] + items.length) % items.length;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = items.length - 1;
    if (i === null) return;
    e.preventDefault();
    select(i);
    tabsRef.current[i]?.focus();
  };

  const runKey = `${c.id}:${run}`;
  const n = Math.round(cut);

  return (
    <section id="correcao" className="section cmp" ref={sectionRef} aria-labelledby="cmp-title">
      <h2 className="section-title cmp__title" id="cmp-title">Veja o erro. <span>Veja o ajuste.</span></h2>

      <div className="cmp__tabs" role="tablist" aria-label="Fundamentos" onKeyDown={onTabKey}>
        {items.map((it, i) => (
          <button
            key={it.id}
            ref={(el) => { tabsRef.current[i] = el; }}
            type="button"
            role="tab"
            id={`cmp-tab-${it.id}`}
            aria-selected={i === active}
            aria-controls="cmp-panel"
            tabIndex={i === active ? 0 : -1}
            className="cmp__tab"
            onClick={() => select(i)}
          >
            {it.title}
          </button>
        ))}
      </div>

      <div
        className="cmp__vis"
        ref={trackRef}
        style={{ "--cut": `${cut}%` }}
        onClick={(e) => { if (!e.target.closest('[role="slider"]')) replay(); }}
      >
        <div className="cmp__layer cmp__layer--erro">
          <PlayDiagram path={c.erro.path} players={c.erro.players} tone="erro" once runKey={runKey} />
          <span className="cmp__chip cmp__chip--erro" aria-hidden="true"><Cross /> Erro</span>
        </div>
        <div className="cmp__layer cmp__layer--certo">
          <PlayDiagram path={c.certo.path} players={c.certo.players} tone="certo" once runKey={runKey} />
          <span className="cmp__chip cmp__chip--certo" aria-hidden="true"><Icon name="check" size={14} /> Certo</span>
        </div>
        <div className="cmp__handle" data-cursor="arraste" aria-valuetext={`${n}% erro, ${100 - n}% certo`} {...handleProps}>
          <span className="cmp__knob" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6 3 12l6 6M15 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>

      <dl className="cmp__text" role="tabpanel" id="cmp-panel" aria-labelledby={`cmp-tab-${c.id}`} tabIndex={0} aria-live="polite">
        <div className="cmp__line cmp__line--erro">
          <dt><Cross /> Erro</dt>
          <dd>{c.erro.text}</dd>
        </div>
        <div className="cmp__line cmp__line--certo">
          <dt><Icon name="check" size={14} /> Certo</dt>
          <dd>{c.certo.text}</dd>
        </div>
      </dl>
    </section>
  );
}
