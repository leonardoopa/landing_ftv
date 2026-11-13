import { useEffect, useState } from "react";
import { api } from "../services/api";

// Carrega as aulas de cada nível de uma vez (para as abas presas ao scroll).
export function useLessonsByLevel(levels) {
  const [byLevel, setByLevel] = useState(null);
  const key = levels.join(",");
  useEffect(() => {
    let alive = true;
    Promise.all(levels.map((level) => api.getLessons({ level, limit: 30 })))
      .then((pages) => alive && setByLevel(Object.fromEntries(levels.map((l, i) => [l, pages[i].items]))))
      .catch(() => alive && setByLevel(Object.fromEntries(levels.map((l) => [l, []]))));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return byLevel;
}
