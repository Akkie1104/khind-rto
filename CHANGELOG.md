# Changelog

## 2026-11-02 - Unpublished live-readiness candidate

- Fixed the malformed homepage combo DHP90 photo URL and added optimized official WM1248 hero/social photography and metadata.
- Made every RF480 WhatsApp CTA follow the selected plan, rates, schedule, term and estimate; corrected homepage selected-plan benefits.
- Restored Details-trigger focus after language rendering; improved saved-label, product-nav and focus-indicator contrast; enforced 12px supporting text across home, navigation and picker variants.
- Made touch decisions use final coordinates and survive implicit image-to-card capture transfer, preserving vertical/cancelled-gesture behavior.
- Candidate r3 passed 175/175 five-width route checks, 115/115 product-width image checks, zero load/failed/HTTP/harness errors and focused customer-flow/accessibility checks. Fresh Node suite passed 25/25; syntax and diff checks passed.
- Production remains 406f953 and retains the recorded image, sizing, contrast, focus, touch and RF480 CTA failures. Commercial confirmations remain open. This candidate is uncommitted/unpublished; production is not verified live-ready and a new release requires explicit approval.
- Evidence: parent-project .qa-live-readiness-20261102.json, .qa-candidate-full-r3-20261102.json and screenshot catalogue in CURRENT_STATE.md. No production or external action was performed.

## 2026-10-20

- Fixed the FAQ answer contrast by matching the legacy selector's specificity.
- Updated the shared stylesheet cache key to `folio-12` across all 35 referencing pages.
- Published to GitHub Pages as `f7f28cca68685019456a0bda150b1d80f7429bcd`; live FAQ keyboard interaction verified.
- No commercial copy or product data changed.

### Review still open

- Runtime reduced-motion emulation, wider route-by-route keyboard checks, and a saved WM1248 detail capture remain outstanding.
- MobileViewer's daily limit prevented a fresh post-release run; KHIND still needs to confirm time-sensitive commercial claims.

## 2026-10-20

- Improved folio contrast for the logo tagline and category chooser disclosure.
- Refreshed the shared `khind-folio.css` cache key to `folio-11` across 35 pages.
- Updated the storefront workflow to validate the versioned folio cache key.
- Published as `42193868e2157fe919b2fdd8dfda004c3e04f95e`; GitHub Actions validation and Pages deployment succeeded.


## 2026-10-22 - Clarified KHIND rate-reference links
- Relabeled the WD1438 and CD12D EasyR2O links so they identify the rate reference rather than claiming to link product photos/specifications.
- Added regression checks for the source links on all ten combo detail pages and both EasyR2O rate links.
- Local candidate verification passed: 12 Node test files, JavaScript syntax checks for storefront.js/catalogue.js, and git diff --check. Not deployed.

## 2026-11-02 - Fresh live-readiness check

- Confirmed deployed 406f9539c62ae5d3c215b84c07c9279e34bc3996 and successful Pages/validation runs 42/69.
- Rechecked all 23 product routes and their loaded images, alt text and KHIND reference links. Live catalogue recovery, ten FAQ disclosures, picker save/skip/undo, comparison, language metadata, three-item cap and removal passed at available 1280px.
- Confirmed live RF480 defect: only one of three WhatsApp links follows the selected plan and estimate. The unpublished candidate fixes all three in preview.
- Candidate suite 22/22, JS syntax checks and diff check pass. Required responsive matrix, reduced-motion, full console/network audit, touch swipes and screenshot set remain open. Site is not verified live-ready; no production action.
