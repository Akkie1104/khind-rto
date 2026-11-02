"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const css = fs.readFileSync("swipe-shop.css", "utf8");
const folio = fs.readFileSync("khind-folio.css", "utf8");
const palette = name => folio.match(new RegExp("--folio-" + name + ":(#[0-9a-f]{6})"))[1];
for (const [name, hex] of Object.entries({ink:"#17231b", muted:"#465247", paper:"#f4f0e4", "paper-light":"#fbf8ef"})) {
  assert.equal(palette(name), hex, "reviewed folio " + name + " token");
}
function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map(x => parseInt(x, 16) / 255)
    .map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
  return channels.reduce((sum, x, i) => sum + x * [.2126, .7152, .0722][i], 0);
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + .05) / (values[1] + .05);
}
test("saved label inherits readable enabled and disabled folio text without opacity loss", () => {
  assert.match(folio, /\.folio-shop \.saved-indicator\{[^}]*background:transparent;color:var\(--folio-ink\)/);
  assert.match(css, /\.folio-shop \.saved-indicator \.saved-label\{color:inherit\}/);
  assert.match(css, /\.folio-shop \.saved-indicator:disabled\{opacity:1;color:var\(--folio-muted\)\}/);
  assert.ok(contrast(palette("ink"), palette("paper")) >= 4.5);
  assert.ok(contrast(palette("muted"), palette("paper")) >= 4.5);
  console.log("Saved normal/disabled contrast on cream:", contrast(palette("ink"), palette("paper")).toFixed(2), contrast(palette("muted"), palette("paper")).toFixed(2));
});
test("picker links and buttons use contrasting focus bands on cream and dark surfaces", () => {
  assert.match(css, /\.folio-shop :is\(a,button,\[tabindex\]\):focus-visible\{outline:3px solid var\(--folio-ink\);outline-offset:3px;box-shadow:0 0 0 3px var\(--folio-paper-light\)\}/);
  assert.ok(contrast(palette("ink"), palette("paper")) >= 3);
  assert.ok(contrast(palette("paper-light"), "#111a12") >= 3);
  assert.ok(contrast(palette("ink"), palette("paper-light")) >= 3);
  console.log("Focus ink/light band contrast on cream:", contrast(palette("ink"), palette("paper")).toFixed(2), contrast(palette("paper-light"), palette("paper")).toFixed(2));
  console.log("Focus ink/light band contrast on dark #111a12:", contrast(palette("ink"), "#111a12").toFixed(2), contrast(palette("paper-light"), "#111a12").toFixed(2));
  console.log("Focus bands against each other:", contrast(palette("ink"), palette("paper-light")).toFixed(2));
});
test("light product navigation hover and current states retain dark text and an underline", () => {
  assert.match(folio, /\.agent-nav a:hover,\.agent-nav a\[aria-current=page\]\{color:var\(--folio-ink\);text-decoration:underline;text-decoration-thickness:2px\}/);
  assert.ok(contrast(palette("ink"), palette("paper")) >= 4.5);
  console.log("Product nav hover/current ink on cream:", contrast(palette("ink"), palette("paper")).toFixed(2));
});
