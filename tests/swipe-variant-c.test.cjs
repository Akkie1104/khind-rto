/* Budget-first experimental variant C: source-driven bands and shared swipe regressions. */
"use strict";
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const htmlA = fs.readFileSync("pilih/index.html", "utf8");
const htmlB = fs.readFileSync("pilih-b/index.html", "utf8");
const htmlC = fs.readFileSync("pilih-c/index.html", "utf8");
const cssC = fs.readFileSync("swipe-variant-c.css", "utf8");
const catalogueJS = fs.readFileSync("catalogue.js", "utf8");
const shopJS = fs.readFileSync("swipe-shop.js", "utf8");

class Element {
  constructor(id) {
    this.id = id;
    this._html = "";
    this.textContent = "";
    this.hidden = false;
    this.disabled = false;
    this.listeners = {};
    this.children = new Map();
    this.clientWidth = 390;
    this.style = { setProperty() {}, removeProperty() {} };
    this.classList = { add() {}, remove() {} };
    this.attributes = {};
    this.open = false;
  }
  set innerHTML(value) { this._html = value; this.children.clear(); }
  get innerHTML() { return this._html; }
  addEventListener(event, handler) { this.listeners[event] = handler; }
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
function launch(variant, modifyCatalogue) {
  const elements = new Map();
  const get = id => {
    if (!elements.has(id)) elements.set(id, new Element(id));
    return elements.get(id);
  };
  const document = {
    getElementById: get,
    querySelector: get,
    documentElement: { getAttribute: key => key === "data-swipe-variant" ? variant : null },
    body: { classList: { remove() {} } }
  };
  const window = { matchMedia: () => ({ matches: true }), setTimeout: callback => callback() };
  const context = vm.createContext({ document, window, URL, console });
  vm.runInContext(catalogueJS, context, { filename: "catalogue.js" });
  modifyCatalogue?.(window.KHIND_PRODUCTS);
  vm.runInContext(shopJS, context, { filename: "swipe-shop.js" });
  const currentCard = () => get("card-slot").hidden ? "" : get("card-slot").innerHTML;
  const code = () => {
    const match = currentCard().match(/class="photo-topline"><span>KOLEKSI KHIND RTO<\/span><span>([^<]+)<\/span>/);
    return match?.[1] || null;
  };
  const choose = key => {
    const button = { getAttribute: attr => attr === "data-budget-choice" ? String(key) : null };
    get("budget-options").listeners.click?.({ target: { closest: () => button } });
  };
  const cards = () => {
    const results = [];
    let guard = 0;
    while (code() && guard++ < 30) {
      const id = code();
      const product = window.KHIND_PRODUCTS.find(p => p.id === id);
      results.push({ id, html: currentCard(), product });
      get("skip-button").click();
      if (!get("rescue-question").hidden) get("rescue-question").querySelector("#rescue-skip").click();
    }
    return results;
  };
  return { get, choose, code, cards, currentCard, products: window.KHIND_PRODUCTS };
}
function check(name, passed) {
  assert.ok(passed, name);
  console.log("PASS " + name);
}
const gate = htmlC.split('<section id="budget-question-gate"')[1]?.split("</section>")[0] || "";
check("C has exactly one preproduct question", gate.includes("Berapakah bajet bulanan yang selesa untuk anda?") &&
  (gate.match(/\?/g) || []).length === 1 && !gate.includes("<form"));
check("C starts without a hardcoded price", !/RM\d/.test(gate));
check("C preserves independent agent, no approval promise", gate.includes("bukan semakan kelayakan atau kelulusan pinjaman") &&
  htmlC.includes("bukan KHIND HQ"));
check("C uses source catalogue and common swipe controls",
  htmlC.includes("../catalogue.js?v=20261022-4") &&
  htmlC.includes("../swipe-shop.js?v=20261023-1") &&
  htmlC.includes('id="skip-button"') &&
  htmlC.includes('id="save-button"') &&
  htmlC.includes('id="undo-button"') &&
  htmlC.includes('id="details-sheet"'));
const rf480App = launch("budget-first");
rf480App.choose(1);
const rf480Card = rf480App.cards().find(card => card.id === "RF480");
check("RF480 card separates its dated three-month RTO offer from regular total",
  !!rf480Card && rf480Card.html.includes("RM47.50/bulan selama 3 bulan") &&
  rf480Card.html.includes("RM95/bulan selama 57 bulan") &&
  rf480Card.html.includes("RM5,557.50") &&
  rf480Card.html.includes("pembundaran KHIND perlu disahkan") &&
  rf480Card.html.includes("Anggaran jumlah pada kadar biasa, sebelum promosi"));
const rf480Details = launch("budget-first");
rf480Details.choose(1);
let rf480Guard = 0;
while (rf480Details.code() !== "RF480" && rf480Details.code() && rf480Guard++ < 30) {
  rf480Details.get("skip-button").click();
  if (!rf480Details.get("rescue-question").hidden) {
    rf480Details.get("rescue-question").querySelector("#rescue-skip").click();
  }
}
rf480Details.get("card-slot").querySelector("#details-button").click();
check("RF480 details calculate both plan totals from the same three-month source data",
  rf480Details.get("details-body").innerHTML.includes("RM4,387.50") &&
  rf480Details.get("details-body").innerHTML.includes("RM5,557.50") &&
  rf480Details.get("details-body").innerHTML.includes("jika layak"));
const rf480Compare = launch("budget-first");
rf480Compare.choose(1);
let rf480CompareGuard = 0;
while (rf480Compare.code() !== "RF480" && rf480Compare.code() && rf480CompareGuard++ < 30) {
  rf480Compare.get("skip-button").click();
  if (!rf480Compare.get("rescue-question").hidden) {
    rf480Compare.get("rescue-question").querySelector("#rescue-skip").click();
  }
}
rf480Compare.get("save-button").click();
rf480Compare.get("save-button").click();
rf480Compare.get("decision-prompt").querySelector("#compare-now").click();
check("RF480 comparison retains the selected plan promotion and estimate",
  rf480Compare.get("compare-view").innerHTML.includes("RM47.50/bulan selama 3 bulan") &&
  rf480Compare.get("compare-view").innerHTML.includes("RM5,557.50"));
check("A and B entry points remain distinct", !htmlA.includes("budget-question-gate") &&
  !htmlB.includes("budget-question-gate"));
check("C retains mobile-specific design", cssC.includes("max-width:370px") &&
  cssC.includes("max-height:620px") &&
  cssC.includes("prefers-reduced-motion:reduce"));

const unsorted = launch("budget-first");
check("C does not render a product before optional tap",
  !unsorted.code() && !!unsorted.get("budget-options").innerHTML);
const choices = unsorted.get("budget-options").innerHTML;
const bands = [...choices.matchAll(/data-budget-choice="(\d+)"[\s\S]*?<span class="budget-amount">(RM[\d,.]+)(?: – (RM[\d,.]+))?/g)]
  .map(match => ({ index: Number(match[1]), low: match[2], high: match[3] ?? match[2] }));
const listed = unsorted.products.filter(p => p.image && p.plans?.length &&
  /^\d{4}-\d{2}-\d{2}$/.test(p.verifiedDate || "") &&
  /^https:\/\/(?:www\.khindrto\.com\.my|easyr2o\.khind\.com\.my)\//i.test(p.source || ""));
const regularRates = new Set(listed.flatMap(p => p.plans.map(q => Number(q.rate))));
const sourceAmounts = value => "RM" + Number(value).toLocaleString("en-MY", { maximumFractionDigits: 2 });
check("C generates three broad bands from real rates", bands.length === 3 &&
  bands.every(b => [...regularRates].some(r => sourceAmounts(r) === b.low) &&
                   [...regularRates].some(r => sourceAmounts(r) === b.high)));
check("C rates derive expected current bands", bands.map(b => b.low + "–" + b.high).join(";") ===
  "RM70–RM85;RM95–RM105;RM115–RM135");
check("C always offers Not sure", choices.includes('data-budget-choice="unsure"'));

const control = launch(null);
const controlProducts = control.cards().map(x => x.id);
const unsure = launch("budget-first");
unsure.choose("unsure");
check("Not sure immediately opens full control deck", unsure.cards().map(x => x.id).join(",") === controlProducts.join(","));

for (const band of bands) {
  const app = launch("budget-first");
  app.choose(band.index);
  check("Band " + band.index + " opens card in one tap", !!app.code() &&
    app.get("budget-question-gate").hidden);
  const cards = app.cards();
  check("Band " + band.index + " includes all dated individual products", cards.length === listed.length);
  const selectedLow = Number(band.low.replace("RM", "").replace(/,/g, ""));
  const selectedHigh = Number(band.high.replace("RM", "").replace(/,/g, ""));
  const center = (selectedLow + selectedHigh) / 2;
  let lastDistance = -1;
  for (const { id, product, html } of cards) {
    const plan = product.plans.filter(q => q.rate > 0).sort((a, b) => {
      const outside = rate => rate < selectedLow ? selectedLow - rate : rate > selectedHigh ? rate - selectedHigh : 0;
      return outside(a.rate) - outside(b.rate) || Math.abs(a.rate - center) - Math.abs(b.rate - center) || a.rate - b.rate;
    })[0];
    const distance = plan.rate < selectedLow ? selectedLow - plan.rate : plan.rate > selectedHigh ? plan.rate - selectedHigh : 0;
    check("Price and tenure grounded in catalogue: " + band.index + " " + id,
      html.includes(sourceAmounts(plan.rate)) &&
      html.includes("KADAR BULANAN BIASA · " + plan.name) &&
      html.includes("<strong>" + product.months + "</strong><span>bulan</span>") &&
      distance >= lastDistance);
    lastDistance = distance;
  }
}
const mid = launch("budget-first");
mid.choose(1);
const midCards = mid.cards();
check("multi-plan product can show actual premium plan closest to band",
  midCards.some(x => x.id === "WM150A" && x.html.includes("KADAR BULANAN BIASA · Premium") &&
    x.html.includes("RM105")));
const app = launch("budget-first");
app.choose(2);
app.get("card-slot").querySelector("#details-button").click();
check("C Details opens source plan terms", app.get("details-sheet").open &&
  app.get("details-body").innerHTML.includes("Pelan & bayaran biasa"));
app.get("details-sheet").close();
app.get("save-button").click();
check("C Save increments saved counter", app.get("saved-count").textContent === "1");
app.get("undo-button").click();
check("C Undo restores saved counter", app.get("saved-count").textContent === "0");
app.get("save-button").click();
app.get("save-button").click();
check("C keeps two-save compare / keep swiping / Ask Hakim", ["Bandingkan", "Teruskan lihat produk", "Tanya Hakim"]
  .every(s => app.get("decision-prompt").innerHTML.includes(s)));
app.get("decision-prompt").querySelector("#compare-now").click();
check("C opens factual saved shortlist", !app.get("compare-view").hidden && app.get("compare-view").innerHTML.includes("compare-grid") && app.get("compare-view").innerHTML.includes("compare-item"));
const recalculated = launch("budget-first", products => { products.find(p => p.id === "SI6029BP").plans[0].rate = 65; });
check("bands recalculated when actual catalogue terms change",
  recalculated.get("budget-options").innerHTML.includes("RM65") &&
  !choices.includes("RM65"));
console.log("Experiment C budget-first checks passed.");
