import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";

// Seção "sticky": a página rola e a etapa ativa muda (storytelling por scroll).
export default function Method({ steps }) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)));
    setActive(i);
  });

  if (!steps.length) return null;
  const step = steps[active];

  return (
    <section id="metodo" className="method" ref={ref} style={{ height: `${steps.length * 90 + 40}vh` }}>
      <div className="method__sticky">
        <p className="eyebrow">O método</p>
        <h2 className="section-title">Quatro passos. Uma evolução.</h2>
        <div className="method__stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="method__big"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -60, scale: 0.9 }}
              transition={{ duration: 0.45 }}
            >
              {String(active + 1).padStart(2, "0")}
            </motion.div>
          </AnimatePresence>
          <div className="method__copy">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                {step.tag && <span className="chip">{step.tag}</span>}
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <ol className="method__dots">
          {steps.map((s, i) => (
            <li key={s.id} className={i === active ? "on" : i < active ? "done" : ""}>
              <span />{s.title}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
