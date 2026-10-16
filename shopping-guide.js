/* KHIND RTO Swipe Shop v3 — browse first, filter only when needed.
   No questionnaire, analytics, persistence, or eligibility claims. */
(function(){
"use strict";
const dialog=document.getElementById("guided-shop");
const root=document.getElementById("guide-stage");
if(!dialog||!root||!Array.isArray(window.KHIND_PRODUCTS))return;
const products=window.KHIND_PRODUCTS;
const byId=Object.fromEntries(products.map(p=>[p.id,p]));
const combos={"COMBO-1":["WM1248","DHP90"],"COMBO-2":["WD1468","RFM466A"],"COMBO-3":["WD1468","RFS600A"],"COMBO-4":["ACSON-1.0","ACSON-1.0"],"COMBO-5":["ACSON-1.5","ACSON-1.0"],"COMBO-6":["ACSON-1.5","ACSON-1.5"],"COMBO-7":["ACSON-2.0","ACSON-2.0"],"COMBO-8":["ACSON-1.0","ACSON-2.0"],"COMBO-9":["WM150A","RFM466A"],"COMBO-10":["WM150A","RFS600A"]};
const starter=["WM1248","RF480","ACSON-1.0","RFM466A","WD1468","DHP90","RFS600A","ACSON-1.5"];
const labels={starter:"Keperluan rumah",all:"Semua produk",laundry:"Basuh & kering",fridge:"Peti sejuk",cooling:"Aircond",bundle:"Kombo",garment:"Seterika"};
const money=n=>"RM"+Number(n).toLocaleString("en-MY",{minimumFractionDigits:Number(n)%1?2:0,maximumFractionDigits:2});
const safe=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const rate=p=>Math.min(...(p.plans||[]).map(q=>Number(q.rate)).filter(Number.isFinite));
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
const s={category:"starter",budget:"all",deck:[],index:0,saved:[],history:[],busy:false,session:0};
let priorFocus=null;
const openers=[...document.querySelectorAll("[data-guide-open]")];
function photos(p){
 if(p.category==="bundle"){
  return '<div class="swipe-pair">'+(combos[p.id]||[]).map(id=>byId[id]?.image?
   '<img src="'+safe(byId[id].image)+'" alt="'+safe(byId[id].name)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer">':'').join("")+'</div>';
 }
 return p.image?'<img src="'+safe(p.image)+'" alt="'+safe(p.name+" "+p.id)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer">':
   '<span class="swipe-no-image">Imej belum tersedia</span>';
}
function eligible(p){
 return p.plans?.length>0&&Number.isFinite(rate(p))&&p.months>0;
}
function selection(){
 const ids=s.category==="starter"?starter:null;
 const pool=(ids?ids.map(id=>byId[id]).filter(Boolean):products.filter(p=>s.category==="all"||p.category===s.category))
    .filter(eligible);
 const cap=s.budget==="all"?Infinity:Number(s.budget);
 return pool.filter(p=>rate(p)<=cap).slice(0,8);
}
function progress(){
 const label=dialog.querySelector("#guide-step-label"),bar=dialog.querySelector("#guide-progress");
 if(label)label.textContent=s.index>=s.deck.length?"Pilihan disimpan":"Kad "+(s.index+1)+" / "+s.deck.length;
 if(bar){bar.max=Math.max(1,s.deck.length);bar.value=Math.min(s.index,s.deck.length);}
}
function start(resetSaved){
 s.session++;
 s.busy=false;
 s.deck=selection();
 s.index=0;
 s.history=[];
 if(resetSaved)s.saved=[];
 display();
}
function open(){
 priorFocus=document.activeElement;
 s.category="starter";s.budget="all";s.saved=[];
 start(false);
 if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");
 document.body.classList.add("guide-open");
}
function close(){if(typeof dialog.close==="function")dialog.close();else dialog.removeAttribute("open");}
function filterUi(){
 const cats=Object.entries(labels).map(([v,l])=>'<option value="'+v+'"'+(v===s.category?' selected':'')+'>'+safe(l)+'</option>').join("");
 const budgets=[["all","Semua bajet"],["80","Sehingga RM80"],["100","Sehingga RM100"],["150","Sehingga RM150"],["200","Sehingga RM200"],["300","Sehingga RM300"]].map(([v,l])=>
  '<option value="'+v+'"'+(v===s.budget?' selected':'')+'>'+l+'</option>').join("");
 return '<details class="swipe-filter"><summary>Ubah kategori atau bajet <span aria-hidden="true">⌄</span></summary>'+
   '<div class="swipe-filter-fields"><label>Kategori<select id="swipe-filter-category">'+cats+'</select></label>'+
   '<label>Had bayaran biasa<select id="swipe-filter-budget">'+budgets+'</select></label>'+
   '<button type="button" data-swipe-filter>Guna penapis →</button></div>'+
   '<p>Ini pilihan untuk menapis katalog, bukan semakan kelayakan. Pilihan yang telah disimpan kekal.</p></details>';
}
function wireFilters(){
 root.querySelector("[data-swipe-filter]")?.addEventListener("click",()=>{
   s.category=root.querySelector("#swipe-filter-category").value;
   s.budget=root.querySelector("#swipe-filter-budget").value;
   start(false);
   dialog.scrollTop=0;
 });
}
function top(){
 return '<div class="swipe-v3-intro"><div><p class="guide-eyebrow">TERUS LERET · TAK PERLU JAWAB SOALAN</p>'+
  '<h2 id="guide-title">Jumpa barang yang anda suka.</h2><p>Leret kanan untuk simpan, kiri untuk langkau. Banding kadar biasa sebelum pilih.</p></div>'+
  '<span class="swipe-count" aria-label="'+s.saved.length+' produk disimpan">♥ '+s.saved.length+' / 3</span></div>'+
  filterUi();
}
function empty(){
 progress();
 root.innerHTML=top()+'<div class="guide-empty"><strong>Tiada produk dalam had pilihan ini.</strong>'+
  '<p>Cuba naikkan had bajet atau pilih kategori lain. Kami tidak akan paparkan produk di luar had anda sebagai sesuai.</p></div>'+
  '<div class="guide-actions"><a class="guide-skip" href="catalogue/">Lihat katalog penuh ↗</a><button class="guide-back" data-swipe-reset type="button">Mula semula</button></div>';
 wireFilters();wireReset();
}
function card(){
 const p=s.deck[s.index];
 const amount=rate(p),months=Number(p.months);
 const total=money(amount*months);
 const other=s.deck[s.index+1];
 return '<div class="swipe-arena" aria-label="Leret ke kiri untuk langkau, kanan untuk simpan">'+
   (other?'<div class="swipe-card-peek" aria-hidden="true"></div>':'')+
   '<article class="swipe-card" id="guide-swipe-card" tabindex="0" aria-label="'+safe(p.name)+' '+safe(p.id)+'. ArrowLeft untuk langkau, ArrowRight untuk simpan.">'+
   '<div class="swipe-stamp swipe-stamp-skip" aria-hidden="true">LANGKAU</div><div class="swipe-stamp swipe-stamp-save" aria-hidden="true">SIMPAN</div>'+
   '<div class="swipe-card-photo">'+photos(p)+'</div>'+
   '<div class="swipe-card-details"><span class="swipe-model">'+safe(p.id)+' · KHIND RTO</span><h3>'+safe(p.name)+'</h3>'+
   '<p class="swipe-description">'+safe(p.description||"Sahkan spesifikasi dengan KHIND")+'</p>'+
   '<div class="swipe-payment"><span>KADAR BULANAN BIASA</span>'+
   '<div class="swipe-rate">'+money(amount)+' <small>/bulan</small></div>'+
   '<div class="swipe-meta"><span>'+months+' bulan</span><span>Anggaran '+total+' sebelum promosi/caj*</span></div></div>'+
   (p.id==="WM1248"?'<p class="guide-term-warning">Tempoh WM1248 perlu pengesahan KHIND.</p>':'')+
   (p.stock?'<p class="guide-term-warning">'+safe(p.stock)+'</p>':'')+
   '<p class="swipe-care"><strong>Waranti & servis mengikut pelan</strong>'+safe(p.benefits||"Sahkan butiran pelan dengan Hakim.")+'</p>'+
   '<a href="products/'+encodeURIComponent(p.id)+'/" class="swipe-details-link">Lihat butiran produk ↗</a>'+
   '</div></article></div>';
}
function display(){
 progress();
 if(s.saved.length>=3||s.index>=s.deck.length){summary();return;}
 if(!s.deck.length){empty();return;}
 root.innerHTML=top()+
   '<div class="swipe-current-info"><span>'+safe(labels[s.category])+' · '+(s.budget==="all"?"Semua bajet":"Sehingga "+money(Number(s.budget)))+'</span>'+
   '<span>Kad '+(s.index+1)+' daripada '+s.deck.length+'</span></div>'+
   card()+
   '<div class="swipe-help">← Langkau <span>Leret kad atau guna butang</span> Simpan →</div>'+
   '<div class="swipe-controls"><button type="button" data-swipe="skip" class="swipe-skip">✕ <span>Tak sesuai</span></button>'+
   '<button type="button" data-swipe="save" class="swipe-save">♥ <span>Minat</span></button></div>'+
   '<div class="guide-actions swipe-bottom"><button type="button" class="guide-back" data-swipe-undo '+(!s.history.length?'disabled':'')+'>↶ Undur</button>'+
   '<button type="button" class="guide-outline" data-swipe-finish>Lihat simpanan ('+s.saved.length+')</button>'+
   '<a href="catalogue/" class="guide-skip">Katalog penuh ↗</a></div>'+
   '<p class="swipe-disclaimer">*Jumlah anggaran menggunakan kadar biasa × tempoh, tanpa potongan promosi atau caj. Sahkan tempoh, harga, stok dan perkhidmatan dengan KHIND. Bukan semakan kelayakan.</p>';
 wireFilters();
 root.querySelector('[data-swipe="skip"]')?.addEventListener("click",()=>decide(false));
 root.querySelector('[data-swipe="save"]')?.addEventListener("click",()=>decide(true));
 root.querySelector("[data-swipe-undo]")?.addEventListener("click",undo);
 root.querySelector("[data-swipe-finish]")?.addEventListener("click",summary);
 enableGesture();
 dialog.scrollTop=0;
}
function enableGesture(){
 const el=root.querySelector("#guide-swipe-card");
 if(!el)return;
 let gesture=null;
 const reset=()=>{el.style.transition="";el.style.transform="";el.style.removeProperty("--swipe-left-opacity");el.style.removeProperty("--swipe-right-opacity");};
 el.addEventListener("pointerdown",e=>{
   if(s.busy||e.button!==0||e.target.closest("a, button"))return;
   gesture={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,active:false};
 });
 el.addEventListener("pointermove",e=>{
   if(!gesture||gesture.id!==e.pointerId||s.busy)return;
   const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
   if(!gesture.active){
      if(Math.abs(dy)>13&&Math.abs(dy)>Math.abs(dx)){gesture=null;return;}
      if(Math.abs(dx)<12||Math.abs(dx)<Math.abs(dy))return;
      gesture.active=true;
      try{el.setPointerCapture(e.pointerId);}catch(_){}
   }
   gesture.dx=dx;
   el.style.transition="none";
   el.style.transform="translateX("+dx+"px) rotate("+Math.max(-12,Math.min(12,dx/14))+"deg)";
   const visibility=Math.min(1,Math.abs(dx)/100);
   el.style.setProperty("--swipe-left-opacity",dx<0?String(visibility):"0");
   el.style.setProperty("--swipe-right-opacity",dx>0?String(visibility):"0");
 });
 el.addEventListener("pointerup",e=>{
   if(!gesture||gesture.id!==e.pointerId)return;
   const dx=gesture.dx,dragged=gesture.active;
   gesture=null;
   if(dragged&&Math.abs(dx)>=Math.min(108,el.clientWidth*.27))decide(dx>0);else reset();
 });
 el.addEventListener("pointercancel",()=>{gesture=null;reset();});
 el.addEventListener("lostpointercapture",()=>{if(gesture){gesture=null;reset();}});
 el.addEventListener("keydown",e=>{
   if(e.target!==el||s.busy)return;
   if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();decide(e.key==="ArrowRight");}
 });
}
function decide(save){
 if(s.busy||s.index>=s.deck.length||s.saved.length>=3)return;
 s.busy=true;
 const p=s.deck[s.index],n=s.index,stamp=s.session,el=root.querySelector("#guide-swipe-card");
 const finish=()=>{
   if(stamp!==s.session)return;
   s.history.push({index:n,save});
   if(save&&!s.saved.some(q=>q.id===p.id))s.saved.push(p);
   s.index++;s.busy=false;display();
 };
 if(reduced.matches||!el){finish();return;}
 el.style.transition="";el.style.transform="";
 el.style.removeProperty("--swipe-left-opacity");el.style.removeProperty("--swipe-right-opacity");
 el.classList.add(save?"swipe-exit-right":"swipe-exit-left");
 window.setTimeout(finish,185);
}
function undo(){
 if(s.busy||!s.history.length)return;
 const last=s.history.pop();
 s.index=last.index;
 if(last.save)s.saved=s.saved.filter(p=>p.id!==s.deck[last.index].id);
 display();
}
function wireReset(){
 root.querySelector("[data-swipe-reset]")?.addEventListener("click",()=>{
    s.category="starter";s.budget="all";s.saved=[];start(false);
 });
}
function summary(){
 progress();
 const chosen=s.saved;
 const codes=chosen.map(p=>p.id).join(", ");
 const msg="Salam Hakim, saya cuba Swipe Pilih KHIND RTO di khindrto.akizen.my. Saya minat: "+codes+
 ". Boleh semak kadar biasa, tempoh, jumlah penuh, waranti/servis, stok dan cara permohonan rasmi? Terima kasih.";
 root.innerHTML='<div class="guide-head"><p class="guide-eyebrow">PILIHAN YANG ANDA SIMPAN</p><h2 id="guide-title">'+
 (chosen.length?chosen.length+' barang menarik perhatian anda':'Tiada barang disimpan lagi')+'</h2><p>'+
 (chosen.length?'Semak harga keseluruhan dan perkhidmatan sebelum mohon.':'Tak mengapa. Cuba kategori atau bajet lain.')+'</p></div>'+
 (chosen.length?'<div class="swipe-saved-list">'+chosen.map(p=>
  '<div class="swipe-saved-item"><div class="swipe-saved-photo">'+photos(p)+'</div><div class="swipe-saved-copy"><strong>'+safe(p.name)+
  '</strong><small>'+safe(p.id)+' · '+money(rate(p))+'/bulan biasa</small><a href="products/'+encodeURIComponent(p.id)+'/">Lihat butiran & pelan ↗</a></div></div>').join("")+
  '</div><a class="swipe-whatsapp" href="https://wa.me/60174201247?text='+encodeURIComponent(msg)+
  '" target="_blank" rel="noopener noreferrer">Tanya Hakim tentang pilihan ini ↗</a>':
  '<div class="guide-empty"><p>Anda tak perlu memilih jika belum jumpa yang sesuai.</p></div>')+
 '<p class="guide-footnote">Kadar, stok, kelayakan, waranti dan jumlah akhir mesti disahkan oleh KHIND melalui saluran rasmi. Laman ejen tidak meminta IC atau bayaran.</p>'+
 '<div class="guide-actions guide-end-actions"><button type="button" class="guide-back" data-swipe-undo '+(!s.history.length?'disabled':'')+'>↶ Kembali ke kad</button>'+
 '<button type="button" class="guide-outline" data-swipe-new>Pilih kategori lain</button><a href="catalogue/" class="guide-skip">Katalog penuh ↗</a></div>';
 root.querySelector("[data-swipe-undo]")?.addEventListener("click",undo);
 root.querySelector("[data-swipe-new]")?.addEventListener("click",()=>{
    // Keep the shortlist when choosing additional categories unless already full.
    if(s.saved.length>=3)s.saved=[];
    s.category="all";s.budget="all";start(false);
 });
 dialog.scrollTop=0;
}
openers.forEach(el=>el.addEventListener("click",open));
dialog.querySelector("[data-guide-close]")?.addEventListener("click",close);
dialog.addEventListener("close",()=>{document.body.classList.remove("guide-open");priorFocus?.focus?.();});
dialog.addEventListener("click",e=>{if(e.target===dialog)close();});
if(new URLSearchParams(location.search).get("pilih")==="1")open();
})();
