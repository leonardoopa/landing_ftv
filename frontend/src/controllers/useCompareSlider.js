import { useCallback, useEffect, useRef, useState } from "react";
import { clampCut, stepCut } from "../models/corrections.js";

// Varredura de apresentação: 50 → 35 → 65 → 50 (alvo, duração em ms).
const SWEEP = [[35, 420], [65, 640], [50, 420]];
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

// Slider de comparação: `cut` (0–100) vem da divisória, que captura o ponteiro só para si.
// `onRelease` (opcional) roda quando a divisória é solta.
export function useCompareSlider({ onRelease } = {}) {
  const [cut, setCutState] = useState(50);
  const trackRef = useRef(null);
  const cutRef = useRef(50);
  const drag = useRef(null); // { id, offset } enquanto arrasta
  const raf = useRef(0);
  const swept = useRef(false);
  const releaseRef = useRef(onRelease);
  releaseRef.current = onRelease;

  const setCut = useCallback((value) => {
    const next = clampCut(value);
    cutRef.current = next;
    setCutState(next);
  }, []);

  // também chamada quando a pessoa assume a divisória: a varredura não roda mais depois disso
  const stopSweep = () => {
    swept.current = true;
    cancelAnimationFrame(raf.current);
    raf.current = 0;
  };
  useEffect(() => stopSweep, []);

  const sweep = useCallback(() => {
    if (swept.current) return;
    swept.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let from = cutRef.current;
    let seg = 0;
    let start = 0;
    const tick = (now) => {
      if (!start) start = now;
      const [to, ms] = SWEEP[seg];
      const t = Math.min(1, (now - start) / ms);
      setCut(from + (to - from) * ease(t));
      if (t < 1) { raf.current = requestAnimationFrame(tick); return; }
      seg += 1;
      if (seg >= SWEEP.length) { raf.current = 0; return; }
      from = to;
      start = now;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [setCut]);

  const pointerCut = (e) => {
    const r = trackRef.current?.getBoundingClientRect();
    return r && r.width ? ((e.clientX - r.left) / r.width) * 100 : cutRef.current;
  };

  const end = (e, released) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    drag.current = null;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (released) releaseRef.current?.();
  };

  const handleProps = {
    role: "slider",
    tabIndex: 0,
    "aria-label": "Comparar erro e jogada certa",
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-valuenow": Math.round(cut),
    onPointerDown: (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault(); // sem seleção de texto; o foco vai para a divisória
      e.currentTarget.focus({ preventScroll: true });
      stopSweep();
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ponteiro já liberado */ }
      drag.current = { id: e.pointerId, offset: pointerCut(e) - cutRef.current };
    },
    onPointerMove: (e) => {
      if (!drag.current || drag.current.id !== e.pointerId) return;
      setCut(pointerCut(e) - drag.current.offset);
    },
    onPointerUp: (e) => end(e, true),
    onPointerCancel: (e) => end(e, false),
    onKeyDown: (e) => {
      const next = stepCut(cutRef.current, e.key);
      if (next === null) return;
      e.preventDefault();
      stopSweep();
      setCut(next);
    },
  };

  return { cut, setCut, trackRef, handleProps, sweep };
}
