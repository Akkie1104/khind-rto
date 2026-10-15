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
- `catalogue.js`: Product and price reference data.
- `script.js`: Search, filters, product details and WhatsApp enquiries.
- `retail-2026.css`: Current page styling.
- `style.css`: Legacy styling retained for reference.
- `assets/`: Icons, local font and required licences.

Images for most products currently reference KHIND-associated external CDNs rather than local copies. If an image disappears from the original source, it may disappear here too. Review imagery separately before a production promotion.

## Operational checks

- Verify current products, pricing, availability, campaign eligibility and payment terms with KHIND before promoting.
- Confirm applicable written approval for independently produced advertisements; registered agent status does not automatically settle every advertising-permission requirement.
- Do not accept NRIC photos, credit-card details or payments through this static website.
- Keep `akizen.my` hosted independently in the `Akkie1104/akizen` repository.
