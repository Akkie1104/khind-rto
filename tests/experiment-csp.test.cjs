"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const entry = fs.readFileSync(path.join(root, "pilih-exp", "index.html"), "utf8");
const folio = fs.readFileSync(path.join(root, "khind-folio.css"), "utf8");

test("experiment entry uses external layout rules and permits the local font", () => {
  assert.match(entry, /style-src 'self';/);
  assert.match(entry, /font-src 'self';/);
  assert.doesNotMatch(entry, /\sstyle\s*=/i);
  assert.match(entry, /<main class="rto-exp-entry">/);
  assert.match(folio, /\.rto-exp-entry\{/);
});
