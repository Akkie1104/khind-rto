/* First-party Worker server-side allowlist, CORS and retention regression. */
"use strict";
const fs=require("node:fs"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const source=fs.readFileSync("analytics-worker/worker.js","utf8");
const check=(name,pass)=>{assert.ok(pass,name);console.log("PASS "+name)};
(async()=>{
 const worker=(await import("data:text/javascript;base64,"+Buffer.from(source).toString("base64"))).default;
 const rows=[],sql=[];
 const env={DB:{prepare(query){sql.push(query);return{bind(...args){return{run:async()=>{rows.push(args);return{success:true}}}} ,run:async()=>({success:true})}}}};
 const stamp=new Date().toISOString();
 const event={event_id:crypto.randomUUID(),session_id:crypto.randomUUID(),occurred_at:stamp,
  event_name:"card_save_button",experiment:"khind_swipe_v1",variant:"B",
  assignment_mode:"randomized",action_source:"button",product_id:"WM1248",
  card_position:1,saved_count:1};
 const req=(value,origin="https://khindrto.akizen.my",method="POST")=>
  new Request("https://collector.example/events",{method,headers:{"Origin":origin,"Content-Type":"application/json"},
    ...(method==="POST"?{body:JSON.stringify(value)}:{})});
 const ok=await worker.fetch(req(event),env);
 check("valid first-party event accepted and inserted",ok.status===204 && rows.length===1);
 check("SQL stores strictly fourteen whitelisted fields, no IP, phone or names",
  rows[0].length===14 && !sql[0].includes("ip_address") && !sql[0].includes("customer"));
 const p=await worker.fetch(req({...event,event_id:crypto.randomUUID(),phone:"0123456789"}),env);
 check("raw phone field rejected by collector",p.status===422 && rows.length===1);
 const q=await worker.fetch(req({...event,event_id:crypto.randomUUID(),income:"RM8000"}),env);
 check("income rejected server-side",q.status===422);
 const r=await worker.fetch(req({...event,event_id:crypto.randomUUID(),budget_amount:120}),env);
 check("individual monthly budget rejected",r.status===422);
 const x=await worker.fetch(req({...event,event_id:crypto.randomUUID(),action_source:"gesture"}),env);
 check("button events cannot falsely use gesture source",x.status===422);
 const noOrigin=await worker.fetch(req(event,"https://other.example"),env);
 check("different origin blocked",noOrigin.status===403);
 const opt=await worker.fetch(req(null,"https://khindrto.akizen.my","OPTIONS"),env);
 check("preflight uses exact originating storefront",opt.status===204 &&
  opt.headers.get("access-control-allow-origin")==="https://khindrto.akizen.my");
 const bad=await worker.fetch(new Request("https://collector.example/events",{method:"POST",
  headers:{"Origin":"https://khindrto.akizen.my","Content-Type":"application/json"},
  body:"{"}),env);
 check("malformed JSON rejected",bad.status===400);
 await worker.scheduled({},env);
 check("retention cleanup query scheduled",sql.some(x=>x.includes("DELETE FROM events") &&
  x.includes("90 days")));
 console.log("First-party collector tests passed.");
})().catch(err=>{console.error(err);process.exitCode=1});
