"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const home = fs.readFileSync("index.html", "utf8");
const catalogue = fs.readFileSync("catalogue.js", "utf8");
const sharedFolio = fs.readFileSync("khind-folio.css", "utf8");
const picker = fs.readFileSync("swipe-shop.css", "utf8");

test("homepage combo uses the same working official DHP90 image as catalogue", () => {
  const url = /67b6de08e697276c238572df_80470333f122e0f2aadfa0e9527a24db\.avif/;
  assert.match(catalogue, url);
  assert.match(home, url);
  assert.doesNotMatch(home, /67b6de08e697276c238572df_80470333f122e0aadfa0e9527a24db\.avif/);
});

test("mobile navigation and picker support labels have a 12px floor", () => {
  assert.match(sharedFolio, /\.agent-nav a\{font-size:max\(12px,\.75rem\)!important\}/);
  assert.ok(sharedFolio.lastIndexOf(".agent-nav a{font-size:max(12px,.75rem)!important}") > sharedFolio.lastIndexOf(".agent-nav a{font-size:.74rem}"), "nav minimum follows shared responsive nav sizing");
  assert.match(sharedFolio, /\.mobile-bottom-nav :is\(a,span\)\{font-size:max\(12px,\.75rem\)!important\}/);
  const rule = [...picker.matchAll(/body\.folio-shop :is\(([^)]+)\)\{font-size:max\(12px,\.75rem\)!important\}/g)].find(match => match[1].includes(".photo-corner-mark"));
  assert.ok(rule, "picker support text keeps a 12px floor");
  for (const selector of [".photo-corner-mark", ".product-overline span", ".home-link", ".question-eyebrow", ".question-option-number", ".question-disclosure", ".budget-option-caption", ".photo-topline", ".photo-topline span:last-child", ".question-marker span"]) {
    assert.ok(rule[1].split(",").includes(selector), selector + " 12px floor");
  }
});
