// Camada de acesso à API (única que conhece fetch/URLs).
const BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let detail = "Algo deu errado. Tente de novo.";
    try {
      const body = await res.json();
      if (typeof body.detail === "string") detail = body.detail;
      else if (Array.isArray(body.detail)) detail = "Confira os dados informados.";
    } catch {}
    const err = new Error(detail);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const api = {
  getLanding: () => request("/api/landing"),
  getLessons: ({ cursor = 0, limit = 9, level = "" }) => {
    const q = new URLSearchParams({ cursor, limit });
    if (level) q.set("level", level);
    return request(`/api/lessons?${q}`);
  },
  createLead: (payload) =>
    request("/api/leads", { method: "POST", body: JSON.stringify(payload) }),
};
