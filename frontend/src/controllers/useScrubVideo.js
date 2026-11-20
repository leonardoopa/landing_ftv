import { useEffect } from "react";
import { isSettled, smoothToward } from "./scrubMath";

// Liga o tempo do vídeo a um progresso 0..1 (`targetRef.current`): rolar = avançar frames.
// Suaviza por tempo (independe do Hz), nunca enfileira seeks e dorme quando assentado.
export function useScrubVideo(videoRef, targetRef, enabled) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enabled) return undefined;

    let raf = 0;
    let last = 0;
    let current = targetRef.current;

    // iOS só permite seek depois de um play() iniciado (vídeo mudo é permitido).
    const unlock = () => {
      const p = video.play();
      if (p?.then) p.then(() => video.pause()).catch(() => {});
    };
    video.addEventListener("loadedmetadata", unlock, { once: true });
    if (video.readyState >= 1) unlock();

    const loop = (now) => {
      raf = 0;
      const dt = last ? (now - last) / 1000 : 1 / 60;
      last = now;
      const duration = video.duration;
      if (duration && video.readyState >= 2 && !video.seeking) {
        current = smoothToward(current, targetRef.current, dt);
        const time = Math.min(duration - 0.04, Math.max(0, current * duration));
        if (Math.abs(video.currentTime - time) > 0.012) video.currentTime = time;
      }
      if (isSettled(current, targetRef.current) && !video.seeking) {
        last = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("scroll", wake, { passive: true });
    wake();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      video.removeEventListener("loadedmetadata", unlock);
    };
  }, [videoRef, targetRef, enabled]);
}
