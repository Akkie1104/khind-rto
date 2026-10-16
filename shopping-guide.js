/* KHIND RTO guided shopping — decision support, not eligibility assessment.
   All shortlist data comes from KHIND_PRODUCTS already used in the storefront.
   No cookies, tracking, personal income collection, or backend calls. */
(function(){
  "use strict";
  const dialog=document.getElementById("guided-shop");
  const root=document.getElementById("guide-stage");
  if(!dialog||!root||!Array.isArray(window.KHIND_PRODUCTS))return;
  const steps=[
    {id:"need",heading:"Apa yang rumah anda perlukan?",description:"Pilih satu. Kami akan kecilkan senarai kepada kategori yang berkaitan.",options:[
      {value:"washer",title:"Mesin basuh",detail:"Basuh pakaian harian",symbol:"01"},
      {value:"washer-dryer",title:"Basuh + kering",detail:"Dua fungsi dalam satu mesin",symbol:"02"},
      {value:"dryer",title:"Pengering",detail:"Keringkan pakaian tanpa jemur",symbol:"03"},
      {value:"fridge",title:"Peti sejuk",detail:"Simpan bahan makanan",symbol:"04"},
      {value:"cooling",title:"Aircond",detail:"Sejukkan ruang rumah",symbol:"05"},
      {value:"combo",title:"Pakej rumah",detail:"Dua barang dalam satu pelan",symbol:"06"},
      {value:"garment",title:"Seterika wap",detail:"Penjagaan pakaian",symbol:"07"}
    ]},
    {id:"budget",heading:"Had bulanan yang selesa?",description:"Kami gunakan kadar BIASA selepas promosi, bukan harga murah enam bulan pertama.",options:[
      {value:"80",title:"Sehingga RM80",detail:"Had bayaran bulanan"},
      {value:"100",title:"Sehingga RM100",detail:"Had bayaran bulanan"},
      {value:"150",title:"Sehingga RM150",detail:"Had bayaran bulanan"},
      {value:"200",title:"Sehingga RM200",detail:"Had bayaran bulanan"},
      {value:"all",title:"Saya belum pasti",detail:"Tunjukkan pilihan paling rendah dahulu"}
    ]},
    {id:"priority",heading:"Yang mana paling penting?",description:"Ini hanya membantu susunan cadangan. Semua butiran sebenar masih perlu dibandingkan.",options:[
      {value:"monthly",title:"Komitmen bulanan rendah",detail:"Mulakan dengan kadar biasa yang lebih rendah",symbol:"A"},
      {value:"care",title:"Waranti & penjagaan",detail:"Utamakan pelan yang menyenaraikan servis",symbol:"B"},
      {value:"capacity",title:"Saiz atau kapasiti",detail:"Utamakan spesifikasi kapasiti yang diketahui",symbol:"C"}
    ]}
  ];
  const categoryNames={washer:"Mesin basuh", "washer-dryer":"Basuh + kering",dryer:"Pengering",fridge:"Peti sejuk",cooling:"Aircond",combo:"Kombo",garment:"Seterika wap"};
  const state={need:null,budget:null,priority:null,step:0,showAll:false,deck:[],deckIndex:0,saved:[],history:[],session:0,busy:false};
  const openButtons=[...document.querySelectorAll("[data-guide-open]")];
  let previousFocus=null;
  const money=n=>"RM"+Number(n).toLocaleString("en-MY",{minimumFractionDigits:Number(n)%1?2:0,maximumFractionDigits:2});
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const choiceMatch=p=>{
    const id=p.id;
    switch(state.need){
      case "washer":return ["WM1248","WM150A"].includes(id);
      case "washer-dryer":return ["WD1468","WD1438"].includes(id);
      case "dryer":return ["DHP90","CD12D"].includes(id);
      case "fridge":return p.category==="fridge";
      case "cooling":return p.category==="cooling";
      case "combo":return p.category==="bundle";
      case "garment":return p.category==="garment";
      default:return false;
    }
  };
  const monthly=p=>Math.min(...(p.plans||[]).map(q=>Number(q.rate)).filter(Number.isFinite));
  const capacity=p=>{
    const m=String(p.description||"").match(/(\d+(?:\.\d+)?)\s*(kg|l|hp)/i);
    return m?Number(m[1]):0;
  };
  const hasCare=p=>/\bservis\b/i.test(String(p.benefits||""))?1:0;
  function candidates(){
    const cap=state.budget==="all"?Infinity:Number(state.budget);
    const pool=window.KHIND_PRODUCTS.filter(p=>choiceMatch(p)&&p.plans?.length&&Number.isFinite(monthly(p)));
    const suitable=pool.filter(p=>monthly(p)<=cap);
    const order=(a,b)=>{
      if(state.priority==="care"){
        const v=hasCare(b)-hasCare(a);
        if(v)return v;
      }
      if(state.priority==="capacity"){
        const c=capacity(b)-capacity(a);
        if(c)return c;
      }
      return monthly(a)-monthly(b)||String(a.id).localeCompare(String(b.id));
    };
    return {pool:pool.sort(order),suitable:suitable.sort(order),cap};
  }
  function setProgress(position){
    const progress=dialog.querySelector("#guide-progress");
    if(progress){progress.max=3;progress.value=position;}
    const indicator=dialog.querySelector("#guide-step-label");
    if(indicator)indicator.textContent=position>=3?"Pilihan anda":"Langkah "+(position+1)+" daripada 3";
  }
  function open(){
    previousFocus=document.activeElement;
    state.need=null;state.budget=null;state.priority=null;state.step=0;state.showAll=false;
    state.deck=[];state.deckIndex=0;state.saved=[];state.history=[];state.session++;state.busy=false;
    render();
    if(typeof dialog.showModal==="function")dialog.showModal();
    else dialog.setAttribute("open","");
    document.body.classList.add("guide-open");
  }
  function close(){
    if(typeof dialog.close==="function")dialog.close();
    else dialog.removeAttribute("open");
  }
  function render(){
    const step=steps[state.step];
    if(!step){if(state.step===3)startDeck();else summary();return;}
    setProgress(state.step);
    root.innerHTML='<div class="guide-head"><p class="guide-eyebrow">BANTU SAYA PILIH · 30–60 SAAT</p><h2 id="guide-title">'+esc(step.heading)+'</h2><p>'+esc(step.description)+'</p></div>'+
      '<div class="guide-options '+(state.step===0?"guide-options-needs":"")+'">'+
      step.options.map(opt=>'<button type="button" class="guide-option" data-guide-choice="'+esc(opt.value)+'"'+(state[step.id]===opt.value?' aria-pressed="true"':' aria-pressed="false"')+'>'+
      (opt.symbol?'<span class="guide-option-number" aria-hidden="true">'+esc(opt.symbol)+'</span>':'')+
      '<span><strong>'+esc(opt.title)+'</strong><small>'+esc(opt.detail)+'</small></span><span class="guide-arrow" aria-hidden="true">→</span></button>').join('')+
      '</div><div class="guide-actions"><button class="guide-back" type="button" data-guide-back '+(state.step===0?"disabled":"")+'>← Kembali</button><a href="catalogue/" class="guide-skip">Lihat semua produk ↗</a></div>';
    root.querySelectorAll("[data-guide-choice]").forEach(btn=>btn.addEventListener("click",()=>{
      state[step.id]=btn.dataset.guideChoice;
      state.step++;
      render();
      dialog.scrollTop=0;
    }));
    root.querySelector("[data-guide-back]")?.addEventListener("click",()=>{
      if(state.step>0){state.step--;render();dialog.scrollTop=0;}
    });
  }

  const comboPairs={
    "COMBO-1":["WM1248","DHP90"],"COMBO-2":["WD1468","RFM466A"],
    "COMBO-3":["WD1468","RFS600A"],"COMBO-4":["ACSON-1.0","ACSON-1.0"],
    "COMBO-5":["ACSON-1.5","ACSON-1.0"],"COMBO-6":["ACSON-1.5","ACSON-1.5"],
    "COMBO-7":["ACSON-2.0","ACSON-2.0"],"COMBO-8":["ACSON-1.0","ACSON-2.0"],
    "COMBO-9":["WM150A","RFM466A"],"COMBO-10":["WM150A","RFS600A"]
  };
  const dataById=Object.fromEntries(window.KHIND_PRODUCTS.map(p=>[p.id,p]));
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  const names={monthly:"kadar bulanan",care:"waranti dan servis",capacity:"kapasiti"};
  function photo(p){
    if(p.category==="bundle"){
      const ids=comboPairs[p.id]||[];
      return '<div class="swipe-pair">'+ids.map(id=>dataById[id]?.image?
        '<img src="'+esc(dataById[id].image)+'" alt="'+esc(dataById[id].name)+'" loading="lazy" referrerpolicy="no-referrer" decoding="async">':'').join("")+'</div>';
    }
    return p.image?'<img src="'+esc(p.image)+'" alt="'+esc(p.name+' '+p.id)+'" loading="lazy" referrerpolicy="no-referrer" decoding="async">'
      :'<span class="swipe-no-image">Gambar belum tersedia</span>';
  }
  function actions(){
    return '<div class="guide-actions guide-end-actions"><button class="guide-back" type="button" data-guide-reset>↻ Mulakan semula</button>'+
    '<a href="catalogue/" class="guide-skip">Katalog penuh ↗</a></div>';
  }
  function wireActions(){
    root.querySelector("[data-guide-reset]")?.addEventListener("click",()=>{
      state.step=0;state.deck=[];state.deckIndex=0;state.saved=[];state.history=[];state.session++;state.busy=false;state.showAll=false;
      render();dialog.scrollTop=0;
    });
  }
  function noMatches(){
    setProgress(3);
    const {pool,cap}=candidates();
    const low=pool.length?Math.min(...pool.map(monthly)):null;
    const budget=Number.isFinite(cap)?money(cap):"yang dipilih";
    root.innerHTML='<div class="guide-head"><p class="guide-eyebrow">KEPUTUSAN PANDUAN</p><h2 id="guide-title">Belum ada pelan dalam bajet ini</h2>'+
    '<p>Untuk '+esc(categoryNames[state.need])+', tiada produk yang kadar <strong>biasanya</strong> tidak melebihi '+esc(budget)+'/bulan.</p></div>'+
    '<div class="guide-empty"><strong>Kami tidak akan cadangkan pelan di luar had anda sebagai sesuai.</strong><p>'+
    (low!==null?'Kadar biasa terendah dalam kategori ini: '+money(low)+'/bulan. ':'')+
    'Anda boleh pilih had baharu atau tanya Hakim tentang pilihan sebenar.</p></div>'+
    '<div class="guide-actions"><button class="guide-outline" type="button" data-guide-budget>← Ubah bajet</button>'+
    '<a href="catalogue/" class="guide-skip">Banding produk sendiri ↗</a></div>';
    root.querySelector("[data-guide-budget]")?.addEventListener("click",()=>{
      state.step=1;render();dialog.scrollTop=0;
    });
  }
  function startDeck(){
    setProgress(3);
    const {suitable}=candidates();
    if(!suitable.length){noMatches();return;}
    // Keep the number of decisions bounded; shortlist is not a credit/approval ranking.
    state.deck=suitable.slice(0,6);
    state.deckIndex=0;state.saved=[];state.history=[];state.busy=false;state.session++;
    swipeView();
  }
  function resultTerms(p){
    const rate=monthly(p),total=rate*(Number(p.months)||0);
    return '<div class="swipe-payment"><span>KADAR BIASA SELEPAS PROMOSI</span>'+
      '<div class="swipe-rate">'+money(rate)+' <small>/bulan</small></div>'+
      '<div class="swipe-meta"><span>'+esc(String(p.months))+' bulan</span><span>Anggaran '+money(total)+' sebelum promosi & caj*</span></div></div>'+
      (p.id==="WM1248"?'<p class="guide-term-warning">Tempoh sebenar WM1248 perlu disahkan dengan KHIND.</p>':'');
  }
  function swipeView(){
    if(state.deckIndex>=state.deck.length || state.saved.length>=3){state.step=4;summary();return;}
    setProgress(3);
    const p=state.deck[state.deckIndex];
    const n=state.deck.length,k=state.deckIndex+1;
    const preview=state.deck[state.deckIndex+1];
    const savedCount=state.saved.length;
    const noImage=!!(!p.image&&!comboPairs[p.id]);
    const label='Kad '+k+' daripada '+n;
    const headline=categoryNames[state.need]+' · '+(state.budget==="all"?"tiada had ditetapkan":"had "+money(Number(state.budget))+"/bulan");
    root.innerHTML='<div class="guide-swipe-heading"><div><p class="guide-eyebrow">LERET UNTUK PILIH · '+esc(label)+'</p>'+
      '<h2 id="guide-title">Yang ini sesuai untuk rumah anda?</h2><p>'+esc(headline)+'</p></div>'+
      '<span class="swipe-count" aria-label="'+savedCount+' pilihan disimpan">'+savedCount+' / 3 disimpan</span></div>'+
      '<div class="swipe-arena" aria-label="Leret kad ke kiri untuk langkau atau kanan untuk simpan">'+
      (preview?'<div class="swipe-card-peek" aria-hidden="true"></div>':'')+
      '<article class="swipe-card" id="guide-swipe-card" tabindex="0" aria-label="'+esc(p.name)+' '+esc(p.id)+'. Leret kiri untuk langkau, kanan untuk simpan. Gunakan butang di bawah jika mahu.">'+
      '<div class="swipe-stamp swipe-stamp-skip" aria-hidden="true">LANGKAU</div>'+
      '<div class="swipe-stamp swipe-stamp-save" aria-hidden="true">SIMPAN</div>'+
      '<div class="swipe-card-photo'+(noImage?' swipe-card-placeholder':'')+'">'+photo(p)+'</div>'+
      '<div class="swipe-card-details"><span class="swipe-model">'+esc(p.id)+' · '+esc(categoryNames[state.need])+'</span>'+
      '<h3>'+esc(p.name)+'</h3><p class="swipe-description">'+esc(p.description||"Semak spesifikasi rasmi produk")+'</p>'+
      resultTerms(p)+
      '<p class="swipe-care"><strong>Waranti & servis pelan</strong>'+esc(p.benefits||"Sahkan manfaat dengan Hakim.")+'</p>'+
      '<a href="products/'+encodeURIComponent(p.id)+'/" class="swipe-details-link">Baca butiran penuh ↗</a></div></article></div>'+
      '<div class="swipe-help">← Langkau <span>Leret kad atau tekan butang</span> Simpan →</div>'+
      '<div class="swipe-controls"><button type="button" class="swipe-skip" data-swipe="skip" aria-label="Langkau '+esc(p.name)+'">✕ <span>Tak sesuai</span></button>'+
      '<button type="button" class="swipe-save" data-swipe="save" aria-label="Simpan '+esc(p.name)+'">♥ <span>Minat</span></button></div>'+
      '<div class="guide-actions swipe-bottom"><button type="button" class="guide-back" data-swipe-undo '+(!state.history.length?'disabled':'')+'>↶ Kad sebelumnya</button>'+
      '<a href="catalogue/" class="guide-skip">Langkau panduan ↗</a></div>'+
      '<p class="swipe-disclaimer">Ini alat bantu pilihan, bukan semakan kelayakan. Kadar biasa dan tempoh berdasarkan katalog ejen. Sahkan harga serta terma terkini dengan KHIND.</p>'+
      '<p class="sr-only" id="swipe-live" aria-live="polite">'+esc(label)+'</p>';
    const card=root.querySelector("#guide-swipe-card");
    root.querySelector('[data-swipe="skip"]')?.addEventListener("click",()=>decide(false));
    root.querySelector('[data-swipe="save"]')?.addEventListener("click",()=>decide(true));
    root.querySelector("[data-swipe-undo]")?.addEventListener("click",undo);
    // Horizontal-only drag: preserve normal vertical scrolling on phones.
    let drag=null;
    card?.addEventListener("pointerdown",e=>{
      if(state.busy||e.button!==0||e.target.closest("a, button"))return;
      drag={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,moving:false};
    });
    card?.addEventListener("pointermove",e=>{
      if(!drag||drag.id!==e.pointerId||state.busy)return;
      const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
      if(!drag.moving){
        if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>12){drag=null;return;}
        if(Math.abs(dx)<12||Math.abs(dx)<Math.abs(dy))return;
        drag.moving=true;
        try{card.setPointerCapture(e.pointerId);}catch(_){}
      }
      drag.dx=dx;
      card.style.transition="none";
      card.style.transform='translateX('+dx+'px) rotate('+Math.max(-13,Math.min(13,dx/13))+'deg)';
      const magnitude=Math.min(1,Math.abs(dx)/100);
      card.style.setProperty("--swipe-left-opacity",dx<0?String(magnitude):"0");
      card.style.setProperty("--swipe-right-opacity",dx>0?String(magnitude):"0");
    });
    const reset=()=>{
      card.style.transition="";
      card.style.transform="";
      card.style.removeProperty("--swipe-left-opacity");
      card.style.removeProperty("--swipe-right-opacity");
    };
    card?.addEventListener("pointerup",e=>{
      if(!drag||drag.id!==e.pointerId)return;
      const dx=drag.dx,wasMoving=drag.moving;
      drag=null;
      if(wasMoving&&Math.abs(dx)>=Math.min(110,card.clientWidth*.26)){decide(dx>0);}
      else reset();
    });
    card?.addEventListener("pointercancel",()=>{drag=null;reset();});
    card?.addEventListener("lostpointercapture",()=>{if(drag){drag=null;reset();}});
    card?.addEventListener("keydown",e=>{
      if(e.target!==card||state.busy)return;
      if(e.key==="ArrowLeft"||e.key==="ArrowRight"){
        e.preventDefault();decide(e.key==="ArrowRight");
      }
    });
    dialog.scrollTop=0;
  }
  function decide(save){
    if(state.busy||state.deckIndex>=state.deck.length)return;
    state.busy=true;
    const index=state.deckIndex,p=state.deck[index],card=root.querySelector("#guide-swipe-card");
    const session=state.session;
    const finish=()=>{
      if(session!==state.session)return;
      state.history.push({index,save});
      if(save&&!state.saved.some(x=>x.id===p.id))state.saved.push(p);
      state.deckIndex++;state.busy=false;
      if(state.deckIndex>=state.deck.length||state.saved.length>=3){state.step=4;summary();}
      else swipeView();
    };
    if(reduced.matches||!card){finish();return;}
    card.style.transition="";
    card.style.transform="";
    card.style.removeProperty("--swipe-left-opacity");
    card.style.removeProperty("--swipe-right-opacity");
    card.classList.add(save?"swipe-exit-right":"swipe-exit-left");
    window.setTimeout(finish,185);
  }
  function undo(){
    if(state.busy||!state.history.length)return;
    const last=state.history.pop();
    state.deckIndex=last.index;
    if(last.save)state.saved=state.saved.filter(p=>p.id!==state.deck[last.index].id);
    state.step=3;swipeView();
  }
  function summary(){
    setProgress(3);
    const selected=state.saved;
    const count=selected.length;
    const selection=selected.map(p=>p.id).join(", ");
    const msg="Salam Hakim, saya guna panduan KHIND RTO di khindrto.akizen.my. Saya berminat dengan: "+selection+
      ". Boleh bantu semak harga, stok, terma bulanan biasa, waranti/servis dan cara mohon rasmi? Terima kasih.";
    root.innerHTML='<div class="guide-head"><p class="guide-eyebrow">SENARAI PILIHAN ANDA</p>'+
      '<h2 id="guide-title">'+(count?"Ini barang yang anda simpan":"Belum ada yang kena dengan pilihan anda")+'</h2>'+
      '<p>'+(count?'Anda memilih '+count+' produk. Semak butiran satu per satu sebelum memohon.':
      'Tak mengapa. Cuba kategori atau bajet lain, atau terus berbual dengan Hakim.')+'</p></div>'+
      (count?'<div class="swipe-saved-list">'+selected.map(p=>'<div class="swipe-saved-item">'+
         '<div class="swipe-saved-photo">'+photo(p)+'</div><div class="swipe-saved-copy"><strong>'+esc(p.name)+'</strong><small>'+esc(p.id)+' · '+money(monthly(p))+'/bulan biasa</small>'+
         '<a href="products/'+encodeURIComponent(p.id)+'/">Semak pelan & jumlah ↗</a></div></div>').join("")+'</div>'+
         '<a class="swipe-whatsapp" href="https://wa.me/60174201247?text='+encodeURIComponent(msg)+'" target="_blank" rel="noopener noreferrer">Tanya Hakim tentang pilihan ini ↗</a>':
         '<div class="guide-empty"><strong>Panduan tidak membuat pilihan bagi pihak anda.</strong><p>Anda boleh cuba semula atau lihat semua produk. Kami tidak menganggap setiap produk sesuai untuk semua bajet.</p></div>')+
      '<p class="guide-footnote">Jumlah akhir, kelayakan, tempoh kontrak serta manfaat servis mesti disahkan dengan KHIND. Tiada data peribadi disimpan oleh panduan ini.</p>'+
      '<div class="guide-actions guide-end-actions"><button type="button" class="guide-back" data-guide-undo '+(!state.history.length?'disabled':'')+'>↶ Kembali ke kad</button><button class="guide-outline" type="button" data-guide-reset>↻ Pilih semula</button>'+
      '<a href="catalogue/" class="guide-skip">Semua produk ↗</a></div>';
    root.querySelector("[data-guide-undo]")?.addEventListener("click",undo);
    wireActions();
    dialog.scrollTop=0;
  }
  openButtons.forEach(btn=>btn.addEventListener("click",open));
  dialog.querySelector("[data-guide-close]")?.addEventListener("click",close);
  dialog.addEventListener("close",()=>{
    document.body.classList.remove("guide-open");
    if(previousFocus&&typeof previousFocus.focus==="function")previousFocus.focus();
  });
  dialog.addEventListener("click",e=>{
    if(e.target===dialog){close();}
  });
  // An explicit internal URL from the catalogue may open the guide on arrival.
  if(new URLSearchParams(location.search).get("pilih")==="1")open();
})();
