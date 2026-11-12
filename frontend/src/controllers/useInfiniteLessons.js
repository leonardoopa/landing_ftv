import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../services/api";

const PAGE = 8;

// Carregamento infinito: busca a próxima página quando o sentinel aparece
// dentro do container rolável (`rootRef`) — aqui, o carrossel horizontal.
export function useInfiniteLessons(level, rootRef) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const inflight = useRef(false);
  const epoch = useRef(0);

  useEffect(() => {
    epoch.current += 1; // invalida requisições do filtro anterior
    inflight.current = false;
    setItems([]); setCursor(0); setDone(false); setError(null); setTotal(0);
  }, [level]);

  const loadMore = useCallback(async () => {
    if (inflight.current || done) return;
    inflight.current = true;
    setLoading(true);
    const mine = epoch.current;
    try {
      const page = await api.getLessons({ cursor, limit: PAGE, level });
      if (mine !== epoch.current) return;
      setItems((prev) => [...prev, ...page.items]);
      setTotal(page.total);
      if (page.next_cursor == null) setDone(true);
      else setCursor(page.next_cursor);
    } catch (e) {
      if (mine === epoch.current) setError(e);
    } finally {
      if (mine === epoch.current) { inflight.current = false; setLoading(false); }
    }
  }, [cursor, done, level]);

  const sentinelRef = useRef(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || error) return;
    const io = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { root: rootRef?.current ?? null, rootMargin: "300px 600px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore, error, rootRef]);

  const retry = () => setError(null);
  return { items, loading, done, error, total, sentinelRef, retry };
}
