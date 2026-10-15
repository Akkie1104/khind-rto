'use strict';

const ALLOWED_PRODUCT_CATEGORIES = new Set(['laundry','fridge','cooling','garment','bundle']);
const ALLOWED_IMAGE_HOSTS = new Set(['cdn.prod.website-files.com','dtrfh4tzb23hn.cloudfront.net']);
const ALLOWED_SOURCE_HOSTS = new Set(['khindrto.com.my','www.khindrto.com.my','khind.com.my','www.khind.com.my','easyr2o.khind.com.my']);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));
const positiveNumber = value => {
  if(value===null||value===undefined||value==='')return null;
  const number=Number(value);
  return Number.isFinite(number)&&number>=0?number:null;
};
function safeHttpsUrl(value, allowedHosts){
  if(!value)return '';
  try{
    const url=new URL(String(value), window.location.href);
    const localDev=(url.hostname==='localhost'||url.hostname==='127.0.0.1')&&url.origin===window.location.origin;
    const sameOrigin=url.origin===window.location.origin;
    if(!(url.protocol==='https:'||(localDev&&url.protocol==='http:')))return '';
    if(!sameOrigin&&!allowedHosts.has(url.hostname))return '';
    return url.href;
  }catch{
    return '';
  }
}
function normalizeProduct(product){
  if(!product||typeof product!=='object')return null;
  const id=String(product.id??'').trim();
  const name=String(product.name??'').trim();
  const category=String(product.category??'').trim();
  if(!/^[A-Za-z0-9._-]+$/.test(id)||!name||!ALLOWED_PRODUCT_CATEGORIES.has(category))return null;
  const plans=Array.isArray(product.plans)?product.plans.map(plan=>{
    const rate=positiveNumber(plan?.rate);
    if(rate===null)return null;
    return {name:String(plan?.name??'Pelan').trim()||'Pelan',rate};
  }).filter(Boolean):[];
  const monthsRaw=positiveNumber(product.months);
  const months=monthsRaw===null?null:Math.trunc(monthsRaw);
  if(plans.length&&(!months||months<1))return null;
  return {
    ...product,
    id,
    name,
    description:String(product.description??''),
    category,
    cash:positiveNumber(product.cash),
    cashPromo:positiveNumber(product.cashPromo),
    months,
    plans,
    image:safeHttpsUrl(product.image,ALLOWED_IMAGE_HOSTS),
    source:safeHttpsUrl(product.source,ALLOWED_SOURCE_HOSTS),
    benefits:String(product.benefits??''),
    stock:String(product.stock??''),
    keywords:Array.isArray(product.keywords)?product.keywords.map(value=>String(value)):[],
    campaignSource:String(product.campaignSource??''),
    yearEndPromo:product.yearEndPromo!==false,
    verifiedDate:String(product.verifiedDate??''),
    sourceConflict:product.sourceConflict&&typeof product.sourceConflict==='object'?{
      ...product.sourceConflict,
      note:String(product.sourceConflict.note??''),
      publicTenureMonths:positiveNumber(product.sourceConflict.publicTenureMonths),
      publicMonthlyRate:positiveNumber(product.sourceConflict.publicMonthlyRate),
      publicCashPrice:positiveNumber(product.sourceConflict.publicCashPrice)
    }:null
  };
}
const rawProducts = Array.isArray(window.KHIND_PRODUCTS) ? window.KHIND_PRODUCTS : [];
const products = rawProducts.map(normalizeProduct).filter(Boolean);
const money = value => 'RM' + new Intl.NumberFormat('en-MY',{minimumFractionDigits:Number.isInteger(value)?0:2,maximumFractionDigits:2}).format(value);
const today = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const active = (start,end) => today >= start && today <= end;
const q3 = false; // retired Q3 campaign
const yearEndCampaign = active('2026-10-01','2026-12-31');
const cashCampaign = active('2026-10-01','2026-10-31');
const dryerCampaign = yearEndCampaign;
const enquiry = text => 'https://wa.me/60174201247?text=' + encodeURIComponent('Salam Hakim, '+text+' Mohon sahkan stok, kelayakan promosi, jumlah awal dan syarat penuh.');
const cashPrice = p => cashCampaign && p.cashPromo ? p.cashPromo : p.cash;
const byId = Object.fromEntries(products.map(p=>[p.id,p]));
const categoryLabels={
  laundry:'Basuh & kering',
  fridge:'Peti sejuk',
  cooling:'Penyaman udara',
  garment:'Penjagaan pakaian',
  bundle:'Kombo'
};
const decisionMeta = {
  WM1248:['9kg','3–5 orang','598 × 608 × 845mm'],
  DHP90:['9kg','Heat pump','598 × 652 × 845mm'],
  WD1468:['11kg basuh','7kg kering','2-dalam-1'],
  RFS600A:['592L','Side-by-side','Waranti RTO 5 tahun'],
  RFM466A:['466L','Multi-door','Waranti RTO 5 tahun'],
  RF480:['480L','Peti sejuk','Waranti RTO 5 tahun'],
  WM150A:['15kg','Muatan atas','Waranti RTO 4 tahun'],
  'ACSON-1.0':['1.0HP','5 servis tahunan','10 kaki paip standard'],
  'ACSON-1.5':['1.5HP','5 servis tahunan','10 kaki paip standard'],
  'ACSON-2.0':['2.0HP','5 servis tahunan','10 kaki paip standard'],
  SI6029BP:['Seterika wap','Papan seterika (Premium)','Waranti 2 tahun'],
  WD1438:['10kg basuh','6kg kering','Sabah sahaja'],
  CD12D:['12kg','Air-vented','RM75 × 48 bulan']
};
const bundleParts = {
  'COMBO-1':['WM1248','DHP90'],
  'COMBO-2':['WD1468','RFM466A'],
  'COMBO-3':['WD1468','RFS600A'],
  'COMBO-4':['ACSON-1.0','ACSON-1.0'],
  'COMBO-5':['ACSON-1.5','ACSON-1.0'],
  'COMBO-6':['ACSON-1.5','ACSON-1.5'],
  'COMBO-7':['ACSON-2.0','ACSON-2.0'],
  'COMBO-8':['ACSON-1.0','ACSON-2.0'],
  'COMBO-9':['WM150A','RFM466A'],
  'COMBO-10':['WM150A','RFS600A']
};
function schedule(p,plan){
 let first=plan.rate,discount=false,end='',promoLabel='';
 if(yearEndCampaign&&p.yearEndPromo){
   discount=true;
   end='31 Disember 2026';
   if(p.id==='DHP90'){
     first=30;
     promoLabel='65% OFF · 6 BULAN PERTAMA';
   }else if(p.category==='bundle'){
     first=65;
     promoLabel='RM65 · 6 BULAN PERTAMA';
   }else{
     first=plan.rate/2;
     promoLabel='50% OFF · 6 BULAN PERTAMA';
   }
 }
 return {first,discount,end,promoLabel,total:discount?first*6+plan.rate*(p.months-6):plan.rate*p.months};
}
const heroImage=document.querySelector('#hero-image');
const heroProduct=byId.WM1248||products[0]||null;
function showHeroFallback(){
  if(!heroImage||heroImage.dataset.failed)return;
  heroImage.dataset.failed='1';
  heroImage.hidden=true;
  const fallback=document.createElement('span');
  fallback.className='hero-image-fallback no-image';
  fallback.textContent='Gambar produk tidak tersedia';
  heroImage.after(fallback);
}
if(heroImage&&heroProduct){
  heroImage.src=heroProduct.image||'';
  heroImage.alt=heroProduct.name+' '+heroProduct.id;
  heroImage.closest('.hero-product-image').dataset.model=heroProduct.id;
  if(!heroProduct.image)showHeroFallback();
  else heroImage.addEventListener('error',showHeroFallback,{once:true});
}else if(heroImage){
  showHeroFallback();
}
if(heroProduct&&heroProduct.plans.length){
 const plan=heroProduct.plans[0], preview=schedule(heroProduct,plan);
 const rate=document.querySelector('#hero-rate'),regular=document.querySelector('#hero-regular'),terms=document.querySelector('#hero-terms');
 if(rate)rate.textContent=money(preview.first);
 if(regular)regular.textContent=preview.discount?'Selepas 6 bulan: '+money(plan.rate)+'/bulan · '+heroProduct.months+' bulan':'Kadar biasa '+money(plan.rate)+'/bulan · '+heroProduct.months+' bulan';
 if(terms)terms.textContent=preview.discount?'6 bulan pertama; tertakluk kelayakan promosi.':'Kadar rujukan; sahkan terma akhir.';
}
const banner=document.querySelector('#campaign');
if(yearEndCampaign) banner.innerHTML='<b>Promosi 1 Okt – 31 Dis 2026</b><span>Produk individu terpilih: 50% untuk 6 bulan pertama · Kombo: RM65 untuk 6 bulan pertama · DHP90: dari RM30 untuk 6 bulan pertama.<small>Kadar biasa bersambung selepas tempoh promosi. Tertakluk kelayakan, stok dan pengesahan KHIND.</small></span>';
let category='all';
const grid=document.querySelector('#products');
const categoryStory=document.querySelector('#category-story');
function renderCategoryStory(term){
  categoryStory.dataset.category=term?'all':category;
  categoryStory.innerHTML='<div class="story-inner"><h3 class="story-title">'+(term?'Hasil carian':category==='all'?'Semua peralatan':categoryLabels[category])+'</h3><p class="story-copy">'+(term?'Carian merangkumi model individu dan kombo.':category==='bundle'?'Dua peralatan, satu pelan. Semak jumlah komitmen sebelum memilih.':'Bandingkan fungsi, tempoh dan jumlah bayaran sebelum memilih.')+'</p></div>';
}

function decisionPoints(p){
  if(decisionMeta[p.id])return decisionMeta[p.id].map(value=>String(value));
  if(p.category==='bundle')return ['2 unit','Satu pelan','Semak manfaat sebenar'];
  return [];
}
function productVisual(p){
  const parts=bundleParts[p.id];
  if(parts){
    return '<div class="combo-art">'+parts.map(id=>{
      const item=byId[id];
      return item&&item.image
        ? '<img src="'+item.image+'" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">'
        : '<span class="no-image" aria-hidden="true">Gambar tidak tersedia</span>';
    }).join('')+'</div>';
  }
  return p.image
    ? '<img src="'+p.image+'" alt="'+escapeHTML(p.name+' '+p.id)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer">'
    : '<span class="no-image">'+escapeHTML(p.id)+'</span>';
}
function searchableText(p){
  return [p.name,p.id,p.description,categoryLabels[p.category],...(p.keywords||[])].filter(Boolean).join(' ').toLowerCase();
}
function promoEligible(p){
  return yearEndCampaign&&p.yearEndPromo&&p.plans&&p.plans.length>0;
}
function rtoCardSummary(p,plan,sched){
 const multi=p.plans.length>1;
 const firstLabel=sched.discount?'6 bulan pertama':'Kadar bulanan biasa';
 const next=sched.discount?'Selepas promosi: '+(multi?'dari ':'')+money(plan.rate)+'/bulan':(multi?'Pilihan pelan lain tersedia.':'Kadar ini sepanjang tempoh kontrak.');
 const total=p.sourceConflict?'Perlu pengesahan':money(sched.total+1);
 return '<div class="shop-price" aria-label="Ringkasan RTO">'+
 '<span class="shop-price-label">'+firstLabel+'</span>'+
 '<div class="shop-price-main"><strong>'+money(sched.first)+'</strong><span>/bulan</span></div>'+
 '<span class="shop-price-next">'+next+'</span>'+
 '<div class="shop-price-commitment"><span>Tempoh pelan</span><strong>'+p.months+' bulan</strong></div>'+
 '<div class="shop-price-commitment"><span>Anggaran jumlah RTO*</span><strong>'+total+'</strong></div>'+
 '<p class="pricing-foot">*Termasuk anggaran fi pemprosesan RM1. Caj tambahan & bayaran pertama perlu pengesahan KHIND.</p>'+
 '</div>';
}
let budgetCap=null;
const budgetButtons=[...document.querySelectorAll('[data-budget]')];
const budgetFeedback=document.querySelector('#budget-feedback');
function setBudget(value){
 budgetCap=value==='all'?null:Number(value);
 budgetButtons.forEach(button=>{
  const selected=button.dataset.budget===value;
  button.classList.toggle('active',selected);
  button.setAttribute('aria-pressed',String(selected));
 });
 if(budgetFeedback)budgetFeedback.textContent=budgetCap===null?
  'Semua bajet dipaparkan. Bandingkan kadar biasa, tempoh dan jumlah pembayaran.':
  'Pelan dengan kadar biasa sehingga '+money(budgetCap)+'/bulan. Ini bukan semakan kelayakan.';
 render();
 document.querySelector('#koleksi').scrollIntoView({behavior:'smooth',block:'start'});
}
budgetButtons.forEach(button=>button.addEventListener('click',()=>setBudget(button.dataset.budget)));
function render(){
 const searchInput=document.querySelector('#search');
 if(!products.length){
   document.querySelector('#count').textContent='Katalog tidak tersedia';
   categoryStory.innerHTML='<div class="story-inner"><h3 class="story-title">Katalog sementara tidak tersedia</h3><p class="story-copy">Sila hubungi Hakim untuk semakan produk dan harga terkini.</p></div>';
   grid.innerHTML='<div class="category-state"><h3>Maaf, data katalog tidak dapat dimuatkan dengan selamat.</h3><p>Kami tidak akan memaparkan harga yang rosak atau tidak lengkap. Gunakan WhatsApp untuk mendapatkan maklumat terkini.</p><a class="button dark" href="'+enquiry('saya mahu semak katalog KHIND terkini.')+'" target="_blank" rel="noopener noreferrer">Semak dengan Hakim →</a></div>';
   return;
 }
 const term=searchInput.value.trim().toLowerCase();
 const cash=document.querySelector('#payment').value==='cash';
 let shown=term
   ?products.filter(p=>searchableText(p).includes(term))
   :products.filter(p=>category==='all'?p.category!=='bundle':p.category===category);
 if(budgetCap!==null)shown=shown.filter(p=>p.plans.some(plan=>plan.rate<=budgetCap));
 renderCategoryStory(term);
 document.querySelector('#count').textContent=shown.length+(term?' hasil carian':' '+(category==='bundle'?'kombo':'model'));
 grid.classList.remove('category-view');

 if(cash&&category==='bundle'&&!term){
   grid.innerHTML='<div class="category-state"><p class="eyebrow">KOMBO · RTO SAHAJA</p><h3>Kombo ditawarkan melalui pelan RTO.</h3><p>Bayaran penuh tidak tersedia untuk kategori ini. Tukar ke paparan RTO untuk melihat kadar bulanan dan jumlah komitmen setiap kombo.</p><button id="show-bundle-rto" class="button dark" type="button">Lihat harga RTO →</button></div>';
   document.querySelector('#show-bundle-rto').addEventListener('click',()=>{
     setPaymentMode('rto');
   });   return;
 }

 grid.innerHTML=shown.map(p=>{
   const plan=p.plans[0]||null;
   const sched=plan?schedule(p,plan):null;
   const decisions=decisionPoints(p).slice(0,3).map(x=>'<li>'+escapeHTML(x)+'</li>').join('');
   const categoryResult=term?'<p class="result-category">'+escapeHTML(categoryLabels[p.category]||'Produk')+'</p>':'';
   const promo=promoEligible(p)&&sched?'<span class="promo-tag">'+escapeHTML(sched.promoLabel)+'</span>':'';
   const benefit=!cash&&p.benefits?'<p class="card-benefits"><b>Waranti & manfaat pelan</b>'+escapeHTML(p.benefits)+'</p>':'';
   const conflict=p.sourceConflict?'<p class="verification-flag">Tempoh pelan perlu disahkan dengan KHIND sebelum membuat keputusan.</p>':'';
   let pricing='',action='Lihat pelan & butiran',buttonAttr='data-product="'+p.id+'"';
   if(cash){
     const amount=cashPrice(p);
     if(amount==null){
       if(p.category==='bundle'&&p.plans.length){
         pricing='<div class="cash-unavailable"><strong>Kombo ialah pelan RTO</strong><span>Bayaran penuh tidak tersedia.</span></div>';
         action='Lihat harga RTO';
         buttonAttr='data-rto-product="'+p.id+'"';
       }else{
         pricing='<div class="cash-unavailable"><strong>Bayaran penuh belum disahkan</strong><span>Tanya Hakim untuk harga terkini.</span></div>';
         action='Semak harga penuh';
       }
     }else{
       pricing='<div class="price-block cash-price"><span class="shop-price-label">Bayaran penuh</span><div><span class="price">'+money(amount)+'</span>'+(cashCampaign&&p.cashPromo&&p.cashPromo<p.cash?'<span class="cash-original">'+money(p.cash)+'</span>':'')+'</div><p class="price-note">'+(cashCampaign&&p.cashPromo&&p.cashPromo<p.cash?'Promosi hingga 31 Okt 2026':'Harga rujukan · sahkan harga akhir')+'</p></div>';
     }
   }else if(sched){
     pricing=rtoCardSummary(p,plan,sched);
   }else{
     pricing='<div class="cash-unavailable"><strong>Pelan belum disahkan</strong><span>Hubungi Hakim untuk semakan.</span></div>';
   }
   const askUrl=enquiry('saya berminat dengan '+p.name+' ('+p.id+').');
   return '<article class="card" data-model="'+escapeHTML(p.id)+'"><div class="product-art">'+productVisual(p)+'</div><div class="card-content">'+categoryResult+'<p class="model">'+escapeHTML(p.category==='bundle'?'PAKEJ DUA PERALATAN':p.id)+'</p><h3>'+escapeHTML(p.name)+'</h3><p class="description">'+escapeHTML(p.description)+'</p><ul class="decision-points" aria-label="Maklumat ringkas">'+decisions+'</ul>'+promo+pricing+benefit+conflict+'<p class="stock">'+escapeHTML(p.stock)+'</p><div class="card-actions"><button aria-label="Lihat butiran '+escapeHTML(p.name+' '+p.id)+'" '+buttonAttr+'>'+action+'</button><a class="card-whatsapp" href="'+askUrl+'" target="_blank" rel="noopener noreferrer" aria-label="Tanya Hakim tentang '+escapeHTML(p.name+' '+p.id)+'"><span class="wa-mark" aria-hidden="true">WA</span><span>Tanya</span></a></div></div></article>';
 }).join('') || '<p class="empty">Tiada model sepadan. Cuba istilah lain seperti aircond, fridge, washer atau dryer.</p>';
 grid.querySelectorAll('[data-product]').forEach(b=>b.addEventListener('click',()=>openDetail(products.find(p=>p.id===b.dataset.product))));
 grid.querySelectorAll('[data-rto-product]').forEach(b=>b.addEventListener('click',()=>{
   setPaymentMode('rto');
   openDetail(products.find(p=>p.id===b.dataset.rtoProduct));
 }));
 grid.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.replaceWith(Object.assign(document.createElement('span'),{className:'no-image',textContent:'Gambar tidak tersedia'}));},{once:true}));}
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{
 category=button.dataset.category;
 searchInput.value='';
 syncClearSearch();
 document.querySelectorAll('[data-category]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});render();
}));
const searchInput=document.querySelector('#search');
const clearSearch=document.querySelector('#clear-search');
function syncClearSearch(){clearSearch.hidden=!searchInput.value;}
searchInput.addEventListener('input',()=>{syncClearSearch();render();});
clearSearch.addEventListener('click',()=>{searchInput.value='';syncClearSearch();render();searchInput.focus();});
syncClearSearch();

document.querySelectorAll('[data-campaign-category],[data-campaign-search]').forEach(link=>link.addEventListener('click',()=>{
  const targetCategory=link.dataset.campaignCategory;
  const targetSearch=link.dataset.campaignSearch;
  if(targetCategory){
    const button=document.querySelector('[data-category="'+targetCategory+'"]');
    if(button)button.click();
  }else if(targetSearch){
    category='all';
    document.querySelectorAll('[data-category]').forEach(b=>{
      const selected=b.dataset.category==='all';
      b.classList.toggle('active',selected);
      b.setAttribute('aria-pressed',String(selected));
    });
    searchInput.value=targetSearch;
    syncClearSearch();
    render();
  }
}));

const paymentSelect=document.querySelector('#payment');
const paymentModeButtons=[...document.querySelectorAll('[data-payment-mode]')];
function syncPaymentModeControls(){
  paymentModeButtons.forEach(button=>{
    const selected=button.dataset.paymentMode===paymentSelect.value;
    button.classList.toggle('active',selected);
    button.setAttribute('aria-pressed',String(selected));
  });
}
function setPaymentMode(mode,shouldRender=true){
  paymentSelect.value=mode;
  syncPaymentModeControls();
  if(shouldRender)render();
}
paymentModeButtons.forEach(button=>button.addEventListener('click',()=>setPaymentMode(button.dataset.paymentMode)));
paymentSelect.addEventListener('change',()=>{syncPaymentModeControls();render();});
syncPaymentModeControls();
const dialog=document.querySelector('#detail');
let lastProductId=null;
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{
 document.body.classList.remove('modal-open');
 const trigger=[...grid.querySelectorAll('button')].find(button=>button.dataset.product===lastProductId||button.dataset.rtoProduct===lastProductId);
 (trigger||searchInput).focus({preventScroll:true});
});
function sourceConflictHtml(p){
  if(!p.sourceConflict)return '';
  return '<div class="source-conflict" role="note"><b>Perlu pengesahan tempoh</b><p>'+escapeHTML(p.sourceConflict.note)+'</p><small>Data kempen ejen: '+escapeHTML(p.tenure)+' bulan · halaman awam: '+escapeHTML(p.sourceConflict.publicTenureMonths)+' bulan · disemak '+escapeHTML(p.verifiedDate)+'.</small></div>';
}
function comparisonHtml(p,planIndex){
  if(p.cash==null||!p.plans.length)return '';
  const plan=p.plans[planIndex]||p.plans[0];
  const sched=schedule(p,plan);
  const cashAmount=cashPrice(p);
  const monthly=sched.discount
    ?money(sched.first)+'/bln (1–6), kemudian '+money(plan.rate)+'/bln'
    :money(plan.rate)+'/bln';
  return '<section class="payment-comparison" aria-labelledby="compare-title"><h3 id="compare-title">Bandingkan jumlah sebelum memilih</h3><p>Jumlah RTO boleh lebih tinggi daripada pembelian tunai. Manfaat waranti, KHIND Care Plan, servis dan perlindungan bergantung pada model dan pelan. Harga tunai mungkin lebih sesuai jika anda tidak memerlukan bayaran berperingkat atau manfaat tambahan.</p><div class="compare-grid"><div class="compare-head"><span></span><b>Bayaran penuh</b><b>RTO</b></div><div><span>Cara bayar</span><strong>Sekali</strong><strong>'+monthly+'</strong></div><div><span>Jumlah</span><strong>'+money(cashAmount)+'</strong><strong>'+(p.sourceConflict?'Perlu pengesahan':money(sched.total+1))+'</strong></div><div><span>Servis / perlindungan</span><strong>Manfaat RTO tidak semestinya disertakan</strong><strong>Mengikut manfaat pelan</strong></div><div><span>Pemilikan</span><strong>Selepas bayaran penuh</strong><strong>Selepas semua bayaran RTO selesai</strong></div></div></section>';
}
function setDetailMode(p,mode,planIndex=0){
  document.querySelectorAll('[data-detail-payment]').forEach(button=>{
    const selected=button.dataset.detailPayment===mode;
    button.classList.toggle('active',selected);
    button.setAttribute('aria-pressed',String(selected));
  });
  const planChoice=document.querySelector('#detail-plan-choice');
  const detail=document.querySelector('#plan-detail');

  if(mode==='cash'){
    planChoice.innerHTML='';
    const amount=cashPrice(p);
    if(amount==null){
      detail.innerHTML='<div class="unavailable-panel"><h3>Bayaran penuh tidak tersedia</h3><p>'+(p.category==='bundle'?'Kombo ditawarkan melalui pelan RTO.':'Harga bayaran penuh belum disahkan untuk model ini.')+'</p></div>'+(p.plans.length?'<button id="switch-detail-rto" class="button secondary-action" type="button">Lihat pilihan RTO →</button>':'')+sourceConflictHtml(p)+'<a class="button dark modal-cta" href="'+enquiry('saya mahu semak harga penuh dan ketersediaan '+p.name+' ('+p.id+').')+'" target="_blank" rel="noopener noreferrer">Semak dengan Hakim di WhatsApp ↗</a>';
      const switchButton=document.querySelector('#switch-detail-rto');
      if(switchButton)switchButton.addEventListener('click',()=>{
        setPaymentMode('rto');
        setDetailMode(p,'rto',0);
      });
      return;
    }
    const message='saya berminat dengan '+p.name+'. Pilihan bayaran penuh '+money(amount)+'.';
    detail.innerHTML='<div class="breakdown cash-breakdown"><p>Bayaran penuh</p><div class="price">'+money(amount)+'</div><p>'+(cashCampaign&&p.cashPromo&&p.cashPromo<p.cash?'Promosi Oktober hingga 31 Oktober 2026. Harga biasa '+money(p.cash)+'.':'Harga rujukan; sahkan harga akhir.')+'</p></div>'+comparisonHtml(p,0)+sourceConflictHtml(p)+'<a class="button dark modal-cta" href="'+enquiry(message)+'" target="_blank" rel="noopener noreferrer">Tanya tentang pilihan ini di WhatsApp ↗</a><p class="fine">Jangan hantar gambar IC atau butiran kad dalam chat. Gunakan pautan rasmi KHIND untuk dokumen dan pembayaran.</p>';
    return;
  }

  if(!p.plans.length){
    planChoice.innerHTML='';
    detail.innerHTML='<div class="unavailable-panel"><h3>Pelan RTO belum disahkan</h3><p>Hakim boleh menyemak harga dan ketersediaan model ini dengan KHIND.</p></div>'+sourceConflictHtml(p)+'<a class="button dark modal-cta" href="'+enquiry('saya mahu semak pelan untuk '+p.name+'.')+'" target="_blank" rel="noopener noreferrer">Semak dengan Hakim ↗</a>';
    return;
  }

  const selected=Math.min(planIndex,p.plans.length-1);
  if(p.plans.length>1){
    planChoice.innerHTML='<label>Pelan RTO<select id="rto-plan">'+p.plans.map((plan,i)=>'<option value="'+i+'"'+(i===selected?' selected':'')+'>'+escapeHTML(plan.name)+' · '+money(plan.rate)+'/bulan kadar biasa</option>').join('')+'</select></label>';
    document.querySelector('#rto-plan').addEventListener('change',event=>{setDetailMode(p,'rto',Number(event.target.value));document.querySelector('#rto-plan').focus();});
  }else{
    planChoice.innerHTML='<p class="single-plan"><span>Pelan RTO</span><b>'+escapeHTML(p.plans[0].name)+' · '+money(p.plans[0].rate)+'/bulan kadar biasa</b></p>';
  }
  const plan=p.plans[selected],sched=schedule(p,plan);
  const message=p.sourceConflict
    ? 'saya berminat dengan '+p.name+'. Pelan '+plan.name+': '+(sched.discount?money(sched.first)+' untuk 6 bulan pertama, kemudian ':'')+money(plan.rate)+'/bulan. Saya faham tempoh dan jumlah akhir perlu disahkan dengan KHIND.'
    : 'saya berminat dengan '+p.name+'. Pelan '+plan.name+': '+(sched.discount?money(sched.first)+' × 6 bulan, kemudian ':'')+money(plan.rate)+' × '+(sched.discount?p.months-6:p.months)+' bulan. Jumlah sewaan '+money(sched.total)+' + fi RM1.';
  const paymentRows=sched.discount
    ? '<div><dt>Bulan 1–6</dt><dd>'+money(sched.first)+' / bulan</dd></div><div><dt>Selepas promosi</dt><dd>'+money(plan.rate)+' / bulan</dd></div>'
    : '<div><dt>Kadar bulanan</dt><dd>'+money(plan.rate)+' / bulan</dd></div>';
  const totalRows=p.sourceConflict
    ? '<div><dt>Jumlah komitmen</dt><dd>Perlu pengesahan tempoh</dd></div>'
    : '<div><dt>Tempoh</dt><dd>'+p.months+' bulan</dd></div><div><dt>Jumlah sewaan</dt><dd>'+money(sched.total)+'</dd></div><div><dt>Fi pemprosesan</dt><dd>RM1</dd></div><div class="total"><dt>Jumlah anggaran</dt><dd>'+money(sched.total+1)+'</dd></div>';
  detail.innerHTML='<div class="breakdown"><dl>'+paymentRows+totalRows+'</dl></div><div class="plan-benefits"><h3>Manfaat pelan yang dipilih</h3><p>'+escapeHTML(p.benefits)+'</p></div>'+comparisonHtml(p,selected)+sourceConflictHtml(p)+'<p class="fine">'+(sched.discount?'Promosi hingga '+sched.end+'. ':'')+'Anggaran tidak termasuk caj kerja tambahan, caj lewat atau penamatan awal. Jumlah bayaran pertama dan kelayakan promosi perlu disahkan oleh KHIND.</p>'+(p.category==='cooling'?'<p><b>Trade-in aircond:</b> 1 Oktober–31 Disember 2026 untuk unit Sejuk Syiok terpilih di Semenanjung Malaysia. Trade-in 1 unit menerima RM150 Touch ’n Go eWallet; 2 unit menerima RM300, tertakluk terma kempen.</p>':'')+'<a class="button dark modal-cta" href="'+enquiry(message)+'" target="_blank" rel="noopener noreferrer">Tanya tentang pilihan ini di WhatsApp ↗</a><p class="fine">Jangan hantar gambar IC atau butiran kad dalam chat. Gunakan pautan rasmi KHIND untuk dokumen dan pembayaran.</p>';
}
function openDetail(p){
  lastProductId=p.id;
  const globalMode=document.querySelector('#payment').value;
  const decisions=decisionPoints(p).slice(0,3).map(x=>'<li>'+escapeHTML(x)+'</li>').join('');
  document.querySelector('#detail-content').innerHTML='<p class="eyebrow">'+escapeHTML(p.id)+'</p><h2 id="detail-title">'+escapeHTML(p.name)+'</h2><p>'+escapeHTML(p.description)+'</p><ul class="decision-points modal-decisions" aria-label="Maklumat ringkas">'+decisions+'</ul><fieldset class="payment-method"><legend>Cara pembayaran</legend><div class="segmented"><button type="button" data-detail-payment="rto" aria-pressed="false">RTO</button><button type="button" data-detail-payment="cash" aria-pressed="false">Bayaran penuh</button></div></fieldset><div id="detail-plan-choice"></div><div id="plan-detail"></div><p class="stock">'+escapeHTML(p.stock)+'</p><p class="verification-meta">Data kempen: '+escapeHTML(p.campaignSource)+' · disemak '+escapeHTML(p.verifiedDate)+'.</p>'+(p.source?'<a class="source" href="'+p.source+'" target="_blank" rel="noopener noreferrer">Spesifikasi produk rasmi ↗</a>':'');
  document.querySelectorAll('[data-detail-payment]').forEach(button=>button.addEventListener('click',()=>{
    const mode=button.dataset.detailPayment;
    setPaymentMode(mode);
    setDetailMode(p,mode,0);
  }));
  setDetailMode(p,globalMode,0);
  dialog.showModal();
  dialog.scrollTop=0;
  document.body.classList.add('modal-open');
}

render();
document.querySelector('#browse-laundry').addEventListener('click',()=>{
  searchInput.value='';
  syncClearSearch();
  document.querySelector('[data-category="laundry"]').click();
});




const desktopNavLinks=[...document.querySelectorAll('.desktop-nav a[href^="#"]')];
if('IntersectionObserver' in window && desktopNavLinks.length){
  const desktopSections=desktopNavLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const navObserver=new IntersectionObserver(entries=>{
    const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible)return;
    desktopNavLinks.forEach(link=>link.classList.toggle('is-active',link.getAttribute('href')==='#'+visible.target.id));
  },{rootMargin:'-25% 0px -60% 0px',threshold:[0,.12,.3]});
  desktopSections.forEach(section=>navObserver.observe(section));
}

const mobileNavLinks=[...document.querySelectorAll('.mobile-bottom-nav [data-mobile-nav]')];
if('IntersectionObserver'in window&&mobileNavLinks.length){
 const navSections=mobileNavLinks.map(link=>document.getElementById(link.dataset.mobileNav)).filter(Boolean);
 const mobileNavObserver=new IntersectionObserver(entries=>{
   const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
   if(!visible)return;
   mobileNavLinks.forEach(link=>{
     const active=link.dataset.mobileNav===visible.target.id;
     link.classList.toggle('active',active);
     if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
   });
 },{rootMargin:'-22% 0px -58% 0px',threshold:[0,.15,.35]});
 navSections.forEach(section=>mobileNavObserver.observe(section));
}

document.querySelectorAll('.category-image img').forEach(img=>{
 img.addEventListener('error',()=>{
   img.hidden=true;
   const box=img.closest('.category-image');
   if(box)box.classList.add('image-missing');
 },{once:true});
});
