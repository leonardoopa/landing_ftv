import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MANIFESTO, PAINS } from "../models/pains";
import Letters from "./Letters";

function Bubble({ text, index, total, progress }) {
  const start = (index / total) * 0.7;
  const opacity = useTransform(progress, [start, start + 0.1], [0, 1]);
  const y = useTransform(progress, [start, start + 0.1], [40, 0]);
  const scale = useTransform(progress, [start, start + 0.1], [0.9, 1]);
  return <motion.li className="pain" style={{ opacity, y, scale }}>{text}</motion.li>;
}

function Word({ children, range, progress }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

// Frases surgem uma a uma com o scroll; depois o manifesto acende palavra por palavra.
export default function Pains() {
  const stageRef = useRef(null);
  const textRef = useRef(null);
  const { scrollYProgress: bubbles } = useScroll({ target: stageRef, offset: ["start start", "end end"] });
  const { scrollYProgress: reading } = useScroll({ target: textRef, offset: ["start 90%", "end 65%"] });
  const words = MANIFESTO.split(" ");

  return (
    <section className="pains">
      <div className="pains__scroll" ref={stageRef}>
        <div className="pains__stage">
          <p className="eyebrow">Você se reconhece?</p>
          <h2 className="section-title"><Letters inView text="Você não precisa descobrir tudo sozinho." /></h2>
          <ul className="pains__cloud">
            {PAINS.map((t, i) => <Bubble key={t} text={t} index={i} total={PAINS.length} progress={bubbles} />)}
          </ul>
        </div>
      </div>
      <p className="manifesto" ref={textRef}>
        {words.map((w, i) => (
          <Word key={i} progress={reading} range={[i / words.length, Math.min(1, (i + 3) / words.length)]}>{w}</Word>
        ))}
      </p>
    </section>
  );
}
