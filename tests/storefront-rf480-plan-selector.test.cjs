"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const storefront = fs.readFileSync(path.join(root, "storefront.js"), "utf8");
const page = fs.readFileSync(path.join(root, "products", "RF480", "index.html"), "utf8");
const catalogueSource = fs.readFileSync(path.join(root, "catalogue.js"), "utf8");
const jsonStart = catalogueSource.indexOf("window.KHIND_PRODUCTS = ") + "window.KHIND_PRODUCTS = ".length;
const jsonEnd = catalogueSource.indexOf("\n];", jsonStart) + 2;
const products = JSON.parse(catalogueSource.slice(jsonStart, jsonEnd));

function element(textContent = "") {
  return {
    textContent,
    innerHTML: "",
    dataset: {},
    listeners: {},
    addEventListener(type, handler) { this.listeners[type] = handler; },
    closest() { return { querySelector() { return null; } }; }
  };
}

function bootPage(now = "2026-11-02T12:00:00Z") {
  const options = [
    { value: "75", textContent: "Basic — RM75/bulan" },
    { value: "95", textContent: "Premium — RM95/bulan" }
  ];
  const choice = element();
  choice.options = options;
  choice.selectedIndex = 0;
  choice.dataset = {
    model: "RF480",
    name: "Chillmaster Lite",
    months: "60",
    promostart: "0",
    promomonths: "3",
    promo: "yes"
  };
  const ids = {
    "#agent-selected-price": element(),
    "#agent-regular-rate": element(),
    "#agent-total": element(),
    "#agent-plan-choice": choice,
    ".agent-plan-label": element(),
    "#agent-total-label": element(),
    "#agent-plan-benefits": element(),
    "#agent-product-stock": element(),
    ".agent-plan .agent-tiny": element()
  };
  const whatsappCount = [...page.matchAll(/href="https:\/\/wa\.me\//g)].length;
  const whatsapp = Array.from({ length: whatsappCount }, () => element());
  const document = {
    documentElement: { lang: "ms" },
    querySelector(selector) { return ids[selector] || null; },
    querySelectorAll(selector) {
      if (selector === 'a[href^="https://wa.me/"]') return whatsapp;
      return [];
    },
    createElement() { throw new Error("No image fallback expected in this fixture"); }
  };
  class FixedDate extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
  }
  const context = {
    document,
    window: { KHIND_PRODUCTS: products },
    location: { search: "", pathname: "/products/RF480/" },
    URLSearchParams,
    Date: FixedDate,
    Intl,
    Number,
    Math,
    encodeURIComponent,
    setTimeout,
    clearTimeout
  };
  vm.runInNewContext(storefront, context, { filename: "storefront.js" });
  return { ids, choice, whatsapp };
}

function decodedPrefills(links) {
  return links.map(link => new URL(link.href).searchParams.get("text"));
}

test("RF480 plan switching updates displayed benefits and every WhatsApp CTA", () => {
  const { ids, choice, whatsapp } = bootPage();
  assert.equal(whatsapp.length, 3, "all three RF480 page CTAs are included");

  const assertPlan = ({ index, rate, promoRate, estimate, plan, benefit }) => {
    choice.selectedIndex = index;
    choice.listeners.change();
    assert.equal(ids["#agent-selected-price"].innerHTML, `RM${promoRate} <small>/bulan</small>`);
    assert.equal(ids["#agent-regular-rate"].textContent, `RM${rate}/bulan`);
    assert.equal(ids["#agent-total"].textContent, `RM${estimate} anggaran`);
    assert.ok(ids["#agent-plan-benefits"].textContent.includes(benefit));
    const prefills = decodedPrefills(whatsapp);
    assert.equal(new Set(prefills).size, 1, "all WhatsApp links share the same selected-plan draft");
    assert.match(prefills[0], new RegExp(`Pelan ${plan}`));
    assert.match(prefills[0], new RegExp(`kadar biasa RM${rate}/bulan selama 60 bulan`));
    assert.ok(prefills[0].includes(`Promosi (jika layak): RM${promoRate}/bulan selama 3 bulan, kemudian RM${rate}/bulan selama 57 bulan`));
    assert.match(prefills[0], new RegExp(`Anggaran jumlah bayaran RM${estimate}`));
    assert.match(prefills[0], /sahkan fi, kelayakan promosi/i);
  };

  assertPlan({
    index: 0,
    rate: 75,
    promoRate: "37.50",
    estimate: "4,387.50",
    plan: "Basic",
    benefit: "Manfaat tambahan pelan Basic perlu disahkan"
  });
  assertPlan({
    index: 1,
    rate: 95,
    promoRate: "47.50",
    estimate: "5,557.50",
    plan: "Premium",
    benefit: "Premium: 1 servis penjagaan"
  });
});

test("RF480 WhatsApp draft omits the promotion schedule when the page no longer shows it", () => {
  const { choice, whatsapp } = bootPage("2027-01-02T12:00:00Z");
  choice.listeners.change();
  const prefills = decodedPrefills(whatsapp);
  assert.equal(new Set(prefills).size, 1);
  assert.match(prefills[0], /kadar biasa RM75\/bulan selama 60 bulan/);
  assert.match(prefills[0], /Anggaran jumlah bayaran RM4,500/);
  assert.doesNotMatch(prefills[0], /Promosi \(jika layak\):/);
});
