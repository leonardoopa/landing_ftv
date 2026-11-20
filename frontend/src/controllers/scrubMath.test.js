import test from "node:test";
import assert from "node:assert/strict";
import { smoothToward, isSettled } from "./scrubMath.js";

test("um quadro a 60 Hz anda cerca de 0,2085 do caminho", () => {
  assert.ok(Math.abs(smoothToward(0, 1, 1 / 60) - 0.2085) < 0.001);
});
test("dois meios passos igualam um passo inteiro", () => {
  const a = smoothToward(smoothToward(0, 1, 1 / 120), 1, 1 / 120);
  assert.ok(Math.abs(a - smoothToward(0, 1, 1 / 60)) < 1e-12);
});
test("aba em segundo plano (dt enorme) não pula nem passa do alvo", () => {
  const v = smoothToward(0, 1, 10);
  assert.ok(Math.abs(v - (1 - Math.exp(-1.4))) < 1e-9 && v < 1);
});
test("dt zero ou negativo devolve o valor atual", () => {
  assert.equal(smoothToward(0.3, 1, 0), 0.3);
  assert.equal(smoothToward(0.3, 1, -1), 0.3);
});
test("isSettled usa a tolerância", () => {
  assert.equal(isSettled(0.5, 0.50049), true);
  assert.equal(isSettled(0.5, 0.502), false);
});
