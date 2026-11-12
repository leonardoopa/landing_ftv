import { useLeadForm } from "../controllers/useLeadForm";

export default function LeadForm() {
  const { form, set, submit, status } = useLeadForm();
  const busy = status.state === "loading";

  return (
    <form onSubmit={submit} className="form">
      <h3>Ficou na dúvida? A gente te chama.</h3>
      <input required minLength={2} value={form.name} onChange={set("name")} placeholder="Seu nome" aria-label="Nome" autoComplete="name" />
      <input required inputMode="tel" value={form.whatsapp} onChange={set("whatsapp")} placeholder="WhatsApp com DDD" aria-label="WhatsApp" autoComplete="tel" />
      <select value={form.level} onChange={set("level")} aria-label="Seu nível">
        <option value="iniciante">Nunca joguei / Iniciante</option>
        <option value="intermediario">Já jogo um pouco</option>
      </select>
      <button className="btn" disabled={busy}>{busy ? "Enviando…" : "Quero que me chamem"}</button>
      {status.state === "ok" && <p className="form__msg form__msg--ok" role="status">{status.message}</p>}
      {status.state === "error" && <p className="form__msg form__msg--err" role="alert">{status.message}</p>}
    </form>
  );
}
