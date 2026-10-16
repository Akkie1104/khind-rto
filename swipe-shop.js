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
  // Variant B asks one question before rendering. Control always starts with a product.
  const categoryGate = $("one-question-gate");
  const isVariantB = document.documentElement.getAttribute("data-swipe-variant") === "one-question" && !!categoryGate;
  const choices = ["washing", "fridge", "cooling", "all"];
  const budgetGate = $("budget-question-gate");
  const isVariantC = document.documentElement.getAttribute("data-swipe-variant") === "budget-first" && !!budgetGate;
  function matchesChoice(p, choice) {
    if (choice === "all") return true;
    if (choice === "fridge") return p.category === "fridge";
    if (choice === "cooling") return p.category === "cooling";
    if (choice === "washing") {
      // The shared "laundry" category also includes dryer-only products.
      // Include washer-dryers, exclude dryer-only entries using supplied catalogue text.
      const facts = [p.name, p.description, ...(Array.isArray(p.keywords) ? p.keywords : [])].join(" ");
      return p.category === "laundry" && /basuh|washer|wash/i.test(facts);
    }
    return false;
  }
  function buildDeck(choice) {
    // Preserve the exact control ordering strategy within the selected subset.
    const lanes = new Map();
    sourceProducts.filter(valid).filter(p => matchesChoice(p, choice)).forEach(p => {
      if (!lanes.has(p.category)) lanes.set(p.category, []);
      lanes.get(p.category).push(p);
    });
    const result = [];
    while ([...lanes.values()].some(list => list.length)) {
      for (const list of lanes.values()) if (list.length) result.push(list.shift());
    }
    return result;
  }
  // Prices and dated catalogue entries are sourced exclusively from catalogue.js.
  // They are reference regular monthly rates, not real-time offers or approval results.
  const hasDatedRates = p => /^\d{4}-\d{2}-\d{2}$/.test(String(p.verifiedDate || ""));
  const verifiedPool = buildDeck("all").filter(hasDatedRates);
  function deriveBudgetBands() {
    // Up to three contiguous broad groups of distinct real starting rates.
    // Every displayed endpoint is an actual catalogue plan rate.
    const values = [...new Set(verifiedPool.map(p => cheapest(p).rate))].sort((a, b) => a - b);
    const groups = Math.min(3, values.length);
    const bands = [];
    for (let i = 0; i < groups; i++) {
      const bucket = values.slice(Math.floor(i * values.length / groups),
        Math.floor((i + 1) * values.length / groups));
      if (!bucket.length) continue;
      bands.push({ min: bucket[0], max: bucket[bucket.length - 1] });
    }
    return bands;
  }
  const budgetBands = isVariantC ? deriveBudgetBands() : [];
  let selectedBudgetBand = null;
  const distanceToBand = (rate, band) => rate < band.min ? band.min - rate :
    rate > band.max ? rate - band.max : 0;
  function closestPlanToBand(p, band) {
    if (!band) return cheapest(p);
    const center = (band.min + band.max) / 2;
    return plansFor(p).sort((a, b) =>
      distanceToBand(a.rate, band) - distanceToBand(b.rate, band) ||
      Math.abs(a.rate - center) - Math.abs(b.rate - center) ||
      a.rate - b.rate)[0];
  }
  const shownPlan = p => isVariantC && selectedBudgetBand ?
    closestPlanToBand(p, selectedBudgetBand) : cheapest(p);
  function buildBudgetDeck(band) {
    if (!band) return buildDeck("all");
    const center = (band.min + band.max) / 2;
    return verifiedPool.map((p, index) => ({ p, index,
      plan: closestPlanToBand(p, band) })).sort((a, b) =>
      distanceToBand(a.plan.rate, band) - distanceToBand(b.plan.rate, band) ||
      Math.abs(a.plan.rate - center) - Math.abs(b.plan.rate - center) ||
      a.index - b.index).map(item => item.p);
  }
  let deck = isVariantB || isVariantC ? [] : buildDeck("all");

  // A single contextual rescue per browsing run. A category question has value only
  // when multiple categories still exist among products not yet shown.
  const state = { index: 0, saved: [], history: [], prompting: false, prompted: false,
    comparing: false, busy: false, skipStreak: 0, rescueOpen: false, rescueUsed: false };
  const cardSlot = $("card-slot");
  const decisionPrompt = $("decision-prompt");
  const rescuePanel = $("rescue-question");
  const completeView = $("deck-complete");
  const compareView = $("compare-view");
  const detailsSheet = $("details-sheet");
  const shortlistSheet = $("shortlist-sheet");
  const shortlistFooter = $("shortlist-footer");
  const savedLimit = 3;
  let removedFromShortlist = null;
  let detailsReturnToShortlist = false;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let animationToken = 0;

  const savedProducts = () => state.saved.map(id => deck.find(p => p.id === id)).filter(Boolean);
  const categoryLabel = { laundry: "Laundry", fridge: "Fridge",
    cooling: "Aircond", garment: "Penjagaan pakaian", bundle: "Kombo" };
  function factualPromotion(p) {
    // cashPromo is a recorded CASH price only. Never imply a monthly RTO discount.
    const regular = Number(p.cash), promo = Number(p.cashPromo);
    if (p.cashPromo != null && Number.isFinite(regular) && regular > 0 &&
        Number.isFinite(promo) && promo > 0 && promo < regular) {
      return "Promosi harga tunai direkodkan (" + money(promo) + "); status semasa perlu disahkan.";
    }
    return "Tiada promosi disahkan dalam data.";
  }
  function factualAvailability(p) {
    return typeof p.stock === "string" && p.stock.trim() ?
      p.stock.trim() : "Status stok semasa tidak dinyatakan. Sahkan dengan KHIND.";
  }
  function monthlyReference(p) {
    const date = String(p.verifiedDate || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "Kadar perlu disahkan";
    return money(shownPlan(p).rate) + "/bulan";
  }
  function rescueCategory(p) {
    if (p.category === "fridge") return "fridge";
    if (p.category === "cooling") return "aircond";
    if (p.category === "laundry" || p.category === "garment") return "laundry";
    return null;
  }
  function worthRescuing() {
    // Do not repeat an already-specified category (e.g. variant B Laundry).
    if (state.rescueUsed || state.prompting || state.comparing ||
        state.index >= deck.length || !rescuePanel) return false;
    const remainingCategories = new Set(deck.slice(state.index).map(rescueCategory).filter(Boolean));
    return remainingCategories.size >= 2;
  }
  function answerRescue(category) {
    if (!state.rescueOpen) return;
    if (category && category !== "unsure") {
      // Stable partition: never replay skipped cards or lose other products.
      // For budget-first decks, the existing price order is preserved within each group.
      const seen = deck.slice(0, state.index);
      const unseen = deck.slice(state.index);
      deck = seen.concat(
        unseen.filter(p => rescueCategory(p) === category),
        unseen.filter(p => rescueCategory(p) !== category)
      );
    }
    state.rescueOpen = false;
    state.skipStreak = 0;
    render();
    cardSlot.querySelector("#active-card")?.focus({ preventScroll: true });
    announce((category && category !== "unsure" ?
      "Produk seterusnya mengutamakan kategori dipilih. " : "Susunan asal dikekalkan. ") +
      nextCardAnnouncement());
  }
  function renderRescue() {
    rescuePanel.innerHTML =
      '<div class="rescue-card"><p class="rescue-eyebrow">BANTU KAMI CARI YANG SESUAI</p>' +
      '<h2 id="rescue-title" tabindex="-1">Which do you need?</h2>' +
      '<p class="rescue-explainer">Pilih satu untuk lihat produk yang lebih relevan dahulu.</p>' +
      '<div class="rescue-options">' +
      '<button type="button" id="rescue-laundry">Laundry <span aria-hidden="true">↗</span></button>' +
      '<button type="button" id="rescue-fridge">Fridge <span aria-hidden="true">↗</span></button>' +
      '<button type="button" id="rescue-aircond">Aircond <span aria-hidden="true">↗</span></button>' +
      '<button type="button" id="rescue-unsure">Not sure <span aria-hidden="true">→</span></button>' +
      '</div><button type="button" id="rescue-skip" class="rescue-bypass">Skip this question.</button>' +
      '</div>';
    ["laundry", "fridge", "aircond", "unsure"].forEach(choice => {
      rescuePanel.querySelector("#rescue-" + choice).addEventListener("click", () => answerRescue(choice));
    });
    rescuePanel.querySelector("#rescue-skip").addEventListener("click", () => answerRescue("unsure"));
    rescuePanel.querySelector("#rescue-title").focus({ preventScroll: true });
  }
  function whatsappUrl(items) {
    const ids = items.map(p => p.id).join(", ");
    const message = "Salam Hakim, saya berminat dengan produk KHIND RTO berikut: " + ids +
      ". Boleh bantu semak kadar biasa, jumlah keseluruhan, tempoh, manfaat pelan, stok dan proses rasmi? Terima kasih.";
    return "https://wa.me/60174201247?text=" + encodeURIComponent(message);
  }
  // A persistent, polite status region communicates outcomes without moving pointer focus.
  function announce(message) { $("live-message").textContent = message; }
  function focusCurrentCard() {
    if (!state.rescueOpen && !state.prompting && !state.comparing &&
        state.index < deck.length) {
      cardSlot.querySelector("#active-card")?.focus({ preventScroll: true });
    }
  }
  function nextCardAnnouncement() {
    if (state.rescueOpen) return "Pilih satu kategori atau langkau soalan untuk teruskan.";
    if (state.prompting) return "Dua produk disimpan. Banding, teruskan, atau tanya Hakim.";
    if (state.index >= deck.length) return "Semua produk telah dilihat.";
    const p = deck[state.index], plan = shownPlan(p);
    return "Seterusnya, " + (state.index + 1) + " daripada " + deck.length +
      ": " + p.name + ", " + money(plan.rate) + " sebulan, " +
      Number(p.months) + " bulan.";
  }
  function photo(p, className, eager) {
    const src = approvedImage(p.image);
    return src ? '<img class="' + className + '" src="' + escape(src) +
      '" alt="' + escape(p.name + " " + p.id) +
      '" loading="' + (eager ? "eager" : "lazy") +
      '" decoding="async" referrerpolicy="no-referrer">' :
      '<span class="no-photo">Imej rasmi tidak tersedia.</span>';
  }
  function productCard(p) {
    const plan = shownPlan(p);
    const total = plan.rate * Number(p.months);
    return '<article id="active-card" class="product-card" tabindex="0" aria-label="' +
      escape(p.name) + '. Anak panah kiri untuk langkau, kanan untuk simpan."' +
      ' aria-describedby="swipe-instructions" aria-keyshortcuts="ArrowLeft ArrowRight">' +
      '<div class="swipe-overlay swipe-left" aria-hidden="true">LANGKAU</div>' +
      '<div class="swipe-overlay swipe-right" aria-hidden="true">SIMPAN ♥</div>' +
      '<div class="product-photo">' +
      '<div class="photo-topline"><span>KOLEKSI KHIND RTO</span><span>' + escape(p.id) + '</span></div>' +
      photo(p, "hero-appliance", true) +
      '<span class="photo-corner-mark" aria-hidden="true">FOTO PRODUK</span></div>' +
      '<div class="product-copy"><p class="product-overline">' + escape(p.category) + ' <span>· ' + escape(p.id) + '</span></p>' +
      '<h1>' + escape(p.name) + '</h1><p class="product-subtitle">' + escape(p.description || "") + '</p>' +
      (p.stock ? '<p class="product-stock">' + escape(p.stock) + '</p>' : '') +
      '<div class="price-row"><div><span class="price-kicker">' +
      (isVariantC && selectedBudgetBand ? 'KADAR BULANAN BIASA · ' + escape(plan.name) : 'KADAR BULANAN BIASA DARI') + '</span>' +
      '<p class="product-price">' + money(plan.rate) + '<small>/bulan</small></p></div>' +
      '<div class="price-duration"><strong>' + Number(p.months) + '</strong><span>bulan</span></div></div>' +
      '<div class="product-extras"><span>Anggaran jumlah dari <strong>' + money(total) +
      '</strong>*</span><button type="button" id="details-button" class="details-button">Details <span aria-hidden="true">↗</span></button></div>' +
      '</div></article>';
  }
  function setControls() {
    const ended = state.index >= deck.length || !deck.length;
    const disabled = state.busy || state.comparing || state.prompting || state.rescueOpen || ended;
    $("skip-button").disabled = disabled;
    $("save-button").disabled = disabled || state.saved.length >= savedLimit;
    $("save-button").innerHTML = state.saved.length >= savedLimit ?
      '<span aria-hidden="true">♥</span> Penuh (3)' :
      '<span aria-hidden="true">♥</span> Simpan';
    const current = deck[state.index];
    $("skip-button").setAttribute("aria-label", current ?
      "Langkau produk: " + current.name : "Langkau produk");
    $("save-button").setAttribute("aria-label", state.saved.length >= savedLimit ?
      "Had simpanan 3 produk. Buka simpanan dan buang satu untuk simpan produk lain." :
      current ? "Simpan produk: " + current.name : "Simpan produk");
    $("undo-button").disabled = state.busy || !state.history.length;
    $("saved-open").disabled = !state.saved.length;
    $("saved-count").textContent = String(state.saved.length);
    $("saved-open").setAttribute("aria-label", "Lihat produk disimpan, " + state.saved.length + " produk");
    $("deck-position").textContent = ended ? "Selesai" : "Pilihan " + (state.index + 1);
    $("deck-total").textContent = state.index + " / " + deck.length + " dilihat";
    $("progress-fill").style.width = (deck.length ? 100 * state.index / deck.length : 0) + "%";
    $("progress-track").setAttribute("aria-valuemax", String(Math.max(1, deck.length)));
    $("progress-track").setAttribute("aria-valuenow", String(state.index));
    $("progress-track").setAttribute("aria-valuetext",
      state.index + " daripada " + deck.length + " produk telah dilihat");
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
    cardSlot.hidden = state.comparing || state.rescueOpen || state.index >= deck.length || !deck.length;
    // Non-modal overlays must not leave underlying card/Details in the tab order.
    cardSlot.inert = state.comparing || state.prompting || state.rescueOpen;
    if (rescuePanel) rescuePanel.hidden = !state.rescueOpen;
    completeView.hidden = state.comparing || !!deck.length && state.index < deck.length;
    compareView.hidden = !state.comparing;
    decisionPrompt.hidden = !state.prompting || state.comparing;
    if (state.comparing) {
      renderCompare();
      return;
    }
    if (state.rescueOpen) {
      renderRescue();
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
      if (state.prompting) renderPrompt();
      return;
    }
    const p = deck[state.index];
    cardSlot.innerHTML = productCard(p);
    bindImageErrors(cardSlot);
    cardSlot.querySelector("#details-button").addEventListener("click", openDetails);
    enableDrag(cardSlot.querySelector("#active-card"));
    if (state.prompting) renderPrompt();
  }
  function commitDecision(save, fromCardKeyboard = false) {
    if (state.busy || state.comparing || state.prompting || state.rescueOpen || state.index >= deck.length) return;
    if (save && state.saved.length >= savedLimit) {
      openShortlist();
      announce("Simpanan penuh. Anda boleh simpan sehingga tiga produk. Buang satu sebelum menyimpan lagi.");
      return;
    }
    state.busy = true;
    setControls();
    const p = deck[state.index];
    const card = $("active-card");
    const token = ++animationToken;
    const apply = () => {
      if (token !== animationToken) return;
      state.history.push({
        index: state.index, saved: [...state.saved], prompted: state.prompted,
        skipStreak: state.skipStreak, rescueUsed: state.rescueUsed, deck: [...deck]
      });
      if (save && !state.saved.includes(p.id)) state.saved.push(p.id);
      state.skipStreak = save ? 0 : state.skipStreak + 1;
      state.index++;
      state.busy = false;
      if (!save && state.skipStreak >= 3 && worthRescuing()) {
        state.rescueOpen = true;
        state.rescueUsed = true;
      }
      if (state.saved.length === 2 && !state.prompted) {
        state.prompting = true;
        state.prompted = true;
      }
      render();
      announce((save ? "Disimpan: " : "Dilangkau: ") + p.name + ". " +
        state.saved.length + " produk disimpan. " + nextCardAnnouncement());
      // The focused card was replaced by innerHTML; move focus to its successor.
      // Button actions leave focus on their persistent button unless it became disabled.
      if (fromCardKeyboard) {
        if (state.index >= deck.length && !state.rescueOpen && !state.prompting) {
          completeView.querySelector("#completion-title")?.focus({ preventScroll: true });
        } else {
          focusCurrentCard();
        }
      } else if (state.index >= deck.length && !state.rescueOpen && !state.prompting) {
        completeView.querySelector("#completion-title")?.focus({ preventScroll: true });
      }
    };
    if (reduceMotion.matches || !card) { apply(); return; }
    card.classList.add(save ? "exit-right" : "exit-left");
    window.setTimeout(apply, 185);
  }
  function undo() {
    if (state.busy || !state.history.length) return;
    const previous = state.history.pop();
    deck = previous.deck;
    state.index = previous.index;
    state.saved = previous.saved;
    state.prompted = previous.prompted;
    state.skipStreak = previous.skipStreak;
    state.rescueUsed = previous.rescueUsed;
    state.rescueOpen = false;
    state.prompting = false;
    state.comparing = false;
    render();
    focusCurrentCard();
    announce("Tindakan dibatalkan. Kembali ke " + deck[state.index].name + ". " +
      nextCardAnnouncement());
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
      if (state.busy || state.prompting || state.rescueOpen ||
          event.button !== 0 || event.isPrimary === false ||
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
        commitDecision(event.key === "ArrowRight", true);
      }
    });
  }
  function renderPrompt() {
    decisionPrompt.innerHTML =
      '<div class="prompt-card"><p class="prompt-kicker">2 PILIHAN DISIMPAN</p>' +
      '<h2>' + (isVariantB ? 'Pilihan anda sudah sedia.' : 'Dah jumpa yang menarik?') + '</h2><p>Banding kedua-duanya dulu, atau teruskan lihat produk lain.</p>' +
      '<button type="button" class="prompt-primary" id="compare-now">Banding produk <span aria-hidden="true">↗</span></button>' +
      '<button type="button" class="prompt-secondary" id="keep-swiping">Teruskan leret</button>' +
      '<a class="prompt-whatsapp" href="' + escape(whatsappUrl(savedProducts())) +
      '" target="_blank" rel="noopener noreferrer">Tanya Hakim tentang ini ↗</a></div>';
    decisionPrompt.querySelector("#compare-now").addEventListener("click", () => {
      state.prompting = false;
      render();
      openShortlist();
    });
    decisionPrompt.querySelector("#keep-swiping").addEventListener("click", () => {
      state.prompting = false;
      render();
      focusCurrentCard();
    });
    decisionPrompt.querySelector("#compare-now").focus({ preventScroll: true });
  }
  function openDetails(item, fromShortlist = false) {
    const p = item && typeof item === "object" && item.id ?
      item : deck[state.index];
    if (!p || (state.rescueOpen && !fromShortlist)) return;
    // Reading the active card resets a skip streak. Opening a saved item is
    // a separate interaction and cannot alter which card is active.
    if (!fromShortlist) state.skipStreak = 0;
    detailsReturnToShortlist = !!fromShortlist;
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
  function shortlistCard(p, index) {
    const plan = shownPlan(p);
    const date = String(p.verifiedDate || "");
    const checked = /^\d{4}-\d{2}-\d{2}$/.test(date) ?
      "Disemak " + date : "Tarikh pengesahan tidak dinyatakan";
    const facts = [
      ["Model", p.id],
      ["Kategori", categoryLabel[p.category] || String(p.category || "Tidak dinyatakan")],
      ["Kapasiti / spesifikasi", p.description || "Tidak dinyatakan dalam data"],
      ["Kadar bulanan biasa", monthlyReference(p)],
      ["Tempoh", String(p.months) + " bulan"],
      ["Promosi", factualPromotion(p)],
      ["Ketersediaan", factualAvailability(p)]
    ];
    return '<article class="saved-product" aria-labelledby="saved-product-title-' + index + '">' +
      '<div class="saved-product-top"><div class="saved-photo">' + photo(p, "shortlist-appliance", false) +
      '</div><div class="saved-product-intro"><span class="saved-order">PILIHAN 0' +
      (index + 1) + '</span><h3 id="saved-product-title-' + index + '">' + escape(p.name) +
      '</h3><p>' + escape(p.id) + '</p><strong>' + escape(monthlyReference(p)) +
      '</strong><small>' + escape(plan.name) + ' · ' + Number(p.months) + ' bulan · ' +
      escape(checked) + '</small></div></div>' +
      '<dl class="saved-facts">' + facts.map(([label, value]) =>
        '<div class="saved-fact"><dt>' + escape(label) + '</dt><dd>' + escape(value) +
        '</dd></div>').join("") + '</dl>' +
      '<div class="saved-actions"><button id="saved-details-' + index +
      '" type="button" class="saved-view">View details <span aria-hidden="true">↗</span></button>' +
      '<button id="saved-remove-' + index +
      '" type="button" class="saved-remove">Remove <span aria-hidden="true">×</span></button></div>' +
      '</article>';
  }
  function renderShortlist() {
    const items = savedProducts().slice(0, savedLimit);
    $("shortlist-count").textContent = items.length + " / " + savedLimit;
    $("shortlist-body").innerHTML =
      '<p id="shortlist-intro" class="shortlist-intro">Banding fakta yang tersenarai sahaja. Kami tidak membuat penarafan automatik.</p>' +
      (removedFromShortlist ? '<button type="button" id="shortlist-undo-remove" class="shortlist-undo-remove">' +
        '↶ Undo remove: ' + escape(removedFromShortlist.id) + '</button>' : "") +
      (items.length ? '<div class="shortlist-cards">' + items.map(shortlistCard).join("") +
        '</div>' : '<div class="shortlist-empty"><h3>Tiada produk disimpan.</h3>' +
        '<p>Teruskan meleret untuk mencari pilihan anda.</p></div>') +
      '<p class="shortlist-disclosure">Kadar ialah kadar bulanan biasa daripada data rujukan bertarikh, bukan sebut harga langsung. ' +
      'Promosi harga tunai tidak bermaksud diskaun pelan RTO. Stok, promosi, harga dan terma perlu disahkan dengan KHIND.</p>';
    shortlistFooter.innerHTML = '<button class="shortlist-keep" id="shortlist-continue" type="button">' +
      'Keep swiping <span aria-hidden="true">→</span></button>' +
      (items.length ? '<a class="shortlist-contact" id="shortlist-contact" href="' +
        escape(whatsappUrl(items)) + '" target="_blank" rel="noopener noreferrer">' +
        'Ask Hakim about these <span aria-hidden="true">↗</span></a>' :
        '<span class="shortlist-contact shortlist-contact-disabled" aria-disabled="true">' +
        'Ask Hakim about these</span>');
    bindImageErrors($("shortlist-body"));
    items.forEach((p, index) => {
      $("shortlist-body").querySelector("#saved-details-" + index).addEventListener("click", () => {
        shortlistSheet.close();
        openDetails(p, true);
      });
      $("shortlist-body").querySelector("#saved-remove-" + index).addEventListener("click", () => {
        const originalIndex = state.saved.indexOf(p.id);
        if (originalIndex < 0) return;
        state.saved.splice(originalIndex, 1);
        removedFromShortlist = { id: p.id, index: originalIndex };
        // Earlier swipe snapshots should not accidentally resurrect deleted saved items.
        state.history = [];
        setControls();
        renderShortlist();
        $("shortlist-body").querySelector("#shortlist-undo-remove").focus({ preventScroll: true });
        announce(p.name + " dibuang daripada simpanan. " + state.saved.length +
          " produk masih disimpan. Anda boleh undur buang.");
      });
    });
    if (removedFromShortlist) {
      $("shortlist-body").querySelector("#shortlist-undo-remove").addEventListener("click", () => {
        if (!state.saved.includes(removedFromShortlist.id) && state.saved.length < savedLimit) {
          state.saved.splice(Math.min(removedFromShortlist.index, state.saved.length), 0, removedFromShortlist.id);
        }
        removedFromShortlist = null;
        setControls();
        renderShortlist();
        $("shortlist-title").focus({ preventScroll: true });
        announce("Produk dipulihkan ke simpanan. " + state.saved.length + " produk disimpan.");
      });
    }
    shortlistFooter.querySelector("#shortlist-continue").addEventListener("click", closeShortlist);
  }
  function closeShortlist() {
    shortlistSheet.close();
    removedFromShortlist = null;
    state.prompting = false;
    render();
    if (state.index >= deck.length) {
      completeView.querySelector("#completion-title")?.focus({ preventScroll: true });
    } else {
      focusCurrentCard();
    }
    announce("Kembali ke produk. " + state.saved.length + " produk disimpan.");
  }
  function openShortlist() {
    if (!state.saved.length) return;
    renderShortlist();
    shortlistSheet.showModal();
    $("shortlist-title").focus({ preventScroll: true });
    announce("Paparan simpanan. " + state.saved.length + " daripada " + savedLimit + " produk disimpan.");
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
        const plan = shownPlan(p);
        return '<article class="compare-item"><div class="compare-photo">' + photo(p, "compare-appliance", false) + '</div>' +
          '<span class="compare-model">' + escape(p.id) + '</span><h2>' + escape(p.name) + '</h2>' +
          '<div class="compare-metric"><small>' +
          (isVariantC && selectedBudgetBand ? 'Kadar biasa · ' + escape(plan.name) : 'Kadar biasa dari') +
          '</small><strong>' + money(plan.rate) + '/bln</strong></div>' +
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
    const back = () => { state.comparing = false; render(); focusCurrentCard(); };
    $("compare-back").addEventListener("click", back);
    $("compare-continue").addEventListener("click", back);
    announce("Paparan perbandingan untuk " + items.length + " produk.");
  }
  function renderEnd() {
    const items = savedProducts();
    completeView.innerHTML = '<div class="end-icon" aria-hidden="true">✓</div>' +
      '<p class="end-kicker">SEMUA PILIHAN TELAH DILIHAT</p><h1 id="completion-title" tabindex="-1">Selesai meleret.</h1>' +
      '<p>' + (items.length ? "Anda telah simpan " + items.length + " pilihan. Banding sebelum membuat keputusan." :
        "Tiada produk disimpan. Anda boleh lihat sekali lagi atau semak katalog.") + '</p>' +
      (items.length >= 2 ? '<button class="prompt-primary" type="button" id="end-compare">Banding produk ↗</button>' : "") +
      (items.length ? '<button class="prompt-secondary" type="button" id="end-shortlist">Lihat simpanan (' + items.length + ')</button>' : "") +
      '<button class="prompt-secondary" type="button" id="restart-deck">Lihat semula dari awal</button>' +
      '<a class="text-link" href="../catalogue/">Katalog penuh ↗</a>';
    $("end-compare")?.addEventListener("click", openShortlist);
    $("end-shortlist")?.addEventListener("click", openShortlist);
    $("restart-deck").addEventListener("click", () => {
      state.index = 0;
      state.history = [];
      state.skipStreak = 0;
      state.rescueOpen = false;
      state.rescueUsed = false;
      state.prompting = false;
      state.prompted = state.saved.length >= 2;
      render();
      focusCurrentCard();
      announce(nextCardAnnouncement());
    });
    announce("Selesai melihat " + deck.length + " produk.");
  }

  $("skip-button").addEventListener("click", () => commitDecision(false));
  $("save-button").addEventListener("click", () => commitDecision(true));
  $("undo-button").addEventListener("click", undo);
  $("saved-open").addEventListener("click", openShortlist);
  document.querySelector("[data-close-details]").addEventListener("click", () => detailsSheet.close());
  document.querySelector("[data-close-shortlist]").addEventListener("click", closeShortlist);
  detailsSheet.addEventListener("close", () => {
    if (!detailsReturnToShortlist) return;
    detailsReturnToShortlist = false;
    if (state.saved.length) openShortlist();
  });
  [detailsSheet, shortlistSheet].forEach(dialog => dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    if (dialog === shortlistSheet) closeShortlist();
    else dialog.close();
  }));
  shortlistSheet.addEventListener("close", () => { removedFromShortlist = null; });
  if (isVariantC) {
    const options = $("budget-options");
    const bandLabel = band => band.min === band.max ? money(band.min) :
      money(band.min) + " – " + money(band.max);
    options.innerHTML = budgetBands.map((band, i) =>
      '<button type="button" data-budget-choice="' + i + '">' +
      '<span class="question-option-number" aria-hidden="true">0' + (i + 1) + '</span>' +
      '<span class="budget-amount">' + bandLabel(band) + ' <small>/month</small>' +
      '<span class="budget-option-caption">Listed regular monthly rates</span></span>' +
      '<span class="question-option-arrow" aria-hidden="true">↗</span></button>'
    ).join("") + '<button type="button" data-budget-choice="unsure">' +
      '<span class="question-option-number" aria-hidden="true">↗</span>' +
      '<span>Not sure<span class="budget-option-caption">Browse all products</span></span>' +
      '<span class="question-option-arrow" aria-hidden="true">→</span></button>';
    options.addEventListener("click", event => {
      const button = event.target.closest("[data-budget-choice]");
      if (!button || budgetGate.hidden) return;
      const value = button.getAttribute("data-budget-choice");
      if (value !== "unsure" && !/^\d+$/.test(value)) return;
      const selected = value === "unsure" ? null : budgetBands[Number(value)];
      if (value !== "unsure" && !selected) return;
      selectedBudgetBand = selected;
      deck = buildBudgetDeck(selectedBudgetBand);
      budgetGate.hidden = true;
      document.body.classList.remove("awaiting-choice");
      render();
      cardSlot.querySelector("#active-card")?.focus({ preventScroll: true });
    });
  } else if (isVariantB) {
    categoryGate.querySelectorAll("[data-deck-choice]").forEach(button => {
      button.addEventListener("click", () => {
        const choice = button.getAttribute("data-deck-choice");
        if (!choices.includes(choice) || categoryGate.hidden) return;
        deck = buildDeck(choice);
        categoryGate.hidden = true;
        document.body.classList.remove("awaiting-choice");
        render();
        cardSlot.querySelector("#active-card")?.focus({ preventScroll: true });
      });
    });
  } else {
    render();
  }
})();