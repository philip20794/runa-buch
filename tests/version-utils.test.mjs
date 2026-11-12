import test from "node:test";
import assert from "node:assert/strict";
import {
  readPublishedSha, hasNewVersion, pdfUrlForVersion, clampPage, clampFraction
} from "../web/version-utils.mjs";

const oldSha = "a".repeat(40);
const newSha = "b".repeat(40);

test("gültige Commit-ID wird normalisiert", () => {
  assert.equal(readPublishedSha({ sha: oldSha.toUpperCase() }), oldSha);
});
test("ungültige Versionen werden nicht akzeptiert", () => {
  for (const value of [null, {}, { sha: "main" }, { sha: "x".repeat(40) }]) {
    assert.throws(() => readPublishedSha(value));
  }
});
test("nur geänderte veröffentlichte Version löst ein Update aus", () => {
  assert.equal(hasNewVersion(oldSha, oldSha), false);
  assert.equal(hasNewVersion(newSha, oldSha), true);
  assert.equal(hasNewVersion(oldSha, null), true);
});
test("PDF-Adresse verwendet den GitHub-Pages-Unterpfad und Versionsparameter", () => {
  const url = new URL(pdfUrlForVersion("https://beispiel.github.io/buch/", newSha));
  assert.equal(url.pathname, "/buch/dokument.pdf");
  assert.equal(url.searchParams.get("v"), newSha);
});
test("Leseposition wird auf gültige Seiten und Anteile begrenzt", () => {
  assert.equal(clampPage(19, 3), 3);
  assert.equal(clampPage(-4, 3), 1);
  assert.equal(clampFraction(1.6), 1);
  assert.equal(clampFraction(-0.6), 0);
});
