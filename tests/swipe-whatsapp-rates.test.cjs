"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.resolve(__dirname, "..", "swipe-shop.js"), "utf8");
const start = source.indexOf("function whatsappUrl(items)");
const next = source.indexOf("\n  function ", start + 1);
const whatsappDraft = start < 0 ? "" : source.slice(start, next < 0 ? undefined : next);

test("comparison WhatsApp draft states each selected plan rate, term, and regular-rate estimate", () => {
  assert.ok(whatsappDraft, "comparison WhatsApp helper must exist");
  assert.match(whatsappDraft, /const plan = shownPlan\(p\)/);
  assert.match(whatsappDraft, /money\(plan\.rate\)/);
  assert.match(whatsappDraft, /const months = Number\(p\.months\)/);
  assert.match(whatsappDraft, /money\(plan\.rate \* months\)/);
  assert.match(whatsappDraft, /planName/);
  assert.match(whatsappDraft, /regular-rate total estimate/);
  assert.match(whatsappDraft, /kadar biasa/);
});
