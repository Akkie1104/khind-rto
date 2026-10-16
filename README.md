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
