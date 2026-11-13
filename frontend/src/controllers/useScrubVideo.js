import { useEffect } from "react";

// Liga o tempo do vídeo a um progresso 0..1 (`targetRef.current`): rolar = avançar frames.
// Suaviza com interpolação e nunca enfileira seeks (espera o anterior terminar).
export function useScrubVideo(videoRef, targetRef, enabled) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enabled) return undefined;

    let raf = 0;
    let current = targetRef.current;

    // iOS só permite seek depois de um play() iniciado (vídeo mudo é permitido).
    const unlock = () => {
      const p = video.play();
      if (p?.then) p.then(() => video.pause()).catch(() => {});
    };
    video.addEventListener("loadedmetadata", unlock, { once: true });
    if (video.readyState >= 1) unlock();

    const loop = () => {
      const duration = video.duration;
      if (duration && video.readyState >= 2 && !video.seeking) {
        current += (targetRef.current - current) * 0.2;
        const time = Math.min(duration - 0.04, Math.max(0, current * duration));
        if (Math.abs(video.currentTime - time) > 0.012) video.currentTime = time;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", unlock);
    };
  }, [videoRef, targetRef, enabled]);
}
