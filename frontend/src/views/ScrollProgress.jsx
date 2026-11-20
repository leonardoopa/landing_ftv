import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

// Linha da rede no topo; a bola rola e quica conforme você desce a página.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  const left = useTransform(p, (v) => `${v * 100}%`);
  const ballRef = useRef(null);

  useMotionValueEvent(p, "change", (v) => {
    const el = ballRef.current;
    if (!el) return;
    const hop = Math.abs(Math.sin(v * 70)) * 9;
    el.style.transform = `translate(-50%, ${-hop}px) rotate(${v * 5200}deg)`;
  });

  return (
    <div className="net" aria-hidden="true">
      <motion.i className="net__fill" style={{ scaleX: p }} />
      <motion.span className="net__ball" style={{ left }}>
        <svg ref={ballRef} width="18" height="18" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="11" fill="#fff" />
          <path d="M12 1v6l5 3-2 7M12 7 7 10l2 7M1.5 9 7 10M22.5 9 17 10" fill="none" stroke="#2563ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.span>
    </div>
  );
}
