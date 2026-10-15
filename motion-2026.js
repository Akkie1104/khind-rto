/* Progressive enhancement: short, one-time entrances for informational sections.
   Observe only content BELOW the current viewport to avoid a load-time flash.
   The stylesheet leaves content visible if this JS is unavailable. */
(function(){
  'use strict';
  if(!('IntersectionObserver' in window) ||
     window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const targets=document.querySelectorAll(
    '.value-grid article, .category-section .simple-heading, .promotion-list article, .steps li, .faq-section, .contact-inner'
  );
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },{threshold:.07,rootMargin:'0px 0px -20px 0px'});
  targets.forEach(el=>{
    const rect=el.getBoundingClientRect();
    // Avoid hiding content users already see, including deep-linked sections.
    if(rect.top<window.innerHeight+30)return;
    el.classList.add('reveal-on-scroll');
    observer.observe(el);
  });
})();
