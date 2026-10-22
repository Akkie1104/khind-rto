# KHIND RTO worklog

## 2026-10-22 — Deployed mobile picker follow-up

- Opened the deployed picker at 360 × 800 and 390 × 844 CSS px. Both viewports had no horizontal document overflow; the WM1248 image loaded with non-zero dimensions and alt text, and picker controls fit at the tested heights.
- Confirmed live failures: only 13 picker cards are exposed; English mode leaves product heading, specifications, and benefits in Malay; the official link's yellow text and focus ring have 1.34:1 contrast against the cream details sheet.
- Checked save, language-state preservation, the three-item cap, saved comparison sheet, and WhatsApp prefill. The fourth save was disabled with an accessible explanation. The prefill opened the WhatsApp share landing page without sending. Removed all temporary picks afterward.
- Production was not changed. Screenshots were captured in the browser session but not exported as files. Source/live reconciliation and publication remain unresolved.

## 2026-10-20 — Fix contact band width

- Production review showed the contact section still had `max-width:68rem`; the prior release's FAQ override did not remove the contact section's max-width. The empty paper strip remained visible at the right side of the customer page.
- Extended the homepage full-width rule to the FAQ and contact sections and cache-busted the homepage folio stylesheet to `folio-16`. No product, price, promotion, or customer-facing copy changed.
- Published two focused commits to `Akkie1104/khind-rto` `main`: `1f246de7d127b8b0dd6f759078d648e8c2b75e03` (CSS) and `c94cd93ee607bde3be8182d9371d17a729b21c6d` (HTML/cache key). Run #59 validation passed; run #60 validation was in progress and Pages run #40 was queued when recorded.
- Local fixed-width browser checks measured FAQ, contact, and footer right edges equal and no horizontal overflow at 320, 360, 390, 430, 768, 1024, 1265, and 1532 CSS px. Visually checked homepage contact/footer, catalogue, FAQ, product chooser, and WM1248 page. Recheck the public homepage after Pages completes.
- Existing Node suite passed 10/10. Rollback code base: `3e619ca344b7df5e9d7fc48f21e896e47e1b94fe`.

## 2026-10-20 — Homepage FAQ edge alignment

- System/environment: KHIND RTO static storefront; production GitHub Pages at `https://khindrto.akizen.my/`, repository `Akkie1104/khind-rto`, branch `main`; no staging identified.
- Type: production deployment, authorized by the user's prior instruction to push to GitHub Pages.
- Finding: the FAQ section's inherited `.shell` gutter left its right edge short of the contact band and footer, leaving a conspicuous blank strip.
- Change: set the homepage FAQ section to full available width and removed its inherited max-width/gutters; bumped only the homepage stylesheet reference from `folio-14` to `folio-15`. No customer copy or product data changed.
- Commit: [`d82e4425a2c38e656281e23f151b243c23411e9f`](https://github.com/Akkie1104/khind-rto/commit/d82e4425a2c38e656281e23f151b243c23411e9f), based on `1cca9e8e62cebe908ab52f56a94f985d4bfd1281`.
- Validation: fixed-width browser preview at 320, 360, 390, 430, and 1532 CSS px measured matching FAQ/contact/footer right edges and no horizontal overflow. GitHub Pages deployment run #37 and storefront validation run #57 succeeded. The public homepage loaded after publication.
- Rollback: revert the code commit to `1cca9e8e62cebe908ab52f56a94f985d4bfd1281`.
- Scope: only `index.html` and `khind-folio.css` were in the code release; unrelated local checkout changes were left untouched.

## 2026-10-20 — Mobile catalogue navigation and asset refresh

- System/environment: KHIND RTO static storefront; GitHub Pages production target, no staging identified.
- Type: deployment.
- Performed by: Codex, with user approval to push to GitHub Pages.
- Change: improve the catalogue header navigation at 320 CSS pixels and provide mobile link hit areas; bump the shared folio stylesheet cache key to `folio-9` on all 35 referencing pages.
- Evidence/source: `Akkie1104/khind-rto`, deployed commit [`a2cdc6d0d4e6928e506ae4b45fd149a4ecbec747`](https://github.com/Akkie1104/khind-rto/commit/a2cdc6d0d4e6928e506ae4b45fd149a4ecbec747), based on `d948a062a730309fceb7e9550565f3d8f7da5c90`.
- Validation/environment: existing Node suite passed 10/10; `git diff --check` passed; 38 local routes and the `folio-9` stylesheet returned HTTP 200; local viewport fixture inspected at 320, 360, 390 and 430 CSS pixels.
- Production drift: no source-commit drift found before push; GitHub `main` matched the local base before deployment.
- Result: pushed to `main`; public catalogue served the updated `folio-9` stylesheet after cache-busted reload. MobileViewer rendered the catalogue at 360, 390, 430 and 450 CSS pixels. No pricing or commercial terms were changed.
- Follow-up: confirm product rates, promotion eligibility, plan terms, benefits, stock and regional availability with KHIND before promotion.

## 2026-10-20 — Local responsive contrast review

- System/environment: KHIND RTO storefront, local `projects/khind-rto` checkout; production remains GitHub Pages at `a2cdc6d0d4e6928e506ae4b45fd149a4ecbec747`.
- Type: local QA and uncommitted UI correction; no deployment performed.
- Finding: the shared header tagline retained the legacy `#f7ce2d` color on a warm-paper background. Changed it to the approved folio muted-ink token in `khind-folio.css` and advanced its stylesheet query key from `folio-9` to `folio-10` across 35 referencing pages.
- Validation: rendered WM1248 detail in the local exact-width fixture at 320, 360, 390 and 430 CSS pixels; visually confirmed the corrected tagline at 320, 360 and desktop width. Existing Node suite passed 10/10; `git diff --check` passed.
- Evidence limit: saved screenshots exist in the task visualization folder, but the 320px catalogue capture predates the deployed narrow-navigation reflow and needs refreshing. Emulated widths and MobileViewer are not physical-device or accessibility certification.
- Open work: complete the remaining page-by-page visual/keyboard review and refresh the catalogue screenshot. Keep current commercial claims flagged for KHIND confirmation; no product data or copy was changed.

## 2026-10-20 — Publish folio contrast fixes

- System/environment: KHIND RTO GitHub Pages production, `Akkie1104/khind-rto` `main`; no staging environment identified.
- Type: production deployment, explicitly approved by Akizen in this task.
- Change: set the shared logo tagline and chooser disclosure to the approved folio muted-ink color; advance all 35 folio stylesheet references to `folio-11`. Updated the workflow assertion to accept versioned folio cache keys.
- Commit: `42193868e2157fe919b2fdd8dfda004c3e04f95e`, based on deployed `5f757a6533458c5efed3d550330f37ee19dc4b3f`.
- Validation: existing Node regression suite, JavaScript syntax checks, and `git diff --check` passed. Storefront workflow run #45 and Pages deployment run #25 completed successfully. Public homepage and chooser loaded after the push.
- Rollback: revert `42193868e2157fe919b2fdd8dfda004c3e04f95e` to return to the prior deployed commit.
- Follow-up: refresh the stale 320px catalogue screenshot; continue route-by-route keyboard and runtime reduced-motion checks. Product rates, WM1248 promotion discrepancy, eligibility, plan terms, benefits, availability, and stock remain subject to KHIND confirmation.

### 2026-10-20 — Continued responsive and interaction review
- Rechecked current live homepage and current local source. main and origin/main are at 2bf1d0a; the earlier approved deployment remains live. No source edits or publication were made in this continuation.
- Viewed local 320/360 homepage and catalogue layouts and the WM1248 detail at narrow widths. MobileViewer previews of the public homepage and WM1248 page rendered at 360/390/430/450px; visible navigation and product summaries fit. Captures were reviewed in-browser but not saved as files.
- Verified catalogue search (WM1248 ? 1 result), regular-rate budget filtering (= RM80 ? 3 products), category-first selection, detail open/close, save/undo, and Enter-key FAQ expansion.
- Existing suite passed: 10/10; `node --check script.js` and `git diff --check` passed.
- Rechecked KHIND official WM1248 page: RM85 regular rate and 48-month plan are displayed, alongside RM43* promotional rate. The agent storefront shows RM42.50 during promotion. Leave exact promo rounding and remaining campaign/plan conditions for KHIND confirmation.
- Remaining: complete route-by-route visual and keyboard audit, runtime reduced-motion check, save screenshots, and resolve owner review items. No new release is authorized by this continuation.

### 2026-10-20 - Responsive and keyboard follow-up
- Visually reviewed the local catalogue, category-first chooser, and WM1248 detail in the exact-width fixture at 320, 360, 390, and 430 CSS px. Keyboard traversal on the WM1248 detail showed a visible 3px green focus outline across header links.
- Existing saved screenshots cover catalogue and chooser comparisons at 320/360 and 390/430 CSS px, plus the desktop homepage. The WM1248 detail was reviewed in-browser but this turn did not save a capture.
- The browser reports `prefers-reduced-motion: reduce` as `false`; this session did not emulate the reduced-motion setting, so runtime verification remains open. No storefront code change or publication was made.
- Remaining: finish route-by-route visual/keyboard review, run a reduced-motion emulation check, save a WM1248 detail capture, and obtain KHIND confirmation for time-sensitive commercial claims.

### 2026-10-20 — Local FAQ contrast correction
- Rechecked the live FAQ and measured the expanded answer at 1.29:1 against the folio paper background. The legacy FAQ selector had higher specificity than the folio override.
- Corrected the local selector and advanced the shared folio stylesheet cache key to `folio-12` in 35 HTML pages. The local rendered answer now measures 7.20:1; keyboard Enter opens/closes the disclosure and focus remains visible.
- Existing suite: 10/10 passed. JavaScript syntax and `git diff --check` passed. Kept the change local; no push or deployment.
- Fresh live interaction checks returned one WM1248 search result and three items for the RM80 regular-rate budget filter. The local exact-width fixture rechecked chooser and WM1248 detail at 320, 360, 390, and 430 CSS px without horizontal page overflow.
- Remaining: full route keyboard/visual review, runtime reduced-motion emulation, saved WM1248 screenshot, and KHIND confirmation of time-sensitive commercial details.

## 2026-10-20 — FAQ contrast release

- System/environment: KHIND RTO GitHub Pages production, `Akkie1104/khind-rto` `main`; no staging identified.
- Type: production deployment, explicitly approved by Akizen in this task.
- Change: raised the FAQ answer selector specificity to override the legacy rule and advanced all 35 folio stylesheet references to `folio-12`. No commercial copy or product data changed.
- Source/release: base commit `2bf1d0ae2a8745d3fa05e8bf304deebf99956acf`; published commit `f7f28cca68685019456a0bda150b1d80f7429bcd`.
- Deployment checks: GitHub Actions storefront validation run #48 and Pages deployment run #28 completed successfully.
- Validation: existing Node suite passed 10/10; JavaScript syntax checks and `git diff --check` passed. Public FAQ loaded the new content; Enter expanded the answer and keyboard focus remained visible. Local route viewport review covered 320/360/390/430 CSS px. Promotions' initial 320px warning was a false positive from comparing `scrollWidth` against `clientWidth` with a 15px vertical scrollbar.
- Rollback: revert `f7f28cca68685019456a0bda150b1d80f7429bcd` to restore the prior deployment.
- Evidence limits/open work: MobileViewer daily preview quota prevented a fresh post-release preview; runtime reduced-motion emulation, broader route-by-route keyboard checks, saved WM1248 detail capture and KHIND confirmation of time-sensitive commercial claims remain open. GitHub status checks were unavailable through the connector at verification time.

## 2026-10-20 — Local route, responsive, and interaction review

- **Environment:** local preview at `http://127.0.0.1:8766/`; GitHub Pages production was inspected read-only. No site-source changes were made; review notes were updated locally. Nothing was deployed or published.
- **Live route evidence:** from the live catalogue inventory, all 23 product detail URLs loaded a title and primary heading. Home, catalogue, combos, promotions, RTO guide, FAQ, enquiry, privacy, and the three chooser routes also loaded their primary heading.
- **Responsive evidence:** local viewport fixture loaded all 11 main routes (including `/pilih/`, `/pilih-b/`, and `/pilih-c/`) and all 23 product detail routes at 320, 360, 390, and 430 CSS px. No document-level horizontal overflow was reported. Promotions reached exactly 320 px scroll width in the 320 px frame, equal to its viewport.
- **Interaction evidence:** catalogue search for WM1248 returned one result; the regular monthly-rate filter at RM80 returned three. FAQ toggled with Enter. Category-first chooser selection opened the product deck and details; Escape closed details. Swipe chooser Right Arrow saved and advanced, and Undo restored WM1248 with zero saved items.
- **Budget-band keyboard check:** Enter on the first band opened a 13-product deck; the initial SI6029BP card showed RM75/month for 24 months and a stock note.
- **Checks:** `node --test --test-reporter=dot tests/*.test.cjs` passed (10 dots); `node --check script.js`; `node --check swipe-shop.js`; `git diff --check`.
- **Reduced motion:** implementation rules are present in `retail-2026.css`, `swipe-shop.css`, and `swipe-shop.js`. Browser emulation was unavailable in the current session.
- **Visual review:** inspected the local desktop homepage, FAQ layout, and WM1248 detail at narrow widths. The browser screenshots were not exported to files; saving representative screenshots remains open.
- **Owner review:** all four folio design choices are approved. KHIND still needs to confirm volatile product rates, campaign eligibility, plan terms/benefits, and stock. No message or enquiry was sent.

## 2026-10-20 — Follow-up keyboard review

- Reviewed the local WM1248 detail page and `/pilih/` chooser in the browser. The brand link, “Utama,” chooser card, and “Lihat butiran” showed visible keyboard focus; Enter opened the details sheet.
- The details sheet appeared to overlap its product imagery and text in the desktop-width capture. Recheck at exact mobile widths and investigate before calling visual review complete.
- The browser exposed no viewport or reduced-motion emulation capability. No site source was changed, no screenshot files were saved, and nothing was deployed or pushed.


## 2026-10-20 - Details-sheet fix and release preparation

- Continued the active KHIND RTO redesign in `projects/khind-rto`; left `projects/akizen-site/khind` untouched.
- Akizen approved the four folio presentation choices and explicitly approved publishing these KHIND RTO changes through GitHub Pages.
- Fixed the chooser Details sheet image overflow and its paper-ground text treatments. Updated the four chooser stylesheet references to `swipe-shop.css?v=6`, and the 35 folio references to `khind-folio.css?v=folio-13`. Updated four existing CSS-version assertions. No commercial copy or product records changed.
- Local browser check of `/pilih/` opened the WM1248 Details sheet. The product image is contained by its frame; monthly plan, cash reference, benefits, and caveat text remain visible.
- Existing suite: 10/10 passed. `node --check script.js`, `node --check swipe-shop.js`, and `git diff --check` passed.
- Review captures remain in `.impeccable/review/`; the temporary capture receiver was stopped and its helper script removed. The browser's attempted viewport override did not apply, so direct 320 CSS px viewport verification was not completed in this continuation. Reduced-motion emulation remains unverified.
- Owner confirmation is still required for promotion eligibility and rounding, rate/plan terms, benefits, and stock. No WhatsApp or KHIND enquiry was sent.
- Publication status at this log entry: approved by the user; push and public verification are the remaining release steps.


## 2026-10-20 - GitHub Pages release verified

- Published the approved local fix to `Akkie1104/khind-rto` `main` as commit `e54e9619695b4851385cdb754fdfb32b619b7400`.
- Actions validation run `39384123309` and Pages deployment run `39384122994` both succeeded.
- Verified public `https://khindrto.akizen.my/pilih/` loads `swipe-shop.css?v=6` and `khind-folio.css?v=folio-13`. Opened the live WM1248 Details sheet and confirmed the image is contained and the payment, cash-reference, benefits, and caveat text is visible.
- MobileViewer can reach the public site, but the daily preview limit prevented a new device capture. The browser viewport override did not apply during the local follow-up, so exact-width runtime capture remains open; prior responsive fixture checks covered 320/360/390/430 CSS px. Reduced-motion emulation also remains open.
- No commercial copy or product data changed. Confirm rates, promotion rounding/eligibility, plan terms/benefits, and stock with KHIND before presenting them as verified.


### 2026-10-20 — Published chooser language fix

- Applied the user-approved i18n fix as a narrow patch on current GitHub `main`, commit `a1b89d41410cd9f54bbbdcfaeb6a993c345b703c`. It updates the progress region's accessible name on language change and bumps the shared script cache key on three chooser routes.
- Validation `39391338338` and Pages deployment `39391338012` succeeded. Fresh live check confirmed “Pick progress” after selecting English.
- Broader visual/keyboard review and an accurate WM1248 mobile detail capture remain open. MobileViewer's daily limit prevented a fresh device render. Commercial facts remain unconfirmed by KHIND.
- Local checkout is divergent at `94c58ea` with stale tracking ref `d4f75c7`; preserve its uncommitted work.



### 2026-10-20 — Correct mobile product detail overflow locally

- A direct 390px Playwright render of WM1248 showed a 592px document width. The mobile grid track expanded to 576px due to intrinsic media width. Changed the mobile track to `minmax(0,1fr)`, constrained grid children, and advanced all 35 local stylesheet references to `folio-14`.
- Re-rendered 11 main and 23 product routes at 320/360/390/430px (136 states): no overflow, missing titles, or page errors. Existing suite 10/10 passed; both scripts pass syntax checks and `git diff --check` is clean.
- Reduced-motion emulation returned `reduce=true`, `scroll-behavior:auto`, 0s card transition/animation. FAQ Enter and category chooser Save/Undo worked in the local UI.
- The headless browser cannot load the remote WM1248 image, so no complete mobile detail screenshot was saved. Existing approved homepage captures and WM1248 desktop capture remain. This fix is local only; no further publication occurred.



### 2026-10-20 — Local audit complete

- Rechecked 34 live routes; all loaded a primary heading. Verified local source at 136 viewport states (11 main + 23 product routes × 320/360/390/430px): no document overflow, missing titles, or JS errors.
- Keyboard traversal across all 34 local routes reached 331 visible focus stops; all had a visible focus outline. Catalogue search/filter, chooser category/Details/Escape/Save/Undo, language switch, FAQ Enter, and reduced-motion runtime behavior passed.
- Existing suite passed 10/10, both JS syntax checks passed, and `git diff --check` passed. Local preview remains HTTP 200. Representative homepage mobile/desktop and WM1248 desktop captures are saved.
- Public `main` remains `a1b89d4`. Its mobile detail rule still uses `1fr`; local source now uses `minmax(0,1fr)` and `folio-14`. No publication was made for this correction.
- A complete WM1248 mobile detail capture was unavailable because the headless browser could not load the official CDN image and MobileViewer's daily limit was reached. Commercial facts still need KHIND confirmation.

### 2026-10-21 — Local product rates and plan-benefit corrections

- Read the attached goal objective and continued in `projects/khind-rto`; no edits were made to the separate KHIND folder.
- Removed inferred verification dates and campaign-source defaults from catalogue normalization. Budget-first bands now use only explicitly dated products with an official KHIND RTO source. The current bands are RM70–RM85, RM95–RM105, and RM115–RM125; combo rates without dated official sources remain available in the full catalogue but do not shape these bands.
- Connected all 23 product pages to the shared catalogue before `storefront.js`, added the selected-plan benefit target, removed unsupported RM1 fee notes, and bumped shared script/style cache keys. Plan-dependent card/detail estimates now omit unconfirmed fees; the homepage WM1248 example total is RM3,825 based on six promotional months followed by 42 regular months.
- Validation: 10 Node test files passed (275 PASS checks; no assertion failures); `node --check` passed for 21 JS/CJS files; 30 local routes returned 200 with titles and expected headings; all 23 product pages had catalogue-before-storefront scripts, benefit targets, image alt text, and no unsupported RM1 fee note. Browser preview confirmed the RF480 Basic benefit copy and revised budget bands.
- **Local only. Production is unchanged and the existing release approval gate remains closed.** Deployed verification, wider visual/keyboard review, reduced-motion runtime verification, and checking every remote product image remain open. Commercial terms still require KHIND confirmation.

## 2026-10-22 — Local end-to-end continuation

- Resumed the attached goal objective in `projects/khind-rto`; preserved the independent `projects/akizen-site/khind` folder and existing uncommitted work. Read the deployment, hotfix and Git standards. No staging environment is identified; production approval remains closed.
- Local working tree is `main` at `94c58ea6fea08e793c62052b9899585c9ff615cc`; local `origin/main` ref is `c94cd93ee607bde3be8182d9371d17a729b21c6d` (ahead 2 / behind 11). No push, reset, deployment, WhatsApp message or application submission occurred.
- Fixed official product-link contrast and keyboard focus; fixed both picker Compare entry points to render the comparison view; contained comparison product images and changed comparison heading/model/note colors to readable Folio values. Added regression assertions for comparison rendering and return-to-deck behavior. Added catalogue data script to the catalogue page and advanced shared script/style query keys.
- **Checks passed:** 10 Node test files; syntax checks for 21 JS/CJS files; `git diff --check`. Local and public route scans covered 12 main routes and all 23 product detail routes. Local and public scans each found all 33 detail images loaded with non-zero natural dimensions and no missing headings; 12-route scans had no console errors.
- **Local interaction evidence:** picker deck yielded 23 unique IDs including all 10 combos; language switch preserved the current card and saved count while Details stayed open; Compare opened two comparison rows and returned to the deck; three saves disabled Save, removing one freed a slot. Catalogue no-results recovery cleared search/filter in one action; RM80 returned 3 entries and combo filter returned 10.
- **Local visual evidence:** 25 route/viewport states across 1440/1024/768/390/360 had no document overflow. The actual comparison view was separately checked at all five widths; both images remained inside their frames. Official product-link default color and 3px keyboard focus outline passed. A broken-image fixture rendered the branded accessible fallback and was removed. Browser captures were shown for home, catalogue, RF480, picker, comparison and 360px comparison, but not exported as files.
- **Live check remains a fail for RF480:** deployed Basic plan shows Premium benefits; estimate is RM4,276, which includes an unconfirmed RM1 fee; public page still loads `storefront.js?v=1`. All deployed route/image checks were read-only. The deployed GitHub commit/Actions run was not verified in this pass.
- **Open:** no production changes until the existing approval gate opens. KHIND/owner confirmation is still needed for rates, promotion eligibility, terms, benefits, cash-price references, fees and stock. Runtime hover and reduced-motion checks were not repeated. Goal remains active; deployed acceptance criteria are not yet met.
## 2026-10-22 — Catalogue-data and evidence follow-up

- Audited 23 offer records and 28 plan options. In the prior browser pass, all checked plan selections matched local data for rates, estimates, benefits, WhatsApp prefills, and stock display.
- Four individual records lack dated official rate verification (RF480 and ACSON-1.0/1.5/2.0); all 10 combo records lack official reference URLs and dated verification. Campaign eligibility/dates, some plan benefits, cash references, fees, and current stock still need KHIND/owner confirmation. No unconfirmed processing fee is included in estimates.
- SI6029BP's recorded WM/KK/KU ETA has no year and may be stale; current availability and dates remain unverified.
- Kept six 22 Oct screenshots in .impeccable/review/goal-2026-10-22-*.png. Headless capture could not fetch remote CDN images, so they show the intentional branded fallback and are layout evidence only. A separate local in-app browser render loaded both COMBO-10 component images; prior live checks found all 33 public product/detail images loaded with non-zero dimensions.
- Updated stale regression assertions to expect the current CSS query key and comparison view. Full Node suite: 10/10 files passed; node --check script.js and git diff --check passed.
- No push, deployment, WhatsApp message, or application submission. Release approval, deployed commit/Actions reference, commercial confirmations, and runtime hover/reduced-motion checks remain open.
- Follow-up: clarified SI6029BP's yearless ETA as possibly changed and requiring current KHIND confirmation; advanced the catalogue data cache key across 28 HTML pages. Local browser confirmed the revised message; browser error log was empty.

- After the catalogue data cache-key bump, all 23 local product routes loaded a product heading, matching model ID, and estimate in the in-app browser.
## 2026-10-22 - Local combo reference links

- Added official component product reference links to COMBO-1 through COMBO-10 using the individual product source URLs in catalogue.js. Repeated component models appear once per combo (17 distinct component links across the ten pages).
- Added a visible Malay caveat explaining that these links identify the component appliances only; combo pricing, promotions, benefits and RTO terms still require KHIND confirmation.
- Verified all ten local combo pages contain the expected component links and caveat. Local browser rendered both COMBO-10 links and the caveat. Existing Node suite: 10/10 files passed. git diff --check passed; Git reported existing line-ending conversion warnings in unrelated working files.
- No push or deployment. Production remains unchanged and the release gate remains closed. Runtime hover and reduced-motion behavior are still unverified; commercial terms, current stock and the deployed acceptance checks remain open.

## 2026-10-22 - Combo link accessibility and deployed recheck

- A local screenshot exposed white component-link text against the cream page background. Scoped the combo-reference links to dark underlined text, added a clear hover treatment and explicit 3px keyboard focus outline, and advanced the shared folio stylesheet key to folio-19 across all 35 referencing HTML pages.
- Reloaded local COMBO-10: both link labels were legible, keyboard navigation reached the second component link, and the screenshot showed its green focus ring. Hover styling is present in CSS; runtime hover and reduced-motion emulation remain unverified.
- Read-only public COMBO-10 still has no component-reference section and shows RM9,031 with an RM1 fee described as based on agent campaign data. The local estimate is RM9,030 and excludes that unverified fee. No deployment or push; production approval remains closed.

## 2026-10-22 - Combo responsive and live evidence

- Checked COMBO-1 through COMBO-10 locally at 1440, 1024, 768, 390 and 360 px (50 route/width states). All headings and reference sections were present, links had nonzero rendered widths, supporting text stayed at least 12 px, and no state overflowed horizontally. Reset the temporary viewport afterward.
- Read-only local and public COMBO-10 browser checks: both appliance images loaded with natural dimensions 3059x4096 and 2238x4096; both sessions had zero browser console errors. Local shows 2 component links and RM9,030. Public shows 0 component links and RM9,031 including the unconfirmed RM1 processing fee.
- Production remains unchanged. Deployed acceptance is still failing; no push or deployment.

## 2026-10-22 - RF480 promotion consistency (local only)

- Checked the official KHIND ChillMaster Lite page on 2026-10-22. It shows RM75/RM95 monthly rates for 60 months, a 50% pre-order reduction for the first 3 months, and RM4,200 outright. No promotion expiry or supply date was stated on the checked page.
- Updated the source record with the dated rate/promotion check and pre-order wording; removed the unverified RM3,200 cash-promotion value. Updated storefront and catalogue calculations to use three promotional payments for RF480, with no unconfirmed fee added. The guided picker now labels regular totals as pre-promotion and shows a separate if-eligible promotion estimate in the card, plan details, saved item, and comparison, in both English and Malay.
- Local browser verified Basic RM37.50 x 3 then RM75 x 57 = RM4,387.50 and Premium RM47.50 x 3 then RM95 x 57 = RM5,557.50. The selector updated plan benefits and the WhatsApp draft to Premium. No message was sent. No browser console errors were logged.
- All 10 Node test files passed; syntax checks for script.js, storefront.js, and swipe-shop.js passed; git diff --check passed. Shared cache keys were advanced on 34 HTML pages; the swipe script key was advanced on its three chooser pages.
- Production remains unchanged. The release approval gate remains closed. Confirm promotion eligibility/expiry, pre-order supply date, remaining commercial terms, and benefits with KHIND before release; deployed acceptance remains blocked by existing live mismatches.
- Follow-up after rereading the official page: KHIND displays RM38 for the Basic promotional amount while exact 50% math gives RM37.50. The local product estimate and picker now say that the calculated promotional amounts (RM37.50 Basic / RM47.50 Premium) are scenarios and that KHIND's final rounding/billed rate must be confirmed. The updated Premium browser view showed RM47.50, RM95, RM5,557.50, the rounding note, and a plan-specific WhatsApp draft. No message was sent. The 10-file suite and syntax/diff checks passed again after this change.
## 2026-10-22 - RF480 narrow-width follow-up

- Selected RF480 detail in the local route viewport fixture and checked 320, 360, 390, and 430 CSS px after adding the promotion and rounding disclosures. The fixture reported viewport/client-width/scroll-width as 320/305/305, 360/345/345, 390/375/375, and 430/415/415; its horizontal-overflow result was empty at all four widths. This verifies document overflow only, not full mobile visual or clipped-text acceptance.## 2026-10-22 - Homepage responsive overflow correction
- Refreshed the local route viewport fixture after the separate RF480 three-month source note and homepage cache update. The dated campaign and RF480 reference remain visibly distinct.
- At homepage widths 320, 360, 390, and 430 CSS px, viewport/client/scroll widths were 320/305/305, 360/345/345, 390/375/375, and 430/415/415. No horizontal document overflow.
- Root cause was the campaign heading no-wrap rule. Changed campaign copy to 12px minimum and allowed the heading to wrap on mobile.
- Re-ran all 10 Node test files: 10 passed, 0 failed.
- Syntax checks passed for script.js, storefront.js, and swipe-shop.js. Whitespace check passed.
- Local-only result. Public storefront discrepancies remain unresolved; no push, deployment, WhatsApp message, or application submission. Goal remains active.

## 2026-10-22 - Live drift and local route verification
- Read-only public RF480 check: Basic is selected, but the page still shows a six-month promotion, RM4,276 estimate, and Premium-specific benefits. This conflicts with the local three-month source reference and plan-specific display.
- Read-only public COMBO-10 check: the RM9,031 estimate includes an unconfirmed RM1 processing fee; WM150A and RFS600A component reference links are absent.
- Local RF480 shows the dated three-month reference and RM4,387.50 Basic estimate. Local COMBO-10 shows both product reference links and RM9,030 estimate without the unconfirmed fee.
- Fixed the 320px homepage campaign overflow by allowing the title to wrap and raising campaign text to 12px. Bumped retail-2026.css URL from family-first-1 to family-first-2 to ensure browsers load the fix.
- Swept all 34 route fixture options at 320, 360, 390, and 430 CSS px: no document-overflow warnings. WD1438 and CD12D local images loaded with descriptive alt text.
- All 10 Node test files passed; script.js, storefront.js, and swipe-shop.js syntax checks passed; git diff --check passed.
- No production changes, push, WhatsApp message, or application submission. Goal remains active.

## 2026-10-22 - Homepage runtime and RF480 schedule correction
- Current source checks found an undefined verification fragment in script.js that stopped homepage product-card rendering. Removed it and bumped the homepage script asset to folio-10.
- Added an explicit stock and ETA fallback for offers with no stock note. The local homepage now renders 13 cards, all with stock text.
- Replaced hard-coded six-month wording in the homepage comparison and WhatsApp draft with the scheduled promotion duration. RF480 card and modal now agree on three months: Basic RM37.50 x 3 then RM75 x 57 = RM4,387.50; Premium RM47.50 x 3 then RM95 x 57 = RM5,557.50.
- The RF480 modal now states the recorded reference does not specify offer expiry or eligibility and requires KHIND confirmation. The selected plan updates benefits and WhatsApp prefill. No message sent.
- Verified search no-results and clear-search recovery. Swept all 34 route fixture options at 320, 360, 390, and 430 CSS px after the latest code changes; no overflow warnings.
- All 10 Node test files passed; script.js, storefront.js, and swipe-shop.js syntax checks passed; git diff --check passed.
- Read-only public checks still show RF480 six-month pricing/benefit mismatch and COMBO-10 missing component links plus an unconfirmed RM1 fee. No production change, push, WhatsApp message, or application submission. Goal remains active.

## 2026-10-22 — Goal acceptance follow-up

- Re-ran all existing Node tests from the project root: 10 files passed, 0 failed. JavaScript syntax checks passed for `script.js`, `storefront.js`, and `swipe-shop.js`; `git diff --check` passed.
- Read-only deployed RF480 browser inspection still shows a six-month promotion label, RM4,276 estimate, and RM1 fee. The enquiry prefill identifies Basic while the benefit copy includes Premium-only services. This fails deployed pricing/plan consistency against the dated local three-month reference.
- Read-only deployed COMBO-10 browser inspection still shows RM9,031 with an RM1 fee and no WM150A/RFS600A component reference links. Both appliance images loaded in the browser accessibility tree.
- Read-only deployed `/pilih/` accessibility tree starts at `0 / 13` products viewed. The current local catalogue and regression test contain 23 offers, so the published picker does not meet the all-23-offers requirement.
- Read-only deployed `/catalogue/` accessibility tree reports 23 choices and links to all ten combo cards; `?category=bundle` reports 10 results. Its six-month campaign copy remains generic to eligible products and does not reconcile the model-specific RF480 evidence.
- Read-only deployed WM1248 detail loads with an image label but shows a 48-month term and RM3,826 estimate beside a warning that the term differs from KHIND's public information. Keep its commercial terms unverified.
- Read-only deployed FAQ exposes collapsed question buttons; this pass did not activate them, so accordion behavior remains unverified live.
- Verified release reference: GitHub Pages run [#40](https://github.com/Akkie1104/khind-rto/actions/runs/39405599024) deployed commit `c94cd93ee607bde3be8182d9371d17a729b21c6d`; storefront validation run [#60](https://github.com/Akkie1104/khind-rto/actions/runs/39405599587) passed on the same commit. The run page reports a non-blocking Node.js 20 deprecation warning. Local corrective changes are not in that deployed commit.
- No WhatsApp link was opened, no message was sent, and no application submitted. No production change or push. Release gate remains closed and goal remains active.
- Browser-level hover and reduced-motion emulation, KHIND/owner commercial confirmation, deployed route and interaction acceptance, and a verified deployment reference remain open.

- Local privacy correction: removed area and monthly-budget prompts from default WhatsApp drafts on the homepage, catalogue, RTO guide, FAQ, and enquiry page. A static scan of 42 HTML files and 78 WhatsApp anchors found zero budget, income, location, IC, OTP, card, or password prefills. Public commit c94cd93 still has the old homepage template; this fix is local only.
- After this source change, all 10 Node test files passed; syntax checks for script.js, storefront.js, and swipe-shop.js and git diff --check passed.
- Latest read-only live homepage tree still shows the WM1248 example as six promotional months and RM3,826 including a stated RM1 processing fee, while its note says fees need KHIND confirmation. It also still exposes the old WhatsApp draft with blank area and monthly-budget fields. These are deployed failures; the privacy and fee corrections remain local.

## 2026-10-22 - Read-only live RTO/privacy/picker audit

- Live `/cara-rto/` WhatsApp prefill still asks which product fits the visitor's home budget. Live `/mohon/` visible copy asks for location and monthly budget, and its WhatsApp prefill includes product, area, and monthly-budget fields. These do not match the local privacy-minimized drafts.
- Local correction also removed location/budget requests from the visible enquiry page copy, keeping model/category help and warnings against sending sensitive documents. Local text scan of `/mohon/` found no budget, location, income, or equivalent prompts.
- Live `/privasi/` loaded; its data-collection disclosure appeared expanded in the accessibility tree. I did not activate or inspect any further controls.
- Live `/pilih-b/` initially presents the category question; `/pilih-c/` initially presents budget bands RM70-85, RM95-105, and RM115-135. I did not select an answer or verify post-selection behavior. A direct `/pilih-exp/` open landed at `/pilih-c/`; reason and experiment behavior are unverified.
- The local all-HTML WhatsApp scan and Node suite passed after the enquiry-copy changes. Public pages still serve commit `c94cd93`; no deployment, WhatsApp message, or application submission was made.


2026-10-22 - Local ACSON pricing and regression verification
- VERIFIED against KHIND Kool Series product page (https://www.khindrto.com.my/products/koolseries-airconditioner): ACSON 1.0/1.5/2.0 HP regular rates RM105/RM115/RM135 for 60 months and regular cash references RM4,000/RM4,500/RM5,500. Promotion eligibility and final billed rounding for all capacities remain unconfirmed; KHIND advertises RM53/month for 1.0 HP while exact half-rate arithmetic is RM52.50.
- Added a bilingual ACSON estimate note to explain that difference and require confirmation of final billed rates, other-capacity promotional rates, eligibility, fees and inclusions. Updated the three ACSON detail pages to load storefront.js?v=6.
- The picker regression expectation now reflects the source-derived upper band RM115-RM135, including ACSON 2.0 HP at RM135.
- VERIFIED local checks: all 10 Node test files passed; node --check passed for script.js, storefront.js and swipe-shop.js; git diff --check passed; targeted catalogue assertions confirmed all three ACSON rates, cash references and 2026-10-22 review dates.
- Local source only. No push or deployment. Public site remains at commit c94cd93; deployed pricing, picker, privacy, route and accessibility failures remain open. Release gate stays closed.
## 2026-10-22 - Deployed keyboard and language recheck

- Re-ran the local Node suite: 10 test files passed, 0 failed. `node --check` passed for `script.js`, `storefront.js`, and `swipe-shop.js`; `git diff --check` passed.
- Read-only deployed `/pilih-c/` keyboard check: selected the first budget band, ArrowLeft skipped SI6029BP, Undo restored it, and keyboard activation opened Details. Escape closed the sheet. Switching to English inside Details preserved the product and open sheet, but the product name, description, benefits, and stock notice remained Malay. The deployed picker still exposes only 13 of 23 products.
- Read-only deployed RF480: Basic and Premium selections update the visible monthly amount, estimate, and WhatsApp draft to the selected regular rate and term. Basic still displays Premium-only benefits. The public page shows a six-month promotion and RM4,276 estimate; the locally verified KHIND source records a three-month 50% pre-order scenario and RM4,387.50 for Basic. Rounding, expiry, eligibility, fees, and supply date still need confirmation. No WhatsApp message was sent.
- The deployed RF480 official product link is white on transparent over cream (computed link text `rgb(255,255,255)`, body `rgb(244,240,228)`). Local source renders the link dark green on cream; keyboard Tab focus showed its 3px green outline. The public RF480 image loaded at 3335×5000; its browser tab reported no console warnings or errors.
- Captured live homepage, catalogue, picker, and RF480 screenshots during review. The local ten combo pages contain official component references and a caveat that these links do not confirm combo terms; deployed COMBO-10 still lacks them.
- No production changes, push, message, or application submission. Release gate remains closed. Reduced-motion styles exist in local CSS, but runtime emulation is unavailable in the browser capability set; live hover/focus styling and deployed acceptance remain open. Goal remains active.

## 2026-10-22 - Local combo card and comparison checkpoint
- Fixed the combo-card mobile layout: at widths up to 430 CSS px, the estimate sits above the Details control instead of competing for the same row. Updated the shared chooser CSS URL to `swipe-shop.css?v=10`. The chooser JS URL is `swipe-shop.js?v=20261022-5`; static test expectations that still pinned older cache keys were updated.
- Verified COMBO-1 in the local exact-width iframe fixture at 320, 360, 390, and 430 CSS px. Page scroll width equaled viewport width at each size; card scroll width equaled card client width; the estimate and Details control did not overlap. WM1248 and DHP90 component images both loaded and retained descriptive alt text. The main 390px picker screenshot was saved in the system temporary directory for this review.
- Local comparison showed COMBO-1 at RM150/month for 48 months (RM7,200 regular-rate estimate) and DHP90 at RM85/month for 48 months (RM4,080 estimate), matching the selected items. Opened the generated WhatsApp prefill in an unsent tab; it carried the selected model names and a terms-confirmation request only. No message was sent.
- All 10 existing Node test files passed; `node --check` passed for `script.js`, `storefront.js`, and `swipe-shop.js`; `git diff --check` passed. The test expectation changes only align the assertions with the current asset cache keys.
- Production remains unchanged. Deployed picker coverage, RF480 price/benefit mismatch, official-link contrast, combo reference links, privacy copy, and deployed visual/accessibility acceptance remain open. No push, deployment, WhatsApp message, or application submission; release gate stays closed.

## 2026-10-22 - Fresh deployed acceptance checkpoint
- Read-only swept all 23 live product routes. Every route had a heading, price panel, loaded image(s) with alt text, and no page-level horizontal overflow at the browser's current viewport. All 13 individual routes had an official photo/specification link; all 10 combo routes lacked component-reference links.
- Live `/pilih-c/` returned 13 offers after selecting RM115-RM135. English mode localized controls and status but left the active product name and specifications in Malay.
- Live RF480: Basic selected while Premium-only services remained in the benefit copy; six-month promotion, RM4,276 Basic estimate, and RM1 fee remain published. Selecting Premium produced RM5,416. The locally recorded KHIND reference is a three-month pre-order scenario; eligibility, expiry, supply date, fees, benefits, and final rounding remain unresolved.
- Every live individual official-reference link measured white text on transparent over the cream page background. RF480 keyboard focus showed a 3px solid green outline; hover behavior was not verified.
- Live COMBO-10 still shows RM9,031 including the unconfirmed RM1 fee and lacks WM150A/RFS600A component links. Live `/mohon/` still asks for location and monthly budget and places both in its WhatsApp draft.
- Live catalogue: 23 offers at base, 10 results with the combo filter, and 3 under the RM80 rate cap. A no-match query showed only `0 pilihan sepadan`, without empty-state guidance or a clear-filters action. Catalogue-to-WM1248 navigation and breadcrumb return worked. The first live FAQ disclosure expanded.
- The local catalogue passed the matching no-results case with the RM80 budget filter active: it showed the empty-state message and one `Kosongkan carian dan penapis` action. That action cleared search and budget together and restored 23 offers.
- The browser URL policy blocked a `data:` fixture used to view the deployed picker at 360/390px; only HTTP and HTTPS URLs are allowed. No alternate route was attempted. Deployed mobile-width visual acceptance remains unverified.
- Deployed hover, reduced-motion runtime, required viewport matrix, and all required screenshot types remain unverified; deployed commit/reference was not established this turn. No production edits, push, message, or application submission. Release gate stays closed.
