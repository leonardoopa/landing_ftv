import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollStory } from "../controllers/useScrollStory";
import { useScrubVideo } from "../controllers/useScrubVideo";
import Icon from "./Icons";
import Letters from "./Letters";
import Ticker from "./Ticker";

const INTRO = 0.16; // fração do scroll em que o título fica na tela

function phaseAt(progress, total) {
  if (!total || progress < INTRO) return 0;
  return Math.min(total, Math.floor(((progress - INTRO) / (1 - INTRO)) * total) + 1);
}

// Hero preso: o scroll avança o vídeo frame a frame, troca as legendas,
// solta um cartão por passo ao redor do vídeo e enche a linha do tempo.
export default function Hero({ site, steps }) {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const target = useRef(0);
  const [videoOk, setVideoOk] = useState(Boolean(site.hero_video_url));
  const [imageOk, setImageOk] = useState(Boolean(site.hero_image_url));
  const [phase, setPhase] = useState(0); // 0 = título; 1..n = passos
  const total = steps.length;

  useScrubVideo(videoRef, target, videoOk);

  useScrollStory(ref, ({ tl, q }) => {
    const seg = total ? (1 - INTRO) / total : 0;
    tl.fromTo(q(".hero__rail span"), { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0);
    tl.fromTo(q(".hero__glow"), { yPercent: -10 }, { yPercent: 30, duration: 1 }, 0);
    const bar = q(".hero__marks-bar i");
    if (bar.length) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1 - INTRO }, INTRO);
    const poster = q(".hero__frame img");
    if (poster.length) tl.fromTo(poster, { scale: 1.02 }, { scale: 1.28, duration: 1 }, 0); // movimento sem vídeo

    q(".hero__card").forEach((card, i) => {
      const at = INTRO + i * seg;
      const side = i % 2 ? 1 : -1; // nasce de dentro do vídeo e vai para o lado
      tl.fromTo(card,
        { autoAlpha: 0, scale: 0.4, x: -side * 150, y: 40 },
        { autoAlpha: 1, scale: 1, x: 0, y: 0, duration: seg * 0.45, ease: "back.out(1.7)" }, at);
      if (i < total - 1) tl.to(card, { autoAlpha: 0.45, scale: 0.9, duration: seg * 0.3 }, at + seg);
    });
  }, [total, videoOk, imageOk], {
    onProgress: (p) => { target.current = p; setPhase(phaseAt(p, total)); },
  });

  const step = phase > 0 ? steps[phase - 1] : null;

  return (
    <section ref={ref} id="top" className="hero" style={{ height: `${120 + total * 50}vh` }}>
      <div className="hero__stage">
        <div className="hero__backdrop" aria-hidden="true">
          {imageOk && <img src={site.hero_image_url} alt="" onError={() => setImageOk(false)} />}
          <div className="hero__glow" />
        </div>

        <Ticker words={site.marquee} />

        <div className="hero__copy">
          <p className="eyebrow">{site.hero_eyebrow}</p>
          <div className="hero__swap">
            <AnimatePresence mode="wait" initial={false}>
              {step ? (
                <motion.div key={phase} className="hero__step"
                  initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -36 }}
                  transition={{ duration: 0.3 }}>
                  <span className="hero__num">{String(phase).padStart(2, "0")}<small>/{String(total).padStart(2, "0")}</small></span>
                  <h2 className="hero__title hero__title--step"><Letters text={step.title} /></h2>
                  <p className="hero__sub">{step.text}</p>
                </motion.div>
              ) : (
                <motion.div key="intro"
                  initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -36 }}
                  transition={{ duration: 0.3 }}>
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

        <div className="hero__media">
          <div className="hero__frame">
            {videoOk ? (
              <video ref={videoRef} src={site.hero_video_url} poster={imageOk ? site.hero_image_url : undefined}
                muted playsInline preload="auto" disablePictureInPicture onError={() => setVideoOk(false)} />
            ) : imageOk ? (
              <img src={site.hero_image_url} alt="Jogada de futevôlei na areia" />
            ) : (
              <div className="hero__empty" />
            )}
            <div className="hero__frame-shade" aria-hidden="true" />
            <div className="hero__rail" aria-hidden="true"><span /></div>
            <span className="hero__hint" aria-hidden="true"><i />Role para dar o play</span>
          </div>

          {steps.map((s, i) => (
            <div className="hero__card" key={s.id} aria-hidden="true">
              <b>{String(i + 1).padStart(2, "0")}</b>
              <span><strong>{s.title}</strong>{s.tag && <small>{s.tag}</small>}</span>
            </div>
          ))}

          {total > 0 && (
            <ol className="hero__marks" aria-hidden="true" style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}>
              <span className="hero__marks-bar"><i /></span>
              {steps.map((s, i) => (
                <li key={s.id} className={phase === i + 1 ? "on" : phase > i + 1 ? "done" : ""}>
                  <b>{String(i + 1).padStart(2, "0")}</b>{s.title}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
