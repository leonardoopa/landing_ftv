import test from "node:test";
import assert from "node:assert/strict";
import {
  QUIZ_KEY,
  safeStorage,
  sanitizeQuizState,
  QUESTIONS,
  scoreQuiz,
  pickPlan,
  buildWhatsAppUrl,
  reasonFor,
  readStored,
  writeStored,
} from "./quiz.js";

test("QUIZ_KEY e QUESTIONS", () => {
  assert.equal(QUIZ_KEY, "royal:quiz");
  assert.deepEqual(
    QUESTIONS.map((q) => q.id),
    ["experiencia", "controle", "objetivo"],
  );
  assert.equal(QUESTIONS[0].title, "Você já jogou futevôlei?");
  assert.equal(QUESTIONS[2].options[2].value, "presencial");
});

test("scoreQuiz", () => {
  const cases = [
    [0, 0, "sozinho", "iniciante", "essencial"],
    [1, 1, "sozinho", "iniciante", "essencial"],
    [2, 1, "sozinho", "intermediario", "completo"],
    [0, 0, "evoluir", "iniciante", "completo"],
    [2, 2, "presencial", "intermediario", "premium"],
    [0, 0, "presencial", "iniciante", "premium"],
  ];
  for (const [experiencia, controle, objetivo, level, planKey] of cases) {
    assert.deepEqual(scoreQuiz({ experiencia, controle, objetivo }), { level, planKey });
  }
});

test("pickPlan", () => {
  const plans = [
    { id: 1, name: "Essencial" },
    { id: 2, name: "Completo" },
    { id: 3, name: "Premium" },
  ];
  assert.equal(pickPlan([{ id: 9, name: "Outro" }, { id: 2, name: "COMPLETO" }], "completo").id, 2);
  const swapped = [{ id: 1, name: "A" }, { id: 2, name: "B" }, { id: 3, name: "C" }];
  assert.equal(pickPlan(swapped, "essencial").id, 1);
  assert.equal(pickPlan(swapped, "completo").id, 2);
  assert.equal(pickPlan(swapped, "premium").id, 3);
  assert.equal(pickPlan(plans, "premium").id, 3);
  assert.equal(pickPlan([], "completo"), null);
});

test("buildWhatsAppUrl", () => {
  const url = buildWhatsAppUrl({
    whatsapp: "+55 (11) 99999-0000",
    level: "intermediario",
    plan: { name: "Completo", price: "R$ 35,90" },
  });
  assert.equal(
    url,
    "https://wa.me/5511999990000?text=" +
      encodeURIComponent("Oi! Fiz o quiz da Royal: nível Intermediário. Quero o plano Completo (R$ 35,90)."),
  );
  const plan = { name: "Essencial", price: "R$ 1" };
  assert.equal(buildWhatsAppUrl({ whatsapp: "", level: "iniciante", plan }), null);
  assert.equal(buildWhatsAppUrl({ whatsapp: "abc", level: "iniciante", plan }), null);
  assert.ok(
    decodeURIComponent(buildWhatsAppUrl({ whatsapp: "1", level: "iniciante", plan })).includes("nível Iniciante."),
  );
});

test("reasonFor", () => {
  assert.equal(
    reasonFor("essencial"),
    "Você está começando e quer aprender no seu ritmo: o Essencial cobre os fundamentos em vídeo.",
  );
  assert.equal(
    reasonFor("completo"),
    "Você quer evoluir o jogo: o Completo libera o nível iniciante e o intermediário.",
  );
  assert.equal(
    reasonFor("premium"),
    "Você quer treinar na areia: o Premium soma uma aula presencial na Royal.",
  );
});

test("readStored e writeStored nunca lançam", () => {
  const boom = {
    getItem() {
      throw new Error("x");
    },
    setItem() {
      throw new Error("x");
    },
  };
  assert.equal(readStored(boom, "k"), null);
  assert.doesNotThrow(() => writeStored(boom, "k", { a: 1 }));
  assert.equal(readStored(null, "k"), null);
  assert.doesNotThrow(() => writeStored(null, "k", {}));
});

test("readStored e writeStored: ida e volta e entradas ruins", () => {
  const data = {};
  const mem = {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = v;
    },
  };
  assert.equal(readStored(mem, "k"), null);
  writeStored(mem, "k", { level: "iniciante" });
  assert.deepEqual(readStored(mem, "k"), { level: "iniciante" });
  data.k = "{invalido";
  assert.equal(readStored(mem, "k"), null);
});

test("safeStorage devolve o storage ou null sem lançar", () => {
  const store = { getItem() {} };
  assert.equal(safeStorage({ sessionStorage: store }), store);
  const bloqueado = {};
  Object.defineProperty(bloqueado, "sessionStorage", {
    get() {
      throw new Error("SecurityError");
    },
  });
  assert.equal(safeStorage(bloqueado), null);
  assert.equal(safeStorage(undefined), null);
});

test("sanitizeQuizState valida respostas e limita o passo", () => {
  const full = { experiencia: 1, controle: 2, objetivo: "evoluir" };
  assert.deepEqual(sanitizeQuizState({ step: 3, answers: full }), { step: 3, answers: full });
  assert.deepEqual(sanitizeQuizState({ step: 2, answers: {} }), { step: 0, answers: {} });
  assert.deepEqual(
    sanitizeQuizState({ step: 3, answers: { experiencia: 9, controle: 1, objetivo: "evoluir" } }),
    { step: 0, answers: { controle: 1, objetivo: "evoluir" } },
  );
  assert.deepEqual(
    sanitizeQuizState({ step: 3, answers: { experiencia: 0, controle: 1 } }),
    { step: 2, answers: { experiencia: 0, controle: 1 } },
  );
  for (const bad of [null, "x", [], 5, { step: "a", answers: "b" }]) {
    assert.deepEqual(sanitizeQuizState(bad), { step: 0, answers: {} });
  }
});
