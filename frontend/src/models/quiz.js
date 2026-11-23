export const QUIZ_KEY = "royal:quiz";

export const QUESTIONS = [
  {
    id: "experiencia",
    title: "Você já jogou futevôlei?",
    options: [
      { value: 0, label: "Nunca jogei" },
      { value: 1, label: "Já joguei algumas vezes" },
      { value: 2, label: "Jogo toda semana" },
    ],
  },
  {
    id: "controle",
    title: "Você controla a bola com pé e peito?",
    options: [
      { value: 0, label: "Ainda não" },
      { value: 1, label: "Mais ou menos" },
      { value: 2, label: "Com firmeza" },
    ],
  },
  {
    id: "objetivo",
    title: "O que você quer agora?",
    options: [
      { value: "sozinho", label: "Aprender sozinho com vídeo" },
      { value: "evoluir", label: "Evoluir o meu jogo" },
      { value: "presencial", label: "Treinar com o professor na areia" },
    ],
  },
];

export function scoreQuiz({ experiencia, controle, objetivo }) {
  const level = experiencia + controle <= 2 ? "iniciante" : "intermediario";
  let planKey = "essencial";
  if (objetivo === "presencial") planKey = "premium";
  else if (objetivo === "evoluir" || level === "intermediario") planKey = "completo";
  return { level, planKey };
}

const PLAN_POSITION = { essencial: 0, completo: 1, premium: 2 };

export function pickPlan(plans, planKey) {
  if (!Array.isArray(plans) || plans.length === 0) return null;
  const byName = plans.find((p) => String(p.name).toLowerCase() === planKey);
  return byName || plans[Math.min(PLAN_POSITION[planKey] ?? 0, plans.length - 1)];
}

export function buildWhatsAppUrl({ whatsapp, level, plan }) {
  const digits = String(whatsapp || "").replace(/\D/g, "");
  if (!digits) return null;
  const levelLabel = level === "intermediario" ? "Intermediário" : "Iniciante";
  const text = `Oi! Fiz o quiz da Royal: nível ${levelLabel}. Quero o plano ${plan.name} (${plan.price}).`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

const REASONS = {
  essencial: "Você está começando e quer aprender no seu ritmo: o Essencial cobre os fundamentos em vídeo.",
  completo: "Você quer evoluir o jogo: o Completo libera o nível iniciante e o intermediário.",
  premium: "Você quer treinar na areia: o Premium soma uma aula presencial na Royal.",
};

export function reasonFor(planKey) {
  return REASONS[planKey];
}

export function readStored(storage, key) {
  try {
    const raw = storage.getItem(key);
    if (raw == null) return null;
    const value = JSON.parse(raw);
    return value && typeof value === "object" ? value : null;
  } catch {
    return null;
  }
}

export function writeStored(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // storage indisponível: ignora
  }
}

// Ler window.sessionStorage pode lançar (storage bloqueado): devolve null nesses casos.
export function safeStorage(win) {
  try {
    return win?.sessionStorage ?? null;
  } catch {
    return null;
  }
}

// Valida o estado guardado: só respostas que existem nas opções; passo limitado à 1ª pergunta sem resposta.
export function sanitizeQuizState(raw) {
  const empty = { step: 0, answers: {} };
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return empty;
  const source = raw.answers && typeof raw.answers === "object" && !Array.isArray(raw.answers) ? raw.answers : {};
  const answers = {};
  for (const q of QUESTIONS) {
    if (q.options.some((o) => o.value === source[q.id])) answers[q.id] = source[q.id];
  }
  const firstOpen = QUESTIONS.findIndex((q) => answers[q.id] === undefined);
  const limit = firstOpen === -1 ? QUESTIONS.length : firstOpen;
  const step = Number.isInteger(raw.step) && raw.step > 0 ? Math.min(raw.step, limit) : 0;
  return { step, answers };
}
