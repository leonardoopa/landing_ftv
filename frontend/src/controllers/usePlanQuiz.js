import { useCallback, useMemo, useState } from "react";
import { QUESTIONS, QUIZ_KEY, pickPlan, readStored, scoreQuiz, writeStored } from "../models/quiz";

const store = () => (typeof window === "undefined" ? null : window.sessionStorage);

function load() {
  const s = store();
  const saved = s ? readStored(s, QUIZ_KEY) : null;
  const answers = saved && saved.answers && typeof saved.answers === "object" ? saved.answers : {};
  const step = Number.isInteger(saved?.step) && saved.step >= 0 && saved.step <= 3 ? saved.step : 0;
  const complete = QUESTIONS.every((q) => answers[q.id] !== undefined);
  return { step: step === 3 && !complete ? 0 : step, answers };
}

// Estado do quiz de nível: passo atual (0-2 perguntas, 3 resultado), respostas e plano indicado.
export function usePlanQuiz(plans) {
  const [state, setState] = useState(load);

  const commit = useCallback((next) => {
    const s = store();
    if (s) writeStored(s, QUIZ_KEY, next);
    setState(next);
  }, []);

  const answer = useCallback(
    (id, value) => commit({ answers: { ...state.answers, [id]: value }, step: Math.min(state.step + 1, 3) }),
    [commit, state],
  );
  const back = useCallback(() => commit({ ...state, step: Math.max(state.step - 1, 0) }), [commit, state]);
  const reset = useCallback(() => commit({ answers: {}, step: 0 }), [commit]);

  const result = useMemo(() => {
    if (state.step !== 3 || !QUESTIONS.every((q) => state.answers[q.id] !== undefined)) return null;
    const { level, planKey } = scoreQuiz(state.answers);
    const plan = pickPlan(plans, planKey);
    return plan ? { level, planKey, plan } : null;
  }, [state, plans]);

  return { step: state.step, answers: state.answers, answer, back, reset, result };
}
