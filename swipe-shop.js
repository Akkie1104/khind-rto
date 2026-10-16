/* KHIND RTO independent-agent swipe shop.
   All product facts and official image URLs originate in catalogue.js.
   No analytics, personal-information collection, or browser storage. */
(function () {
  "use strict";

  const $ = id => document.getElementById(id);
  const stage = $("swipe-stage");
  if (!stage) return;

  const money = value => "RM" + Number(value).toLocaleString("en-MY", {
    minimumFractionDigits: Number(value) % 1 ? 2 : 0,
    maximumFractionDigits: 2
  });
  const escape = value => String(value ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const approvedImage = value => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && [
        "cdn.prod.website-files.com", "dtrfh4tzb23hn.cloudfront.net"
      ].includes(url.hostname) ? url.href : "";
    } catch (_) { return ""; }
  };
  const approvedSource = value => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && [
        "www.khindrto.com.my", "khindrto.com.my", "easyr2o.khind.com.my"
      ].includes(url.hostname) ? url.href : "";
    } catch (_) { return ""; }
  };
  const plansFor = p => (Array.isArray(p.plans) ? p.plans : [])
    .filter(q => Number.isFinite(Number(q.rate)) && Number(q.rate) > 0)
    .map(q => ({ name: String(q.name || "Pelan"), rate: Number(q.rate) }));
  const cheapest = p => plansFor(p).sort((a, b) => a.rate - b.rate)[0];
  const valid = p => p && typeof p.id === "string" && p.name &&
    Number.isInteger(Number(p.months)) && Number(p.months) > 0 &&
    plansFor(p).length && approvedImage(p.image);
  const sourceProducts = Array.isArray(window.KHIND_PRODUCTS) ? window.KHIND_PRODUCTS : [];
  // Round-robin by existing categories so a visitor sees variety early without answering questions.
  const lanes = new Map();
  sourceProducts.filter(valid).forEach(p => {
    if (!lanes.has(p.category)) lanes.set(p.category, []);
    lanes.get(p.category).push(p);
  });
  const deck = [];
  while ([...lanes.values()].some(list => list.length)) {
    for (const list of lanes.values()) if (list.length) deck.push(list.shift());
  }

  const state = { index: 0, saved: [], history: [], prompting: false, prompted: false, comparing: false, busy: false };
  const cardSlot = $("card-slot");
  const decisionPrompt = $("decision-prompt");
  const completeView = $("deck-complete");
  const compareView = $("compare-view");
  const detailsSheet = $("details-sheet");
  const shortlistSheet = $("shortlist-sheet");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let animationToken = 0;

  const savedProducts = () => state.saved.map(id => deck.find(p => p.id === id)).filter(Boolean);
  function whatsappUrl(items) {
    const ids = items.map(p => p.id).join(", ");
    const message = "Salam Hakim, saya berminat dengan produk KHIND RTO berikut: " + ids +
      ". Boleh bantu semak kadar biasa, jumlah keseluruhan, tempoh, manfaat pelan, stok dan proses rasmi? Terima kasih.";
    return "https://wa.me/60174201247?text=" + encodeURIComponent(message);
  }
  function announce(message) { $("live-message").textContent = message; }
  function photo(p, className, eager) {
    const src = approvedImage(p.image);
    return src ? '<img class="' + className + '" src="' + escape(src) +
      '" alt="' + escape(p.name + " " + p.id) +
      '" loading="' + (eager ? "eager" : "lazy") +
      '" decoding="async" referrerpolicy="no-referrer">' :
      '<span class="no-photo">Imej rasmi tidak tersedia.</span>';
  }
  function productCard(p) {
    const plan = cheapest(p);
    const total = plan.rate * Number(p.months);
    return '<article id="active-card" class="product-card" tabindex="0" aria-label="' +
      escape(p.name) + '. Anak panah kiri untuk langkau, kanan untuk simpan.">' +
      '<div class="swipe-overlay swipe-left" aria-hidden="true">LANGKAU</div>' +
      '<div class="swipe-overlay swipe-right" aria-hidden="true">SIMPAN ♥</div>' +
      '<div class="product-photo">' +
      '<div class="photo-topline"><span>KOLEKSI KHIND RTO</span><span>' + escape(p.id) + '</span></div>' +
      photo(p, "hero-appliance", true) +
      '<span class="photo-corner-mark" aria-hidden="true">01 / PILIHAN</span></div>' +
      '<div class="product-copy"><p class="product-overline">' + escape(p.category) + ' <span>· ' + escape(p.id) + '</span></p>' +
      '<h1>' + escape(p.name) + '</h1><p class="product-subtitle">' + escape(p.description || "") + '</p>' +
      '<div class="price-row"><div><span class="price-kicker">KADAR BULANAN BIASA DARI</span>' +
      '<p class="product-price">' + money(plan.rate) + '<small>/bulan</small></p></div>' +
      '<div class="price-duration"><strong>' + Number(p.months) + '</strong><span>bulan</span></div></div>' +
      '<div class="product-extras"><span>Anggaran jumlah dari <strong>' + money(total) +
      '</strong>*</span><button type="button" id="details-button" class="details-button">Details <span aria-hidden="true">↗</span></button></div>' +
      '</div></article>';
  }
  function setControls() {
    const ended = state.index >= deck.length || !deck.length;
    const disabled = state.busy || state.comparing || state.prompting || ended;
    $("skip-button").disabled = disabled;
    $("save-button").disabled = disabled;
    $("undo-button").disabled = state.busy || !state.history.length;
    $("saved-open").disabled = !state.saved.length;
    $("saved-count").textContent = String(state.saved.length);
    $("saved-open").setAttribute("aria-label", "Lihat produk disimpan, " + state.saved.length + " produk");
    $("deck-position").textContent = ended ? "Selesai" : "Pilihan " + (state.index + 1);
    $("deck-total").textContent = state.index + " / " + deck.length + " dilihat";
    $("progress-fill").style.width = (deck.length ? 100 * state.index / deck.length : 0) + "%";
    $("progress-track").setAttribute("aria-valuemax", String(Math.max(1, deck.length)));
    $("progress-track").setAttribute("aria-valuenow", String(state.index));
  }
  function bindImageErrors(container) {
    container.querySelectorAll("img").forEach(img => {
      img.addEventListener("error", () => {
        const holder = document.createElement("span");
        holder.className = "no-photo";
        holder.textContent = "Imej rasmi tidak dapat dimuatkan.";
        img.replaceWith(holder);
      }, { once: true });
    });
  }
  function render() {
    setControls();
    cardSlot.hidden = state.comparing || state.index >= deck.length || !deck.length;
    completeView.hidden = state.comparing || !!deck.length && state.index < deck.length;
    compareView.hidden = !state.comparing;
    decisionPrompt.hidden = !state.prompting || state.comparing;
    if (state.comparing) {
      renderCompare();
      return;
    }
    if (!deck.length) {
      completeView.innerHTML = '<div class="end-icon" aria-hidden="true">!</div><h1>Produk belum tersedia</h1>' +
        '<p>Katalog belum mempunyai imej dan kadar sah yang boleh dipaparkan.</p>' +
        '<a class="text-link" href="../catalogue/">Lihat katalog penuh →</a>';
      announce("Tiada produk tersedia.");
      return;
    }
    if (state.index >= deck.length) {
      renderEnd();
      return;
    }
    const p = deck[state.index];
    cardSlot.innerHTML = productCard(p);
    bindImageErrors(cardSlot);
    cardSlot.querySelector("#details-button").addEventListener("click", openDetails);
    enableDrag(cardSlot.querySelector("#active-card"));
    if (state.prompting) renderPrompt();
  }
  function commitDecision(save) {
    if (state.busy || state.comparing || state.prompting || state.index >= deck.length) return;
    state.busy = true;
    setControls();
    const p = deck[state.index];
    const card = $("active-card");
    const token = ++animationToken;
    const apply = () => {
      if (token !== animationToken) return;
      state.history.push({ index: state.index, saved: [...state.saved], prompted: state.prompted });
      if (save && !state.saved.includes(p.id)) state.saved.push(p.id);
      state.index++;
      state.busy = false;
      if (state.saved.length === 2 && !state.prompted) {
        state.prompting = true;
        state.prompted = true;
      }
      render();
      announce((save ? "Disimpan: " : "Dilangkau: ") + p.name + ". " +
        state.saved.length + " produk disimpan.");
    };
    if (reduceMotion.matches || !card) { apply(); return; }
    card.classList.add(save ? "exit-right" : "exit-left");
    window.setTimeout(apply, 185);
  }
  function undo() {
    if (state.busy || !state.history.length) return;
    const previous = state.history.pop();
    state.index = previous.index;
    state.saved = previous.saved;
    state.prompted = previous.prompted;
    state.prompting = false;
    state.comparing = false;
    render();
    announce("Tindakan dibatalkan. Kembali ke " + deck[state.index].name + ".");
  }
  function enableDrag(card) {
    let gesture = null;
    const reset = () => {
      card.style.removeProperty("--drag-x");
      card.style.removeProperty("--drag-rotate");
      card.style.removeProperty("--left-opacity");
      card.style.removeProperty("--right-opacity");
      card.classList.remove("dragging");
    };
    card.addEventListener("pointerdown", event => {
      if (state.busy || state.prompting || event.button !== 0 ||
          event.target.closest("button, a")) return;
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, active: false };
    });
    card.addEventListener("pointermove", event => {
      if (!gesture || gesture.id !== event.pointerId || state.busy) return;
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      if (!gesture.active) {
        if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { gesture = null; return; }
        if (Math.abs(dx) < 12 || Math.abs(dx) <= Math.abs(dy)) return;
        gesture.active = true;
        try { card.setPointerCapture(event.pointerId); } catch (_) { }
      }
      gesture.dx = dx;
      card.classList.add("dragging");
      card.style.setProperty("--drag-x", dx + "px");
      card.style.setProperty("--drag-rotate", Math.max(-13, Math.min(13, dx / 19)) + "deg");
      card.style.setProperty("--left-opacity", String(dx < 0 ? Math.min(1, -dx / 95) : 0));
      card.style.setProperty("--right-opacity", String(dx > 0 ? Math.min(1, dx / 95) : 0));
    });
    card.addEventListener("pointerup", event => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const dx = gesture.dx;
      const active = gesture.active;
      gesture = null;
      reset();
      if (active && Math.abs(dx) >= Math.min(105, card.clientWidth * .24)) commitDecision(dx > 0);
    });
    card.addEventListener("pointercancel", () => { gesture = null; reset(); });
    card.addEventListener("lostpointercapture", () => { if (gesture) { gesture = null; reset(); } });
    card.addEventListener("keydown", event => {
      if (event.target !== card) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        commitDecision(event.key === "ArrowRight");
      }
    });
  }
  function renderPrompt() {
    decisionPrompt.innerHTML =
      '<div class="prompt-card"><p class="prompt-kicker">2 PILIHAN DISIMPAN</p>' +
      '<h2>Dah jumpa yang menarik?</h2><p>Banding kedua-duanya dulu, atau teruskan lihat produk lain.</p>' +
      '<button type="button" class="prompt-primary" id="compare-now">Banding produk <span aria-hidden="true">↗</span></button>' +
      '<button type="button" class="prompt-secondary" id="keep-swiping">Teruskan leret</button>' +
      '<a class="prompt-whatsapp" href="' + escape(whatsappUrl(savedProducts())) +
      '" target="_blank" rel="noopener noreferrer">Tanya Hakim tentang ini ↗</a></div>';
    decisionPrompt.querySelector("#compare-now").addEventListener("click", () => {
      state.prompting = false;
      state.comparing = true;
      render();
    });
    decisionPrompt.querySelector("#keep-swiping").addEventListener("click", () => {
      state.prompting = false;
      render();
    });
  }
  function openDetails() {
    const p = deck[state.index];
    if (!p) return;
    const plans = plansFor(p);
    $("details-body").innerHTML =
      '<div class="details-photo">' + photo(p, "details-appliance", false) + '</div>' +
      '<div class="details-summary"><span class="detail-model">' + escape(p.id) + '</span>' +
      '<h2 id="details-title">' + escape(p.name) + '</h2><p>' + escape(p.description || "") + '</p></div>' +
      '<h3>Pelan & bayaran biasa</h3><div class="plan-list">' +
      plans.map(q => '<div class="plan-item"><span>' + escape(q.name) + '</span><strong>' +
        money(q.rate) + ' <small>/bulan</small></strong><small>Anggaran ' +
        money(q.rate * Number(p.months)) + ' / ' + Number(p.months) + ' bulan*</small></div>').join("") +
      '</div>' +
      (Number.isFinite(Number(p.cash)) && p.cash != null ?
        '<p class="cash-reference">Harga tunai rujukan: <strong>' + money(p.cash) + '</strong></p>' : "") +
      (p.benefits ? '<h3>Manfaat yang disenaraikan</h3><p>' + escape(p.benefits) + '</p>' : "") +
      (p.stock ? '<p class="stock-note">' + escape(p.stock) + '</p>' : "") +
      '<p class="details-caveat">*Anggaran kadar biasa × tempoh, tidak termasuk promosi atau caj tambahan. Harga, stok, manfaat, tempoh dan kelayakan perlu disahkan melalui KHIND. Banding jumlah RTO dengan harga tunai.</p>' +
      '<div class="detail-links"><a href="../products/' + encodeURIComponent(p.id) +
      '/">Halaman produk →</a>' +
      (approvedSource(p.source) ? '<a href="' + escape(approvedSource(p.source)) +
        '" target="_blank" rel="noopener noreferrer">Rujukan rasmi ↗</a>' : "") + '</div>';
    bindImageErrors($("details-body"));
    detailsSheet.showModal();
  }
  function renderShortlist() {
    const items = savedProducts();
    $("shortlist-body").innerHTML = items.map(p =>
      '<article class="shortlist-row"><div class="shortlist-photo">' + photo(p, "shortlist-appliance", false) +
      '</div><div><span>' + escape(p.id) + '</span><h3>' + escape(p.name) +
      '</h3><p>Dari ' + money(cheapest(p).rate) + '/bulan biasa</p></div></article>').join("") +
      '<div class="shortlist-choices">' +
      (items.length >= 2 ? '<button type="button" class="prompt-primary" id="compare-saved">Banding ' + items.length + ' pilihan ↗</button>' : "") +
      '<a class="prompt-whatsapp" href="' + escape(whatsappUrl(items)) +
      '" target="_blank" rel="noopener noreferrer">Tanya Hakim tentang pilihan ini ↗</a></div>' +
      '<p class="details-caveat">Kadar biasa dan anggaran bukan tawaran muktamad. Jangan hantar IC atau butiran bayaran melalui laman ini.</p>';
    bindImageErrors($("shortlist-body"));
    $("compare-saved")?.addEventListener("click", () => {
      shortlistSheet.close();
      state.prompting = false;
      state.comparing = true;
      render();
    });
  }
  function openShortlist() {
    if (!state.saved.length) return;
    renderShortlist();
    shortlistSheet.showModal();
  }
  function renderCompare() {
    const items = savedProducts();
    if (items.length < 2) {
      state.comparing = false;
      render();
      return;
    }
    compareView.innerHTML = '<div class="compare-heading"><button type="button" id="compare-back">← Kembali</button>' +
      '<span>' + items.length + ' PILIHAN</span></div>' +
      '<h1>Banding sebelum pilih.</h1><p>Leret jadual ke tepi untuk lihat semua pilihan yang disimpan.</p>' +
      '<div class="compare-scroll"><div class="compare-grid">' +
      items.map(p => {
        const plan = cheapest(p);
        return '<article class="compare-item"><div class="compare-photo">' + photo(p, "compare-appliance", false) + '</div>' +
          '<span class="compare-model">' + escape(p.id) + '</span><h2>' + escape(p.name) + '</h2>' +
          '<div class="compare-metric"><small>Kadar biasa dari</small><strong>' + money(plan.rate) + '/bln</strong></div>' +
          '<div class="compare-metric"><small>Tempoh</small><strong>' + Number(p.months) + ' bulan</strong></div>' +
          '<div class="compare-metric"><small>Jumlah anggaran*</small><strong>' +
          money(plan.rate * Number(p.months)) + '</strong></div>' +
          (p.cash != null && Number.isFinite(Number(p.cash)) ?
            '<div class="compare-metric"><small>Harga tunai rujukan</small><strong>' + money(p.cash) + '</strong></div>' : "") +
          '<div class="compare-benefits"><small>Manfaat disenaraikan</small><p>' + escape(p.benefits || "Sahkan butiran pelan.") + '</p></div>' +
          '<a href="../products/' + encodeURIComponent(p.id) + '/">Butiran produk ↗</a></article>';
      }).join("") + '</div></div>' +
      '<p class="compare-note">*Jumlah anggaran kadar biasa × tempoh; belum mengambil kira promosi/caj. Ini bukan penilaian kelayakan. Manfaat berbeza mengikut pelan.</p>' +
      '<a class="compare-contact" href="' + escape(whatsappUrl(items)) +
      '" target="_blank" rel="noopener noreferrer">Tanya Hakim tentang pilihan ini ↗</a>' +
      '<button class="continue-after-compare" id="compare-continue" type="button">Teruskan leret →</button>';
    bindImageErrors(compareView);
    const back = () => { state.comparing = false; render(); };
    $("compare-back").addEventListener("click", back);
    $("compare-continue").addEventListener("click", back);
    announce("Paparan perbandingan untuk " + items.length + " produk.");
  }
  function renderEnd() {
    const items = savedProducts();
    completeView.innerHTML = '<div class="end-icon" aria-hidden="true">✓</div>' +
      '<p class="end-kicker">SEMUA PILIHAN TELAH DILIHAT</p><h1>Selesai meleret.</h1>' +
      '<p>' + (items.length ? "Anda telah simpan " + items.length + " pilihan. Banding sebelum membuat keputusan." :
        "Tiada produk disimpan. Anda boleh lihat sekali lagi atau semak katalog.") + '</p>' +
      (items.length >= 2 ? '<button class="prompt-primary" type="button" id="end-compare">Banding produk ↗</button>' : "") +
      (items.length ? '<button class="prompt-secondary" type="button" id="end-shortlist">Lihat simpanan (' + items.length + ')</button>' : "") +
      '<button class="prompt-secondary" type="button" id="restart-deck">Lihat semula dari awal</button>' +
      '<a class="text-link" href="../catalogue/">Katalog penuh ↗</a>';
    $("end-compare")?.addEventListener("click", () => { state.comparing = true; render(); });
    $("end-shortlist")?.addEventListener("click", openShortlist);
    $("restart-deck").addEventListener("click", () => {
      state.index = 0;
      state.history = [];
      state.prompting = false;
      state.prompted = state.saved.length >= 2;
      render();
    });
    announce("Selesai melihat " + deck.length + " produk.");
  }

  $("skip-button").addEventListener("click", () => commitDecision(false));
  $("save-button").addEventListener("click", () => commitDecision(true));
  $("undo-button").addEventListener("click", undo);
  $("saved-open").addEventListener("click", openShortlist);
  document.querySelector("[data-close-details]").addEventListener("click", () => detailsSheet.close());
  document.querySelector("[data-close-shortlist]").addEventListener("click", () => shortlistSheet.close());
  [detailsSheet, shortlistSheet].forEach(dialog => dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  }));
  render();
})();