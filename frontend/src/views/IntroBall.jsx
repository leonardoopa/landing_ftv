import { useEffect, useRef, useState } from "react";
import { INTRO_KEY, shouldPlayIntro } from "../models/intro";

const SIZE = 28;
const DURATION = 1000;
const FADE = 200;
const PULSE = 300;

function readSeen() {
  try { return sessionStorage.getItem(INTRO_KEY) === "1"; } catch { return false; }
}
function markSeen() {
  try { sessionStorage.setItem(INTRO_KEY, "1"); } catch { /* sem storage: toca de novo, sem problema */ }
}

// Bola que cai do topo, quica duas vezes e pousa na coroa do cabeçalho.
export default function IntroBall() {
  const [play, setPlay] = useState(false);
  const ballRef = useRef(null);

  useEffect(() => {
    const crown = document.querySelector(".brand .crown");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!shouldPlayIntro({ reducedMotion, scrollY: window.scrollY, seen: readSeen(), hasCrown: !!crown })) return;
    markSeen();
    setPlay(true);
  }, []);

  useEffect(() => {
    if (!play) return;
    const ball = ballRef.current;
    const crown = document.querySelector(".brand .crown");
    if (!ball || !crown) { setPlay(false); return; }

    const r = crown.getBoundingClientRect();
    const x = r.left + r.width / 2 - SIZE / 2;
    const y = r.top + r.height / 2 - SIZE / 2;
    const top = -SIZE * 2;
    const hop1 = y - 28;    // a coroa fica colada no topo: os quiques sobem pouco
    const hop2 = y - 12;
    const at = (py, sx, sy) => `translate(${x}px, ${py}px) scale(${sx}, ${sy})`;
    const frame = (offset, py, sx, sy, easing) => ({ offset, transform: at(py, sx, sy), easing });

    const fall = ball.animate([
      { ...frame(0, top, 1, 1, "cubic-bezier(0.55, 0, 1, 0.6)"), opacity: 1 },
      frame(0.26, y, 1.18, 0.8, "cubic-bezier(0.2, 0.6, 0.35, 1)"),   // 1º contato, squash
      frame(0.42, hop1, 1, 1, "cubic-bezier(0.55, 0, 1, 0.6)"),
      frame(0.56, y, 1.12, 0.88, "cubic-bezier(0.2, 0.6, 0.35, 1)"),  // 2º contato
      frame(0.68, hop2, 1, 1, "cubic-bezier(0.55, 0, 1, 0.6)"),
      frame(0.8, y, 1.06, 0.94, "ease-out"),                         // assenta
      frame(1, y, 1, 1, "linear"),
    ], { duration: DURATION - FADE, fill: "forwards" });

    let fade; let pulse; let cancelled = false;
    fall.finished.then(() => {
      if (cancelled) return;
      fade = ball.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FADE, fill: "forwards" });
      pulse = crown.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
        { duration: PULSE, easing: "ease-in-out" },
      );
      return fade.finished;
    }).then(() => { if (!cancelled) setPlay(false); }).catch(() => {});

    return () => {
      cancelled = true;
      fall.cancel(); fade?.cancel(); pulse?.cancel();
    };
  }, [play]);

  if (!play) return null;
  return (
    <span className="intro-ball" ref={ballRef} aria-hidden="true">
      <svg width={SIZE} height={SIZE} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="11" fill="#fff" />
        <path d="M12 1v6l5 3-2 7M12 7 7 10l2 7M1.5 9 7 10M22.5 9 17 10" fill="none" stroke="#2563ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
