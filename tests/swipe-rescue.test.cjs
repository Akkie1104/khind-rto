/* Deterministic shared-deck rescue tests. No browser, analytics or network. */
"use strict";
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const js = fs.readFileSync("swipe-shop.js", "utf8");
const source = fs.readFileSync("catalogue.js", "utf8");
const css = fs.readFileSync("swipe-shop.css", "utf8");

class Element {
  constructor(id) {
    this.id = id; this._html = ""; this.hidden = false; this.disabled = false;
    this.listeners = {}; this.children = new Map(); this.attributes = {};
    this.clientWidth = 390; this.open = false; this.textContent = "";
    this.style = { setProperty() {}, removeProperty() {} };
    this.classList = { add() {}, remove() {} };
  }
  set innerHTML(value) { this._html = value; this.children.clear(); }
  get innerHTML() { return this._html; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  querySelector(selector) {
    if (!this.children.has(selector)) this.children.set(selector, new Element(selector));
    return this.children.get(selector);
  }
  querySelectorAll() { return []; }
  setAttribute(name, value) { this.attributes[name] = value; }
  getAttribute(name) { return this.attributes[name] ?? null; }
  focus() { this.focused = true; }
  showModal() { this.open = true; }
  close() { this.open = false; }
  click() { this.listeners.click?.({ target: this }); }
}
function launch(variant = null, filter = "all", catalogueMutator) {
  const map = new Map();
  const get = id => {
    if (!map.has(id)) map.set(id, new Element(id));
    return map.get(id);
  };
  const categoryButtons = ["washing", "fridge", "cooling", "all"].map(category => {
    const button = new Element(category);
    button.setAttribute("data-deck-choice", category);
    return button;
  });
  get("one-question-gate").querySelectorAll = selector => selector === "[data-deck-choice]" ? categoryButtons : [];
  const document = {
    getElementById: get,
    querySelector: get,
    documentElement: { getAttribute: name => name === "data-swipe-variant" ? variant : null },
    body: { classList: { remove() {} } }
  };
  const window = { matchMedia: () => ({ matches: true }), setTimeout: cb => cb() };
  const ctx = vm.createContext({ document, window, URL, console });
  vm.runInContext(source, ctx);
  catalogueMutator?.(window.KHIND_PRODUCTS);
  vm.runInContext(js, ctx);
  if (variant === "one-question") {
    categoryButtons.find(button => button.getAttribute("data-deck-choice") === filter).click();
  }
  if (variant === "budget-first") {
    const button = { getAttribute: key => key === "data-budget-choice" ? "unsure" : null };
    get("budget-options").listeners.click?.({ target: { closest: () => button } });
  }
  const id = () => get("card-slot").hidden ? null :
    get("card-slot").innerHTML.match(/class="photo-topline"><span>KOLEKSI KHIND RTO<\/span><span>([^<]+)<\/span>/)?.[1] || null;
  const rescue = () => !get("rescue-question").hidden;
  const skip = () => get("skip-button").click();
  const save = () => get("save-button").click();
  const respond = choice => get("rescue-question").querySelector("#rescue-" + choice).click();
  const details = () => get("card-slot").querySelector("#details-button").click();
  return { get, id, skip, save, rescue, respond, details, products: window.KHIND_PRODUCTS };
}
function check(name, pass) {
  assert.ok(pass, name);
  console.log("PASS " + name);
}
for (const variant of ["pilih", "pilih-b", "pilih-c"]) {
  const html = fs.readFileSync(variant + "/index.html", "utf8");
  check("rescue container is embedded and hidden at load in " + variant,
    html.includes('id="rescue-question"') &&
    html.includes('aria-labelledby="rescue-title" hidden') &&
    html.includes("swipe-shop.js?v=6") &&
    html.includes("swipe-shop.css?v=6"));
}
check("compact rescue includes reduced height and motion-safe styles",
  css.includes(".rescue-options{display:grid;grid-template-columns:repeat(2") &&
  css.includes("@media(max-height:43rem)") &&
  css.includes("prefers-reduced-motion:reduce"));

const basic = launch();
check("no rescue at deck opening", !basic.rescue() && basic.id() === "WM1248");
basic.skip();
basic.skip();
check("two skips do not show rescue", !basic.rescue() && !basic.get("skip-button").disabled);
basic.skip();
check("third consecutive skip pauses before next card", basic.rescue() &&
  basic.id() === null &&
  basic.get("skip-button").disabled &&
  basic.get("save-button").disabled &&
  basic.get("undo-button").disabled === false);
check("one exact category question with requested alternatives",
  basic.get("rescue-question").innerHTML.includes("Apa yang anda perlukan?") &&
  ["Dobi", "Peti sejuk", "Penyaman udara", "Tak pasti", "Langkau soalan ini."].every(label =>
    basic.get("rescue-question").innerHTML.includes(label)) &&
  (basic.get("rescue-question").innerHTML.match(/\?/g) || []).length === 1);
basic.respond("fridge");
check("Fridge answer immediately shows next unviewed fridge", !basic.rescue() &&
  basic.id() === "RFM466A" && !basic.get("skip-button").disabled);
basic.skip();
check("remaining fridge entries prioritized before other categories", basic.id() === "RF480");
basic.skip();
check("other categories retained after prioritized group", basic.id() !== null &&
  !["RFM466A", "RF480"].includes(basic.id()));
for (let i = 0; i < 6 && basic.id(); i++) basic.skip();
check("never stacks another rescue question in the same run", !basic.rescue());

const bypass = launch();
bypass.skip(); bypass.skip(); bypass.skip();
check("Skip this question remains available", bypass.rescue());
bypass.respond("skip");
check("bypass resumes original next product", !bypass.rescue() && bypass.id() === "SI6029BP");
for (let i = 0; i < 6 && bypass.id(); i++) bypass.skip();
check("bypass also suppresses any repeated question", !bypass.rescue());

const unsure = launch();
unsure.skip(); unsure.skip(); unsure.skip();
unsure.respond("unsure");
check("Not sure resumes original next product", unsure.id() === "SI6029BP" && !unsure.rescue());

const undoOnRescue = launch();
undoOnRescue.skip(); undoOnRescue.skip(); undoOnRescue.skip();
undoOnRescue.get("undo-button").click();
check("Undo while paused restores previous card without rescue", !undoOnRescue.rescue() &&
  undoOnRescue.id() === "ACSON-1.0");
undoOnRescue.skip();
check("rescue becomes eligible again after undoing trigger", undoOnRescue.rescue());
undoOnRescue.respond("fridge");
undoOnRescue.get("undo-button").click();
check("Undo after answering restores original third product and ordering",
  !undoOnRescue.rescue() && undoOnRescue.id() === "ACSON-1.0");
undoOnRescue.skip();
undoOnRescue.respond("skip");
check("undo restored original ordering even after fridge priority", undoOnRescue.id() === "SI6029BP");

const resetSave = launch();
resetSave.skip(); resetSave.skip(); resetSave.save();
resetSave.skip(); resetSave.skip();
check("save interrupts skip streak", !resetSave.rescue());
resetSave.skip();
check("three new skips after saving trigger rescue", resetSave.rescue());

const resetDetails = launch();
resetDetails.skip(); resetDetails.skip();
resetDetails.details();
check("viewing Details resets skip streak", resetDetails.get("details-sheet").open);
resetDetails.get("details-sheet").close();
resetDetails.skip();
check("skip after Details does not trigger rescue prematurely", !resetDetails.rescue());
resetDetails.skip();
check("two skips after Details still no question", !resetDetails.rescue());
resetDetails.skip();
check("third skip after Details triggers rescue", resetDetails.rescue());

const bCategory = launch("one-question", "washing");
bCategory.skip(); bCategory.skip(); bCategory.skip();
check("category-filtered B does not repeat an already-known category question",
  !bCategory.rescue() && bCategory.id() === "WD1438");
const bAll = launch("one-question", "all");
bAll.skip(); bAll.skip(); bAll.skip();
check("B with all categories can trigger rescue", bAll.rescue());
bAll.respond("laundry");
check("B rescue prioritizes laundry after response", ["DHP90", "WD1468", "WM150A", "WD1438", "CD12D", "SI6029BP"].includes(bAll.id()));
const cAll = launch("budget-first");
cAll.skip(); cAll.skip(); cAll.skip();
check("C begins with its own optional budget gate, not a rescue; later it can rescue",
  cAll.rescue());
cAll.respond("aircond");
check("C immediately resumes with unseen aircond items", cAll.id()?.startsWith("ACSON") === true);

const shortDeck = launch(null, "all", products => {
  for (const p of products.slice(3)) p.image = "";
});
shortDeck.skip(); shortDeck.skip(); shortDeck.skip();
check("no rescue at exhausted deck, even after 3 skips", !shortDeck.rescue() &&
  shortDeck.get("deck-position").textContent === "Selesai");

const oneCategory = launch(null, "all", products => {
  for (const p of products) if (p.category !== "laundry") p.image = "";
});
oneCategory.skip(); oneCategory.skip(); oneCategory.skip();
check("no low-information category prompt when just one group remains", !oneCategory.rescue());

const engagement = launch();
engagement.save(); engagement.save();
check("existing two-save comparison still appears", engagement.get("decision-prompt").innerHTML.includes("Bandingkan"));
engagement.get("decision-prompt").querySelector("#keep-swiping").click();
check("comparison does not introduce an immediate rescue question", !engagement.rescue());
console.log("Conditional rescue checks passed.");
