import { useEffect } from "react";

// Liga o tempo do vídeo ao progresso do scroll (0..1): rolar = avançar frames.
// Suaviza com interpolação e nunca enfileira seeks (espera o anterior terminar).
export function useScrubVideo(videoRef, progress, enabled) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enabled) return;

    let raf = 0;
    let target = progress.get();
    let current = target;
    const unsubscribe = progress.on("change", (p) => { target = p; });

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
        current += (target - current) * 0.2;
        const time = Math.min(duration - 0.04, Math.max(0, current * duration));
        if (Math.abs(video.currentTime - time) > 0.012) video.currentTime = time;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
      video.removeEventListener("loadedmetadata", unlock);
    };
  }, [videoRef, progress, enabled]);
}
