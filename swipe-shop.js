/* KHIND RTO independent-agent swipe shop.
   All product facts and official image URLs originate in catalogue.js.
   No analytics, personal-information collection, or browser storage. */
(function () {
  "use strict";

  const $ = id => document.getElementById(id);
  // UI language is view-only, never part of the deck, saved list or navigation history.
  // Catalogue product facts keep their original language, clearly marked lang="ms".
  let language = "ms";
  const copy = {
    help: ["Bantu saya pilih", "Help me choose"],
    home: ["Utama", "Home"],
    withHakim: ["bersama Hakim", "with Hakim"],
    yourPicks: ["Pilihan anda", "Your picks"],
    save: ["Simpan", "Save"],
    skip: ["Langkau", "Skip"],
    undo: ["Undur", "Undo"],
    viewDetails: ["Lihat butiran", "View details"],
    details: ["Butiran produk", "Product details"],
    compare: ["Bandingkan", "Compare"],
    monthlyBudget: ["Bajet bulanan", "Monthly budget"],
    notSure: ["Tak pasti", "Not sure"],
    askHakim: ["Tanya Hakim", "Ask Hakim"],
    remove: ["Buang", "Remove"],
    keepSwiping: ["Teruskan lihat produk", "Keep swiping"],
    switch: ["Switch to English", "Tukar ke Bahasa Melayu"],
    languageChanged: ["Bahasa Melayu dipilih.", "English selected."],
    goBack: ["Kembali ke laman utama", "Go to homepage"],
    savedAria: ["Lihat pilihan disimpan, ", "View saved picks, "],
    savedUnit: [" produk", " products"],
    nextCard: ["Seterusnya, ", "Next, "],
    of: [" daripada ", " of "],
    ratePerMonth: [" sebulan, ", " per month, "],
    months: [" bulan", " months"],
    monthSuffix: ["/bulan", "/month"],
    viewed: [" dilihat", " viewed"],
    viewedAlt: [" produk telah dilihat", " products viewed"],
    finished: ["Selesai", "Finished"],
    choice: ["Pilihan ", "Pick "],
    full: ["Penuh (3)", "Full (3)"],
    saveMax: ["Had simpanan tiga produk. Buka Pilihan anda untuk membuang satu sebelum menyimpan lagi.",
      "You can save up to three products. Open Your picks and remove one before saving another."],
    saveItemAria: ["Simpan produk: ", "Save product: "],
    skipItemAria: ["Langkau produk: ", "Skip product: "],
    undoAria: ["Undur tindakan terakhir", "Undo last action"],
    savedLabel: ["Simpan", "Saved"],
    hintSkip: ["← Langkau", "← Skip"],
    hintSave: ["Simpan →", "Save →"],
    shortcutHint: ["Butang atau ← / → pada kad", "Buttons or ← / → on card"],
    footerDisclosure: ["Laman ejen bebas, bukan KHIND HQ · Kadar & kelayakan disahkan KHIND.",
      "Independent agent, not KHIND HQ · Rates and eligibility are subject to KHIND confirmation."],
    detailsHeading: ["MAKLUMAT PRODUK", "PRODUCT DETAILS"],
    closeDetails: ["Tutup butiran", "Close details"],
    closeShortlist: ["Tutup simpanan", "Close shortlist"],
    progressLabel: ["Produk telah dilihat", "Products viewed"],
    stageLabel: ["Pilihan peralatan dan kad produk", "Appliance chooser and product card"],
    unavailable: ["Imej rasmi tidak tersedia.", "Official image unavailable."],
    unavailableLoad: ["Imej rasmi tidak dapat dimuatkan.", "Could not load official image."],
    photo: ["FOTO PRODUK", "PRODUCT PHOTO"],
    collection: ["KOLEKSI KHIND RTO", "KHIND RTO COLLECTION"],
    normalFrom: ["KADAR BULANAN BIASA DARI", "REGULAR MONTHLY RATE FROM"],
    normalSelected: ["KADAR BULANAN BIASA · ", "REGULAR MONTHLY RATE · "],
    estimateFrom: ["Anggaran jumlah dari ", "Estimated total from "],
    arrowHint: [". Anak panah kiri untuk langkau, kanan untuk simpan.",
      ". Press Left Arrow to skip or Right Arrow to save."],
    savedResult: ["Disimpan: ", "Saved: "],
    skippedResult: ["Dilangkau: ", "Skipped: "],
    productsSaved: [" produk disimpan. ", " products saved. "],
    undoResult: ["Tindakan dibatalkan. Kembali ke ", "Action undone. Back to "],
    noProducts: ["Produk belum tersedia", "No products available"],
    noProductsBody: ["Katalog belum mempunyai imej dan kadar sah yang boleh dipaparkan.",
      "No catalogue products with valid images and rates can currently be shown."],
    fullCatalogue: ["Lihat katalog penuh", "View full catalogue"],
    askRescue: ["Apa yang anda perlukan?", "Which do you need?"],
    rescueKicker: ["BANTU KAMI CARI YANG SESUAI", "HELP US FIND WHAT FITS"],
    rescueInfo: ["Pilih satu untuk lihat produk yang lebih relevan dahulu.",
      "Choose one to see relevant products first."],
    laundry: ["Dobi", "Laundry"],
    fridge: ["Peti sejuk", "Fridge"],
    aircond: ["Penyaman udara", "Aircond"],
    skipQuestion: ["Langkau soalan ini.", "Skip this question."],
    rescueChosen: ["Produk seterusnya mengutamakan kategori dipilih. ",
      "Remaining products now prioritize your chosen category. "],
    rescueUnchanged: ["Susunan asal dikekalkan. ", "Original order preserved. "],
    rescuePending: ["Pilih satu kategori atau langkau soalan untuk teruskan.",
      "Choose a category or skip this question to continue."],
    rescuePrompt: ["Tiga produk dilangkau. Soalan pilihan dipaparkan.",
      "Three products skipped. An optional question is now shown."],
    twoSaved: ["2 PILIHAN DISIMPAN", "2 PICKS SAVED"],
    twoSavedReady: ["Pilihan anda sudah sedia.", "Your picks are ready."],
    twoSavedQuestion: ["Dah jumpa yang menarik?", "Found something you like?"],
    twoSavedDescription: ["Bandingkan pilihan ini dahulu atau teruskan lihat produk.",
      "Compare your saved picks or keep browsing."],
    compareProducts: ["Bandingkan produk", "Compare products"],
    askAbout: ["Tanya Hakim tentang ini", "Ask Hakim about these"],
    promptSaved: ["Dua produk disimpan. Bandingkan, teruskan, atau tanya Hakim.",
      "Two products saved. Compare, continue or ask Hakim."],
    allSeen: ["Semua produk telah dilihat.", "All products viewed."],
    estimated: ["Anggaran ", "Estimated "],
    normalPlans: ["Pelan & bayaran biasa", "Plans and regular monthly payments"],
    cashReference: ["Harga tunai rujukan: ", "Reference cash price: "],
    listedBenefits: ["Manfaat yang disenaraikan", "Listed benefits"],
    detailsDisclaimer: ["*Anggaran kadar biasa × tempoh, tidak termasuk promosi atau caj tambahan. Harga, stok, manfaat, tempoh dan kelayakan perlu disahkan melalui KHIND. Banding jumlah RTO dengan harga tunai.",
      "*Estimated regular monthly amount × term, excluding promotions and additional charges. Confirm rates, stock, benefits, term and eligibility with KHIND. Compare total RTO cost with the cash price."],
    productPage: ["Halaman produk", "Product page"],
    officialReference: ["Rujukan rasmi", "Official reference"],
    savedKicker: ["PILIHAN ANDA", "YOUR PICKS"],
    savedChoice: ["PILIHAN 0", "PICK 0"],
    checked: ["Disemak ", "Checked "],
    dateMissing: ["Tarikh pengesahan tidak dinyatakan", "No verification date supplied"],
    model: ["Model", "Model"],
    category: ["Kategori", "Category"],
    majorSpec: ["Kapasiti / spesifikasi", "Capacity / key specification"],
    monthlyRate: ["Kadar bulanan biasa", "Regular monthly amount"],
    term: ["Tempoh", "Term"],
    promotion: ["Promosi", "Promotion"],
    availability: ["Ketersediaan", "Availability"],
    unsupplied: ["Tidak dinyatakan dalam data", "Not supplied in product data"],
    promoCash: ["Promosi harga tunai direkodkan (", "Recorded cash-price promotion ("],
    promoCheck: ["); status semasa perlu disahkan.", "); current status must be confirmed."],
    noPromotion: ["Tiada promosi disahkan dalam data.", "No promotion confirmed in the data."],
    unknownStock: ["Status stok semasa tidak dinyatakan. Sahkan dengan KHIND.",
      "Current stock status not provided. Confirm with KHIND."],
    rateToConfirm: ["Kadar perlu disahkan", "Rate requires confirmation"],
    notRanked: ["Banding fakta yang tersenarai sahaja. Kami tidak membuat penarafan automatik.",
      "Compare listed facts only. Products are not ranked automatically."],
    undoRemove: ["Undur buang: ", "Undo remove: "],
    emptyPicks: ["Tiada produk disimpan.", "No saved products."],
    emptyPicksBody: ["Teruskan melihat produk untuk mencari pilihan anda.",
      "Keep browsing to find your picks."],
    shortlistDisclaimer: ["Kadar ialah kadar bulanan biasa daripada data rujukan bertarikh, bukan sebut harga langsung. Promosi harga tunai tidak bermaksud diskaun pelan RTO. Stok, promosi, harga dan terma perlu disahkan dengan KHIND.",
      "Rates are dated regular monthly catalogue references, not live quotes. Cash-price promotions are not RTO plan discounts. Confirm stock, promotions, prices and terms with KHIND."],
    askAboutThese: ["Tanya Hakim tentang pilihan ini", "Ask Hakim about these"],
    removeResult: [" dibuang daripada simpanan. ", " removed from your picks. "],
    remainingSaved: [" produk masih disimpan. Anda boleh undur buang.",
      " picks remaining. You can undo the removal."],
    restored: ["Produk dipulihkan ke simpanan. ", "Product restored to your picks. "],
    backProducts: ["Kembali ke produk. ", "Back to products. "],
    picksView: ["Paparan Pilihan anda. ", "Your picks. "],
    outOf: [" daripada ", " of "],
    completionKicker: ["SEMUA PILIHAN TELAH DILIHAT", "ALL PRODUCTS VIEWED"],
    completionHeading: ["Selesai meleret.", "You've seen them all."],
    completionSaved: ["Anda telah simpan ", "You've saved "],
    completionSavedEnd: [" pilihan. Bandingkan dahulu sebelum membuat keputusan.",
      " picks. Compare them before deciding."],
    completionEmpty: ["Tiada produk disimpan. Anda boleh lihat sekali lagi atau semak katalog.",
      "Nothing saved yet. Browse again or explore the catalogue."],
    seeSaved: ["Lihat simpanan (", "View picks ("],
    restart: ["Lihat semula dari awal", "Browse again"],
    doneAnnounce: ["Selesai melihat ", "Finished viewing "],
    categoryQ: ["Apa yang anda cari hari ini?", "What are you looking for today?"],
    categoryMarker: ["BANTU SAYA PILIH", "FIND YOUR FIT"],
    categoryEyebrow: ["SATU PILIHAN. TERUS LIHAT PRODUK.", "ONE TAP. STRAIGHT TO PRODUCTS."],
    categoryExplanation: ["Pilih kategori yang anda perlukan dan terus lihat produk.",
      "Choose what you need and start swiping immediately."],
    washing: ["Mesin basuh", "Washing machine"],
    refrigerator: ["Peti sejuk", "Refrigerator"],
    airconditioner: ["Penyaman udara", "Air conditioner"],
    showEverything: ["Lihat semua", "Show me everything"],
    categoryDisclosure: ["Laman ejen bebas, bukan KHIND HQ. Kadar dan kelayakan tertakluk kepada pengesahan KHIND.",
      "Independent agent, not KHIND HQ. Rates and eligibility must be confirmed by KHIND."],
    budgetQ: ["Berapakah bajet bulanan yang selesa untuk anda?", "What monthly amount feels comfortable?"],
    budgetMarker: ["BAJET BULANAN", "MONTHLY BUDGET"],
    budgetEyebrow: ["SATU LANGKAH PILIHAN", "ONE OPTIONAL STEP"],
    budgetExplanation: ["Julat ini berdasarkan kadar bulanan biasa dalam katalog semasa. Pilih julat atau tekan Tak pasti.",
      "These bands use current catalogue regular monthly rates. Choose a range or select Not sure."],
    budgetDisclosure: ["Ini hanya pilihan untuk melihat produk, bukan semakan kelayakan atau kelulusan pinjaman. Kadar dan terma perlu disahkan oleh KHIND. Laman ejen bebas, bukan KHIND HQ.",
      "This is a browsing preference, not a loan eligibility or approval check. KHIND must confirm rates and terms. Independent agent, not KHIND HQ."],
    listedRates: ["Kadar bulanan biasa tersenarai", "Listed regular monthly rates"],
    browseAll: ["Lihat semua produk", "Browse all products"],
    monthlyShort: ["/bulan", "/month"],
    compareHeading: ["Bandingkan sebelum memilih", "Compare before choosing"],
    compareBack: ["Kembali", "Back"],
    compareHelp: ["Leret jadual ke tepi untuk melihat pilihan lain.", "Scroll sideways to see other picks."],
    compareEstimated: ["Jumlah anggaran*", "Estimated total*"],
    planDifferences: ["Manfaat berbeza mengikut pelan.", "Benefits vary by plan."],
    detailsMore: ["Butiran produk", "Product details"]
  };
  const t = key => (copy[key] || [key, key])[language === "ms" ? 0 : 1];

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
  function labelCategory(category) {
    return ({
      laundry: t("laundry"), fridge: t("fridge"), cooling: t("aircond"),
      garment: language === "ms" ? "Penjagaan pakaian" : "Garment care",
      bundle: language === "ms" ? "Kombo" : "Bundle"
    })[category] || String(category || t("unsupplied"));
  }
  function factualPromotion(p) {
    // cashPromo is a recorded CASH price only. Never imply a monthly RTO discount.
    const regular = Number(p.cash), promo = Number(p.cashPromo);
    if (p.cashPromo != null && Number.isFinite(regular) && regular > 0 &&
        Number.isFinite(promo) && promo > 0 && promo < regular) {
      return t("promoCash") + money(promo) + t("promoCheck");
    }
    return t("noPromotion");
  }
  function factualAvailability(p) {
    return typeof p.stock === "string" && p.stock.trim() ?
      p.stock.trim() : t("unknownStock");
  }
  function monthlyReference(p) {
    const date = String(p.verifiedDate || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return t("rateToConfirm");
    return money(shownPlan(p).rate) + t("monthSuffix");
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
      t("rescueChosen") : t("rescueUnchanged")) +
      nextCardAnnouncement());
  }
  function renderRescue() {
    rescuePanel.innerHTML =
      '<div class="rescue-card"><p class="rescue-eyebrow">' + t("rescueKicker") + '</p>' +
      '<h2 id="rescue-title" tabindex="-1">' + t("askRescue") + '</h2>' +
      '<p class="rescue-explainer">' + t("rescueInfo") + '</p>' +
      '<div class="rescue-options">' +
      '<button type="button" id="rescue-laundry">' + t("laundry") + ' <span aria-hidden="true">↗</span></button>' +
      '<button type="button" id="rescue-fridge">' + t("fridge") + ' <span aria-hidden="true">↗</span></button>' +
      '<button type="button" id="rescue-aircond">' + t("aircond") + ' <span aria-hidden="true">↗</span></button>' +
      '<button type="button" id="rescue-unsure">' + t("notSure") + ' <span aria-hidden="true">→</span></button>' +
      '</div><button type="button" id="rescue-skip" class="rescue-bypass">' + t("skipQuestion") + '</button>' +
      '</div>';
    ["laundry", "fridge", "aircond", "unsure"].forEach(choice => {
      rescuePanel.querySelector("#rescue-" + choice).addEventListener("click", () => answerRescue(choice));
    });
    rescuePanel.querySelector("#rescue-skip").addEventListener("click", () => answerRescue("unsure"));
    rescuePanel.querySelector("#rescue-title").focus({ preventScroll: true });
  }
  function whatsappUrl(items) {
    const ids = items.map(p => p.id).join(", ");
    const message = language === "ms" ?
      "Salam Hakim, saya berminat dengan produk KHIND RTO berikut: " + ids +
        ". Boleh bantu semak kadar biasa, jumlah keseluruhan, tempoh, manfaat pelan, stok dan proses rasmi? Terima kasih." :
      "Hello Hakim, I'm interested in these KHIND RTO products: " + ids +
        ". Please help confirm regular monthly amounts, total costs, terms, benefits, stock and the official application process. Thank you.";
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
    if (state.rescueOpen) return t("rescuePending");
    if (state.prompting) return t("promptSaved");
    if (state.index >= deck.length) return t("allSeen");
    const p = deck[state.index], plan = shownPlan(p);
    return t("nextCard") + (state.index + 1) + t("of") + deck.length +
      ": " + p.name + ", " + money(plan.rate) + t("ratePerMonth") +
      Number(p.months) + t("months") + ".";
  }
  function photo(p, className, eager) {
    const src = approvedImage(p.image);
    return src ? '<img class="' + className + '" src="' + escape(src) +
      '" alt="' + escape(p.name + " " + p.id) +
      '" loading="' + (eager ? "eager" : "lazy") +
      '" decoding="async" referrerpolicy="no-referrer">' :
      '<span class="no-photo">' + t("unavailable") + '</span>';
  }
  function productCard(p) {
    const plan = shownPlan(p);
    const total = plan.rate * Number(p.months);
    return '<article id="active-card" class="product-card" tabindex="0" aria-label="' +
      escape(p.name) + t("arrowHint") + '"' +
      ' aria-describedby="swipe-instructions" aria-keyshortcuts="ArrowLeft ArrowRight">' +
      '<div class="swipe-overlay swipe-left" aria-hidden="true">' + t("skip").toUpperCase() + '</div>' +
      '<div class="swipe-overlay swipe-right" aria-hidden="true">' + t("save").toUpperCase() + ' ♥</div>' +
      '<div class="product-photo">' +
      '<div class="photo-topline"><span>' + t("collection") + '</span><span>' + escape(p.id) + '</span></div>' +
      photo(p, "hero-appliance", true) +
      '<span class="photo-corner-mark" aria-hidden="true">' + t("photo") + '</span></div>' +
      '<div class="product-copy"><p class="product-overline">' + escape(labelCategory(p.category)) + ' <span>· ' + escape(p.id) + '</span></p>' +
      '<h1 lang="ms">' + escape(p.name) + '</h1><p class="product-subtitle" lang="ms">' + escape(p.description || "") + '</p>' +
      (p.stock ? '<p class="product-stock" lang="ms">' + escape(p.stock) + '</p>' : '') +
      '<div class="price-row"><div><span class="price-kicker">' +
      (isVariantC && selectedBudgetBand ? t("normalSelected") + escape(plan.name) : t("normalFrom")) + '</span>' +
      '<p class="product-price">' + money(plan.rate) + '<small>' + t("monthSuffix") + '</small></p></div>' +
      '<div class="price-duration"><strong>' + Number(p.months) + '</strong><span>' + t("months").trim() + '</span></div></div>' +
      '<div class="product-extras"><span>' + t("estimateFrom") + '<strong>' + money(total) +
      '</strong>*</span><button type="button" id="details-button" class="details-button">' + t("viewDetails") + ' <span aria-hidden="true">↗</span></button></div>' +
      '</div></article>';
  }
  function setControls() {
    const ended = state.index >= deck.length || !deck.length;
    const disabled = state.busy || state.comparing || state.prompting || state.rescueOpen || ended;
    $("skip-button").disabled = disabled;
    $("save-button").disabled = disabled || state.saved.length >= savedLimit;
    $("save-button").innerHTML = state.saved.length >= savedLimit ?
      '<span aria-hidden="true">♥</span> ' + t("full") :
      '<span aria-hidden="true">♥</span> ' + t("save");
    const current = deck[state.index];
    $("skip-button").setAttribute("aria-label", current ?
      t("skipItemAria") + current.name : t("skip"));
    $("save-button").setAttribute("aria-label", state.saved.length >= savedLimit ?
      t("saveMax") :
      current ? t("saveItemAria") + current.name : t("save"));
    $("undo-button").disabled = state.busy || !state.history.length;
    $("saved-open").disabled = !state.saved.length;
    $("saved-count").textContent = String(state.saved.length);
    $("saved-open").setAttribute("aria-label", t("savedAria") + state.saved.length + t("savedUnit"));
    $("deck-position").textContent = ended ? t("finished") : t("choice") + (state.index + 1);
    $("deck-total").textContent = state.index + " / " + deck.length + t("viewed");
    $("progress-fill").style.width = (deck.length ? 100 * state.index / deck.length : 0) + "%";
    $("progress-track").setAttribute("aria-valuemax", String(Math.max(1, deck.length)));
    $("progress-track").setAttribute("aria-valuenow", String(state.index));
    $("progress-track").setAttribute("aria-valuetext",
      state.index + t("of") + deck.length + t("viewedAlt"));
  }
  function bindImageErrors(container) {
    container.querySelectorAll("img").forEach(img => {
      img.addEventListener("error", () => {
        const holder = document.createElement("span");
        holder.className = "no-photo";
        holder.textContent = t("unavailableLoad");
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
      completeView.innerHTML = '<div class="end-icon" aria-hidden="true">!</div><h1>' + t("noProducts") + '</h1>' +
        '<p>' + t("noProductsBody") + '</p>' +
        '<a class="text-link" href="../catalogue/">' + t("fullCatalogue") + ' →</a>';
      announce(t("noProducts"));
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
      announce(t("saveMax"));
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
      announce((save ? t("savedResult") : t("skippedResult")) + p.name + ". " +
        state.saved.length + t("productsSaved") + nextCardAnnouncement());
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
    announce(t("undoResult") + deck[state.index].name + ". " +
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
      '<div class="prompt-card"><p class="prompt-kicker">' + t("twoSaved") + '</p>' +
      '<h2>' + (isVariantB ? t("twoSavedReady") : t("twoSavedQuestion")) + '</h2>' +
      '<p>' + t("twoSavedDescription") + '</p>' +
      '<button type="button" class="prompt-primary" id="compare-now">' + t("compare") +
      ' <span aria-hidden="true">↗</span></button>' +
      '<button type="button" class="prompt-secondary" id="keep-swiping">' + t("keepSwiping") + '</button>' +
      '<a class="prompt-whatsapp" href="' + escape(whatsappUrl(savedProducts())) +
      '" target="_blank" rel="noopener noreferrer">' + t("askAbout") + ' ↗</a></div>';
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
  let detailsProduct = null;
  function openDetails(item, fromShortlist = false) {
    const p = item && typeof item === "object" && item.id ? item : deck[state.index];
    if (!p || (state.rescueOpen && !fromShortlist)) return;
    if (!fromShortlist) state.skipStreak = 0;
    detailsReturnToShortlist = !!fromShortlist;
    detailsProduct = p;
    const plans = plansFor(p);
    const previousScroll = detailsSheet.open ? $("details-body").scrollTop : 0;
    $("details-body").innerHTML =
      '<div class="details-photo">' + photo(p, "details-appliance", false) + '</div>' +
      '<div class="details-summary"><span class="detail-model">' + escape(p.id) + '</span>' +
      '<h2 id="details-title" lang="ms">' + escape(p.name) + '</h2>' +
      '<p lang="ms">' + escape(p.description || "") + '</p></div>' +
      '<h3>' + t("normalPlans") + '</h3><div class="plan-list">' +
      plans.map(q => '<div class="plan-item"><span>' + escape(q.name) + '</span><strong>' +
        money(q.rate) + ' <small>' + t("monthSuffix") + '</small></strong><small>' + t("estimated") +
        money(q.rate * Number(p.months)) + ' / ' + Number(p.months) + t("months") +
        '*</small></div>').join("") + '</div>' +
      (Number.isFinite(Number(p.cash)) && p.cash != null ?
        '<p class="cash-reference">' + t("cashReference") + '<strong>' + money(p.cash) + '</strong></p>' : "") +
      (p.benefits ? '<h3>' + t("listedBenefits") + '</h3><p lang="ms">' + escape(p.benefits) + '</p>' : "") +
      (p.stock ? '<p class="stock-note" lang="ms">' + escape(p.stock) + '</p>' : "") +
      '<p class="details-caveat">' + t("detailsDisclaimer") + '</p>' +
      '<div class="detail-links"><a href="../products/' + encodeURIComponent(p.id) +
      '/">' + t("productPage") + ' →</a>' +
      (approvedSource(p.source) ? '<a href="' + escape(approvedSource(p.source)) +
        '" target="_blank" rel="noopener noreferrer">' + t("officialReference") + ' ↗</a>' : "") +
      '</div>';
    bindImageErrors($("details-body"));
    if (!detailsSheet.open) detailsSheet.showModal();
    else $("details-body").scrollTop = previousScroll;
  }
  function shortlistCard(p, index) {
    const plan = shownPlan(p);
    const date = String(p.verifiedDate || "");
    const checked = /^\d{4}-\d{2}-\d{2}$/.test(date) ?
      t("checked") + date : t("dateMissing");
    const facts = [
      [t("model"), p.id, false],
      [t("category"), labelCategory(p.category), false],
      [t("majorSpec"), p.description || t("unsupplied"), !!p.description],
      [t("monthlyRate"), monthlyReference(p), false],
      [t("term"), String(p.months) + t("months"), false],
      [t("promotion"), factualPromotion(p), false],
      [t("availability"), factualAvailability(p), !!(p.stock && p.stock.trim())]
    ];
    return '<article class="saved-product" aria-labelledby="saved-product-title-' + index + '">' +
      '<div class="saved-product-top"><div class="saved-photo">' + photo(p, "shortlist-appliance", false) +
      '</div><div class="saved-product-intro"><span class="saved-order">' + t("savedChoice") +
      (index + 1) + '</span><h3 lang="ms" id="saved-product-title-' + index + '">' + escape(p.name) +
      '</h3><p>' + escape(p.id) + '</p><strong>' + escape(monthlyReference(p)) +
      '</strong><small>' + escape(plan.name) + ' · ' + Number(p.months) + t("months") + ' · ' +
      escape(checked) + '</small></div></div>' +
      '<dl class="saved-facts">' + facts.map(([label, value, sourceMalay]) =>
        '<div class="saved-fact"><dt>' + escape(label) + '</dt><dd' +
        (sourceMalay ? ' lang="ms"' : "") + '>' + escape(value) + '</dd></div>').join("") + '</dl>' +
      '<div class="saved-actions"><button id="saved-details-' + index +
      '" type="button" class="saved-view">' + t("viewDetails") +
      ' <span aria-hidden="true">↗</span></button>' +
      '<button id="saved-remove-' + index +
      '" type="button" class="saved-remove">' + t("remove") +
      ' <span aria-hidden="true">×</span></button></div></article>';
  }
  function renderShortlist() {
    const items = savedProducts().slice(0, savedLimit);
    $("shortlist-count").textContent = items.length + " / " + savedLimit;
    $("shortlist-body").innerHTML =
      '<p id="shortlist-intro" class="shortlist-intro">' + t("notRanked") + '</p>' +
      (removedFromShortlist ? '<button type="button" id="shortlist-undo-remove" class="shortlist-undo-remove">' +
        '↶ ' + t("undoRemove") + escape(removedFromShortlist.id) + '</button>' : "") +
      (items.length ? '<div class="shortlist-cards">' + items.map(shortlistCard).join("") +
        '</div>' : '<div class="shortlist-empty"><h3>' + t("emptyPicks") + '</h3>' +
        '<p>' + t("emptyPicksBody") + '</p></div>') +
      '<p class="shortlist-disclosure">' + t("shortlistDisclaimer") + '</p>';
    shortlistFooter.innerHTML = '<button class="shortlist-keep" id="shortlist-continue" type="button">' +
      t("keepSwiping") + ' <span aria-hidden="true">→</span></button>' +
      (items.length ? '<a class="shortlist-contact" id="shortlist-contact" href="' +
        escape(whatsappUrl(items)) + '" target="_blank" rel="noopener noreferrer">' +
        t("askAboutThese") + ' <span aria-hidden="true">↗</span></a>' :
        '<span class="shortlist-contact shortlist-contact-disabled" aria-disabled="true">' +
        t("askAboutThese") + '</span>');
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
        state.history = [];
        setControls();
        renderShortlist();
        $("shortlist-body").querySelector("#shortlist-undo-remove").focus({ preventScroll: true });
        announce(p.name + t("removeResult") + state.saved.length + t("remainingSaved"));
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
        announce(t("restored") + state.saved.length + t("savedUnit") + ".");
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
    announce(t("backProducts") + state.saved.length + t("savedUnit") + ".");
  }
  function openShortlist() {
    if (!state.saved.length) return;
    renderShortlist();
    shortlistSheet.showModal();
    $("shortlist-title").focus({ preventScroll: true });
    announce(t("picksView") + state.saved.length + t("outOf") + savedLimit + t("savedUnit") + ".");
  }
  function renderCompare() {
    const items = savedProducts();
    if (items.length < 2) {
      state.comparing = false;
      render();
      return;
    }
    compareView.innerHTML = '<div class="compare-heading"><button type="button" id="compare-back">← ' +
      t("compareBack") + '</button><span>' + items.length + ' ' + t("savedKicker") + '</span></div>' +
      '<h1>' + t("compareHeading") + '</h1><p>' + t("compareHelp") + '</p>' +
      '<div class="compare-scroll"><div class="compare-grid">' +
      items.map(p => {
        const plan = shownPlan(p);
        return '<article class="compare-item"><div class="compare-photo">' + photo(p, "compare-appliance", false) +
          '</div><span class="compare-model">' + escape(p.id) + '</span>' +
          '<h2 lang="ms">' + escape(p.name) + '</h2>' +
          '<div class="compare-metric"><small>' + t("monthlyRate") + '</small><strong>' +
          money(plan.rate) + t("monthSuffix") + '</strong></div>' +
          '<div class="compare-metric"><small>' + t("term") + '</small><strong>' +
          Number(p.months) + t("months") + '</strong></div>' +
          '<div class="compare-metric"><small>' + t("compareEstimated") + '</small><strong>' +
          money(plan.rate * Number(p.months)) + '</strong></div>' +
          (p.cash != null && Number.isFinite(Number(p.cash)) ?
            '<div class="compare-metric"><small>' + t("cashReference") + '</small><strong>' +
            money(p.cash) + '</strong></div>' : "") +
          '<div class="compare-benefits"><small>' + t("listedBenefits") +
            '</small><p lang="ms">' + escape(p.benefits || "") + '</p></div>' +
          '<a href="../products/' + encodeURIComponent(p.id) + '/">' + t("viewDetails") + ' ↗</a></article>';
      }).join("") + '</div></div>' +
      '<p class="compare-note">' + t("shortlistDisclaimer") + '</p>' +
      '<a class="compare-contact" href="' + escape(whatsappUrl(items)) +
      '" target="_blank" rel="noopener noreferrer">' + t("askAboutThese") + ' ↗</a>' +
      '<button class="continue-after-compare" id="compare-continue" type="button">' +
      t("keepSwiping") + ' →</button>';
    bindImageErrors(compareView);
    const back = () => { state.comparing = false; render(); focusCurrentCard(); };
    $("compare-back").addEventListener("click", back);
    $("compare-continue").addEventListener("click", back);
    announce(t("compare") + ": " + items.length + t("savedUnit") + ".");
  }
  function renderEnd() {
    const items = savedProducts();
    completeView.innerHTML = '<div class="end-icon" aria-hidden="true">✓</div>' +
      '<p class="end-kicker">' + t("completionKicker") + '</p>' +
      '<h1 id="completion-title" tabindex="-1">' + t("completionHeading") + '</h1>' +
      '<p>' + (items.length ? t("completionSaved") + items.length + t("completionSavedEnd") :
        t("completionEmpty")) + '</p>' +
      (items.length >= 2 ? '<button class="prompt-primary" type="button" id="end-compare">' +
        t("compare") + ' ↗</button>' : "") +
      (items.length ? '<button class="prompt-secondary" type="button" id="end-shortlist">' +
        t("seeSaved") + items.length + ')</button>' : "") +
      '<button class="prompt-secondary" type="button" id="restart-deck">' + t("restart") + '</button>' +
      '<a class="text-link" href="../catalogue/">' + t("fullCatalogue") + ' ↗</a>';
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
    announce(t("doneAnnounce") + deck.length + t("savedUnit") + ".");
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
  function renderBudgetOptions() {
    if (!isVariantC || budgetGate.hidden) return;
    const options = $("budget-options");
    const bandLabel = band => band.min === band.max ? money(band.min) :
      money(band.min) + " – " + money(band.max);
    options.innerHTML = budgetBands.map((band, i) =>
      '<button type="button" data-budget-choice="' + i + '">' +
      '<span class="question-option-number" aria-hidden="true">0' + (i + 1) + '</span>' +
      '<span class="budget-amount">' + bandLabel(band) + ' <small>' + t("monthlyShort") + '</small>' +
      '<span class="budget-option-caption">' + t("listedRates") + '</span></span>' +
      '<span class="question-option-arrow" aria-hidden="true">↗</span></button>'
    ).join("") + '<button type="button" data-budget-choice="unsure">' +
      '<span class="question-option-number" aria-hidden="true">↗</span>' +
      '<span>' + t("notSure") + '<span class="budget-option-caption">' + t("browseAll") + '</span></span>' +
      '<span class="question-option-arrow" aria-hidden="true">→</span></button>';
  }
  function applyStaticTranslations() {
    document.documentElement.lang = language;
    document.documentElement.setAttribute?.("lang", language);
    const inEnglish = language === "en";
    const variantName = isVariantB ? (inEnglish ? "Category-first" : "Pilihan kategori") :
      isVariantC ? (inEnglish ? "Budget-first" : "Pilihan bajet") : null;
    document.title = (inEnglish ? "Help me choose KHIND RTO appliances" : "Bantu saya pilih peralatan KHIND RTO") +
      (variantName ? " — " + variantName : "") + " | Hakim";
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", inEnglish ?
      "Compare KHIND RTO appliances, regular monthly rates and terms. Save up to three picks and ask independent agent Hakim." :
      "Pilih peralatan KHIND RTO, banding kadar bulanan biasa dan tempoh. Simpan sehingga tiga pilihan dan tanya ejen bebas Hakim.");
    const set = (id, value) => { const node = $(id); if (node) node.textContent = value; };
    set("skip-content-link", t("help"));
    set("home-label", t("home"));
    set("agent-label", t("withHakim"));
    set("saved-label", t("savedLabel"));
    set("hint-skip", "← " + t("skip"));
    set("hint-save", t("save") + " →");
    set("swipe-instructions", t("shortcutHint"));
    $("skip-button").innerHTML = '<span aria-hidden="true">✕</span> ' + t("skip");
    set("footer-disclosure", t("footerDisclosure"));
    set("details-heading-label", t("detailsHeading"));
    set("shortlist-kicker", t("savedKicker"));
    set("shortlist-title", t("yourPicks"));
    $("undo-button").setAttribute("aria-label", t("undoAria"));
    $("undo-button").querySelector("span:last-child").textContent = t("undo");
    document.querySelector("[data-close-details]")?.setAttribute("aria-label", t("closeDetails"));
    document.querySelector("[data-close-shortlist]")?.setAttribute("aria-label", t("closeShortlist"));
    document.querySelector(".home-link")?.setAttribute("aria-label", t("goBack"));
    $("progress-track").setAttribute("aria-label", t("progressLabel"));
    if (isVariantB) {
      set("gate-marker", t("categoryMarker"));
      set("gate-eyebrow", t("categoryEyebrow"));
      set("one-question-title", t("categoryQ"));
      set("gate-explainer", t("categoryExplanation"));
      set("gate-option-washing", t("washing"));
      set("gate-option-fridge", t("refrigerator"));
      set("gate-option-cooling", t("airconditioner"));
      set("gate-option-all", t("showEverything"));
      set("gate-disclosure", t("categoryDisclosure"));
    }
    if (isVariantC) {
      set("gate-marker", t("budgetMarker"));
      set("gate-eyebrow", t("budgetEyebrow"));
      set("budget-question-title", t("budgetQ"));
      set("gate-explainer", t("budgetExplanation"));
      set("gate-disclosure", t("budgetDisclosure"));
      renderBudgetOptions();
    }
    ["language-main", "language-details", "language-shortlist"].forEach(id => {
      const button = $(id);
      if (!button) return;
      button.textContent = inEnglish ? "BM" : "EN";
      button.setAttribute("lang", inEnglish ? "ms" : "en");
      button.setAttribute("aria-label", t("switch"));
      button.setAttribute("aria-pressed", "false");
    });
  }
  function switchLanguage(buttonId) {
    const previous = language;
    language = language === "ms" ? "en" : "ms";
    if (previous === language) return;
    // Rebuild only localized views. Shopping state, deck order, history, preferences,
    // saved/skipped decisions and native dialog open state remain untouched.
    const detailsOpen = detailsSheet.open;
    const shortlistOpen = shortlistSheet.open;
    const shortlistScroll = shortlistOpen ? $("shortlist-body").scrollTop : 0;
    applyStaticTranslations();
    if (!(isVariantB && !categoryGate.hidden) && !(isVariantC && !budgetGate.hidden)) {
      render();
    }
    if (shortlistOpen) {
      renderShortlist();
      $("shortlist-body").scrollTop = shortlistScroll;
    }
    if (detailsOpen && detailsProduct) {
      openDetails(detailsProduct, detailsReturnToShortlist);
    }
    $(buttonId)?.focus({ preventScroll: true });
    announce(t("languageChanged"));
  }
  ["language-main", "language-details", "language-shortlist"].forEach(id => {
    $(id)?.addEventListener("click", () => switchLanguage(id));
  });
  applyStaticTranslations();

  if (isVariantC) {
    const options = $("budget-options");
    renderBudgetOptions();
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