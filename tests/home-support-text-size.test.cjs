"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const css = fs.readFileSync("storefront-home.css", "utf8");
const html = fs.readFileSync("index.html", "utf8");
test("homepage support text keeps a 12px floor across responsive overrides", () => {
  const rule = css.match(/\.folio-home :is\(([^)]+)\)\{font-size:max\(12px,\.75rem\)!important\}/);
  assert.ok(rule, "homepage-scoped minimum wins over later responsive font sizes");
  const selectors = rule[1].split(",");
  for (const selector of [".campaign small", ".footer-inner", ".promo-number", ".section-label", ".promo-tag", ".story-copy", ".guide-label", ".site-notice", ".mobile-bottom-nav a", ".mobile-bottom-nav span", ".brand span"]) {
    assert.ok(selectors.includes(selector), selector + " has the minimum-size floor");
  }
  assert.match(css, /\.folio-home \.folio-index span\{font-size:max\(12px,clamp\(\.7rem,1vw,\.9rem\)\)!important\}/);
  assert.ok(html.includes('href="storefront-home.css?v=3"'), "homepage loads refreshed text rules");
});
