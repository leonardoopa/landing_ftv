import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useScrubVideo } from "../controllers/useScrubVideo";
import Icon from "./Icons";
import Letters from "./Letters";
import Ticker from "./Ticker";

const INTRO = 0.16; // fração do scroll em que o título fica na tela

// Hero "sticky": a página rola, o vídeo avança frame a frame e as legendas trocam.
export default function Hero({ site, steps }) {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [videoOk, setVideoOk] = useState(Boolean(site.hero_video_url));
  const [imageOk, setImageOk] = useState(Boolean(site.hero_image_url));
  const [phase, setPhase] = useState(0); // 0 = título; 1..n = passos

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useScrubVideo(videoRef, scrollYProgress, videoOk);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!steps.length || p < INTRO) return setPhase(0);
    const i = Math.floor(((p - INTRO) / (1 - INTRO)) * steps.length);
    setPhase(Math.min(steps.length, i + 1));
  });

  const bar = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  const zoom = useTransform(scrollYProgress, [0, 1], [1.02, 1.28]); // movimento do poster sem vídeo
  const glowY = useTransform(scrollYProgress, [0, 1], ["-10%", "30%"]);

  const step = phase > 0 ? steps[phase - 1] : null;

  return (
    <section ref={ref} id="top" className="hero" style={{ height: `${140 + steps.length * 40}vh` }}>
      <div className="hero__stage">
        <div className="hero__backdrop" aria-hidden="true">
          {imageOk && <img src={site.hero_image_url} alt="" onError={() => setImageOk(false)} />}
          <motion.div className="hero__glow" style={{ y: glowY }} />
        </div>

        <Ticker words={site.marquee} />

        <div className="hero__copy">
          <p className="eyebrow">{site.hero_eyebrow}</p>
          <div className="hero__swap">
            <AnimatePresence mode="wait" initial={false}>
              {step ? (
                <motion.div key={phase} className="hero__step"
                  initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -36 }}
                  transition={{ duration: 0.35 }}>
                  <span className="hero__num">{String(phase).padStart(2, "0")}<small>/{String(steps.length).padStart(2, "0")}</small></span>
                  <h2 className="hero__title hero__title--step"><Letters text={step.title} /></h2>
                  <p className="hero__sub">{step.text}</p>
                </motion.div>
              ) : (
                <motion.div key="intro"
                  initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -36 }}
                  transition={{ duration: 0.35 }}>
                  <h1 className="hero__title"><Letters text={site.hero_title} delay={0.15} /></h1>
                  <p className="hero__sub">{site.hero_subtitle}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hero__cta">
            <a className="btn" href="#planos">{site.cta_label} <Icon name="arrow" size={20} /></a>
            <a className="btn btn--ghost" href="#aulas"><Icon name="play" size={18} /> Ver aulas</a>
          </div>
          <ul className="hero__stats">
            {site.stats.map((s) => (
              <li key={s.label}><strong>{s.value}</strong><span>{s.label}</span></li>
            ))}
          </ul>
        </div>

        <div className="hero__frame">
          {videoOk ? (
            <video ref={videoRef} src={site.hero_video_url} poster={imageOk ? site.hero_image_url : undefined}
              muted playsInline preload="auto" disablePictureInPicture onError={() => setVideoOk(false)} />
          ) : imageOk ? (
            <motion.img src={site.hero_image_url} alt="Jogada de futevôlei na areia" style={{ scale: zoom }} />
          ) : (
            <div className="hero__empty" />
          )}
          <div className="hero__frame-shade" aria-hidden="true" />
          <div className="hero__rail" aria-hidden="true"><motion.span style={{ scaleY: bar }} /></div>
          <span className="hero__hint" aria-hidden="true"><i />Role para dar o play</span>
        </div>
      </div>
    </section>
  );
}
