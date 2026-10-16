/* Source-only mobile shortlist smoke tests — 1/2/3 saves, removals and actions. */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const script = fs.readFileSync("swipe-shop.js", "utf8");
const productData = fs.readFileSync("catalogue.js", "utf8");
const css = fs.readFileSync("swipe-shop.css", "utf8");
const check = (name, pass) => { assert.ok(pass, name); console.log("PASS " + name); };

class Element {
  constructor(id) {
    this.id = id; this.inner = ""; this.open = false; this.disabled = false; this.hidden = false;
    this.textContent = ""; this.focused = false; this.listeners = {}; this.children = new Map();
    this.attributes = {}; this.inert = false; this.clientWidth = 390;
    this.style = { setProperty() {}, removeProperty() {} };
    this.classList = { add() {}, remove() {} };
  }
  set innerHTML(html) { this.inner = html; this.children.clear(); }
  get innerHTML() { return this.inner; }
  querySelector(sel) {
    if (!this.children.has(sel)) this.children.set(sel, new Element(sel));
    return this.children.get(sel);
  }
  querySelectorAll() { return []; }
  addEventListener(event, handler) { this.listeners[event] = handler; }
  setAttribute(key, val) { this.attributes[key] = val; }
  getAttribute(key) { return this.attributes[key] ?? null; }
  showModal() { this.open = true; }
  close() { this.open = false; }
  focus() { this.focused = true; }
  click() { this.listeners.click?.({ target: this }); }
}
function run(variant = null, key = null) {
  const elements = new Map();
  const get = id => {
    if (!elements.has(id)) elements.set(id, new Element(id));
    return elements.get(id);
  };
  const options = ["washing", "fridge", "cooling", "all"].map(value => {
    const el = new Element(value); el.attributes["data-deck-choice"] = value; return el;
  });
  get("one-question-gate").querySelectorAll = sel => sel === "[data-deck-choice]" ? options : [];
  const document = {
    getElementById: get, querySelector: get,
    documentElement: { getAttribute: attr => attr === "data-swipe-variant" ? variant : null },
    body: { classList: { remove() {} } }
  };
  const window = { matchMedia: () => ({ matches: true }), setTimeout: fn => fn() };
  const ctx = vm.createContext({ document, window, URL, console });
  vm.runInContext(productData, ctx);
  vm.runInContext(script, ctx);
  if (variant === "one-question") options.find(x=>x.getAttribute("data-deck-choice") === key).click();
  if (variant === "budget-first") {
    const button = { getAttribute: attr => attr === "data-budget-choice" ? String(key) : null };
    get("budget-options").listeners.click({ target: { closest: () => button } });
  }
  const model = () => get("card-slot").hidden ? null :
    get("card-slot").innerHTML.match(/class="photo-topline"><span>KOLEKSI KHIND RTO<\/span><span>([^<]+)<\/span>/)?.[1] || null;
  const skip = () => {
    get("skip-button").click();
    if (!get("rescue-question").hidden) get("rescue-question").querySelector("#rescue-skip").click();
  };
  const open = () => get("saved-open").click();
  const save = () => get("save-button").click();
  const close = () => get("shortlist-footer").querySelector("#shortlist-continue").click();
  return { get, skip, save, open, close, model, products: window.KHIND_PRODUCTS };
}

for (const route of ["pilih", "pilih-b", "pilih-c"]) {
  const page = fs.readFileSync(route + "/index.html", "utf8");
  check(route + " has fullscreen shortlist with count, details, close and actions",
    page.includes('id="shortlist-sheet" class="bottom-sheet shortlist-screen"') &&
    page.includes('id="shortlist-count"') &&
    page.includes('id="shortlist-title" tabindex="-1"') &&
    page.includes('id="shortlist-body"') &&
    page.includes('id="shortlist-footer"') &&
    page.includes("../swipe-shop.js?v=4"));
}
check("Shortlist mobile styling supports 1–3, 44 px targets, reduced motion",
  css.includes(".shortlist-screen[open]") &&
  css.includes("height:100dvh") &&
  css.includes(".shortlist-cards{display:grid") &&
  css.includes("min-height:2.85rem") &&
  css.includes("@media(prefers-reduced-motion:reduce)"));
const a = run();
check("No shortlist appears before saving", !a.get("shortlist-sheet").open);
a.save(); a.open();
check("One saved product is rendered with source image", a.get("shortlist-sheet").open &&
  a.get("shortlist-count").textContent === "1 / 3" &&
  a.get("shortlist-body").innerHTML.includes('class="saved-product"') &&
  a.get("shortlist-body").innerHTML.includes("WM1248_Front%20Left.jpg"));
let html = a.get("shortlist-body").innerHTML;
check("One card shows every requested field as a factual label",
  ["Model", "Kategori", "Kapasiti / spesifikasi", "Kadar bulanan biasa",
   "Tempoh", "Promosi", "Ketersediaan"].every(key => html.includes("<dt>" + key + "</dt>")));
check("Model, category, 9kg specification and checked regular amount come from catalogue",
  html.includes("WM1248") &&
  html.includes("Laundry") &&
  html.includes("9kg · Basuh") &&
  html.includes("RM85/bulan") &&
  html.includes("Standard · 48 bulan") &&
  html.includes("Disemak 2026-10-12"));
check("Cash promotion does not imply an RTO monthly rate discount",
  html.includes("Promosi harga tunai direkodkan (RM3,000)") &&
  html.includes("status semasa perlu disahkan") &&
  html.includes("Promosi harga tunai tidak bermaksud diskaun pelan RTO"));
check("Unknown availability is stated as unknown, not in stock",
  html.includes("Status stok semasa tidak dinyatakan") &&
  !html.includes("Tersedia sekarang"));
check("No unsupported winning-product labels",
  !/TERBAIK|BEST CHOICE|#1 PICK/i.test(html));
check("One item offers all four actions", html.includes('id="saved-details-0"') &&
  html.includes('id="saved-remove-0"') &&
  a.get("shortlist-footer").innerHTML.includes("Keep swiping") &&
  a.get("shortlist-footer").innerHTML.includes("Ask Hakim about these") &&
  a.get("shortlist-footer").innerHTML.includes("wa.me/60174201247"));
a.get("shortlist-body").querySelector("#saved-details-0").click();
check("Details shows saved model and not currently active unrelated model",
  !a.get("shortlist-sheet").open && a.get("details-sheet").open &&
  a.get("details-body").innerHTML.includes("WM1248") &&
  a.get("details-body").innerHTML.includes("Standard"));
a.get("details-sheet").close();
a.get("details-sheet").listeners.close?.();
check("Closing details returns to shortlist", a.get("shortlist-sheet").open);
a.get("shortlist-body").querySelector("#saved-remove-0").click();
check("Remove empties the list and disables inquiry, not entire dialog",
  a.get("shortlist-count").textContent === "0 / 3" &&
  a.get("shortlist-body").innerHTML.includes("Tiada produk disimpan") &&
  a.get("shortlist-footer").innerHTML.includes('aria-disabled="true"') &&
  a.get("saved-count").textContent === "0");
a.get("shortlist-body").querySelector("#shortlist-undo-remove").click();
check("Undo remove restores the same saved model without a duplicate",
  a.get("shortlist-count").textContent === "1 / 3" &&
  (a.get("shortlist-body").innerHTML.match(/id="saved-remove-/g) || []).length === 1);
a.close();
check("Keep swiping returns to active deck and restores keyboard focus",
  !a.get("shortlist-sheet").open &&
  a.get("card-slot").querySelector("#active-card").focused);

const b = run();
b.save(); b.save();
check("2 saves still present original two-save choice prompt",
  b.get("decision-prompt").innerHTML.includes("Banding produk"));
b.get("decision-prompt").querySelector("#compare-now").click();
check("Compare now opens the new factual two-product shortlist",
  b.get("shortlist-sheet").open &&
  b.get("shortlist-count").textContent === "2 / 3" &&
  (b.get("shortlist-body").innerHTML.match(/class="saved-product"/g) || []).length === 2 &&
  b.get("shortlist-body").innerHTML.includes("RFS600A"));
check("WhatsApp enquiry includes both exact source model IDs",
  b.get("shortlist-footer").innerHTML.includes("WM1248%2C%20RFS600A"));
b.close();
b.save();
check("Third save reaches capacity and disables further Save", b.get("saved-count").textContent === "3" &&
  b.get("save-button").disabled &&
  b.get("save-button").innerHTML.includes("Penuh (3)"));
b.open();
check("Three saved appliances are shown without adding a Best badge",
  b.get("shortlist-count").textContent === "3 / 3" &&
  (b.get("shortlist-body").innerHTML.match(/class="saved-product"/g) || []).length === 3 &&
  !b.get("shortlist-body").innerHTML.includes("Pilihan terbaik"));
check("Three saved items all have independent View details and Remove buttons",
  (b.get("shortlist-body").innerHTML.match(/id="saved-details-/g) || []).length === 3 &&
  (b.get("shortlist-body").innerHTML.match(/id="saved-remove-/g) || []).length === 3);
b.get("shortlist-body").querySelector("#saved-remove-1").click();
check("Removing the middle product frees a save slot and updates counts",
  b.get("shortlist-count").textContent === "2 / 3" &&
  b.get("saved-count").textContent === "2" &&
  !b.get("save-button").disabled &&
  !b.get("shortlist-body").innerHTML.includes("<p>RFS600A</p>"));
b.close();
b.save();
check("A new product can replace a removed one", b.get("saved-count").textContent === "3" &&
  b.get("save-button").disabled);

const stock = run();
let guard=0;
while(stock.model()!=="WM150A" && guard++<13) stock.skip();
check("Stock-warning product can be reached without inventing availability", stock.model()==="WM150A");
stock.save(); stock.open();
check("Shortlist preserves exact stock warning from product data",
  stock.get("shortlist-body").innerHTML.includes("Stok terhad / menunggu stok. Sahkan kawasan dan tarikh."));

const promo = run();
while(promo.model()!=="WD1438" && guard++<32) promo.skip();
promo.save(); promo.open();
check("Missing promotion field is not claimed as an active promotion",
  promo.get("shortlist-body").innerHTML.includes("Tiada promosi disahkan dalam data."));

const cat = run("one-question", "fridge");
cat.save(); cat.open();
check("Category B uses the same shortlist and fridge source capacity",
  cat.get("shortlist-body").innerHTML.includes("592L · Penyimpanan makanan") &&
  cat.get("shortlist-body").innerHTML.includes("RM99/bulan"));

const budget = run("budget-first", "1");
budget.save(); budget.open();
const rate = budget.products.find(p=>p.id===budget.model());
check("Budget C uses the same factual shortlist with a valid plan and term",
  budget.get("shortlist-body").innerHTML.includes("Kadar bulanan biasa") &&
  budget.get("shortlist-body").innerHTML.includes("Disemak ") &&
  budget.get("shortlist-footer").innerHTML.includes("Ask Hakim about these"));
console.log("Factual shortlist smoke tests passed.");
