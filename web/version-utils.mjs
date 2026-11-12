/** Reine Hilfsfunktionen: im Browser und mit Node.js testbar. */
export function readPublishedSha(value) {
  if (!value || typeof value !== "object" ||
      typeof value.sha !== "string" || !/^[a-f0-9]{40}$/i.test(value.sha)) {
    throw new Error("Die Versionsdatei enthält keine gültige Commit-ID.");
  }
  return value.sha.toLowerCase();
}

export function hasNewVersion(publishedSha, loadedSha) {
  return publishedSha !== loadedSha;
}

export function pdfUrlForVersion(baseUrl, sha) {
  const validSha = readPublishedSha({ sha });
  const result = new URL("dokument.pdf", baseUrl);
  result.searchParams.set("v", validSha);
  return result.toString();
}

export function clampPage(page, pageCount) {
  const max = Math.max(1, Number.isFinite(pageCount) ? Math.floor(pageCount) : 1);
  return Math.min(max, Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1));
}

export function clampFraction(value) {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}
