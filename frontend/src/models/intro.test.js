import test from "node:test";
import assert from "node:assert/strict";
import { shouldPlayIntro } from "./intro.js";

const base = { reducedMotion: false, scrollY: 0, seen: false, hasCrown: true };

test("toca no caso base", () => {
  assert.equal(shouldPlayIntro(base), true);
});
test("não toca com reduzir movimento", () => {
  assert.equal(shouldPlayIntro({ ...base, reducedMotion: true }), false);
});
test("não toca com a página já rolada", () => {
  assert.equal(shouldPlayIntro({ ...base, scrollY: 81 }), false);
});
test("toca no limite de 80 px", () => {
  assert.equal(shouldPlayIntro({ ...base, scrollY: 80 }), true);
});
test("não toca se já foi vista na sessão", () => {
  assert.equal(shouldPlayIntro({ ...base, seen: true }), false);
});
test("não toca sem coroa", () => {
  assert.equal(shouldPlayIntro({ ...base, hasCrown: false }), false);
});
