import { useEffect } from "react";

// Faixa infinita: anda sozinha, acelera com a velocidade do scroll, pausa no hover e
// aceita arrastar com inércia. O conteúdo precisa estar duplicado (a volta é metade da largura).
export function useMarquee(viewRef, trackRef, { dir = -1, speed = 38, ready = true } = {}) {
  useEffect(() => {
    const view = viewRef.current;
    const track = trackRef.current;
    if (!view || !track) return undefined;

    let x = 0, half = 0, boost = 0, hold = 0, vel = 0;
    let raf = 0, last = performance.now(), lastY = window.scrollY;
    let visible = false, hover = false, drag = null;

    const measure = () => { half = track.scrollWidth / 2; };
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    measure();

    const wrap = () => {
      if (!half) return;
      while (x <= -half) x += half;
      while (x > 0) x -= half;
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (!visible) return;

      const target = Math.min(Math.abs(dy) / Math.max(dt, 0.001) * 0.45, 1100);
      boost += (target - boost) * Math.min(1, dt * 5);
      hold += ((hover || drag ? 1 : 0) - hold) * Math.min(1, dt * 7);

      if (!drag) {
        x += dir * (speed + boost) * (1 - hold) * dt + vel * dt;
        vel *= Math.pow(0.04, dt);
      }
      wrap();
      track.style.transform = `translate3d(${x}px,0,0)`;
    };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; last = performance.now(); }, { rootMargin: "120px" });
    io.observe(view);

    const down = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drag = { px: e.clientX, x, t: performance.now(), moved: 0 };
      view.setPointerCapture?.(e.pointerId);
      view.classList.add("is-drag");
    };
    const move = (e) => {
      if (!drag) return;
      const nx = drag.x + (e.clientX - drag.px);
      const now = performance.now();
      vel = ((nx - x) / Math.max(now - drag.t, 1)) * 1000;
      drag.t = now;
      x = nx;
      wrap();
      track.style.transform = `translate3d(${x}px,0,0)`;
    };
    const up = () => {
      if (!drag) return;
      drag = null;
      vel = Math.max(-1800, Math.min(1800, vel));
      view.classList.remove("is-drag");
    };
    const enter = () => { hover = true; };
    const leave = () => { hover = false; };

    view.addEventListener("pointerdown", down);
    view.addEventListener("pointermove", move);
    view.addEventListener("pointerup", up);
    view.addEventListener("pointercancel", up);
    view.addEventListener("pointerenter", enter);
    view.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      view.removeEventListener("pointerdown", down);
      view.removeEventListener("pointermove", move);
      view.removeEventListener("pointerup", up);
      view.removeEventListener("pointercancel", up);
      view.removeEventListener("pointerenter", enter);
      view.removeEventListener("pointerleave", leave);
    };
  }, [viewRef, trackRef, dir, speed, ready]);
}
