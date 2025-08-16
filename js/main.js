// BrewCycle Coffee — main.js (enhanced a11y & UX)
(function(){
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  document.getElementById('year')?.append(new Date().getFullYear());

  // Mobile nav toggle + accessibility
  const navToggle = $('.nav-toggle');
  const nav = $('#site-nav');
  if(navToggle && nav){
    const closeNav = () => { nav.classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); };
    navToggle.addEventListener('click',()=>{
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
      if(open) nav.querySelector('a')?.focus();
    });
    document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeNav(); });
    nav.addEventListener('click', (e)=>{ if(e.target.tagName==='A') closeNav(); });
    document.addEventListener('click',(e)=>{ if(!nav.contains(e.target) && e.target!==navToggle) closeNav(); });
  }

  // Lightbox for gallery with focus trap
  const lightbox = $('#lightbox');
  const lightImg = $('#lightbox-img');
  const lightCap = $('#lightbox-caption');
  let prevFocus = null;
  const getFocusable = () => $$('#lightbox [href], #lightbox button, #lightbox [tabindex]:not([tabindex="-1"])');

  function openLightbox(src, alt){
    prevFocus = document.activeElement;
    lightImg.src = src; lightImg.alt = alt; lightCap.textContent = alt;
    lightbox.hidden = false; lightbox.focus();
  }
  function closeLightbox(){
    lightbox.hidden = true; lightImg.removeAttribute('src');
    prevFocus?.focus();
  }

  if(lightbox && lightImg){
    $$('.thumb').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const full = btn.getAttribute('data-full');
        const img = btn.querySelector('img');
        if(full && img) openLightbox(full, img.alt);
      });
    });
    lightbox.addEventListener('click',(e)=>{ if(e.target.hasAttribute('data-close')) closeLightbox(); });
    document.addEventListener('keydown',(e)=>{
      if(e.key==='Escape' && !lightbox.hidden) closeLightbox();
      if(e.key==='Tab' && !lightbox.hidden){
        const f = getFocusable(); if(!f.length) return;
        const first = f[0], last = f[f.length-1];
        if(e.shiftKey && document.activeElement===first){ last.focus(); e.preventDefault(); }
        else if(!e.shiftKey && document.activeElement===last){ first.focus(); e.preventDefault(); }
      }
    });
  }

  // Contact form validation + prototype submit
  const form = $('#contactForm');
  if(form){
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      const fields = ['name','email','subject','message'];
      let valid = true;
      fields.forEach(id=>{
        const input = document.getElementById(id);
        const err = document.getElementById(id+'Error');
        if(!input || !err) return;
        err.textContent = input.validity.valid ? '' : (input.validationMessage || 'Please check this field.');
        input.setAttribute('aria-invalid', String(!input.validity.valid));
        if(!input.validity.valid) valid = false;
      });
      if(valid){
        const status = $('#formStatus');
        status.hidden = false;
        status.textContent = 'Thanks! Your message has been queued. (Prototype — no data is stored or emailed.)';
        form.reset();
        form.querySelector('button[type="submit"]').focus();
      }
    });
    $$('input, textarea', form).forEach(el=>{
      el.addEventListener('input',()=>{
        const err = document.getElementById(el.id+'Error');
        if(err) err.textContent = el.validity.valid ? '' : err.textContent;
      });
    });
  }
})();