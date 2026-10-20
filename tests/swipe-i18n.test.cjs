/* EN/BM state preservation across A/B/C guided-shopping variants. */
"use strict";
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const js = fs.readFileSync("swipe-shop.js", "utf8");
const catalogue = fs.readFileSync("catalogue.js", "utf8");
const check = (name, yes) => { assert.ok(yes, name); console.log("PASS " + name); };
class Element {
  constructor(id) {
    this.id = id; this._html = ""; this.textContent = ""; this.hidden = false;
    this.disabled = false; this.open = false; this.focused = false; this.scrollTop = 0;
    this.attributes = {}; this.listeners = {}; this.children = new Map();
    this.style = { setProperty() {}, removeProperty() {} };
    this.classList = { add() {}, remove() {} };
    this.clientWidth = 390; this.inert = false;
  }
  set innerHTML(v) { this._html = v; this.children.clear(); }
  get innerHTML() { return this._html; }
  querySelector(key) { if (!this.children.has(key)) this.children.set(key, new Element(key)); return this.children.get(key); }
  querySelectorAll() { return []; }
  addEventListener(key, fn) { this.listeners[key] = fn; }
  getAttribute(key) { return this.attributes[key] ?? null; }
  setAttribute(key, value) { this.attributes[key] = value; }
  focus() { this.focused = true; }
  showModal() { this.open = true; }
  close() { this.open = false; }
  click() { this.listeners.click?.({ target: this }); }
}
function launch(variant) {
  const elements = new Map();
  const get = id => {
    if (!elements.has(id)) elements.set(id, new Element(id));
    return elements.get(id);
  };
  const choices = ["washing", "fridge", "cooling", "all"].map(v => {
    const el = new Element(v); el.setAttribute("data-deck-choice", v); return el;
  });
  get("one-question-gate").querySelectorAll = selector => selector === "[data-deck-choice]" ? choices : [];
  const root = new Element("html");
  root.lang = "ms"; root.setAttribute("data-swipe-variant", variant || "");
  const doc = {
    title: "", documentElement: root, getElementById: get,
    querySelector: key => get(key), body: { classList: { remove() {} } }
  };
  const window = { matchMedia: () => ({ matches: true }), setTimeout: fn => fn() };
  const ctx = vm.createContext({ document: doc, window, URL, console });
  vm.runInContext(catalogue, ctx, { filename: "catalogue.js" });
  vm.runInContext(js, ctx, { filename: "swipe-shop.js" });
  const current = () => get("card-slot").hidden ? null :
    get("card-slot").innerHTML.match(/class="photo-topline"><span>[^<]+<\/span><span>([^<]+)<\/span>/)?.[1] || null;
  const chooseB = value => choices.find(x => x.getAttribute("data-deck-choice") === value).click();
  const chooseC = value => {
    const button = { getAttribute: key => key === "data-budget-choice" ? value : null };
    get("budget-options").listeners.click({ target: { closest: () => button } });
  };
  return { get, doc, current, chooseB, chooseC, items: window.KHIND_PRODUCTS };
}
for (const route of ["pilih", "pilih-b", "pilih-c"]) {
  const h = fs.readFileSync(route + "/index.html", "utf8");
  check(route + ": Malay document language on initial HTML", h.includes('<html lang="ms"'));
  check(route + ": language selector available outside and inside modal dialogs",
    ["language-main","language-details","language-shortlist"].every(id => h.includes('id="' + id + '"')));
  check(route + ": refreshed shared assets",
    h.includes("../swipe-shop.js?v=6") && h.includes("../swipe-shop.css?v=6"));
}

const a = launch(null);
check("A: initializes in Malay without added gate", a.doc.documentElement.lang === "ms" &&
  a.current() === "WM1248" && !a.get("one-question-gate").hidden &&
  a.doc.title.includes("Bantu saya pilih"));
check("A: initial visible shortcuts use Langkau/Simpan/Undur",
  a.get("skip-button").getAttribute("aria-label").includes("Langkau") &&
  a.get("undo-button").querySelector("span:last-child").textContent === "Undur");
a.get("save-button").click(); a.get("skip-button").click();
check("A: one saved and one skipped before switch",
  a.current() === "ACSON-1.0" && a.get("saved-count").textContent === "1" &&
  a.get("deck-position").textContent === "Pilihan 3");
a.get("language-main").click();
check("A: visible Skip button and active category translate to English",
  a.get("skip-button").innerHTML.includes("Skip") &&
  a.get("card-slot").innerHTML.includes("Aircond"));
check("A: language tag/title/description metadata switch to English",
  a.doc.documentElement.lang === "en" && a.doc.title.includes("Help me choose") &&
  a.get('meta[name="description"]').getAttribute("content").startsWith("Compare KHIND") &&
  a.get("language-main").textContent === "BM");
check("A: current product, position and saved list preserved",
  a.current() === "ACSON-1.0" && a.get("deck-position").textContent === "Pick 3" &&
  a.get("saved-count").textContent === "1" && a.get("skip-button").getAttribute("aria-label").includes("Skip"));
a.get("card-slot").querySelector("#details-button").click();
check("A: Details open in English for same current product",
  a.get("details-sheet").open && a.get("details-body").innerHTML.includes("ACSON-1.0") &&
  a.get("details-body").innerHTML.includes("Plans and regular monthly payments"));
a.get("details-body").scrollTop = 180;
a.get("language-details").click();
check("A: switching language inside Details keeps it open on same product",
  a.get("details-sheet").open && a.get("details-body").innerHTML.includes("ACSON-1.0") &&
  a.get("details-body").innerHTML.includes("Pelan & bayaran biasa") &&
  a.get("details-body").scrollTop === 180 && a.doc.documentElement.lang === "ms");
a.get("details-sheet").close();
a.get("undo-button").click();
check("A: undo restores skipped product after language change without losing save",
  a.current() === "RFS600A" && a.get("deck-position").textContent === "Pilihan 2" &&
  a.get("saved-count").textContent === "1");
a.get("saved-open").click();
check("A: shortlist opens with original saved product",
  a.get("shortlist-sheet").open && a.get("shortlist-body").innerHTML.includes("WM1248"));
a.get("language-shortlist").click();
check("A: shortlist stays open and is translated with original models/rates",
  a.get("shortlist-sheet").open && a.doc.documentElement.lang === "en" &&
  a.get("shortlist-title").textContent === "Your picks" &&
  a.get("shortlist-body").innerHTML.includes("WM1248") &&
  a.get("shortlist-body").innerHTML.includes("RM85/month") &&
  a.get("shortlist-body").innerHTML.includes("View details") &&
  a.get("shortlist-footer").innerHTML.includes("Ask Hakim about these"));
a.get("shortlist-body").querySelector("#saved-details-0").click();
check("A: saved product Details opens, separate from active RFS600A",
  a.get("details-sheet").open && a.get("details-body").innerHTML.includes("WM1248") &&
  !a.get("shortlist-sheet").open);
a.get("language-details").click();
check("A: saved product Details survives language switch",
  a.get("details-sheet").open && a.get("details-body").innerHTML.includes("WM1248") &&
  a.doc.documentElement.lang === "ms");
a.get("details-sheet").close();
a.get("details-sheet").listeners.close?.();
check("A: closing saved product Details reopens localized shortlist",
  a.get("shortlist-sheet").open && a.get("shortlist-title").textContent === "Pilihan anda");
a.get("shortlist-footer").querySelector("#shortlist-continue").click();
check("A: Keep swiping returns to same product and position",
  a.current() === "RFS600A" && a.get("deck-position").textContent === "Pilihan 2");

const b = launch("one-question");
check("B: category gate remains open in Malay before first choice",
  b.current() === null && b.get("one-question-title").textContent === "Apa yang anda cari hari ini?");
b.get("language-main").click();
check("B: category choice gate translates without proceeding to deck",
  b.current() === null && b.doc.documentElement.lang === "en" &&
  b.get("one-question-title").textContent === "What are you looking for today?" &&
  b.get("gate-option-washing").textContent === "Washing machine");
b.chooseB("washing");
check("B: category choice still restricts deck after switching languages",
  b.current() === "WM1248" && b.get("one-question-gate").hidden);
b.get("skip-button").click();
b.get("language-main").click();
check("B: chosen category and skipped product remain unchanged on switch",
  b.current() === "WD1468" && b.get("deck-position").textContent === "Pilihan 2");

const c = launch("budget-first");
check("C: budget gate initializes in Malay with live catalogue bands",
  c.current() === null && c.get("budget-question-title").textContent.includes("bajet bulanan") &&
  c.get("budget-options").innerHTML.includes("Tak pasti") &&
  c.get("budget-options").innerHTML.includes("RM70"));
c.get("language-main").click();
check("C: budget question/ranges translate but prices stay unchanged",
  c.current() === null && c.get("budget-question-title").textContent === "What monthly amount feels comfortable?" &&
  c.get("budget-options").innerHTML.includes("Not sure") &&
  c.get("budget-options").innerHTML.includes("RM70"));
c.chooseC("1");
const selectedProduct = c.current();
const before = c.get("card-slot").innerHTML;
c.get("language-main").click();
check("C: selected budget and active plan rate are preserved on translation",
  c.current() === selectedProduct && c.get("card-slot").innerHTML.includes("KADAR BULANAN BIASA") &&
  c.get("card-slot").innerHTML.includes(before.match(/RM[\d,.]+/)?.[0] || "__missing"));
c.get("save-button").click();
const next = c.current();
c.get("language-main").click();
check("C: budget priority and saved choice survive further switching",
  c.current() === next && c.get("saved-count").textContent === "1" &&
  c.get("deck-position").textContent.startsWith("Pick "));
c.get("saved-open").click();
check("C: chosen plan and tenure appear in English shortlist",
  c.get("shortlist-body").innerHTML.includes("Regular monthly amount") &&
  c.get("shortlist-body").innerHTML.includes("Term") &&
  c.get("shortlist-body").innerHTML.includes("months"));
console.log("Bilingual guided shopping regression checks passed.");
