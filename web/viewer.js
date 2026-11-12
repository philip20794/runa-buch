import { getDocument, GlobalWorkerOptions } from "./vendor/pdf.mjs";
import {
  readPublishedSha, hasNewVersion, pdfUrlForVersion, clampPage, clampFraction
} from "./version-utils.mjs";

const baseUrl = new URL("./", import.meta.url);
GlobalWorkerOptions.workerSrc = new URL("vendor/pdf.worker.mjs", baseUrl).toString();

const reader = document.querySelector("#reader");
const pagesHost = document.querySelector("#pages");
const empty = document.querySelector("#empty");
const status = document.querySelector("#status");
const statusText = document.querySelector("#status-text");
const counter = document.querySelector("#page-counter");
const zoomLabel = document.querySelector("#zoom-label");
const refresh = document.querySelector("#refresh");
const download = document.querySelector("#download");
const zoomIn = document.querySelector("#zoom-in");
const zoomOut = document.querySelector("#zoom-out");
const zoomReset = document.querySelector("#zoom-reset");

let currentPdf = null;
let currentSha = null;
let observer = null;
let checking = false;
let working = false;
let zoom = 1;
let rafScheduled = false;
let lastPage = 1;

function setStatus(state, message) {
  status.dataset.state = state;
  statusText.textContent = message;
}

function setZoomLabel() {
  zoomLabel.textContent = Math.round(zoom * 100) + " %";
}

function getReadingPosition() {
  const list = pagesHost.querySelector(".page-list");
  if (!list) return { page: lastPage, fraction: 0 };
  const top = reader.getBoundingClientRect().top + 12;
  const nodes = list.children;
  for (let i = 0; i < nodes.length; i++) {
    const rect = nodes[i].getBoundingClientRect();
    if (rect.bottom > top) {
      return { page: i + 1, fraction: clampFraction((top - rect.top) / rect.height) };
    }
  }
  return { page: Math.max(1, nodes.length), fraction: 1 };
}

function updateCounter() {
  if (!currentPdf) return;
  lastPage = clampPage(getReadingPosition().page, currentPdf.numPages);
  counter.textContent = lastPage + " / " + currentPdf.numPages;
}

function queueCounterUpdate() {
  if (rafScheduled) return;
  rafScheduled = true;
  requestAnimationFrame(() => {
    rafScheduled = false;
    updateCounter();
  });
}

function renderWidth(firstPage) {
  const originalWidth = firstPage.getViewport({ scale: 1 }).width;
  const space = Math.max(180, reader.clientWidth - 32);
  return Math.round(Math.min(originalWidth * 1.4, space) * zoom);
}

async function drawPage(pdf, element, cssWidth) {
  if (element.dataset.rendering === "true" || element.dataset.rendered === "true") return;
  element.dataset.rendering = "true";
  try {
    const page = await pdf.getPage(Number(element.dataset.page));
    const natural = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: cssWidth / natural.width });
    const pixelScale = Math.min(window.devicePixelRatio || 1, 2);
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width * pixelScale);
    canvas.height = Math.ceil(viewport.height * pixelScale);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Canvas wird vom Browser nicht unterstützt.");
    await page.render({
      canvasContext: context,
      canvas,
      viewport,
      transform: [pixelScale, 0, 0, pixelScale, 0, 0]
    }).promise;
    if (element.dataset.rendering === "true") {
      element.style.aspectRatio = natural.width + " / " + natural.height;
      element.replaceChildren(canvas);
      element.dataset.rendered = "true";
    }
  } finally {
    delete element.dataset.rendering;
  }
}

async function prepareView(pdf, position) {
  const firstPage = await pdf.getPage(1);
  const natural = firstPage.getViewport({ scale: 1 });
  const cssWidth = renderWidth(firstPage);
  const list = document.createElement("div");
  list.className = "page-list";
  list.style.width = Math.max(reader.clientWidth, cssWidth + 28) + "px";
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = document.createElement("article");
    page.className = "pdf-page";
    page.dataset.page = String(n);
    page.setAttribute("aria-label", "Seite " + n);
    page.style.width = cssWidth + "px";
    page.style.aspectRatio = natural.width + " / " + natural.height;
    list.append(page);
  }
  const target = clampPage(position.page, pdf.numPages);
  await drawPage(pdf, list.children[target - 1], cssWidth);
  return { list, target, cssWidth };
}

function observePages(pdf, list, cssWidth) {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const element = entry.target;
      if (entry.isIntersecting) {
        if (element.dataset.rendered !== "true" && element.dataset.rendering !== "true") {
          void drawPage(pdf, element, cssWidth).catch((error) => {
            console.error("PDF-Seite kann nicht gerendert werden:", error);
            setStatus("error", "Seitenfehler – erneut scrollen");
          });
        }
      } else if (element.dataset.rendered === "true") {
        // Außerhalb des großzügigen Sichtbereichs Canvas-Speicher freigeben.
        element.replaceChildren();
        delete element.dataset.rendered;
      }
    }
  }, { root: reader, rootMargin: "800px 0px", threshold: 0 });
  for (const element of list.children) observer.observe(element);
}

async function installPdf(pdf, position) {
  const { list, target, cssWidth } = await prepareView(pdf, position);
  pagesHost.replaceChildren(list);
  empty.hidden = true;
  const targetPage = list.children[target - 1];
  reader.scrollTop = targetPage.offsetTop + targetPage.offsetHeight * clampFraction(position.fraction);
  observePages(pdf, list, cssWidth);
  lastPage = target;
  counter.textContent = target + " / " + pdf.numPages;
}

async function loadVersion(sha) {
  working = true;
  setStatus("loading", "Neue PDF wird geladen");
  refresh.disabled = true;
  const position = getReadingPosition();
  let pendingPdf = null;
  try {
    const url = pdfUrlForVersion(baseUrl, sha);
    const task = getDocument({
      url,
      cMapUrl: new URL("vendor/cmaps/", baseUrl).toString(),
      cMapPacked: true,
      standardFontDataUrl: new URL("vendor/standard_fonts/", baseUrl).toString()
    });
    pendingPdf = await task.promise;
    const oldPdf = currentPdf;
    await installPdf(pendingPdf, position);
    currentPdf = pendingPdf;
    currentSha = sha;
    pendingPdf = null;
    download.href = url;
    setStatus("ok", "Aktuell");
    if (oldPdf) void oldPdf.destroy().catch(console.warn);
  } catch (error) {
    console.error("Neue PDF konnte nicht geladen werden:", error);
    setStatus("error", "Aktualisierung fehlgeschlagen");
    if (!currentPdf) {
      empty.hidden = false;
      empty.textContent = "Die PDF konnte nicht geladen werden. Bitte GitHub Actions und GitHub Pages prüfen. Die Seite versucht es automatisch erneut.";
    }
  } finally {
    if (pendingPdf) void pendingPdf.destroy().catch(console.warn);
    working = false;
    refresh.disabled = false;
  }
}

async function checkVersion(force = false) {
  if (checking || working || (document.hidden && !force)) return;
  checking = true;
  try {
    const url = new URL("version.json", baseUrl);
    url.searchParams.set("check", String(Date.now()));
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error("Versionsabfrage: HTTP " + response.status);
    const sha = readPublishedSha(await response.json());
    if (hasNewVersion(sha, currentSha)) {
      await loadVersion(sha);
    } else if (currentPdf && status.dataset.state !== "ok") {
      setStatus("ok", "Aktuell");
    }
  } catch (error) {
    console.error("Versionsprüfung fehlgeschlagen:", error);
    setStatus("error", "Verbindung prüfen");
    if (!currentPdf) {
      empty.hidden = false;
      empty.textContent = "Noch keine veröffentlichte PDF erreichbar. Bitte GitHub Pages aktivieren und auf den ersten erfolgreichen Build warten.";
    }
  } finally {
    checking = false;
  }
}

async function adjustZoom(next) {
  if (!currentPdf || working || checking) return;
  const newZoom = Math.max(0.6, Math.min(3, Math.round(next * 10) / 10));
  if (newZoom === zoom) return;
  working = true;
  refresh.disabled = true;
  const position = getReadingPosition();
  const oldZoom = zoom;
  zoom = newZoom;
  try {
    await installPdf(currentPdf, position);
    setZoomLabel();
  } catch (error) {
    zoom = oldZoom;
    console.error("Zoom konnte nicht aktualisiert werden:", error);
    setStatus("error", "Zoom fehlgeschlagen");
  } finally {
    working = false;
    refresh.disabled = false;
  }
}

reader.addEventListener("scroll", queueCounterUpdate, { passive: true });
refresh.addEventListener("click", () => void checkVersion(true));
zoomIn.addEventListener("click", () => void adjustZoom(zoom + 0.2));
zoomOut.addEventListener("click", () => void adjustZoom(zoom - 0.2));
zoomReset.addEventListener("click", () => void adjustZoom(1));
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) void checkVersion(true);
});
window.addEventListener("focus", () => void checkVersion(true));
window.addEventListener("online", () => void checkVersion(true));
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (currentPdf && !working && !checking) {
      // Derselbe Zoomwert: Layout über kurzzeitigen Zoomwechsel neu berechnen.
      const position = getReadingPosition();
      working = true;
      void installPdf(currentPdf, position)
        .catch((error) => console.error("Fensteranpassung fehlgeschlagen:", error))
        .finally(() => { working = false; });
    }
  }, 200);
});

setZoomLabel();
void checkVersion(true);
setInterval(() => void checkVersion(), 15_000);
