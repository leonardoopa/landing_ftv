import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Icon from "./Icons";

function Counter({ value }) {
  return <strong>{value}</strong>;
}

export default function Hero({ site }) {
  const ref = useRef(null);
  const [videoOk, setVideoOk] = useState(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sunY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const seaY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const ballRotate = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const ballY = useTransform(scrollYProgress, [0, 1], ["0%", "180%"]);

  const words = (site.hero_title || "").split(" ");

  return (
    <section ref={ref} id="top" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <motion.div className="hero__sky" />
        <motion.div className="hero__sun" style={{ y: sunY }} />
        {site.hero_video_url && videoOk && (
          <video
            className="hero__video"
            src={site.hero_video_url}
            poster={site.hero_image_url || undefined}
            autoPlay muted loop playsInline
            onError={() => setVideoOk(false)}
          />
        )}
        <motion.svg className="hero__sea" style={{ y: seaY }} viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path className="wave wave--1" d="M0 120 C240 40 480 200 720 120 S1200 40 1440 120 V320 H0Z" />
          <path className="wave wave--2" d="M0 170 C260 100 500 240 760 170 S1200 100 1440 170 V320 H0Z" />
          <path className="wave wave--3" d="M0 230 C300 170 520 290 800 230 S1240 170 1440 230 V320 H0Z" />
        </motion.svg>
        <div className="hero__shade" />
      </div>

      <motion.div className="hero__content" style={{ y: textY, opacity: fade }}>
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {site.hero_eyebrow}
        </motion.p>
        <h1 className="hero__title">
          {words.map((w, i) => (
            <span className="word" key={i}>
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              >{w}&nbsp;</motion.span>
            </span>
          ))}
        </h1>
        <motion.p className="hero__sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          {site.hero_subtitle}
        </motion.p>
        <motion.div className="hero__cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
          <a className="btn" href="#matricula">{site.cta_label} <Icon name="arrow" size={20} /></a>
          <a className="btn btn--ghost" href="#aulas"><Icon name="play" size={18} /> Ver aulas</a>
        </motion.div>
        <motion.ul className="hero__stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
          {site.stats.map((s) => (
            <li key={s.label}><Counter value={s.value} /><span>{s.label}</span></li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.div className="hero__ball" style={{ rotate: ballRotate, y: ballY }} aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <defs>
            <radialGradient id="ballg" cx="35%" cy="30%">
              <stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#d9d2c0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="url(#ballg)" />
          <path d="M50 4v30l22 16-8 26M50 34 28 50l8 26M6 40l22 10M94 40 72 50M36 76l-14 16M64 76l14 16" fill="none" stroke="#ff5a1f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <div className="scroll-hint" aria-hidden="true"><span /> Role</div>
    </section>
  );
}
