/* Privacy-minimal first-party KHIND swipe experiment instrumentation.
 * No customer details, URLs, IP, UA, budget amounts or free text in events.
 * No outbound collection unless explicitly configured AND enabled.
 */
(function (root) {
  "use strict";
  const EXPERIMENT = "khind_swipe_v1";
  const ASSIGN_KEY = "khind_swipe_bucket_v1";
  const ACTIVE_KEY = "khind_swipe_assignment_active_v1";
  const SESSION_KEY = "khind_swipe_session_v1";
  const VARIANTS = Object.freeze({ A: "/pilih/", B: "/pilih-b/", C: "/pilih-c/" });
  const EVENTS = Object.freeze([
    "guide_open", "guide_close", "card_impression",
    "card_swipe_left", "card_swipe_right", "card_skip_button",
    "card_save_button", "card_undo", "product_details_open",
    "filter_question_shown", "filter_answered", "shortlist_open",
    "compare_open", "whatsapp_cta_click", "catalogue_fallback_click"
  ]);
  const SOURCES = ["automatic", "button", "keyboard", "gesture", "link", "navigation"];
  const QUESTIONS = ["category_entry", "budget_entry", "rescue"];
  const ANSWERS = ["selected", "unsure", "dismissed"];
  const CATEGORIES = ["laundry", "fridge", "aircond", "all"];
  const KEYS = [
    "event_id", "session_id", "occurred_at", "event_name", "experiment", "variant",
    "assignment_mode", "action_source", "product_id", "card_position",
    "saved_count", "question_type", "answer_kind", "filter_category"
  ];
  const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
  const config = root.KHIND_EXPERIMENT_CONFIG || {};
  const storage = kind => {
    try { return kind === "local" ? root.localStorage : root.sessionStorage; }
    catch (_) { return null; }
  };
  const secureId = () => root.crypto?.randomUUID?.() || null;
  const getPathVariant = () => {
    const path = root.location?.pathname || "";
    return Object.keys(VARIANTS).find(key => path.endsWith(VARIANTS[key])) || null;
  };
  const readSession = () => {
    const store = storage("session");
    try {
      const existing = store?.getItem(SESSION_KEY);
      if (uuid.test(existing || "")) return existing;
      const next = secureId();
      if (!next) return null;
      store?.setItem(SESSION_KEY, next);
      return next;
    } catch (_) { return secureId(); }
  };
  // Use rejection sampling to avoid even the tiny modulo-3 bucket bias.
  function chooseVariant() {
    if (!root.crypto?.getRandomValues) return null;
    const nums = new Uint32Array(1);
    let n;
    do {
      root.crypto.getRandomValues(nums);
      n = nums[0];
    } while (n >= 4294967295);
    return ["A", "B", "C"][n % 3];
  }
  function assign() {
    const store = storage("local");
    if (!store) return null;
    try {
      const stored = store.getItem(ASSIGN_KEY);
      if (Object.hasOwn(VARIANTS, stored)) return stored;
      const choice = chooseVariant();
      if (!choice) return null;
      store.setItem(ASSIGN_KEY, choice);
      return store.getItem(ASSIGN_KEY) === choice ? choice : null;
    } catch (_) { return null; }
  }
  function enterExperiment() {
    const variant = assign();
    if (!variant) return null;
    const active = storage("session");
    // Do not claim randomized enrollment when session state cannot be verified.
    try {
      if (!active) return null;
      active.setItem(ACTIVE_KEY, variant);
      if (active.getItem(ACTIVE_KEY) !== variant) return null;
    } catch (_) { return null; }
    return VARIANTS[variant];
  }
  function context() {
    const variant = getPathVariant();
    if (!variant) return null;
    let enrolled = false;
    try {
      enrolled = storage("session")?.getItem(ACTIVE_KEY) === variant &&
        storage("local")?.getItem(ASSIGN_KEY) === variant;
    } catch (_) { enrolled = false; }
    return { experiment: EXPERIMENT, variant,
      assignment_mode: enrolled ? "randomized" : "direct" };
  }
  function validate(event) {
    const errors = [];
    if (!event || Array.isArray(event) || typeof event !== "object") return { valid: false, errors: ["Payload must be an object"] };
    for (const key of Object.keys(event)) {
      if (!KEYS.includes(key)) errors.push("Forbidden field: " + key);
    }
    for (const key of ["event_id", "session_id"]) if (!uuid.test(event[key] || "")) errors.push("Invalid " + key);
    if (typeof event.occurred_at !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(event.occurred_at) ||
        !Number.isFinite(Date.parse(event.occurred_at))) errors.push("Invalid timestamp");
    if (!EVENTS.includes(event.event_name)) errors.push("Unknown event_name");
    if (event.experiment !== EXPERIMENT) errors.push("Unknown experiment");
    if (!Object.hasOwn(VARIANTS, event.variant)) errors.push("Invalid variant");
    if (!["randomized", "direct"].includes(event.assignment_mode)) errors.push("Invalid assignment_mode");
    if (!SOURCES.includes(event.action_source)) errors.push("Invalid action_source");
    if (!Number.isInteger(event.saved_count) || event.saved_count < 0 || event.saved_count > 3) errors.push("Invalid saved_count");
    const productEvents = new Set(["card_impression", "card_swipe_left", "card_swipe_right",
      "card_skip_button", "card_save_button", "card_undo", "product_details_open"]);
    if (productEvents.has(event.event_name) &&
      (typeof event.product_id !== "string" ||
       !/^[A-Z0-9][A-Z0-9.-]{1,39}$/.test(event.product_id))) errors.push("product_id required / invalid");
    if (event.product_id !== undefined &&
      (typeof event.product_id !== "string" || !/^[A-Z0-9][A-Z0-9.-]{1,39}$/.test(event.product_id))) errors.push("Invalid product_id");
    if (productEvents.has(event.event_name) &&
        (!Number.isInteger(event.card_position) || event.card_position < 1 || event.card_position > 200))
      errors.push("card_position required / invalid");
    if (event.card_position !== undefined &&
      (!Number.isInteger(event.card_position) || event.card_position < 1 || event.card_position > 200))
      errors.push("Invalid card_position");
    const filtered = event.event_name === "filter_question_shown" || event.event_name === "filter_answered";
    if (filtered && !QUESTIONS.includes(event.question_type)) errors.push("question_type required");
    if (!filtered && event.question_type !== undefined) errors.push("Unexpected question_type");
    if (event.event_name === "filter_answered" && !ANSWERS.includes(event.answer_kind)) errors.push("answer_kind required");
    if (event.event_name !== "filter_answered" && event.answer_kind !== undefined) errors.push("Unexpected answer_kind");
    if (event.filter_category !== undefined &&
      (event.event_name !== "filter_answered" || event.question_type === "budget_entry" ||
       !CATEGORIES.includes(event.filter_category))) errors.push("Unexpected filter_category");
    if (["card_swipe_left", "card_swipe_right"].includes(event.event_name) &&
        !["gesture", "keyboard"].includes(event.action_source)) errors.push("Invalid swipe source");
    if (["card_skip_button", "card_save_button", "card_undo"].includes(event.event_name) &&
        event.action_source !== "button") errors.push("Invalid button source");
    return { valid: errors.length === 0, errors };
  }
  const sessionId = readSession();
  let debugChannel = null;
  const debug = /(?:\?|&)debug=1(?:&|$)/.test(root.location?.search || "");
  try { if (debug && root.BroadcastChannel) debugChannel = new root.BroadcastChannel("khind-swipes-qa-v1"); }
  catch (_) { /* diagnostics are optional */ }
  function make(eventName, fields = {}, overrideContext) {
    const ctx = overrideContext || context();
    if (!ctx || !sessionId || !EVENTS.includes(eventName)) return null;
    // Strict field projection: callers cannot attach arbitrary user data.
    const event = {
      event_id: secureId(), session_id: sessionId, occurred_at: new Date().toISOString(),
      event_name: eventName, experiment: ctx.experiment, variant: ctx.variant,
      assignment_mode: ctx.assignment_mode, action_source: fields.action_source || "automatic",
      saved_count: fields.saved_count ?? 0
    };
    if (fields.product_id !== undefined) event.product_id = fields.product_id;
    if (fields.card_position !== undefined) event.card_position = fields.card_position;
    if (fields.question_type !== undefined) event.question_type = fields.question_type;
    if (fields.answer_kind !== undefined) event.answer_kind = fields.answer_kind;
    if (fields.filter_category !== undefined) event.filter_category = fields.filter_category;
    return validate(event).valid ? event : null;
  }
  function track(eventName, fields = {}) {
    const event = make(eventName, fields);
    if (!event) return false;
    if (debugChannel) debugChannel.postMessage({ kind: "event", event });
    // No network activity unless a first-party collection endpoint is explicitly enabled.
    const endpoint = config.enabled === true ? config.endpoint : "";
    if (typeof endpoint === "string" && /^https:\/\/[a-z0-9.-]+\/events$/.test(endpoint) &&
        typeof root.fetch === "function") {
      root.fetch(endpoint, { method: "POST", mode: "cors", credentials: "omit",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event), keepalive: eventName === "guide_close" })
        .catch(() => { /* never block the shopping experience */ });
    }
    return event;
  }
  const sample = (name, variant = "A") => make(name, {
    action_source: "automatic", saved_count: 1,
    ...(name.startsWith("card_") || name === "product_details_open" ?
      { product_id: "WM1248", card_position: 1 } : {}),
    ...(name.startsWith("filter_") ? { question_type: "category_entry" } : {}),
    ...(name === "filter_answered" ? { answer_kind: "selected", filter_category: "laundry" } : {})
  }, { experiment: EXPERIMENT, variant, assignment_mode: "randomized" });
  root.KHIND_TELEMETRY = Object.freeze({
    EXPERIMENT, EVENTS, VARIANTS, assign, enterExperiment, context,
    validate, make, track, sample, debug, enabled: config.enabled === true
  });
})(window);
