import { useEffect, useRef } from "react";
import { labelAt } from "../models/cursor";

// Pílula que acompanha o ponteiro sobre elementos com data-cursor. Passiva: não captura eventos.
export default function CursorLabel() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    let raf = 0;
    let x = -1;
    let y = -1;
    let text = null;
    let rescanning = false;
    const paint = () => {
      raf = 0;
      if (rescanning) { rescanning = false; text = labelAt(document.elementFromPoint(x, y)); }
      el.style.transform = `translate3d(${x + 16}px, ${y + 18}px, 0)`;
      if (text) el.textContent = text;
      el.classList.toggle("is-on", Boolean(text));
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const move = (e) => { x = e.clientX; y = e.clientY; rescanning = false; text = labelAt(e.target); queue(); };
    const rescan = () => { if (x < 0) return; rescanning = true; queue(); };
    const leave = () => { x = -1; y = -1; rescanning = false; text = null; queue(); };
    const down = () => el.classList.add("is-down");
    const up = () => el.classList.remove("is-down");
    document.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", rescan, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("pointercancel", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave, { passive: true });
    return () => {
      document.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", rescan);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="cursor-label" ref={ref} aria-hidden="true" />;
}
