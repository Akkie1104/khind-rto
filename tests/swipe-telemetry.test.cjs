/* Anonymous A/B/C assignment, schema, safe projection and network-off validation. */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const crypto = require("node:crypto");
const source = fs.readFileSync("swipe-telemetry.js","utf8");
const ok = (name, pass) => { assert.ok(pass, name); console.log("PASS " + name); };
class Store {
  constructor(map=new Map()) {this.m=map;}
  getItem(k){return this.m.has(k)?this.m.get(k):null;}
  setItem(k,v){this.m.set(k,String(v));}
  removeItem(k){this.m.delete(k);}
}
function init(path="/pilih/",local=new Store(),session=new Store(),config={enabled:false,endpoint:""},debug=false,random) {
 const posted=[], network=[];
 const crypt={
  randomUUID:()=>crypto.randomUUID(),
  getRandomValues:nums=>{nums[0]=random?random():crypto.randomBytes(4).readUInt32BE(0);return nums;}
 };
 const root={
  localStorage:local,sessionStorage:session,crypto:crypt,
  location:{pathname:path,search:debug?"?debug=1":""},
  KHIND_EXPERIMENT_CONFIG:config,
  BroadcastChannel:class {postMessage(message){posted.push(message);}},
  fetch:(url,options)=>{network.push({url,options});return Promise.resolve({ok:true});}
 };
 vm.runInNewContext(source,{window:root,Uint32Array,Date,console,URL});
 return {api:root.KHIND_TELEMETRY,root,posted,network,local,session};
}
const persistent=new Store(),temp=new Store();
const counts={A:0,B:0,C:0};let idx=0;
for(let i=0;i<300;i++){
 persistent.removeItem("khind_swipe_bucket_v1");
 const setup=init("/pilih-exp/",persistent,temp,undefined,false,()=>idx++%3);
 const v=setup.api.assign();
 counts[v]++;
}
ok("unbiased equal three-bucket assignment for cyclic independent draws",
 counts.A===100 && counts.B===100 && counts.C===100);
persistent.removeItem("khind_swipe_bucket_v1");
const entry=init("/pilih-exp/",persistent,temp,undefined,false,()=>1);
ok("assignment stable across subsequent visits",entry.api.assign()==="B" && entry.api.assign()==="B" &&
  persistent.getItem("khind_swipe_bucket_v1")==="B");
ok("persistent storage has only anonymous bucket, never session/person ID",
 persistent.m.size===1 && [...persistent.m.values()].every(v=>["A","B","C"].includes(v)));
ok("explicit entry activates and routes variant B",
 entry.api.enterExperiment()==="/pilih-b/" &&
 temp.getItem("khind_swipe_assignment_active_v1")==="B");
const randomized=init("/pilih-b/",persistent,temp,undefined,true);
ok("arriving through experiment entry is randomized",randomized.api.context().assignment_mode==="randomized" &&
 randomized.api.context().variant==="B");
ok("entry token consumed once: a later direct entry is not enrolled",
 temp.getItem("khind_swipe_assignment_active_v1")===null &&
 init("/pilih-b/",persistent,temp).api.context().assignment_mode==="direct");
const direct=init("/pilih/",new Store(),new Store(),undefined,true);
ok("direct control route marked direct, not A/B test sample",
 direct.api.context().assignment_mode==="direct" && direct.api.context().variant==="A");
ok("all 15 named events have schema-valid sample payloads",
 direct.api.EVENTS.length===15 && direct.api.EVENTS.every(name=>direct.api.validate(direct.api.sample(name)).valid));
const rejected=direct.api.sample("guide_open");
rejected.name="Full name"; rejected.ic="123"; rejected.income="5000"; rejected.phone="60123456";
ok("sensitive personal fields and unknown keys rejected",
 !direct.api.validate(rejected).valid &&
 direct.api.validate(rejected).errors.some(x=>x.includes("Forbidden field: name")) &&
 direct.api.validate(rejected).errors.some(x=>x.includes("Forbidden field: income")));
const badBudget={...direct.api.sample("filter_answered"),question_type:"budget_entry",filter_band:2};
delete badBudget.filter_category;
ok("individual budget range is not a permitted analytics field",
 !direct.api.validate(badBudget).valid &&
 direct.api.validate(badBudget).errors.some(x=>x.includes("filter_band")));
const privacy=direct.api.track("filter_answered",{
 action_source:"button",question_type:"budget_entry",answer_kind:"selected",
 saved_count:0,budget_amount:500,income:2200,phone:"1234567",free_text:"My finances",ic:"illegal"
});
ok("actual event projection removes financial and personal fields",!!privacy &&
 privacy.question_type==="budget_entry" && privacy.answer_kind==="selected" &&
 !Object.keys(privacy).some(k=>["budget_amount","income","phone","free_text","ic"].includes(k)));
ok("collector disabled: zero outbound requests, QA channel receives event",direct.network.length===0 &&
 direct.posted.some(msg=>msg.kind==="event"));
const invalid={...direct.api.sample("card_impression"),product_id:"https://wa.me/6012345"};
ok("product_id must be a catalogue-style model code",!direct.api.validate(invalid).valid);
const actionInvalid={...direct.api.sample("card_swipe_left"),action_source:"button"};
ok("source semantics validated",!direct.api.validate(actionInvalid).valid);
const notEnrolled=init("/pilih-exp/",new Store(),new Store(),undefined,false,()=>0);
notEnrolled.root.localStorage.setItem=()=>{throw Error("storage blocked");};
ok("no randomized enrollment without writable storage",notEnrolled.api.enterExperiment()===null);
const enabled=init("/pilih/",new Store(),new Store(),
 {enabled:true,endpoint:"https://metrics.khindrto.akizen.my/events"});
enabled.api.track("guide_open",{action_source:"automatic",saved_count:0});
ok("only explicitly configured HTTPS /events collector enables transport",
 enabled.network.length===1 && enabled.network[0].options.credentials==="omit" &&
 enabled.network[0].options.headers["Content-Type"]==="application/json");
const invalidEndpoint=init("/pilih/",new Store(),new Store(),
 {enabled:true,endpoint:"http://evil.example/events"});
invalidEndpoint.api.track("guide_open",{saved_count:0});
ok("insecure collector URL never gets traffic",invalidEndpoint.network.length===0);
ok("non-guide pages cannot emit tagged exposure",
 init("/catalogue/",new Store(),new Store()).api.track("guide_open")===false);
console.log("Anonymous experiment telemetry tests passed.");
