/* Cloudflare Worker + D1: optional first-party analytics receiver.
 * Does not record request IP, URL, user agent, referer, headers or free text.
 * Deploy only after privacy notice and consent/legal-basis review.
 */
const EVENTS = [
  "guide_open","guide_close","card_impression","card_swipe_left","card_swipe_right",
  "card_skip_button","card_save_button","card_undo","product_details_open",
  "filter_question_shown","filter_answered","shortlist_open","compare_open",
  "whatsapp_cta_click","catalogue_fallback_click"
];
const NAMES = ["event_id","session_id","occurred_at","event_name","experiment",
  "variant","assignment_mode","action_source","product_id","card_position",
  "saved_count","question_type","answer_kind","filter_category"];
const PRODUCT_EVENTS = ["card_impression","card_swipe_left","card_swipe_right",
  "card_skip_button","card_save_button","card_undo","product_details_open"];
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const ID = /^[A-Z0-9][A-Z0-9.-]{1,39}$/;
const ORIGIN = "https://khindrto.akizen.my";
function validate(e) {
  if (!e || typeof e !== "object" || Array.isArray(e)) return false;
  if (Object.keys(e).some(k=>!NAMES.includes(k))) return false;
  if (!UUID.test(e.event_id||"") || !UUID.test(e.session_id||"")) return false;
  if (e.experiment !== "khind_swipe_v1" || !["A","B","C"].includes(e.variant) ||
      !["direct","randomized"].includes(e.assignment_mode)) return false;
  if (!EVENTS.includes(e.event_name) ||
      !["automatic","button","keyboard","gesture","link","navigation"].includes(e.action_source)) return false;
  if (!Number.isInteger(e.saved_count)||e.saved_count<0||e.saved_count>3) return false;
  if (typeof e.occurred_at!=="string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(e.occurred_at) ||
      !Number.isFinite(Date.parse(e.occurred_at))) return false;
  if (Math.abs(Date.now()-Date.parse(e.occurred_at))>86400000) return false;
  if (PRODUCT_EVENTS.includes(e.event_name) && (!ID.test(e.product_id||"") ||
      !Number.isInteger(e.card_position))) return false;
  if (e.product_id!==undefined && !ID.test(e.product_id)) return false;
  if (e.card_position!==undefined && (!Number.isInteger(e.card_position) ||
      e.card_position<1||e.card_position>200)) return false;
  const filter = ["filter_question_shown","filter_answered"].includes(e.event_name);
  if (filter && !["category_entry","budget_entry","rescue"].includes(e.question_type)) return false;
  if (!filter && e.question_type!==undefined) return false;
  if (e.event_name==="filter_answered" && !["selected","unsure","dismissed"].includes(e.answer_kind)) return false;
  if (e.event_name!=="filter_answered" && e.answer_kind!==undefined) return false;
  if (e.filter_category!==undefined && (e.event_name!=="filter_answered" ||
      e.question_type==="budget_entry" || !["laundry","fridge","aircond","all"].includes(e.filter_category))) return false;
  if (["card_swipe_left","card_swipe_right"].includes(e.event_name) &&
      !["gesture","keyboard"].includes(e.action_source)) return false;
  if (["card_skip_button","card_save_button","card_undo"].includes(e.event_name) &&
      e.action_source!=="button") return false;
  return true;
}
const cors = { "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "600", "Vary": "Origin", "Cache-Control":"no-store" };
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/events") return new Response("Not found",{status:404});
    if (request.headers.get("Origin") !== ORIGIN) return new Response("Forbidden",{status:403});
    if (request.method === "OPTIONS") return new Response(null,{status:204,headers:cors});
    if (request.method !== "POST") return new Response("Method not allowed",{status:405,headers:cors});
    if ((request.headers.get("Content-Type")||"").split(";")[0].trim()!=="application/json")
      return new Response("Unsupported media type",{status:415,headers:cors});
    const size = Number(request.headers.get("Content-Length")||0);
    if (size>2048) return new Response("Too large",{status:413,headers:cors});
    const body = await request.text();
    if (body.length>2048) return new Response("Too large",{status:413,headers:cors});
    let event;
    try { event=JSON.parse(body); } catch (_) { return new Response("Invalid JSON",{status:400,headers:cors}); }
    if (!validate(event)) return new Response("Invalid event schema",{status:422,headers:cors});
    if (!env.DB) return new Response("Collector not configured",{status:503,headers:cors});
    try {
      await env.DB.prepare(
        "INSERT OR IGNORE INTO events (event_id, session_id, occurred_at, event_name, experiment, variant, assignment_mode, action_source, product_id, card_position, saved_count, question_type, answer_kind, filter_category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(event.event_id,event.session_id,event.occurred_at,event.event_name,
        event.experiment,event.variant,event.assignment_mode,event.action_source,
        event.product_id||null,event.card_position??null,event.saved_count,
        event.question_type||null,event.answer_kind||null,event.filter_category||null).run();
      return new Response(null,{status:204,headers:cors});
    } catch (_) { return new Response("Collector unavailable",{status:503,headers:cors}); }
  },
  async scheduled(_event, env) {
    if (!env.DB) return;
    // Minimize retention: delete expired pseudonymous event rows every day.
    await env.DB.prepare("DELETE FROM events WHERE occurred_at < datetime('now', '-90 days')").run();
  }
};
