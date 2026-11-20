import test from "node:test";
import assert from "node:assert/strict";
import { labelAt } from "./cursor.js";

test("labelAt devolve null sem alvo", () => {
  assert.equal(labelAt(null), null);
});
test("labelAt lê data-cursor do ancestral mais próximo", () => {
  assert.equal(labelAt({ closest: () => ({ dataset: { cursor: "arraste" } }) }), "arraste");
});
test("labelAt devolve null quando nenhum ancestral marca", () => {
  assert.equal(labelAt({ closest: () => null }), null);
});
test("labelAt devolve null para alvo sem closest", () => {
  assert.equal(labelAt({}), null);
});
