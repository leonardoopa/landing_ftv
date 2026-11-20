import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import { QUESTIONS, buildWhatsAppUrl, reasonFor } from "../models/quiz";

const LEVEL_LABEL = { iniciante: "Iniciante", intermediario: "Intermediário" };

export default function PlanQuiz({ quiz, site }) {
  const { step, answers, answer, back, reset, result } = quiz;
  const headingRef = useRef(null);
  const timer = useRef(null);
  const wasResult = useRef(Boolean(result));
  const [typed, setTyped] = useState(null); // resposta escolhida pelo teclado, aguardando "Continuar"

  useEffect(() => () => clearTimeout(timer.current), []);
  // qualquer mudança de passo cancela avanço pendente e seleção de teclado
  useEffect(() => {
    clearTimeout(timer.current);
    setTyped(null);
  }, [step]);
  // foco no título do resultado quando ele aparece (não ao recarregar a página)
  useEffect(() => {
    if (result && !wasResult.current) headingRef.current?.focus();
    wasResult.current = Boolean(result);
  }, [result]);

  // clique do mouse/toque avança sozinho; seleção por teclado (detail 0) só marca e espera "Continuar"
  const pick = (e, id, value) => {
    clearTimeout(timer.current);
    if (e.detail === 0) {
      setTyped({ id, value });
      return;
    }
    setTyped(null);
    timer.current = setTimeout(() => answer(id, value), 250);
  };
  const goBack = () => { clearTimeout(timer.current); back(); };
  const redo = () => { clearTimeout(timer.current); reset(); };

  const q = QUESTIONS[step];

  return (
    <section className="section quiz" id="nivel" aria-labelledby="quiz-title">
      <p className="eyebrow">Seu nível</p>
      <h2 className="section-title" id="quiz-title">Qual plano combina com você?</h2>
      {result ? (
        <Result quiz={quiz} result={result} site={site} headingRef={headingRef} onReset={redo} />
      ) : q ? (
        <div className="quiz__card">
          <div className="quiz__top">
            <span className="quiz__count" aria-live="polite">{step + 1}/{QUESTIONS.length}</span>
            <span className="quiz__bar" aria-hidden="true"><i style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} /></span>
          </div>
          <fieldset className="quiz__q" key={q.id}>
            <legend>{q.title}</legend>
            <div className="quiz__opts">
              {q.options.map((o) => (
                <label key={String(o.value)} className="quiz__opt">
                  <input type="radio" name={q.id} value={String(o.value)} defaultChecked={answers[q.id] === o.value} onClick={(e) => pick(e, q.id, o.value)} />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {typed && <button type="button" className="btn btn--sm" onClick={() => answer(typed.id, typed.value)}>Continuar</button>}
          {step > 0 && <button type="button" className="btn btn--ghost btn--sm quiz__back" onClick={goBack}>Voltar</button>}
        </div>
      ) : null}
    </section>
  );
}

function Result({ quiz, result, site, headingRef, onReset }) {
  const { plan, level, planKey } = result;
  const [mode, setMode] = useState("idle"); // idle | form | loading | ok
  const [form, setForm] = useState({ name: "", whatsapp: "" });
  const [error, setError] = useState("");
  const href = buildWhatsAppUrl({ whatsapp: site.whatsapp, level, plan }) || site.cta_url;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setMode("loading");
    setError("");
    try {
      await api.createLead({ name: form.name, whatsapp: form.whatsapp, level, plan: plan.name, source: "quiz" });
      setMode("ok");
    } catch (err) {
      setError(err.message);
      setMode("form");
    }
  };

  return (
    <div className="quiz__card quiz__result">
      <p className="quiz__level">Nível {LEVEL_LABEL[level]}</p>
      <h3 ref={headingRef} tabIndex={-1} className="quiz__plan">{plan.name} <span>{plan.price}</span></h3>
      <p className="quiz__reason">{reasonFor(planKey)}</p>
      <div className="quiz__actions">
        <a className="btn" href={href} target="_blank" rel="noopener">Chamar no WhatsApp</a>
        {mode === "idle" && <button type="button" className="btn btn--ghost" onClick={() => setMode("form")}>Prefiro que me chamem</button>}
        <button type="button" className="btn btn--ghost" onClick={onReset}>Refazer</button>
      </div>
      {(mode === "form" || mode === "loading") && (
        <form className="quiz__lead" onSubmit={submit}>
          <input required minLength={2} value={form.name} onChange={set("name")} placeholder="Seu nome" aria-label="Nome" autoComplete="name" />
          <input required inputMode="tel" value={form.whatsapp} onChange={set("whatsapp")} placeholder="WhatsApp com DDD" aria-label="WhatsApp" autoComplete="tel" />
          <button className="btn btn--sm" disabled={mode === "loading"}>{mode === "loading" ? "Enviando…" : "Enviar meus dados"}</button>
          {error && <p className="quiz__msg quiz__msg--err" role="alert">{error}</p>}
        </form>
      )}
      {mode === "ok" && <p className="quiz__msg quiz__msg--ok" role="status">Recebemos seus dados. A gente te chama no WhatsApp.</p>}
    </div>
  );
}
