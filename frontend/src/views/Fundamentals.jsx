import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Letters from "./Letters";
import PlayDiagram, { playFor } from "./PlayDiagram";

// Seção presa na tela: o scroll vertical move os cartões na horizontal.
export default function Fundamentals({ items }) {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (track) setTravel(Math.max(0, track.scrollWidth - track.parentElement.clientWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items.length]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, (p) => -p * travel);

  if (!items.length) return null;
  return (
    <section className="funds" ref={ref} style={{ height: `${100 + items.length * 18}vh` }}>
      <div className="funds__stage">
        <div className="funds__head">
          <h2 className="section-title"><Letters inView text="Tudo que o jogo pede." /></h2>
        </div>
        <div className="funds__viewport">
          <motion.ol className="funds__track" ref={trackRef} style={{ x }}>
            {items.map((f, i) => (
              <li className="fund" key={f.id} data-spot>
                <div className="fund__art"><PlayDiagram play={playFor(f.title)} delay={i * 0.4} /></div>
                {f.tag && <span className="fund__tag">{f.tag}</span>}
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </motion.ol>
        </div>
        <div className="funds__bar" aria-hidden="true"><motion.span style={{ scaleX: smooth }} /></div>
      </div>
    </section>
  );
}
