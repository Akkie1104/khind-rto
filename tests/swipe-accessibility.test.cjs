/* WCAG 2.2 AA interaction regression checks; deterministic DOM simulation. */
"use strict";
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const script = fs.readFileSync("swipe-shop.js", "utf8");
const css = fs.readFileSync("swipe-shop.css", "utf8");
const catalogue = fs.readFileSync("catalogue.js", "utf8");
const check = (label, actual) => {
  assert.ok(actual, label);
  console.log("PASS " + label);
};
const routes = ["pilih", "pilih-b", "pilih-c"];
for (const route of routes) {
  const html = fs.readFileSync(route + "/index.html", "utf8");
  check(route + ": visible Skip, Save, Undo, and Details sheet",
    ["skip-button", "save-button", "undo-button", "details-sheet"]
      .every(id => html.includes('id="' + id + '"')));
  check(route + ": accessible status and nonvisual progress",
    html.includes('id="live-message"') &&
    html.includes('role="status"') &&
    html.includes('aria-live="polite"') &&
    html.includes('role="progressbar"'));
  check(route + ": visible keyboard instruction and same shared assets",
    html.includes('id="swipe-instructions"') &&
    html.includes("../swipe-shop.js?v=6") &&
    html.includes("../swipe-shop.css?v=6"));
}
check("WCAG 2.2 AA target minimum, 44 CSS px implementation",
  css.includes("min-height:2.75rem") &&
  css.includes(".home-link,.saved-indicator,.details-button") &&
  css.includes(".action-row{gap:max(.5rem,8px)}") &&
  css.includes(".rescue-options{gap:max(.5rem,8px)}"));
check("Visible focus indicators on buttons, links and card",
  css.includes(":where(a,button,[tabindex]):focus-visible") &&
  css.includes("outline:3px solid #ffe17a") &&
  css.includes("#completion-title:focus"));
check("Reduced motion and high zoom / narrow height reflow",
  css.includes("@media(prefers-reduced-motion:reduce)") &&
  css.includes("body{height:auto;min-height:100dvh;overflow-x:hidden;overflow-y:auto}") &&
  css.includes(".product-card{overflow-y:auto;overflow-x:hidden"));
check("Skip and Save distinguishable by text and icons",
  script.includes('t("skip").toUpperCase()') && script.includes('t("save").toUpperCase()') &&
  fs.readFileSync("pilih/index.html","utf8").includes("✕</span> Langkau") &&
  fs.readFileSync("pilih/index.html","utf8").includes("♥</span> Simpan"));
check("No long-press or multi-touch requirement, swipe operates on pointerup",
  script.includes('card.addEventListener("pointerup"') &&
  script.includes('commitDecision(dx > 0, false, "gesture")') &&
  script.includes("event.isPrimary === false") &&
  script.includes('$("skip-button").addEventListener("click"') &&
  script.includes('$("save-button").addEventListener("click"'));

class Element {
  constructor(id) {
    this.id = id; this.textContent = ""; this._html = "";
    this.hidden = false; this.disabled = false; this.focused = false;
    this.children = new Map(); this.listeners = {}; this.attributes = {};
    this.style = { setProperty() {}, removeProperty() {} };
    this.classList = { add() {}, remove() {} };
    this.clientWidth = 390; this.open = false; this.inert = false;
  }
  set innerHTML(value) { this._html = value; this.children.clear(); }
  get innerHTML() { return this._html; }
  addEventListener(type, cb) { this.listeners[type] = cb; }
  querySelector(selector) {
    if (!this.children.has(selector)) this.children.set(selector, new Element(selector));
    return this.children.get(selector);
  }
  querySelectorAll() { return []; }
  setAttribute(name, val) { this.attributes[name] = val; }
  getAttribute(name) { return this.attributes[name] ?? null; }
  focus() { this.focused = true; }
  showModal() { this.open = true; }
  close() { this.open = false; }
  click() { this.listeners.click?.({ target: this }); }
}
function createApp() {
  const map = new Map();
  function get(id) {
    if (!map.has(id)) map.set(id, new Element(id));
    return map.get(id);
  }
  const document = {
    getElementById: get, querySelector: get,
    documentElement: { getAttribute() { return null; } }
  };
  const window = {
    matchMedia: () => ({ matches: true }),
    setTimeout: () => { throw new Error("Animations must be bypassed under prefers-reduced-motion"); }
  };
  const ctx = vm.createContext({ document, window, URL });
  vm.runInContext(catalogue, ctx);
  vm.runInContext(script, ctx);
  return { get, card: () => get("card-slot").querySelector("#active-card") };
}

const app = createApp();
const { get } = app;
check("First card is announced programmatically with keyboard description",
  app.card().innerHTML === "" &&
  get("card-slot").innerHTML.includes('aria-describedby="swipe-instructions"') &&
  get("card-slot").innerHTML.includes('aria-keyshortcuts="ArrowLeft ArrowRight"'));
check("Skip Save buttons dynamically identify active product",
  get("skip-button").getAttribute("aria-label").includes("WM1248") === false &&
  get("skip-button").getAttribute("aria-label").includes("Mesin basuh") &&
  get("save-button").getAttribute("aria-label").includes("Mesin basuh"));
check("Progress contains spoken fraction",
  get("progress-track").getAttribute("aria-valuetext") === "0 daripada 13 produk telah dilihat");
const initial = app.card();
let prevented = false;
initial.listeners.keydown({
  target: initial, key: "ArrowLeft",
  preventDefault() { prevented = true; }
});
check("ArrowLeft skips with no gesture and prevents unwanted scrolling",
  prevented && get("deck-position").textContent === "Pilihan 2");
check("Keyboard skip keeps focus on the replacement card", app.card().focused);
check("Status announces action and next card facts",
  get("live-message").textContent.includes("Dilangkau:") &&
  get("live-message").textContent.includes("Seterusnya, 2 daripada 13:") &&
  get("live-message").textContent.includes("sebulan") &&
  get("live-message").textContent.includes("bulan"));
check("Progress updates for new card", get("progress-track").getAttribute("aria-valuenow") === "1");
const second = app.card();
second.listeners.keydown({ target: second, key: "ArrowRight", preventDefault() {} });
check("ArrowRight saves via keyboard and moves to next card",
  get("saved-count").textContent === "1" && get("deck-position").textContent === "Pilihan 3");
check("New card refocused after keyboard Save", app.card().focused);
check("Status announces save plus next card", get("live-message").textContent.includes("Disimpan:") &&
  get("live-message").textContent.includes("1 produk disimpan"));
get("undo-button").click();
check("Undo restores previous card, accessible focus, count and feedback",
  get("saved-count").textContent === "0" &&
  get("deck-position").textContent === "Pilihan 2" &&
  app.card().focused &&
  get("live-message").textContent.includes("Tindakan dibatalkan"));
get("card-slot").querySelector("#details-button").click();
check("Details remains keyboard-operable native modal", get("details-sheet").open);
get("details-sheet").close();
get("save-button").click();
check("Tap/click Save alternative is operational", get("saved-count").textContent === "1");
get("skip-button").click();
check("Tap/click Skip alternative is operational", get("deck-position").textContent === "Pilihan 4");
get("undo-button").click();
check("Tap/click Undo alternative restores last skipped card", get("deck-position").textContent === "Pilihan 3");

// Second saved product offers a keyboard-focusable decision prompt and inerts the card.
get("save-button").click();
check("Two-save prompt gets focus and background card becomes inert",
  get("decision-prompt").querySelector("#compare-now").focused &&
  get("card-slot").inert &&
  get("skip-button").disabled && get("save-button").disabled);
get("decision-prompt").querySelector("#keep-swiping").click();
check("After prompt, card is operable and focused", !get("card-slot").inert && app.card().focused);
let guard=0;
while(get("deck-position").textContent !== "Selesai" && guard++<30) {
  if (!get("rescue-question").hidden) get("rescue-question").querySelector("#rescue-skip").click();
  get("skip-button").click();
}
check("End of deck uses focusable completion heading and status",
  get("deck-position").textContent === "Selesai" &&
  get("deck-complete").innerHTML.includes('id="completion-title" tabindex="-1"') &&
  get("deck-complete").querySelector("#completion-title").focused &&
  get("live-message").textContent.includes("Semua produk telah dilihat"));
get("undo-button").click();
check("Undo after completion restores focused product", app.card().focused);
console.log("Swipe card accessibility regression checks passed.");
