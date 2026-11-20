import test from "node:test";
import assert from "node:assert/strict";
import { CORRECTIONS, SHOW_DRAFTS, visibleCorrections, clampCut, stepCut } from "./corrections.js";

test("CORRECTIONS: ids, textos, trajetórias e jogadores", () => {
  assert.equal(SHOW_DRAFTS, true);
  assert.deepEqual(CORRECTIONS.map((c) => c.id), ["toque", "defesa", "saque", "ataque"]);
  for (const c of CORRECTIONS) {
    assert.equal(c.reviewed, false);
    for (const side of [c.erro, c.certo]) {
      assert.ok(side.text.length > 0);
      assert.ok(side.path.startsWith("M"));
      assert.ok(side.players.length > 0);
      assert.ok(side.players.every((x) => typeof x === "number" && x >= 0 && x <= 200));
    }
    assert.equal(c.erro.path.split(" ").slice(0, 2).join(" "), c.certo.path.split(" ").slice(0, 2).join(" "));
  }
});

test("saque e ataque: o erro termina na rede", () => {
  for (const id of ["saque", "ataque"]) {
    const c = CORRECTIONS.find((i) => i.id === id);
    const nums = c.erro.path.match(/-?\d+(\.\d+)?/g).map(Number);
    const [x, y] = nums.slice(-2);
    assert.ok(Math.abs(x - 100) <= 2);
    assert.ok(y >= 56 && y <= 100);
  }
});

test("visibleCorrections", () => {
  assert.deepEqual(visibleCorrections(CORRECTIONS, false), []);
  assert.equal(visibleCorrections(CORRECTIONS, true).length, 4);
});

test("clampCut", () => {
  assert.equal(clampCut(NaN), 50);
  assert.equal(clampCut(-3), 0);
  assert.equal(clampCut(140), 100);
  assert.equal(clampCut(42), 42);
});

test("stepCut", () => {
  assert.equal(stepCut(50, "ArrowRight"), 55);
  assert.equal(stepCut(98, "ArrowRight"), 100);
  assert.equal(stepCut(3, "ArrowLeft"), 0);
  assert.equal(stepCut(50, "Home"), 0);
  assert.equal(stepCut(50, "End"), 100);
  assert.equal(stepCut(50, "a"), null);
});
