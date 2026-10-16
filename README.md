# KHIND RTO bersama Hakim

Independent KHIND RTO agent storefront for Malaysian customers, with a product catalogue, RTO and full-payment information, and WhatsApp enquiries.

**Customer domain:** https://khindrto.akizen.my/

## Hosting

Static HTML, CSS and JavaScript; no build step or server-side processing.

1. In this repository go to **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose **main**, folder **/(root)**, then **Save**.
4. Under **Custom domain**, ensure **khindrto.akizen.my** is saved.
5. Once the certificate is ready, enable **Enforce HTTPS**.

The DNS provider already has a CNAME for `khindrto` that targets `Akkie1104.github.io`. Leave the existing apex `akizen.my` DNS records unchanged.

## Files

- `index.html`: Page, SEO metadata and customer journey.
- `catalogue.js`: Authoritative structured product and price reference data used by the swipe shop.
- `pilih/index.html`, `swipe-shop.js`, `swipe-shop.css`: Full-screen, mobile-first swipe shopping. Starts on a product card, with Skip/Save/Undo, details, comparison after two saves, and product-specific WhatsApp enquiry. No form or tracking.
- `script.js`: Search, filters, product details and WhatsApp enquiries.
- `retail-2026.css`: Current page styling.
- `style.css`: Legacy styling retained for reference.
- `assets/`: Icons, local font and required licences.

Images for most products currently reference KHIND-associated external CDNs rather than local copies. If an image disappears from the original source, it may disappear here too. Review imagery separately before a production promotion.

**Budget-first experimental variant:** `/pilih-c/` asks only “What monthly amount feels comfortable?” with up to three broad price bands automatically derived from distinct cheapest **regular monthly plan rates** among dated, image-backed entries in `catalogue.js`, plus “Not sure.” No bands or amounts are hardcoded. The selected band's closest actual plan rate is shown along with its name and the real contract duration on every swipe card, including when that matching plan is Premium rather than Basic. All dated eligible individual products remain available, ordered by distance to the selected band (in-band first, then nearest outside), rather than making eligibility or affordability claims. “Not sure” opens the unchanged control ordering. The gate and cards do not collect personal information or track choices; this is not a creditworthiness or approval assessment. The recorded verification date is not real-time confirmation of rates or stock: reconfirm with KHIND before closing a sale. Control and category variant routes remain unchanged.

**A/B experiment variant:** `/pilih-b/` asks one category question before showing the *same* swipe engine: Washing machine, Refrigerator, Air conditioner, or Show me everything. Control `/pilih/` remains question-free. Both use the same `catalogue.js`, official product photos and customer enquiry flow. The washing choice includes washer-dryers but not dryer-only products. No additional questions, forms, tracking or automatic allocation are added. The variants are separate URLs to permit controlled link distribution and later measurement. To evaluate an A/B test, distribute visits randomly and track comparable conversion metrics through an appropriately disclosed analytics mechanism; two URLs alone are not an experiment.

The homepage swipe CTA and catalogue invitation link to `/pilih/`. Individual product entries in the swipe deck require a supplied official product image, valid listed plans and a contract duration; bundles remain in the catalogue until their own official imagery is available. Existing product image URLs are used without editing the appliance.

## Contextual rescue after three skips

The shared swipe deck (control `/pilih/` and experimental `/pilih-b/`, `/pilih-c/`) never opens with a rescue question. If a visitor skips **three consecutive product cards** without saving or opening Details, a single compact rescue asks **“Which do you need?”** with **Laundry / Fridge / Aircond / Not sure** plus a separate **“Skip this question.”** bypass. The rescue appears only when multiple product categories are still present among unseen cards; a category-filtered deck never asks for the same preference again. Opening Details or saving interrupts the skip streak. Choosing a category moves matching *unseen* items ahead of other unseen items, without losing products, modifying catalogue prices, or showing previously skipped cards. “Not sure” and bypass resume the original order. The question is limited to **once per browsing run** (unless Undo explicitly returns to before the trigger); Undo restores both the previous card and deck ordering. The restart action resets this run. The visitor can always continue through all products.

This is a navigation preference, not creditworthiness, approval or loan eligibility logic. No analytics, form, local storage or external service is required. Behavior is checked in `tests/swipe-rescue.test.cjs` plus the A/B/C smoke tests.

## Swipe accessibility (WCAG 2.2 AA)

The common swipe card now provides always-visible Skip, Save and Undo buttons, keyboard Left/Right shortcuts on its focusable card, explicit focus restoration and polite state announcements. Focus rings, minimum 44 px interactive targets, keyboard guidance, reduced-motion behavior and scrolling at high zoom/short viewports are included in the shared CSS and JS. All three chooser routes load the same updated components.

See **[SWIPE-ACCESSIBILITY.md](SWIPE-ACCESSIBILITY.md)** for the full implementation checklist and manual checks still required before claiming conformance. The code tests do not replace screen-reader, zoom, real-device and contrast testing.

## Saved shortlist (1–3 appliances)

The three swipe routes use a dedicated full-height mobile shortlist when visitors tap the saved-count button or choose **Banding produk** after two saves. Up to three products can be saved. At three saved, Save becomes visibly full/disabled until one item is removed; Skip and other actions remain available.

Every saved row displays seven **source-backed** fields from `catalogue.js`: model, product category, the existing description as capacity/major specification, the actual regular monthly plan amount selected by the existing A/B/C experience, contract term, the *recorded cash promotion state*, and the original stock note (or an explicit unknown-status message). Monthly amounts are described as catalogue reference rates with their recorded verification dates, **not live quote or approval**. Cash promotions are never presented as discounts on monthly RTO plans. No product is labeled “best.”

Actions are **View details** (the chosen saved product, returning to shortlist after the details sheet closes), **Remove** (with an immediate Undo remove affordance), **Keep swiping**, and **Ask Hakim about these** (WhatsApp with the exact currently saved model IDs). Removal clears prior swipe-Undo snapshots to avoid resurrecting deleted products; Remove itself has its own Undo within the shortlist. The shortlist has no login, storage, analytics or personal-data form. See `tests/swipe-shortlist.test.cjs` for the 1/2/3-saved, model/date/promotion/availability and interaction checks.

## Bilingual guided shopping (English / Bahasa Melayu)

All three swipe routes have EN/BM switches in the page header, Details modal and saved shortlist modal. Malay is the initial page and document language; switching updates `<html lang>`, visible UX copy, document title, metadata description, screen-reader status/ARIA labels, decision prompts, budget/category choices and WhatsApp enquiry wording. The user's current deck, visited/skipped history, position, saved picks, source monthly rate/plan and budget filter remain in memory unchanged. If Details is open, it stays open on the same appliance; when closed, it remains closed. The shortlist likewise remains in its current state.

Product names, model IDs, capacities and other catalogue facts are never translated or fabricated; supplied Malay descriptions and stock notes are marked `lang="ms"` even under an English interface. No new cookies, storage or analytics. Switches are keyboard-accessible and at least 44 CSS pixels. See `tests/swipe-i18n.test.cjs` for state-preservation tests.

## Operational checks

- Verify current products, pricing, availability, campaign eligibility and payment terms with KHIND before promoting.
- Confirm applicable written approval for independently produced advertisements; registered agent status does not automatically settle every advertising-permission requirement.
- Do not accept NRIC photos, credit-card details or payments through this static website.
- Keep `akizen.my` hosted independently in the `Akkie1104/akizen` repository.


## Family-first UX direction (15 October 2026)

**Audience hypothesis, not a proven demographic statistic:** Malaysian households setting up a home or replacing an essential appliance, with insufficient upfront cash for a full purchase but enough stable disposable income to comfortably maintain the normal monthly rate. Also serve customers who independently value KHIND Care Plan / warranty. Do not imply that customers with low income necessarily qualify.

- Display the *regular* monthly rate after any promotion, contract duration, estimated RTO total and plan-specific benefits close to each product.
- The budget filter uses the **normal monthly rate** and cheapest available listed plan, not the temporary promotion rate. It does not check customer creditworthiness or affordability.
- Tell customers plainly that cash purchase can cost less overall and may be more appropriate for them.
- Only market warranty, insurance, installation and servicing where the product's plan and KHIND documents actually support them.
- No fabricated conversion rates, testimonials, approval guarantees, urgency, or savings claims.

**Validate with real enquiries:** Weekly, record (privately) the number of website visitors (once analytics is configured), budget-filter interactions, product-specific WhatsApp enquiries, qualified prospects, submitted applications, approvals and completed sales. Ask prospects their main objection (monthly rate, duration, total cost, trust, service value). Do not upload personal details or NRIC data into GitHub.

**Research context:** DOSM 2024 household-income/expenditure survey establishes broad purchasing-power pressures, *not* KHIND-specific demand. NN/g and Baymard product-page research supports visible pricing, clear total costs and trust signals. Future design changes should be tested against real prospect behavior.

**Maintenance:** Promotions in October–December 2026 must be reviewed when they expire. Verify product data with KHIND before publishing new claims.
