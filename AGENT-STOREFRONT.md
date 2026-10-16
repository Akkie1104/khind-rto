# KHIND RTO bersama Hakim — Agent Storefront

This is an independent KHIND RTO agent marketing site, NOT the official KHIND HQ website. It must not claim to be HQ or collect payments, IC images, OTPs, or card numbers.

## Pages
- `/pilih/`: Mobile-first swipe experience; starts directly on a product, supports Save/Skip/Undo, details bottom sheet, compare and WhatsApp enquiry. Uses only `catalogue.js` product facts and the supplied image URLs.
- `/`: Agent homepage with quick budget selector and selected products.
- `/catalogue/`: Browse all available products, filter by category and normal monthly rate.
- `/combos/`: Two-appliance combinations.
- `/promotions/`: Time-limited campaigns; confirm eligibility and expiry.
- `/cara-rto/`: How RTO works, pricing and official processing.
- `/faq/`: Common questions with reference to official KHIND policy.
- `/mohon/`: Contact agent Hakim through WhatsApp; official KHIND handles applications.
- `/privasi/`: Privacy information for the independent static storefront.
- `/products/<MODEL>/`: 23 SEO-accessible static product pages.

## Data and safety
`catalogue.js` remains the source for product identities, reference plan rates and available product images. Individual product pages are static snapshots generated on 15 October 2026 from that data. After changing `catalogue.js`, regenerate all product pages and indexes; editing only the catalogue data does NOT update standalone product pages.

Promotions are NOT guaranteed. They may expire, prices vary by selected plan, and some manufacturer pages may show different terms or tenures. Where product data conflicts with KHIND's current official details, verify with KHIND **before** advertising the offer. The on-page amounts are reference estimates, not binding quotations.

Copyright and marketing use must remain within the user's actual KHIND agent authorization. Never scrape and reproduce corporate forms, exact marketing copy, or legal policies. Product links and photos point to KHIND-associated online assets.

Hosting: GitHub Pages, domain `khindrto.akizen.my`. All pages are static. New agent pages use `storefront.css` and `storefront.js`. They do not store personal data or collect applications. Product enquiries lead to WhatsApp `60174201247`.

## Review checklist
- Verify the actual promotion and approved artwork before paid marketing.
- Check 6-month promotional price and full-term total for each product, including combos.
- Check official source photos, plan duration, warranty, stock and delivery areas.
- Keep independent-agent disclosure, not-HQ status and official processing links visible.
- Update promotion banners when campaign ends 31 December 2026.
- Run a mobile browser QA pass for cards, menus, product images, sticky contact CTA and FAQ.
- Check accessibility (keyboard navigation, alt text, contrast), performance and broken links.
- Review Search Console indexing and sitemap after deployment.

**Important:** RTO should be positioned as predictable monthly payments plus *verified plan-dependent care*, not necessarily a cheaper total cost than buying outright.
