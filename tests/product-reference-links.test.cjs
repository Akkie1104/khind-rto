"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const catalogueSource = fs.readFileSync(path.join(root, "catalogue.js"), "utf8");
const catalogueMatch = catalogueSource.match(/window\.KHIND_PRODUCTS\s*=\s*(\[[\s\S]*?\]);/);
assert.ok(catalogueMatch, "catalogue.js must expose the product data array");
const products = JSON.parse(catalogueMatch[1]);
const byId = new Map(products.map((product) => [product.id, product]));
const readProductPage = (id) => fs.readFileSync(path.join(root, "products", id, "index.html"), "utf8");
const readAnchors = (html) => [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
  .map((match) => ({ href: match[1], label: match[2].replace(/<[^>]*>/g, "") }));

test("each combo detail page links its components to their catalogue source URLs", () => {
  for (const product of products.filter((item) => item.id.startsWith("COMBO-"))) {
    const html = readProductPage(product.id);
    const sectionStart = html.indexOf("agent-component-references");
    const sectionEnd = html.indexOf("</section>", sectionStart);
    const section = sectionStart < 0 || sectionEnd < 0 ? "" : html.slice(html.lastIndexOf("<section", sectionStart), sectionEnd + "</section>".length);
    assert.ok(section, product.id + " must show its component-reference section");
    const hrefs = readAnchors(section).map((anchor) => anchor.href);
    for (const componentId of product.components || []) {
      const source = byId.get(componentId)?.source;
      assert.ok(source, product.id + " component " + componentId + " needs a source URL");
      assert.ok(hrefs.includes(source), product.id + " must link " + componentId + " to " + source);
    }
  }
});

test("WD1438 and CD12D label their EasyR2O links as rate references", () => {
  for (const id of ["WD1438", "CD12D"]) {
    const product = byId.get(id);
    const anchor = readAnchors(readProductPage(id)).find((item) => item.href === product.source);
    assert.ok(anchor, id + " must link its catalogue rate source");
    assert.match(product.source, /^https:\/\/easyr2o\.khind\.com\.my\//);
    assert.match(anchor.label, /RTO|kadar/i, id + " link should identify rate information");
    assert.doesNotMatch(anchor.label, /foto|spesifikasi|photo|specification/i);
  }
});
