"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const storefront = fs.readFileSync(path.join(root, "storefront.js"), "utf8");

function element({ value = "", dataset = {}, hidden = false } = {}) {
  return {
    value,
    dataset,
    hidden,
    textContent: "",
    listeners: {},
    classList: { toggle() {} },
    addEventListener(type, handler) { this.listeners[type] = handler; },
    querySelector() { return { getAttribute() { return ""; } }; },
    focus() { document.activeElement = this; }
  };
}

const document = {};

function bootCatalogue(category = "") {
  const search = element({ value: "no-such-model" });
  const budget = element({ value: "80" });
  const count = element();
  const empty = element({ hidden: true });
  const clear = element();
  const cards = Array.from({ length: 23 }, (_, i) => element({
    dataset: { search: `model-${i}`, category: "laundry", rate: "85" }
  }));
  const location = { search: category ? `?category=${category}` : "", pathname: "/catalogue/", href: "" };
  Object.assign(document, {
    activeElement: null,
    documentElement: { lang: "ms" },
    querySelector(selector) {
      return {
        "#agent-search": search,
        "#agent-budget": budget,
        "#agent-result-count": count,
        "#agent-empty-state": empty,
        "#agent-clear-filters": clear
      }[selector] || null;
    },
    querySelectorAll(selector) {
      if (selector === "[data-filter-product]") return cards;
      return [];
    }
  });
  vm.runInNewContext(storefront, {
    document,
    window: { KHIND_PRODUCTS: [] },
    location,
    URLSearchParams,
    Date,
    Intl,
    Number,
    Math
  }, { filename: "storefront.js" });
  return { search, budget, count, empty, clear, cards, location };
}

test("clear filters button restores the catalogue and search focus", () => {
  const { search, budget, count, empty, clear } = bootCatalogue();
  search.listeners.input();
  assert.equal(count.textContent, "0 pilihan sepadan");
  assert.equal(empty.hidden, false);

  clear.listeners.click();

  assert.equal(search.value, "");
  assert.equal(budget.value, "all");
  assert.equal(count.textContent, "23 pilihan sepadan");
  assert.equal(empty.hidden, true);
  assert.equal(document.activeElement, search);
});

test("clear filters navigates out of a category-specific catalogue", () => {
  const { clear, location } = bootCatalogue("bundle");
  clear.listeners.click();
  assert.equal(location.href, "/catalogue/");
});
