const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const context = { window: {} };
vm.runInNewContext(read("catalogue.js"), context, { filename: "catalogue.js" });
const products = context.window.KHIND_PRODUCTS;
const byId = id => products.find(product => product.id === id);

for (const id of ["WM1248", "RF480"]) {
  const product = byId(id);
  assert.ok(product, `${id} remains in the catalogue`);
  assert.equal(product.yearEndPromo, false, `${id} is not assumed eligible for a current promotion`);
  assert.equal(product.q3, false, `${id} is excluded from the earlier promo model`);
  assert.equal(product.promoMonths, undefined, `${id} has no invented promo duration`);
}

assert.match(read("script.js"), /yearEndPromo:product\.yearEndPromo===true/);
const home = read("index.html");
assert.match(home, /RM85\/bulan/);
assert.match(home, /RM4,080/);
assert.match(home, /RM43\*/);
assert.doesNotMatch(home, /RM42\.50|RM3,825/);

const wm = read("products/WM1248/index.html");
assert.match(wm, /data-promo="no"/);
assert.match(wm, /RM4,080/);
assert.match(wm, /RM43\*/);
assert.doesNotMatch(wm, /RM42\.5|RM3,825|data-promo="yes"/);

const rf = read("products/RF480/index.html");
assert.match(rf, /data-promo="no"/);
assert.match(rf, /RM4,500/);
assert.match(rf, /pages conflict|bercanggah/i);
assert.doesNotMatch(rf, /data-promo="yes"/);

const promotions = read("promotions/index.html");
assert.match(promotions, /bukan pengesahan tawaran aktif/i);
assert.match(promotions, /tidak mengesahkan kempen masih aktif/i);
assert.doesNotMatch(promotions, /kempen oktober|kempen ejen 1 okt/i);
