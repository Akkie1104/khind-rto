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
  const state={need:null,budget:null,priority:null,step:0,showAll:false};
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
    if(!step){results();return;}
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
  function productCard(p,overBudget){
    const rate=monthly(p);
    const total=rate*(Number(p.months)||0);
    const safeId=encodeURIComponent(p.id);
    const photo=state.need==="combo"&&p.id.startsWith("COMBO-")?null:p.image;
    return '<article class="guide-result-card">'+
      (photo?'<div class="guide-result-photo"><img src="'+esc(photo)+'" alt="'+esc(p.name+' '+p.id)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"></div>':'<div class="guide-result-photo guide-no-photo"><span>KHIND RTO · '+esc(p.id)+'</span></div>')+
      '<div class="guide-result-info">'+(overBudget?'<span class="guide-warning">Melebihi had pilihan anda</span>':'<span class="guide-fit">Dalam had bulanan</span>')+
      '<h3>'+esc(p.name)+' <small>'+esc(p.id)+'</small></h3>'+
      '<p class="guide-product-desc">'+esc(p.description||categoryNames[state.need])+'</p>'+
      '<div class="guide-regular"><strong>'+money(rate)+'</strong><span>/bulan biasa</span></div>'+
      '<div class="guide-result-meta"><span>'+esc(String(p.months))+' bulan</span><span>Anggaran '+money(total)+' sebelum promosi/caj*</span></div>'+
      (p.id==='WM1248'?'<p class="guide-term-warning">Tempoh model ini perlu disahkan semula dengan KHIND.</p>':'')+
      '<p class="guide-benefit">'+esc(p.benefits||"Sahkan manfaat pelan dengan Hakim.")+'</p>'+
      '<a class="guide-view" href="products/'+safeId+'/">Lihat butiran & pelan →</a></div></article>';
  }
  function results(){
    setProgress(3);
    const {pool,suitable,cap}=candidates();
    const matches=suitable.slice(0,3);
    const maxText=cap===Infinity?"tanpa had yang ditetapkan":"sehingga "+money(cap)+"/bulan";
    const empty=matches.length===0;
    let markup='<div class="guide-head"><p class="guide-eyebrow">CADANGAN IKUT PILIHAN ANDA</p><h2 id="guide-title">'+(empty?'Belum ada yang menepati had ini':'Ini pilihan yang boleh anda bandingkan')+'</h2>'+
      '<p>'+esc(categoryNames[state.need])+' · '+esc(maxText)+'. Kadar di bawah menggunakan <strong>bayaran biasa</strong>, bukan kadar promosi.</p></div>';
    if(!empty)markup+='<div class="guide-results">'+matches.map(p=>productCard(p,false)).join('')+'</div>';
    else {
      markup+='<div class="guide-empty"><strong>Tiada pelan dalam had bajet ini.</strong><p>Jangan pilih hanya kerana kadar promosi yang nampak murah. Anda boleh kembali ubah bajet atau tanya Hakim tentang pilihan lain.</p></div>';
      if(state.showAll)markup+='<div class="guide-results">'+pool.slice().sort((a,b)=>monthly(a)-monthly(b)).slice(0,2).map(p=>productCard(p,true)).join('')+'</div>';
    }
    markup+='<p class="guide-footnote">*Jumlah anggaran = kadar biasa × tempoh; belum mengambil kira potongan promosi, fi, caj tambahan atau perubahan kelayakan. Liputan waranti dan servis bergantung pada pelan KHIND dan mesti disahkan. Ini bukan semakan kelayakan kredit.</p>'+
      '<div class="guide-actions guide-end-actions"><button type="button" class="guide-back" data-guide-reset>↻ Cuba semula</button>'+
      (empty&&!state.showAll&&pool.length?'<button type="button" class="guide-outline" data-guide-over>Lihat pilihan melebihi bajet</button>':'')+
      '<a href="catalogue/" class="guide-skip">Katalog penuh ↗</a></div>';
    root.innerHTML=markup;
    root.querySelector("[data-guide-reset]")?.addEventListener("click",()=>{state.step=0;state.showAll=false;render();dialog.scrollTop=0;});
    root.querySelector("[data-guide-over]")?.addEventListener("click",()=>{state.showAll=true;results();dialog.scrollTop=0;});
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
