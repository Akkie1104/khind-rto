/* Accessible progressive filtering and product plan controls.
   No tracking, no sensitive data storage, no outside APIs. */
(function(){
 "use strict";
 const money=v=>'RM'+new Intl.NumberFormat('en-MY',{maximumFractionDigits:2,minimumFractionDigits:Number.isInteger(v)?0:2}).format(v);
 const officialRateSource=/^https:\/\/(?:www\.khindrto\.com\.my|easyr2o\.khind\.com\.my)\//i;
 const hasVerifiedRate=p=>/^\d{4}-\d{2}-\d{2}$/.test(String(p?.verifiedDate||''))&&officialRateSource.test(String(p?.source||''));
 const language=document.documentElement.lang==='en'?'en':'ms';
 function showImageFallback(img){
   if(!img?.parentNode||img.dataset.agentFallback==='true')return;
   img.dataset.agentFallback='true';
   const fallback=document.createElement('div');
   fallback.className='agent-image-fallback';
   fallback.setAttribute('role','img');
   const alt=img.getAttribute('alt')|| (language==='en'?'KHIND product image':'Imej produk KHIND');
   const unavailable=language==='en'?'Product image temporarily unavailable.':'Foto produk tidak dapat dimuat buat sementara.';
   fallback.setAttribute('aria-label',alt+'. '+unavailable);
   const brand=document.createElement('span');brand.className='agent-image-fallback-mark';brand.textContent='KHIND';
   const message=document.createElement('span');message.textContent=unavailable;
   const hint=document.createElement('small');hint.textContent=language==='en'?'Check the official KHIND product page.':'Semak halaman produk rasmi KHIND.';
   fallback.append(brand,message,hint);
   img.replaceWith(fallback);
 }
 document.querySelectorAll('.agent-media img,.agent-item-image img').forEach(img=>{
   img.addEventListener('error',()=>showImageFallback(img),{once:true});
   if(img.complete&&img.naturalWidth===0)showImageFallback(img);
 });
 const query=new URLSearchParams(location.search);
 const cards=[...document.querySelectorAll('[data-filter-product]')];
 const search=document.querySelector('#agent-search');
 const budget=document.querySelector('#agent-budget');
 const count=document.querySelector('#agent-result-count');
 const emptyState=document.querySelector('#agent-empty-state');
 const clearFilters=document.querySelector('#agent-clear-filters');
 const chosenCategory=document.querySelectorAll('[data-category-filter]');
 const productData=new Map((window.KHIND_PRODUCTS||[]).map(p=>[p.id,p]));
 for(const card of cards){
   const href=card.querySelector('a[href*="../products/"]')?.getAttribute('href')||'';
   const id=href.match(/products\/([^/]+)\//)?.[1];
   const product=productData.get(id);
   if(product&&!hasVerifiedRate(product)){
     const note=card.querySelector('.agent-price-notes');
     if(note&&!note.querySelector('.agent-verification-note')){
       const label=document.createElement('span');label.className='agent-verification-note';
       label.textContent='Kadar dan jumlah perlu disahkan dengan KHIND.';
       note.append(document.createElement('br'),label);
     }
   }
 }
 function updateCards(){
   if(!cards.length)return;
   const q=(search?.value||'').trim().toLowerCase(),cap=budget?.value==='all'||!budget?.value?Infinity:Number(budget.value);
   const ct=query.get('category')||'all';
   document.querySelectorAll('.agent-filter-pills a').forEach(link=>{
      link.classList.toggle('active',ct==='all'?link.getAttribute('href')==='./':link.getAttribute('href')==='?category='+ct);
   });
   let hits=0;
   for(const el of cards){
     const words=el.dataset.search||'';
     const category=el.dataset.category||'';
     const rate=Number(el.dataset.rate||Infinity);
     const show=words.includes(q)&&(ct==='all'||ct===category)&&rate<=cap;
     el.classList.toggle('agent-hidden',!show);
     if(show)hits++;
   }
   if(count)count.textContent=hits+' pilihan sepadan';
   if(emptyState)emptyState.hidden=hits>0;
 }
 search?.addEventListener('input',updateCards);
 budget?.addEventListener('change',updateCards);
 clearFilters?.addEventListener('click',()=>{
   if(search)search.value='';
   if(budget)budget.value='all';
   if(query.has('category')){ location.href=location.pathname; return; }
   updateCards();
   search?.focus();
 });
 updateCards();
 // Expired six-month campaigns are never presented as current offers.
 const localDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 if(localDate>'2026-12-31'){
   document.querySelectorAll('.agent-item[data-rate]').forEach(card=>{
     const label=card.querySelector('.agent-pill');
     if(!label)return;
     label.remove();
     const rate=Number(card.dataset.rate);
     const display=card.querySelector('.agent-price');
     if(display&&Number.isFinite(rate))display.innerHTML=money(rate)+' <small>/bulan</small>';
   });
   document.querySelectorAll('[data-promo-until]').forEach(el=>{el.hidden=true;});
 }
 const price=document.querySelector('#agent-selected-price');
 const rateText=document.querySelector('#agent-regular-rate');
 const totalText=document.querySelector('#agent-total');
 const ask=document.querySelector('#agent-ask');
 const planChoice=document.querySelector('#agent-plan-choice');
 const priceLabel=document.querySelector('.agent-plan-label');
 const totalLabel=document.querySelector('#agent-total-label');
 const planBenefits=document.querySelector('#agent-plan-benefits');
 const stockText=document.querySelector('#agent-product-stock');
 const estimateNote=document.querySelector('.agent-plan .agent-tiny');
 const options=planChoice?[...planChoice.options]:[];
 function updatePlan(){
   if(!planChoice)return;
   const o=options[planChoice.selectedIndex],amount=Number(o.value),months=Number(planChoice.dataset.months),start=Number(planChoice.dataset.promostart),promo=planChoice.dataset.promo==='yes';
   if(!Number.isFinite(amount)||!Number.isFinite(months)||months<1)return;
   const localDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
   const currentPromo=promo&&localDate>='2026-10-01'&&localDate<='2026-12-31';
   const product=(window.KHIND_PRODUCTS||[]).find(item=>item.id===planChoice.dataset.model);
   const promoMonths=Math.min(months,Number(planChoice.dataset.promomonths||product?.promoMonths)||6);
   const first=currentPromo?(start>0?start:amount*.5):amount;
   const total=currentPromo?first*promoMonths+amount*(months-promoMonths):amount*months;
   const fee=Number(planChoice.dataset.confirmedFee);
   const confirmedFee=Number.isFinite(fee)&&fee>=0?fee:0;
   const estimate=total+confirmedFee;
   const planName=(o.textContent.split(' — ')[0]||'').trim();
   const planBenefit=product?.planBenefits?.[planName];
   const rateVerified=hasVerifiedRate(product);
   const needConfirmation=language==='en'?' · confirm with KHIND':' · PERLU PENGESAHAN KHIND';
   if(planBenefits)planBenefits.textContent=planBenefit||((product?.benefits||'')+(product?.benefits?' ':'')+(language==='en'?'Plan-specific benefits need confirmation with KHIND.':'Manfaat khusus pelan ini perlu disahkan dengan KHIND.'));
   if(stockText)stockText.textContent=(language==='en'?product?.stockEn:product?.stock)||product?.stock||(language==='en'?'Stock status not provided. Confirm availability with KHIND.':'Status stok belum dikemukakan. Sahkan ketersediaan dengan KHIND.');
   if(priceLabel)priceLabel.textContent=(currentPromo?'ANGGARAN '+promoMonths+' BULAN PERTAMA JIKA LAYAK*':'KADAR BULANAN BIASA*')+(!rateVerified?needConfirmation:'');
   if(totalLabel)totalLabel.textContent=(currentPromo?'Anggaran jumlah jika promosi layak*':'Anggaran jumlah pada kadar biasa*')+(!rateVerified?needConfirmation:'');
   const rateRowLabel=rateText?.closest('div')?.querySelector('dt');
   if(rateRowLabel){if(!rateRowLabel.dataset.baseText)rateRowLabel.dataset.baseText=rateRowLabel.textContent;rateRowLabel.textContent=rateRowLabel.dataset.baseText+(!rateVerified?needConfirmation:'')}
   const totalRowLabel=totalText?.closest('div')?.querySelector('dt');
   if(totalRowLabel){if(!totalRowLabel.dataset.baseText)totalRowLabel.dataset.baseText=totalRowLabel.textContent;totalRowLabel.textContent=totalRowLabel.dataset.baseText+(!rateVerified?needConfirmation:'')}
   if(estimateNote){
     if(planChoice.dataset.model==='RF480')estimateNote.textContent=language==='en'?'Estimate uses an exact 50% calculation (RM37.50 Basic / RM47.50 Premium). KHIND displays RM38 for Basic; confirm rounding and the final billed rate. Fees and promotion eligibility also need confirmation.':'Anggaran menggunakan kiraan tepat 50% (Basic RM37.50 / Premium RM47.50). KHIND memaparkan RM38 untuk Basic; sahkan pembundaran dan kadar akhir yang dibilkan. Fi dan kelayakan promosi juga perlu disahkan.';
     else if(planChoice.dataset.model?.startsWith('ACSON-'))estimateNote.textContent=language==='en'?'For ACSON 1.0 HP, KHIND advertises RM53/month; this estimate applies exact 50% math to the listed RM105 rate (RM52.50). Confirm rounding and the final billed rate. Promotion rates and eligibility for other capacities, fees and inclusions need KHIND confirmation.':'Untuk ACSON 1.0HP, KHIND mengiklankan RM53/bulan; anggaran ini menggunakan kiraan tepat 50% daripada kadar tersenarai RM105 (RM52.50). Sahkan pembundaran dan kadar akhir yang dibilkan. Kadar promosi serta kelayakan kapasiti lain, fi dan manfaat perlu disahkan dengan KHIND.';
     else estimateNote.textContent=rateVerified?'Anggaran tidak termasuk fi pemprosesan atau caj tambahan yang belum disahkan. Promosi tertakluk kelayakan dan pengesahan KHIND.':(language==='en'?'The listed rate and estimate are undated references. Confirm the rate, term, promotion and any fee with KHIND before applying.':'Kadar dan jumlah ini ialah rujukan tanpa tarikh semakan. Sahkan kadar, tempoh, promosi dan sebarang fi dengan KHIND sebelum memohon.');
   }
   if(price)price.innerHTML=money(first)+' <small>/bulan</small>';
   if(rateText)rateText.textContent=money(amount)+'/bulan';
   if(totalText)totalText.textContent=money(estimate)+' anggaran';
   if(ask){
     const model=planChoice.dataset.model,name=planChoice.dataset.name;
     const msg='Salam Hakim, saya berminat dengan '+name+' ('+model+'). Pelan '+o.text+', kadar biasa '+money(amount)+'/bulan, tempoh '+months+' bulan. Mohon sahkan jumlah bayaran pertama, promosi, stok, manfaat waranti dan syarat penuh sebelum saya memohon.';
     ask.href='https://wa.me/60174201247?text='+encodeURIComponent(msg);
   }
 }
 planChoice?.addEventListener('change',updatePlan);
 updatePlan();
})();
