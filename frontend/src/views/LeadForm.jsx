import { useLeadForm } from "../controllers/useLeadForm";
import Reveal from "./Reveal";

export default function LeadForm() {
  const { form, set, submit, status } = useLeadForm();
  const busy = status.state === "loading";

  return (
    <section id="matricula" className="section lead">
      <Reveal className="lead__card">
        <div>
          <p className="eyebrow">Aula experimental</p>
          <h2 className="section-title">Deixe seu contato. A gente chama no WhatsApp.</h2>
          <p className="section-lead">Sem compromisso. Conte seu nível e montamos o primeiro treino.</p>
        </div>
        <form onSubmit={submit} className="form">
          <label>Nome
            <input required minLength={2} value={form.name} onChange={set("name")} placeholder="Seu nome" autoComplete="name" />
          </label>
          <label>WhatsApp
            <input required inputMode="tel" value={form.whatsapp} onChange={set("whatsapp")} placeholder="(11) 99999-9999" autoComplete="tel" />
          </label>
          <label>E-mail (opcional)
            <input type="email" value={form.email} onChange={set("email")} placeholder="voce@email.com" autoComplete="email" />
          </label>
          <label>Seu nível
            <select value={form.level} onChange={set("level")}>
              <option value="iniciante">Nunca joguei / Iniciante</option>
              <option value="intermediario">Já jogo um pouco</option>
              <option value="avancado">Jogo bem / Avançado</option>
            </select>
          </label>
          <button className="btn" disabled={busy}>{busy ? "Enviando…" : "Quero minha aula"}</button>
          {status.state === "ok" && <p className="form__msg form__msg--ok" role="status">{status.message}</p>}
          {status.state === "error" && <p className="form__msg form__msg--err" role="alert">{status.message}</p>}
        </form>
      </Reveal>
    </section>
  );
}
