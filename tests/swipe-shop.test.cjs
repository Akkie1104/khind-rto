/* Dependency-free behaviour smoke tests for the independently hosted swipe shop. */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

class Element {
  constructor(id) {
    this.id = id;
    this._html = "";
    this.textContent = "";
    this.listeners = {};
    this.children = new Map();
    this.open = false;
    this.hidden = false;
    this.disabled = false;
    this.attributes = {};
    this.clientWidth = 390;
    this.style = { setProperty() {}, removeProperty() {} };
    this.classList = { add() {}, remove() {} };
  }
  set innerHTML(value) { this._html = value; this.children.clear(); }
  get innerHTML() { return this._html; }
  addEventListener(type, listener) { this.listeners[type] = listener; }
  querySelector(selector) {
    if (!this.children.has(selector)) this.children.set(selector, new Element(selector));
    return this.children.get(selector);
  }
  querySelectorAll() { return []; }
  setAttribute(name, value) { this.attributes[name] = value; }
  showModal() { this.open = true; }
  close() { this.open = false; }
  click() { if (this.listeners.click) this.listeners.click({ target: this }); }
}

const elements = new Map();
function get(id) {
  if (!elements.has(id)) elements.set(id, new Element(id));
  return elements.get(id);
}
const document = { getElementById: get, querySelector: get };
const window = {
  matchMedia: () => ({ matches: true }),
  setTimeout: callback => callback()
};
const context = vm.createContext({ document, window, URL, console });
vm.runInContext(fs.readFileSync("catalogue.js", "utf8"), context, { filename: "catalogue.js" });
vm.runInContext(fs.readFileSync("swipe-shop.js", "utf8"), context, { filename: "swipe-shop.js" });

const check = (name, condition) => {
  assert.ok(condition, name);
  console.log("PASS " + name);
};
check("catalogue loads", window.KHIND_PRODUCTS.length === 23);
check("first screen is a real WM1248 product", get("card-slot").innerHTML.includes('class="product-card"') &&
  get("card-slot").innerHTML.includes("WM1248"));
check("official product photo is unchanged", get("card-slot").innerHTML.includes("WM1248_Front%20Left.jpg"));
get("card-slot").querySelector("#details-button").click();
check("Details opens native bottom sheet", get("details-sheet").open &&
  get("details-body").innerHTML.includes("Standard"));
get("details-sheet").close();

get("save-button").click();
check("Save increments saved and moves to second card", get("saved-count").textContent === "1" &&
  get("deck-position").textContent === "Pilihan 2");
get("skip-button").click();
check("Skip advances without saving", get("saved-count").textContent === "1" &&
  get("deck-position").textContent === "Pilihan 3");
get("undo-button").click();
check("Undo restores skipped card", get("deck-position").textContent === "Pilihan 2");
get("save-button").click();
check("second save offers all three actions", get("saved-count").textContent === "2" &&
  ["Banding produk", "Teruskan leret", "Tanya Hakim"].every(text =>
    get("decision-prompt").innerHTML.includes(text)));
get("decision-prompt").querySelector("#compare-now").click();
check("Compare shows exact saved models", get("compare-view").innerHTML.includes("WM1248") &&
  get("compare-view").innerHTML.includes("RFS600A"));
get("compare-view").querySelector("#compare-back").click();
get("undo-button").click();
check("Undo a saved card restores prior saved list", get("saved-count").textContent === "1" &&
  get("deck-position").textContent === "Pilihan 2");
get("save-button").click();
get("decision-prompt").querySelector("#keep-swiping").click();
check("Keep swiping returns to current deck", get("deck-position").textContent === "Pilihan 3" &&
  get("saved-count").textContent === "2");
get("saved-open").click();
check("Saved list offers product-specific agent WhatsApp", get("shortlist-sheet").open &&
  get("shortlist-body").innerHTML.includes("wa.me/60174201247") &&
  get("shortlist-body").innerHTML.includes("RFS600A"));
get("shortlist-sheet").close();

for (let i = 0; i < 30 && get("deck-position").textContent !== "Selesai"; i++) get("skip-button").click();
check("full deck can be traversed without account or form", get("deck-position").textContent === "Selesai" &&
  get("deck-complete").innerHTML.includes("Selesai meleret"));
get("undo-button").click();
check("Undo from the final card returns to deck", get("deck-position").textContent !== "Selesai");
console.log("Swipe shop behaviour smoke checks passed.");
