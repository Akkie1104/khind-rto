/* Regression tests for A/B entry variants; no browser dependency. */
"use strict";
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");

const controlMarkup = fs.readFileSync("pilih/index.html", "utf8");
const variantMarkup = fs.readFileSync("pilih-b/index.html", "utf8");
const script = fs.readFileSync("swipe-shop.js", "utf8");
const catalogue = fs.readFileSync("catalogue.js", "utf8");
const css = fs.readFileSync("swipe-variant-b.css", "utf8");
const options = [
  ["washing", "Mesin basuh", ["WM1248", "WD1468", "WM150A", "WD1438"]],
  ["fridge", "Peti sejuk", ["RFS600A", "RFM466A", "RF480"]],
  ["cooling", "Penyaman udara", ["ACSON-1.0", "ACSON-1.5", "ACSON-2.0"]],
  ["all", "Lihat semua", null]
];

class Element {
  constructor(id) {
    this.id = id;
    this._html = "";
    this.textContent = "";
    this.hidden = false;
    this.disabled = false;
    this.open = false;
    this.listeners = {};
    this.children = new Map();
    this.clientWidth = 390;
    this.attributes = {};
    this.style = { setProperty() {}, removeProperty() {} };
    this.classList = { add() {}, remove() {} };
  }
  set innerHTML(value) { this._html = value; this.children.clear(); }
  get innerHTML() { return this._html; }
  addEventListener(event, callback) { this.listeners[event] = callback; }
  querySelector(selector) {
    if (!this.children.has(selector)) this.children.set(selector, new Element(selector));
    return this.children.get(selector);
  }
  querySelectorAll() { return []; }
  setAttribute(key, value) { this.attributes[key] = value; }
  getAttribute(key) { return this.attributes[key] ?? null; }
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
  const choices = options.map(([value]) => {
    const button = new Element(value);
    button.attributes["data-deck-choice"] = value;
    return button;
  });
  get("one-question-gate").querySelectorAll = selector => selector === "[data-deck-choice]" ? choices : [];
  const removedClasses = [];
  const document = {
    getElementById: get,
    querySelector: get,
    documentElement: { getAttribute: key => key === "data-swipe-variant" && variant ? "one-question" : null },
    body: { classList: { remove: name => removedClasses.push(name) } }
  };
  const window = { matchMedia: () => ({ matches: true }), setTimeout: callback => callback() };
  const context = vm.createContext({ document, window, URL, console });
  vm.runInContext(catalogue, context, { filename: "catalogue.js" });
  vm.runInContext(script, context, { filename: "swipe-shop.js" });
  const idOnCard = () => {
    if (get("card-slot").hidden) return null;
    const match = get("card-slot").innerHTML.match(/class="photo-topline"><span>KOLEKSI KHIND RTO<\/span><span>([^<]+)<\/span>/);
    return match ? match[1] : null;
  };
  return { get, choices, removedClasses, idOnCard };
}

function verify(name, condition) {
  assert.ok(condition, name);
  console.log("PASS " + name);
}

verify("control has no question or choice gate", !controlMarkup.includes('id="one-question-gate"'));
const gateHtml = variantMarkup.split('<section id="one-question-gate"')[1]?.split('</section>')[0] ?? "";
verify("variant asks exactly one question", gateHtml.includes("Apa yang anda cari hari ini?") &&
  (gateHtml.match(/\?/g) || []).length === 1);
verify("variant offers exactly four accessible buttons", (gateHtml.match(/<button type="button" data-deck-choice=/g) || []).length === 4 &&
  options.every(([key, label]) => gateHtml.includes('data-deck-choice="' + key + '"') && gateHtml.includes(label)));
verify("variant uses shared assets with no product duplication",
  variantMarkup.includes("../swipe-shop.js?v=20261023-2") &&
  variantMarkup.includes("../catalogue.js?v=20261022-4") &&
  variantMarkup.includes("../swipe-shop.css?v=11"));
verify("question fits short mobile viewports", css.includes("@media(max-height:620px)") &&
  css.includes("@media(max-width:370px)"));

const control = launch(false);
verify("control starts with product immediately", control.idOnCard() === "WM1248");

for (const [key, label, expected] of options) {
  const app = launch(true);
  verify(label + ": no card before initial tap", !app.idOnCard() && !app.get("one-question-gate").hidden);
  const button = app.choices.find(b => b.getAttribute("data-deck-choice") === key);
  button.click();
  verify(label + ": one tap opens first product", app.get("one-question-gate").hidden &&
    app.removedClasses.includes("awaiting-choice") && !!app.idOnCard());
  const actual = [];
  let guard = 0;
  while (app.idOnCard() && guard++ < 35) {
    actual.push(app.idOnCard());
    app.get("skip-button").click();
    if (!app.get("rescue-question").hidden) app.get("rescue-question").querySelector("#rescue-skip").click();
  }
  verify(label + ": correct category, no dryer-only cards",
    expected ? actual.join(",") === expected.join(",") :
      actual.length === 23 && actual[0] === "WM1248" && actual[1] === "RFS600A");
  verify(label + ": deck completes and Skip button disables",
    app.get("deck-position").textContent === "Selesai" && app.get("skip-button").disabled);
}

const app = launch(true);
app.choices.find(b => b.getAttribute("data-deck-choice") === "washing").click();
app.get("card-slot").querySelector("#details-button").click();
verify("details preserved for B", app.get("details-sheet").open &&
  app.get("details-body").innerHTML.includes("Standard"));
app.get("details-sheet").close();
app.get("save-button").click();
verify("Save preserved for B", app.get("saved-count").textContent === "1");
app.get("undo-button").click();
verify("Undo preserved for B", app.get("saved-count").textContent === "0" && app.idOnCard() === "WM1248");
app.get("save-button").click();
app.get("save-button").click();
verify("after two saved, B retains Compare, Keep swiping, Ask Hakim",
  app.get("decision-prompt").innerHTML.includes("Bandingkan") &&
  app.get("decision-prompt").innerHTML.includes("Teruskan lihat produk") &&
  app.get("decision-prompt").innerHTML.includes("Tanya Hakim"));
verify("no second question at two-save prompt", app.get("decision-prompt").innerHTML.includes("<h2>Pilihan anda sudah sedia.</h2>") && !app.get("decision-prompt").innerHTML.includes("Dah jumpa yang menarik?"));
app.get("decision-prompt").querySelector("#compare-now").click();
verify("factual shortlist works in B", !app.get("compare-view").hidden && app.get("compare-view").innerHTML.includes("compare-grid") && app.get("compare-view").innerHTML.includes("compare-item"));
console.log("Experiment B checks passed.");
