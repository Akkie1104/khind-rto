/* Shared engine event integration: no duplicate impressions on i18n, source attribution, filters and CTAs. */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const catalogue=fs.readFileSync("catalogue.js","utf8"),guide=fs.readFileSync("swipe-shop.js","utf8");
const check=(name,pass)=>{assert.ok(pass,name);console.log("PASS "+name)};
class El {
 constructor(id){this.id=id;this._html="";this.disabled=false;this.hidden=false;this.open=false;this.listeners={};
  this.children=new Map();this.attributes={};this.style={setProperty(){},removeProperty(){}};
  this.classList={add(){},remove(){}};this.clientWidth=390;this.scrollTop=0;this.textContent="";}
 set innerHTML(v){this._html=v;this.children.clear();}
 get innerHTML(){return this._html;}
 querySelector(key){if(!this.children.has(key))this.children.set(key,new El(key));return this.children.get(key);}
 querySelectorAll(){return [];}
 addEventListener(key,fn){this.listeners[key]=fn;}
 setAttribute(key,v){this.attributes[key]=v;}
 getAttribute(key){return this.attributes[key]??null;}
 focus(){}
 click(){this.listeners.click?.({target:this});}
 showModal(){this.open=true;}
 close(){this.open=false;}
}
function launch(variant=""){
 const elements=new Map(),events=[],get=id=>{
  if(!elements.has(id))elements.set(id,new El(id));return elements.get(id);
 };
 const document={getElementById:get,querySelector:get,documentElement:{lang:"ms",getAttribute:key=>key==="data-swipe-variant"?variant:null,setAttribute(){}},
   body:{classList:{remove(){}}},addEventListener:(name,fn)=>{document.listeners[name]=fn},listeners:{}};
 const choiceButtons=["washing","fridge","cooling","all"].map(v=>{
   const e=new El(v);e.setAttribute("data-deck-choice",v);return e;
 });
 get("one-question-gate").querySelectorAll=sel=>sel==="[data-deck-choice]"?choiceButtons:[];
 const window={KHIND_TELEMETRY:{track:(name,fields)=>{events.push({name,...fields});return true}},
  matchMedia:()=>({matches:true}),setTimeout:fn=>fn(),
  addEventListener:(name,fn)=>{window.listeners[name]=fn},listeners:{}};
 const ctx=vm.createContext({document,window,URL,console});
 vm.runInContext(catalogue,ctx);vm.runInContext(guide,ctx);
 return {get,events,document,window,choices:choiceButtons,
   chooseB:v=>choiceButtons.find(b=>b.getAttribute("data-deck-choice")===v).click(),
   chooseC:v=>get("budget-options").listeners.click({target:{closest:()=>({getAttribute:()=>v})}}),
   named:n=>events.filter(e=>e.name===n)};
}
const a=launch();
check("control emits guide_open before first impression",
  a.events[0]?.name==="guide_open" && a.events[1]?.name==="card_impression" &&
  a.events[1]?.product_id==="WM1248" && a.events[1]?.card_position===1);
a.get("language-main").click();
check("translation does not duplicate card impression",a.named("card_impression").length===1);
a.get("skip-button").click();
check("visible Skip is card_skip_button, source button",a.named("card_skip_button").length===1 &&
  a.named("card_skip_button")[0].action_source==="button" && a.named("card_skip_button")[0].saved_count===0);
a.get("undo-button").click();
check("Undo emits restored card position and model",a.named("card_undo").length===1 &&
  a.named("card_undo")[0].product_id==="WM1248" && a.named("card_undo")[0].card_position===1);
a.get("save-button").click();
check("Save emits correct saved_count after decision",a.named("card_save_button")[0].saved_count===1);
a.get("card-slot").querySelector("#details-button").click();
check("Details open recorded once",a.named("product_details_open").length===1);
a.get("language-details").click();
check("language switch while details open doesn't duplicate detail event",a.named("product_details_open").length===1);
a.get("details-sheet").close();
const card=a.get("card-slot").querySelector("#active-card");
card.listeners.keydown({target:card,key:"ArrowLeft",preventDefault(){}});
check("keyboard Left is card_swipe_left with keyboard source",
 a.named("card_swipe_left").length===1 && a.named("card_swipe_left")[0].action_source==="keyboard");
a.get("save-button").click();
check("two saves enable Compare prompt",a.get("decision-prompt").innerHTML.includes("compare-now"));
a.get("decision-prompt").querySelector("#compare-now").click();
check("Compare and shortlist transitions instrumented separately",
 a.named("compare_open").length===1 && a.named("shortlist_open").length===0);
const saved=a.get("compare-view").innerHTML;
check("shortlist WhatsApp exists",saved.includes("wa.me/60174201247"));
a.document.listeners.click({target:{closest:()=>({getAttribute:()=> "https://wa.me/60174201247?text=not-logged"})}});
check("WhatsApp event does not copy message URL or customer info",
 a.named("whatsapp_cta_click").length===1 &&
 !JSON.stringify(a.named("whatsapp_cta_click")[0]).includes("not-logged"));
a.document.listeners.click({target:{closest:()=>({getAttribute:()=>"../catalogue/"})}});
check("catalogue fallback click captured without URL",a.named("catalogue_fallback_click").length===1 &&
 !Object.hasOwn(a.named("catalogue_fallback_click")[0],"url"));
a.window.listeners.pagehide();
check("guide_close includes final saved count",a.named("guide_close").length===1 &&
 a.named("guide_close")[0].saved_count===2);

const gesture=launch();
const gc=gesture.get("card-slot").querySelector("#active-card");
gc.listeners.pointerdown({button:0,isPrimary:true,pointerId:3,clientX:270,clientY:120,
 target:{closest:()=>null}});
gc.listeners.pointermove({pointerId:3,clientX:20,clientY:120});
gc.listeners.pointerup({pointerId:3});
check("leftward gesture captured distinctly from button",gesture.named("card_swipe_left").length===1 &&
 gesture.named("card_swipe_left")[0].action_source==="gesture" &&
 gesture.named("card_skip_button").length===0);
const gc2=gesture.get("card-slot").querySelector("#active-card");
gc2.listeners.pointerdown({button:0,isPrimary:true,pointerId:4,clientX:30,clientY:110,
 target:{closest:()=>null}});
gc2.listeners.pointermove({pointerId:4,clientX:280,clientY:110});
gc2.listeners.pointerup({pointerId:4});
check("rightward gesture captured distinctly with updated saved count",
 gesture.named("card_swipe_right").length===1 &&
 gesture.named("card_swipe_right")[0].saved_count===1);

const touch=launch();
const touchCard=()=>touch.get("card-slot").querySelector("#active-card");
const touchEvent=(pointerId,clientX,clientY=120)=>({button:0,isPrimary:true,pointerType:"touch",isTrusted:true,pointerId,clientX,clientY,target:{closest:()=>null}});
touchCard().listeners.pointerdown(touchEvent(5,195));
touchCard().listeners.pointerup(touchEvent(5,361));
check("touch release saves using final coordinates even when move events are coalesced",
  touch.named("card_swipe_right").length===1 && touch.get("saved-count").textContent==="1" &&
  touch.get("progress-track").getAttribute("aria-valuenow")==="1");
touchCard().listeners.pointerdown(touchEvent(6,195));
touchCard().listeners.pointermove(touchEvent(6,180));
touchCard().listeners.pointerup(touchEvent(6,29));
check("touch release skips using final coordinates after a smaller intermediate move",
  touch.named("card_swipe_left").length===1 && touch.get("saved-count").textContent==="1" &&
  touch.get("progress-track").getAttribute("aria-valuenow")==="2");
const unchanged=touch.get("progress-track").getAttribute("aria-valuenow");
touchCard().listeners.pointerdown(touchEvent(7,195));
touchCard().listeners.pointerup(touchEvent(7,210,300));
touchCard().listeners.pointerdown(touchEvent(8,195));
touchCard().listeners.pointercancel(touchEvent(8,361));
touchCard().listeners.pointerup(touchEvent(8,361));
check("vertical scrolling and cancelled touch gestures never decide a card",
  touch.get("progress-track").getAttribute("aria-valuenow")===unchanged && touch.get("saved-count").textContent==="1");

const captureTouch=launch();
function dragFromImage(pointerId,start,end) {
  const card=captureTouch.get("card-slot").querySelector("#active-card");
  const image={closest:()=>null};
  const properties=new Map(),classes=new Set();
  card.style={setProperty:(key,value)=>properties.set(key,value),removeProperty:key=>properties.delete(key)};
  card.classList={add:key=>classes.add(key),remove:key=>classes.delete(key)};
  card.setPointerCapture=id=>card.listeners.lostpointercapture({target:image,pointerId:id});
  card.listeners.pointerdown({...touchEvent(pointerId,start),target:image});
  card.listeners.pointermove({...touchEvent(pointerId,end),target:image});
  check("bubbled image capture transfer preserves drag state " + pointerId,
    classes.has("dragging") && properties.get("--drag-x")===(end-start)+"px");
  card.listeners.pointerup({...touchEvent(pointerId,end),target:card});
}
dragFromImage(9,195,361);
dragFromImage(10,195,29);
check("touch from captured image saves right and skips left exactly once",
  captureTouch.named("card_swipe_right").length===1 && captureTouch.named("card_swipe_left").length===1 &&
  captureTouch.get("saved-count").textContent==="1" && captureTouch.get("progress-track").getAttribute("aria-valuenow")==="2");
const cancelledCard=captureTouch.get("card-slot").querySelector("#active-card");
cancelledCard.listeners.pointerdown(touchEvent(11,195));
cancelledCard.listeners.lostpointercapture({target:cancelledCard,pointerId:11});
cancelledCard.listeners.pointerup(touchEvent(11,361));
check("losing the active card capture cancels only that gesture",
  captureTouch.get("progress-track").getAttribute("aria-valuenow")==="2");

const rescue=launch();
rescue.get("skip-button").click();rescue.get("skip-button").click();rescue.get("skip-button").click();
check("rescue question shown only after third consecutive skip",
 rescue.named("filter_question_shown").length===1 &&
 rescue.named("filter_question_shown")[0].question_type==="rescue");
rescue.get("rescue-question").querySelector("#rescue-fridge").click();
check("rescue answer categorized, no free text",rescue.named("filter_answered").length===1 &&
 rescue.named("filter_answered")[0].filter_category==="fridge");

const b=launch("one-question");
check("category experiment question reported when shown",b.named("filter_question_shown")[0].question_type==="category_entry");
b.chooseB("washing");
check("category answer without user text",b.named("filter_answered")[0].filter_category==="laundry" &&
 b.named("card_impression").length===1);
const c=launch("budget-first");
check("budget question shown without logging prices",c.named("filter_question_shown")[0].question_type==="budget_entry");
c.chooseC("1");
const budget=c.named("filter_answered")[0];
check("budget answer tracked as chosen only; no monthly financial value",
 budget.answer_kind==="selected" &&
 !Object.keys(budget).some(x=>["monthly_amount","budget_amount","band_index","income"].includes(x)) &&
 c.named("card_impression").length===1);
console.log("Swipe analytics event integration checks passed.");
