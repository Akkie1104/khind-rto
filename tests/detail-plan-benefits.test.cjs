"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("script.js", "utf8");
const helper = source.match(/const benefitsForPlan = \(p,plan\) => ([^;]+);/);
assert.ok(helper, "selected-plan benefit helper exists");
const benefitsForPlan = vm.runInNewContext(`(p,plan) => ${helper[1]}`);

test("detail shows benefits for the selected plan and flags unknown benefits", () => {
  const product = {
    benefits: "Premium: care service and insurance.",
    planBenefits: {
      Basic: "Basic plan benefits need KHIND confirmation.",
      Premium: "Premium includes a care service and insurance.",
    },
  };

  assert.equal(
    benefitsForPlan(product, { name: "Basic" }),
    "Basic plan benefits need KHIND confirmation."
  );
  assert.equal(
    benefitsForPlan(product, { name: "Premium" }),
    "Premium includes a care service and insurance."
  );
  assert.match(source, /benefitsForPlan\(p,plan\)/);
});
