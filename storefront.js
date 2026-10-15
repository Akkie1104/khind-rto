/* Accessible progressive filtering and product plan controls.
   No tracking, no sensitive data storage, no outside APIs. */
(function(){
 "use strict";
 const money=v=>'RM'+new Intl.NumberFormat('en-MY',{maximumFractionDigits:2,minimumFractionDigits:Number.isInteger(v)?0:2}).format(v);
 const query=new URLSearchParams(location.search);
 const cards=[...document.querySelectorAll('[data-filter-product]')];
 const search=document.querySelector('#agent-search');
 const budget=document.querySelector('#agent-budget');
 const count=document.querySelector('#agent-result-count');
 const chosenCategory=document.querySelectorAll('[data-category-filter]');
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
 }
 search?.addEventListener('input',updateCards);
 budget?.addEventListener('change',updateCards);
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
 const options=planChoice?[...planChoice.options]:[];
 function updatePlan(){
   if(!planChoice)return;
   const o=options[planChoice.selectedIndex],amount=Number(o.value),months=Number(planChoice.dataset.months),start=Number(planChoice.dataset.promostart),promo=planChoice.dataset.promo==='yes';
   if(!Number.isFinite(amount)||!Number.isFinite(months)||months<1)return;
   const localDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
   const currentPromo=promo&&localDate>='2026-10-01'&&localDate<='2026-12-31';
   const first=currentPromo?(start>0?start:amount*.5):amount;
   const total=currentPromo&&months>=6?first*6+amount*(months-6):amount*months;
   if(price)price.innerHTML=money(first)+' <small>/bulan</small>';
   if(rateText)rateText.textContent=money(amount)+'/bulan';
   if(totalText)totalText.textContent=money(total+1)+' anggaran';
   if(ask){
     const model=planChoice.dataset.model,name=planChoice.dataset.name;
     const msg='Salam Hakim, saya berminat dengan '+name+' ('+model+'). Pelan '+o.text+', kadar biasa '+money(amount)+'/bulan, tempoh '+months+' bulan. Mohon sahkan jumlah bayaran pertama, promosi, stok, manfaat waranti dan syarat penuh sebelum saya memohon.';
     ask.href='https://wa.me/60174201247?text='+encodeURIComponent(msg);
   }
 }
 planChoice?.addEventListener('change',updatePlan);
 updatePlan();
})();
