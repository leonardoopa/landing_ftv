import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { HOW_IT_WORKS } from "../models/howItWorks";
import Reveal from "./Reveal";
import Letters from "./Letters";

// Linha do tempo: a linha dourada "enche" conforme a página rola.
export default function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  return (
    <section className="section how">
      <Reveal>
        <p className="eyebrow">Como funciona</p>
        <h2 className="section-title"><Letters inView text="Da compra à areia em 4 passos." /></h2>
      </Reveal>
      <ol className="how__list" ref={ref}>
        <span className="how__line" aria-hidden="true"><motion.i style={{ scaleY: fill }} /></span>
        {HOW_IT_WORKS.map((s, i) => (
          <Reveal as="li" key={s.title} y={30} className="how__item">
            <span className="how__dot">{i + 1}</span>
            <div><h3>{s.title}</h3><p>{s.text}</p></div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
