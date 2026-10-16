# KHIND swipe experiment — controlled assignment and event instrumentation

## Deployment status
**Instrumentation is integrated; production collection is OFF by default.** The existing GitHub Pages site has no analytics database or recipient. Do not claim conversion measurement until the optional Cloudflare Worker is configured and deployed. No sensitive customer data is included in event payloads.

## Stable anonymous A/B/C experiment
- Controlled entry: /pilih-exp/ with 1:1:1 random allocation using crypto.getRandomValues and rejection sampling.
- Stable repeat assignment: localStorage stores ONLY the letter A, B or C under khind_swipe_bucket_v1. No persistent user/customer identifier is used.
- Session events: sessionStorage holds an anonymous UUID scoped to the browsing tab. Events can be joined within this tab, not reliably across visits or browsers.
- One-use session token distinguishes users entering via /pilih-exp/ (assignment_mode=randomized) from people directly visiting /pilih/, /pilih-b/ or /pilih-c/ (assignment_mode=direct).
- If required storage/cryptography is unavailable, do not randomly enroll: the user can continue on the control.
- The existing homepage continues to link to A by default; switch its CTA to /pilih-exp/ only after deploying the collector and privacy notice.

## Event contract: exactly 15 names
guide_open, guide_close, card_impression, card_swipe_left, card_swipe_right,
card_skip_button, card_save_button, card_undo, product_details_open,
filter_question_shown, filter_answered, shortlist_open, compare_open,
whatsapp_cta_click, catalogue_fallback_click.

All events use a closed, validated schema: event_id, session_id, occurred_at,
event_name, experiment, variant, assignment_mode, action_source, saved_count;
product_id, card_position, question_type, answer_kind and filter_category only when applicable.

Source semantics: button for visible Skip/Save/Undo; gesture or keyboard for swipes;
automatic for impressions or shown gates; link for WhatsApp/catalogue; navigation
for guide_close. New card impressions are deduplicated across EN/BM rerenders.
Details clicks are not re-counted when translating an already-open modal.
Each filter gate/rescue records shown and answered. Every source model ID is validated
against a restricted product-code format.

**Never log** customer name, IC, income, phone, WhatsApp message text, page URL,
query string, user agent or request IP. Budget-first answers only send
question_type=budget_entry and answer_kind=selected|unsure; there is no budget amount,
band index or free text. Direct visitors must be excluded from experimental effect estimates.

## Validation console (works before deployment)
1. Open https://khindrto.akizen.my/experiment-console/ in one tab.
2. Open https://khindrto.akizen.my/pilih/?debug=1, /pilih-b/?debug=1 or
   /pilih-c/?debug=1 in another tab (same browser and origin).
3. Each event is sent to the QA console using same-origin BroadcastChannel only
   when debug=1. It shows valid/invalid schema and raw allowlisted payload.
   The console retains up to 100 events in tab RAM, not storage or backend.
4. Use Load sample event set for all 15 events. Insert valid sample and
   Insert forbidden-field example prove personal keys are rejected.
5. Test A/B/C, three skips/rescue, language switching, details open/close,
   1-3 saved products, Undo, Compare, WhatsApp CTA, and catalogue fallback.
6. Reopen /pilih-exp/ several times in the same browser profile and confirm
   the bucket is stable. A direct chooser URL should remain assignment_mode=direct.
7. CI runs dedicated telemetry schema, assignment, integration and collector tests.

## Optional first-party collector: Cloudflare Worker + D1
Files: analytics-worker/worker.js, analytics-worker/schema.sql,
analytics-worker/wrangler.toml.

This source is not deployed automatically. Explicit operator actions are required:
1. Review Malaysia PDPA/privacy basis and update the /privasi/ notice to explain
   experiment purpose, first-party storage, session identifiers, 90-day retention,
   rights and opt-out / choice controls. Do not activate collection until reviewed.
2. Create a D1 database using Wrangler, set the actual D1 database_id in
   analytics-worker/wrangler.toml and apply analytics-worker/schema.sql.
3. Deploy Worker on an actual owned first-party custom domain (for example,
   https://metrics.khindrto.akizen.my/events; this hostname is only an example).
   Require rate limiting/WAF: CORS is not authentication.
4. Edit swipe-telemetry-config.js to enabled=true with the actual HTTPS /events
   endpoint. In each chooser page, update the CSP connect-src directive from
   'none' to the exact deployed collector origin. Avoid wildcards.
5. Run end-to-end checks with valid events and attempts to submit sensitive keys.
   Only then redirect homepage chooser traffic to /pilih-exp/.
6. Scheduled Worker removes D1 event rows older than 90 days. To stop,
   disable the endpoint and collector; handle stored rows per privacy policy.

## Analysis cautions
Calculate session-level conversion (randomized sessions with WhatsApp CTA clicks
divided by randomized sessions with guide_open) grouped by variant. This is
NOT a count of unique customers, messages sent, approvals or sales.
Exclude assignment_mode=direct to avoid biased comparisons.

Example SQL:
SELECT variant,
 COUNT(DISTINCT CASE WHEN event_name='guide_open' THEN session_id END) AS opens,
 COUNT(DISTINCT CASE WHEN event_name='whatsapp_cta_click' THEN session_id END) AS whatsapp_click_sessions
FROM events
WHERE experiment='khind_swipe_v1' AND assignment_mode='randomized'
GROUP BY variant;

Browser payload minimization does not eliminate ordinary CDN/host network metadata,
such as IP data observed for routine server operation.
