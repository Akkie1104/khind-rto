# KHIND RTO deployment state

## Deployed mobile picker verification — 2026-10-22

- **VERIFIED — live `/pilih-c/`:** Opened in the in-app browser at 360 × 800 and 390 × 844 CSS px. The document width matched the viewport at both sizes; the active card, detail action, and save/skip controls fit without horizontal scrolling. WM1248's image loaded at 5304 × 7952 with Malay alt text.
- **VERIFIED — live accessibility/content failures:** The official reference link in WM1248 details uses `#f3ce43` on `#f4f0e4` (computed contrast 1.34:1); its 3px focus outline uses the same yellow. Switching to English sets document language to `en`, but the product heading, specification, and listed benefits remain in Malay. The picker reports only 13 cards, not the required 23.
- **VERIFIED — live picker behavior:** One saved pick and progress position survived a language switch. The three-pick limit blocks a fourth with an explanatory accessible label. The saved-items sheet showed three records without horizontal overflow. The WhatsApp prefill included only the selected model names and a general request; it opened the WhatsApp share landing page, and no message was sent.
- All temporary saved picks were removed. Production was not changed. Screenshots and DOM measurements were captured in the visible browser session; no standalone screenshot files were exported.
- Existing local source changes remain uncommitted on `main` (`ahead 2, behind 11`); source/live reconciliation and deployment are still outstanding. Do not mark the goal complete.

## Homepage contact band alignment — 2026-10-20

- Production inspection showed the contact band still stopped at the inherited 68rem maximum width, leaving the paper background strip visible beside the full-width footer. The previous release widened the FAQ section but did not widen the contact band.
- Updated the homepage width override to cover both `.faq-section` and `.contact-section`; advanced the homepage stylesheet reference to `folio-16`. No customer copy, product data, or commercial claims changed.
- Published code commits: CSS `1f246de7d127b8b0dd6f759078d648e8c2b75e03`; HTML `c94cd93ee607bde3be8182d9371d17a729b21c6d`. Pages run #40 was queued and storefront validation run #60 was in progress at record time; verify both before marking release complete.
- Local browser review: section right edges matched at 320, 360, 390, 430, 768, 1024, 1265, and 1532 CSS px; no document overflow. Visually inspected homepage, catalogue, FAQ, chooser, and WM1248 product page at desktop; checked homepage at tablet and narrow widths.
- Local existing Node suite passed 10/10. Rollback source is the previous production commit `3e619ca344b7df5e9d7fc48f21e896e47e1b94fe`; verify live deployment before declaring the correction live.

## Homepage edge alignment — 2026-10-20

- **VERIFIED published:** GitHub Pages `main` code commit [`d82e4425a2c38e656281e23f151b243c23411e9f`](https://github.com/Akkie1104/khind-rto/commit/d82e4425a2c38e656281e23f151b243c23411e9f); the custom-domain homepage loaded after deployment. Pages deployment run #37 and storefront validation run #57 succeeded.
- **Change:** the homepage FAQ now uses the full content width so its right edge aligns with the contact band and footer. The homepage Folio stylesheet reference is cache-busted at `folio-15`. No product, price, promotion, or customer-facing copy changed.
- **Responsive evidence:** browser preview checked 320, 360, 390, 430, and 1532 CSS px. FAQ, contact band, and footer right edges matched at every width, with no horizontal overflow.
- **Rollback position:** previous `main` commit [`1cca9e8e62cebe908ab52f56a94f985d4bfd1281`](https://github.com/Akkie1104/khind-rto/commit/1cca9e8e62cebe908ab52f56a94f985d4bfd1281).
- **Scope:** no staging environment was identified. The code release included only `khind-folio.css` and homepage `index.html`; unrelated local working-tree changes were not included.

## Local route and interaction review — 2026-10-20

- **Production remains unchanged.** The live site currently serves the approved folio design. This review made no site-source edits and no deployment.
- **Live route check:** the eight standard content routes, `/pilih/`, `/pilih-b/`, `/pilih-c/`, and all 23 product detail URLs loaded a page title and primary heading from `https://khindrto.akizen.my/`.
- **Local responsive check:** all 11 main routes (including `/pilih/`, `/pilih-b/`, and `/pilih-c/`) and all 23 product detail pages loaded in the 320, 360, 390, and 430 CSS px frames. No page document exceeded its viewport. Promotions measured exactly 320 px of scroll width in the 320 px frame.
- **Interactions:** WM1248 search returned one match; the regular-rate RM80 filter returned three. FAQ disclosure toggled with Enter. The category chooser opened the selected product deck and details sheet; Escape closed the sheet. The swipe chooser saved with Right Arrow and Undo restored the previous product and cleared the saved count.
- **Budget chooser keyboard check:** Enter on the first band opened the 13-item deck; the initial card showed SI6029BP at RM75/month for 24 months with its stock note.
- **Checks:** existing Node suite passed (10 tests); `node --check` passed for `script.js` and `swipe-shop.js`; `git diff --check` passed.
- **Reduced motion:** CSS and swipe JavaScript contain reduced-motion handling. The current browser session exposes no emulation capability, so runtime emulation was not verified.
- **Visual evidence:** WM1248 mobile and desktop page layouts were inspected in the browser. Screenshot captures are not saved as local image files yet.
- **Still open:** save representative mobile and desktop screenshots; complete wider keyboard/accessibility review; confirm promotion eligibility, rates, terms, benefits, and stock with KHIND before treating them as current. The four folio design choices (caption, paper ground, index texture, WM1248 cutout) are approved.

### Follow-up keyboard and visual review — 2026-10-20

- WM1248 detail page: keyboard focus reached the brand link and next reached “Utama”; both showed a visible focus outline.
- Swipe chooser: Tab moved from the skip-content link to the language switch, card, and “Lihat butiran” control. The details sheet opened with Enter.
- **Open visual finding:** the chooser details sheet appeared to overlap product imagery and text in the desktop-width browser capture. Confirm at the exact mobile widths and correct locally if reproducible before closing visual review.
- Browser capability check exposed no viewport or reduced-motion emulation API. The fixture still renders the WM1248 page in 320/360/390/430 CSS px frames, but screenshots from this follow-up were inspected in-browser and not saved as files.

## Latest verification — 2026-10-20

- GitHub Actions storefront validation run #48 and GitHub Pages deployment run #28 completed successfully for `f7f28cca68685019456a0bda150b1d80f7429bcd`.
- The public FAQ loads the updated stylesheet and its answer opens by keyboard; the focus outline is visible.
- MobileViewer's daily preview limit blocked a fresh post-release check. Local responsive previews covered the chooser, catalogue, WM1248 detail, FAQ and Promotions at 320/360/390/430 CSS px.
- Still open: runtime reduced-motion emulation, broader route-by-route keyboard checks, a saved WM1248 detail capture, and KHIND confirmation of time-sensitive commercial claims.

Last updated: 2026-10-20  
Last verified: 2026-10-20  
Overall status: The previously verified version remains published on the customer domain; current corrective work is local and unpushed, and the release gate remains closed.

- Production: `https://khindrto.akizen.my/` via GitHub Pages from `Akkie1104/khind-rto`, branch `main`, repository root; current storefront code release `f7f28cca68685019456a0bda150b1d80f7429bcd`.
- Staging: None identified; current review scope is production-only after deployment.
- Source repository/location: `projects/khind-rto`, remote `https://github.com/Akkie1104/khind-rto.git`.
- Base source commit: `2bf1d0ae2a8745d3fa05e8bf304deebf99956acf` (matched GitHub `main` before this change).
- Change: fixed FAQ answer text contrast by matching the legacy selector's specificity, and advanced the shared stylesheet cache key to `folio-12` on all 35 referencing pages. No commercial copy or product data changed.
- Validation: the existing Node suite passed 10/10; JavaScript syntax checks and `git diff --check` passed. A 36-route sweep checked titles, primary headings, images and desktop overflow. Responsive previews covered the chooser, catalogue, WM1248 details, FAQ and Promotions at 320/360/390/430 CSS px. The public FAQ loads the answer and toggles with Enter; the visible focus outline remains. MobileViewer's daily preview limit prevented a fresh post-release run; prior MobileViewer previews were not a post-release check. GitHub status checks were not available from the connector at verification time.
- Rollback position: prior `main` commit `2bf1d0ae2a8745d3fa05e8bf304deebf99956acf`; revert the deployment commit if needed.
- Risks/unknowns: MobileViewer is an external preview, not a physical-device or accessibility certification. Confirm product rates, promotion eligibility, plan terms, benefits, stock and regional availability with KHIND before promotion.
- Commercial copy: no offer or pricing copy changed in this deployment.

## FAQ contrast release — 2026-10-20

- **VERIFIED deployed:** GitHub Pages `main` at `f7f28cca68685019456a0bda150b1d80f7429bcd`; the public FAQ loads the updated `folio-12` source.
- **Change:** FAQ answer text now uses the specificity needed to override the legacy style; all 35 folio references use the new cache key.
- **Checks:** existing Node suite 10/10, JavaScript syntax checks and `git diff --check` passed. The live FAQ answer opens with Enter and keeps a visible 3px focus ring. Local visual review found no horizontal overflow at 320, 360, 390 or 430 CSS px; the earlier Promotions flag was caused by comparing document width to content width while the vertical scrollbar occupied 15px.
- **Still open:** runtime reduced-motion emulation, broader route-by-route keyboard checks, a saved WM1248 detail capture, and KHIND confirmation of time-sensitive commercial claims. MobileViewer's daily limit prevented a fresh post-release preview. GitHub status checks were unavailable through the connector at verification time.

## Deployment follow-up — 2026-10-20

- **VERIFIED deployed:** GitHub Pages `main` at `42193868e2157fe919b2fdd8dfda004c3e04f95e`. The shared folio stylesheet uses muted ink for the logo tagline and chooser disclosure; 35 pages now reference `folio-11`.
- **Validation:** existing Node regression suite and JavaScript syntax checks pass; `git diff --check` passes. GitHub Actions storefront run #45 and Pages deployment run #25 completed successfully. Public homepage and category-first chooser load on `https://khindrto.akizen.my/`; local keyboard review confirmed language switching and FAQ accordion operation.
- **Workflow maintenance:** updated the folio design assertion in `.github/workflows/verify.yml` to accept the current cache-key version instead of requiring the obsolete `folio-6`.
- **Rollback position:** prior deployed source commit `5f757a6533458c5efed3d550330f37ee19dc4b3f`; revert the release commit if needed.
- **Evidence limits/open work:** refresh the stale 320px catalogue screenshot and continue full-route keyboard/reduced-motion review. MobileViewer and browser emulation are not physical-device or accessibility certification.
- **Still unresolved:** KHIND must confirm the WM1248 promotion/plan discrepancy and all time-sensitive price, eligibility, benefits, plan-term, and stock claims before promotion.

### Continuation verification — 2026-10-20
- Current source is main at 2bf1d0a, aligned with origin/main. Existing untracked review files remain untouched. This continuation made no storefront code change and did not publish.
- The four Home Handover Folio design decisions were approved earlier. The active gate for further production publication remains closed.
- Rechecked the live homepage and the published WM1248 page. Local exact-width fixture showed the homepage at 320/360px, catalogue at 320/360px, and WM1248 detail at 320/360px. MobileViewer rendered public homepage and WM1248 detail at selected 360/390/430/450px widths. Visible checks found no clipping in the 320/360 navigation, hero or product summary. Browser captures were viewed but not saved as files.
- Manual interactions: catalogue search WM1248 returned 1 result; regular-rate budget RM80 returned 3; category-first chooser opened WM1248; Details open/close, Save, Undo and live FAQ Enter operation worked.
- Checks: `node --test --test-reporter=dot tests/*.test.cjs` passed (10/10); `node --check script.js` and `git diff --check` passed.
- Current official KHIND WM1248 listing shows RM43* promotional and RM85 regular monthly rates, with the RM85/48-month plan option. The agent listing shows RM42.50 for the promotional period. Keep the rounding, campaign eligibility, benefits, stock and final terms flagged for KHIND confirmation.
- Still open: full customer-route visual/keyboard review, reduced-motion runtime check, saved representative screenshots, and owner confirmation of time-sensitive commercial facts.

### Responsive and keyboard follow-up - 2026-10-20
- Rechecked the local catalogue, category-first chooser, and WM1248 detail in the responsive fixture at 320, 360, 390, and 430 CSS px. The detail page showed a visible 3px green focus ring during keyboard traversal across header links.
- Saved representative captures already cover catalogue and chooser comparisons at 320/360 and 390/430 CSS px, plus the desktop homepage. This turn's WM1248 detail screenshot was reviewed in-browser but not saved as a file.
- Browser `matchMedia('(prefers-reduced-motion: reduce)')` reports `false`; this session did not emulate reduced motion. The runtime check remains open.
- The WM1248 detail still uses the source photograph with `object-fit: contain`; the appliance looks small within its portrait frame at mobile widths. No crop or CSS change was made pending a better source/frame review.
- No storefront source change or publication was made. `main` and `origin/main` remain aligned at `2bf1d0ae2a8745d3fa05e8bf304deebf99956acf`.
- Still open: route-by-route visual and keyboard review, reduced-motion runtime emulation, a saved WM1248 detail capture, and KHIND confirmation of time-sensitive commercial details.

### Local FAQ contrast follow-up — 2026-10-20
- Fresh live FAQ inspection found expanded answer text at #ced8ca on #f4f0e4 (1.29:1 contrast). The more-specific legacy `.agent-faq details p` rule in `storefront.css` overrode the newer, lower-specificity folio rule.
- Local-only fix changes `khind-folio.css` to the matching `.agent-faq details p` selector and advances all 35 HTML stylesheet references from `folio-11` to `folio-12`. Local browser computed styles now show #465247 on #f4f0e4 (7.20:1); Enter toggles the FAQ and keyboard focus remains visible with a 3px outline.
- Existing tests passed (10/10); `node --check script.js` and `git diff --check` passed. No publication occurred; the public FAQ still serves `folio-11` and retains the contrast issue until an approved release.
- Fresh live checks also confirmed the folio homepage is still current, catalogue search for WM1248 returns 1 item, and the regular-rate RM80 filter returns 3. The local 320/360/390/430 fixture shows the category-first chooser fits its measured page widths; the WM1248 detail is visible at all four widths without page overflow.
- This browser session cannot emulate `prefers-reduced-motion`; source media rules are present, but runtime behavior is still unverified. Saved screenshot deliverable, route-by-route keyboard review, and commercial owner checks remain open.


## 2026-10-20 - Approved responsive follow-up

- The user approved all four folio presentation choices and then directly approved pushing the KHIND RTO changes to GitHub Pages.
- Fixed the chooser Details sheet image bounds and clipping in `swipe-shop.css`; added readable paper, muted-ink, rust, and stock-note treatments in `khind-folio.css`.
- Bumped `swipe-shop.css` to cache key `v=6` on all four chooser routes and `khind-folio.css` to `folio-13` on all 35 referencing pages. Updated four corresponding existing test assertions. No product prices or commercial claims were changed.
- Local browser inspection of `/pilih/` confirmed the WM1248 image stays inside its photo frame; the plan, reference-price, benefits, and caveat text remain visible in the Details sheet.
- Existing test suite passes (10/10). `node --check script.js`, `node --check swipe-shop.js`, and `git diff --check` pass.
- Review captures are saved under `.impeccable/review/`. The temporary capture receiver has been stopped and its helper file removed.
- Exact-width review fixtures previously covered 320, 360, 390, and 430 CSS px. The browser viewport override did not change the active browser's actual inner width on this continuation, so that direct runtime check remains unverified here. Runtime reduced-motion emulation also remains open.
- Confirm current rates, promotion eligibility and rounding, plan duration and benefits, and stock with KHIND before representing them as confirmed. These items remain visibly caveated and no related copy or data was changed.


## 2026-10-20 - GitHub Pages release verification

- GitHub main advanced to `e54e9619695b4851385cdb754fdfb32b619b7400` for the approved folio details-sheet fixes and cache-key updates.
- GitHub Actions validation run `39384123309` and Pages deployment run `39384122994` completed successfully for that commit.
- Public `/pilih/` verified: it loads `swipe-shop.css?v=6` and `khind-folio.css?v=folio-13`. The live Details sheet keeps the WM1248 image inside its photo frame and shows its plan, price reference, benefits, and caveat text.
- MobileViewer loaded the public site, but its daily preview limit blocked a fresh device render. The earlier 320/360/390/430 CSS-pixel fixture review remains useful; an exact viewport override did not apply in this continuation.
- Runtime reduced-motion emulation remains unverified. The existing code includes reduced-motion handling.
- No product data, prices, or commercial claims changed. KHIND confirmation remains open for rates, promotion eligibility and rounding, plan duration and benefits, and stock. Keep those claims caveated until confirmed.


## 2026-10-20 — Approved chooser language fix published

- User approved publishing the chooser progress-label language fix. Commit `a1b89d4` is on remote `main`; validation run `39391338338` and Pages deployment `39391338012` succeeded.
- Fresh public `/pilih-b/` check confirmed its progress region changes from “Kemajuan pilihan” to “Pick progress” when English is selected.
- Prior local review covered 11 main routes and 23 product routes at 320/360/390/430 CSS px without document overflow; existing suite passed 10/10, syntax checks and `git diff --check` passed. Search/filter, chooser Details/Escape/Save/Undo, FAQ keyboard, language switching, and reduced-motion runtime checks passed. Homepage captures are saved in `.impeccable/review/` (mobile 320/390 and desktop 1440).
- MobileViewer's cached 390×844 preview hit its daily limit. A reliable WM1248 mobile detail capture and wider route-by-route visual/keyboard review remain open.
- Local checkout remains at `94c58ea`, stale `origin/main` `d4f75c7`, with local diffs. Preserve the divergent checkout; do not push or reset it. Two verified `khind-rto-capture-*` temp profiles were removed.
- Rates and promotion rounding/eligibility, plan terms/benefits, stock, and regional availability remain subject to KHIND confirmation.



## 2026-10-20 — Mobile product overflow fixed locally

- Direct mobile rendering exposed horizontal overflow on product detail pages: at 390px, the single grid track expanded to 576px because its intrinsic minimum was retained. Updated the mobile detail grid to `minmax(0,1fr)`, constrained its children, and bumped the local folio CSS key to `folio-14` on all 35 references.
- Rechecked all 11 main routes and 23 product routes at 320, 360, 390, and 430 CSS px: 136 rendered states, no document overflow, missing page titles, or JavaScript errors. The WM1248 detail fit each width.
- Existing Node suite passed 10/10; `node --check script.js`, `node --check swipe-shop.js`, and `git diff --check` passed. Runtime reduced-motion check showed `scroll-behavior:auto` and 0s card transition/animation. FAQ Enter and category chooser Save/Undo worked in the local browser.
- Local preview remains available at `http://127.0.0.1:8766/`. Headless Chromium cannot load the official CDN product image, so it cannot produce a complete mobile detail capture. Existing homepage mobile and desktop captures plus the WM1248 desktop capture remain available in `.impeccable/review/`.
- This correction is local only; production remains at `a1b89d4`. Local checkout is still divergent at `94c58ea` with stale `origin/main` `d4f75c7`; preserve it and do not push/reset it.
- Still open: accurate WM1248 mobile capture and broader route-by-route keyboard/visual audit. KHIND confirmation remains required for rates/promotions, eligibility, plan terms/benefits, stock, and regional availability.



## 2026-10-20 — Local redesign audit completion

- Rechecked current production source and live site: GitHub `main` remains `a1b89d4`; all 34 customer routes loaded with a primary heading. The live stylesheet still has the 1fr mobile detail track, so the newly confirmed fix remains local as required by the no-publish scope.
- Local implementation: all 11 main routes and 23 product routes rendered at 320/360/390/430 CSS px (136 states), no overflow, missing titles, or JS errors. Keyboard traversal reached 331 visible focus stops across all 34 routes with a visible outline at every stop.
- Key non-transactional interactions verified: catalogue search and budget filter, category-first chooser, Details/Escape, Save/Undo, English/Malay label switch, and FAQ Enter. Reduced-motion emulation matched and reduced scrolling/transitions/animations. Existing suite 10/10, JS syntax, and diff checks passed.
- Local preview is available at `http://127.0.0.1:8766/`. Representative captures are saved under `.impeccable/review/`: homepage mobile 320/390, homepage desktop 1440, and WM1248 desktop detail. A fresh WM1248 mobile detail capture could not be made because the headless browser cannot load its official CDN image; MobileViewer had only its cached preview and daily limit.
- No production change was made for the local mobile grid correction. Preserve local `94c58ea` and its uncommitted changes; `origin/main` remains stale at `d4f75c7`. Do not push or reset this divergent checkout.
- Owner review remains required for rates, promotion rounding and eligibility, plan terms/benefits, stock, and regional availability. Those facts remain caveated.

## 2026-10-21 — Goal continuation: local product and pricing corrections

- **Local source only.** Production remains unchanged; the prior publication approval gate is still closed.
- All 23 detail pages now load the shared product catalogue before the detail script. Their selected-plan benefits update from the catalogue data, and estimates no longer include the unconfirmed RM1 fee. The homepage WM1248 example shows RM3,825 (6 × RM42.50 + 42 × RM85).
- Catalogue normalization no longer invents a campaign source or verification date when a record has none. The budget-first chooser excludes combos and other entries without both an explicit verification date and an official KHIND RTO source. Current verified bands: RM70–RM85, RM95–RM105, RM115–RM125.
- **Checks passed:** Node suite 10 files / 275 assertions; syntax check 21 JS/CJS files; local HTTP sweep of 30 routes (7 main routes and 23 product routes); product-page markup checks across all 23 pages; RF480 Basic-plan benefit and budget bands inspected in the local browser.
- **Still open:** deployed-site verification awaits release approval; visual/keyboard review across responsive widths, reduced-motion runtime behavior, and remote image load checks are incomplete. KHIND must confirm time-sensitive rates, promotions, benefits, and stock.

Last updated: 2026-10-21

### 2026-10-22 — Local end-to-end continuation

- **Environment:** local preview only. Production approval remains closed; nothing was pushed, deployed, or sent. Local branch is `main` at `94c58ea6fea08e793c62052b9899585c9ff615cc`; its local `origin/main` ref is `c94cd93ee607bde3be8182d9371d17a729b21c6d` and the checkout reports ahead 2 / behind 11. Do not push or reset this divergent checkout. The deployed GitHub Actions/commit reference was not confirmed in this pass.
- **Local fixes:** added `catalogue.js` before `storefront.js` on the catalogue page; refreshed shared cache keys; gave the official product link dark default text, underline, hover and keyboard focus styling; routed both Compare actions to the actual comparison view; constrained comparison images and corrected model, heading and note contrast. Existing catalogue and picker changes continue to label unverified rates/terms for KHIND confirmation and omit the unconfirmed RM1 fee.
- **Automated checks:** all 10 Node test files passed, including new compare-view and continue assertions; syntax checks passed for 21 JS/CJS files; `git diff --check` passed.
- **Local browser checks:** 12 primary routes and all 23 product detail routes loaded titles/headings with no console errors. All 33 product/detail images across the 23 routes loaded with non-zero natural dimensions. The picker exposed 23 unique offers (13 individual models and COMBO-1 through COMBO-10). Tested language switching with saved state and an open Details sheet, comparison entry/continue, three-save cap/removal, search empty-state recovery, RM80 budget filter (3 results), and combo category filter (10 results). A deliberate local broken-image probe produced the branded `role=img` fallback with the original alt text and a recovery hint; the probe file was removed.
- **Responsive:** home, catalogue, RF480, picker and combos checked at 1440, 1024, 768, 390 and 360 CSS px (25 route/width states), no document overflow. The actual comparison view was checked at all five widths; both images fit their frames and the page did not overflow. RF480 official link default color and keyboard focus outline (3px) were verified. Hover styling is present in CSS; pointer-hover state was not simulated.
- **Public site, read-only:** all 12 primary routes and all 23 product routes loaded headings; all 33 public product/detail images had non-zero natural dimensions. Public RF480 remains stale: Basic is selected while Premium benefits are displayed, and its estimated total is RM4,276 including the unsupported RM1 fee. The page still loads `storefront.js?v=1`. No production fix is present yet.
- **Evidence:** browser captures were taken for homepage, catalogue, RF480 detail, picker, comparison and a 360px comparison. They were displayed in the review but not exported as workspace image files.
- **Still open:** production release approval, exact deployed commit/Actions reference, KHIND/owner confirmation for unverified rates, promotion eligibility, terms, fees, benefits, cash prices and stock; runtime hover and reduced-motion were not re-run in this pass. Therefore the deployed-site definition of done is not met.
### 2026-10-22 — Catalogue-data and screenshot audit

- Audited all 23 offers and 28 plan options. The prior local browser pass checked every plan option's displayed regular/promo rate, estimated total, benefits, WhatsApp prefill, and stock text against its local catalogue record.
- Data still requiring KHIND/owner confirmation: four individual offers without a dated official rate reference (RF480 and ACSON-1.0/1.5/2.0); all 10 combos lack official reference URLs and dated verification; current campaign eligibility/amounts/expiry, plan-specific benefits, cash-price references, fees, and current stock remain time-sensitive or unverified. The customer UI labels undated rates and estimates for confirmation; no unconfirmed fee is added.
- SI6029BP's stock note records WM ETA 21 Oct and KK/KU ETA Dec without a year. Those dates may be stale; current availability and ETA need confirmation.
- Exported .impeccable/review/goal-2026-10-22-{home-desktop,catalogue-desktop,rf480-desktop,picker-desktop,comparison-desktop,comparison-mobile-360}.png. Headless capture could not fetch remote CDN images, so the files show the intentional fallback and support layout/fallback review only. The local in-app browser separately loaded both COMBO-10 component images; prior live-browser checks found all 33 public product/detail images with non-zero dimensions.
- Regression checks had stale assertions for the current swipe-shop.css?v=7 key and for comparison view versus shortlist. Updated those assertions; current Node suite passes 10/10 files.
- Production remains unchanged. Exact deployment reference, release approval, owner/KHIND confirmations, and runtime hover/reduced-motion checks remain open. Goal remains active.
- Follow-up fix: clarified SI6029BP's undated ETA as a possibly changed historical note and instructs customers to confirm current stock/dates. Bumped the catalogue data cache key across 28 HTML routes; the local browser displayed the revised warning after reload.

- After the catalogue data cache-key bump, all 23 local product routes loaded a product heading, matching model ID, and estimate in the in-app browser.

## 2026-10-22 - Local combo reference links

- Added official component product reference links on all ten combo detail pages, sourced from the corresponding component records in catalogue.js.
- Verified 17 distinct component links and the combo pricing/terms confirmation caveat across all ten local pages; COMBO-10 rendered with both links in the local browser. The existing Node suite passed 10/10 files and git diff --check passed.
- No deployment or push. Production approval remains closed. Full goal remains active: commercial confirmation, runtime hover/reduced-motion checks, and deployed acceptance criteria remain open.

## 2026-10-22 - Combo link accessibility and live status

- Corrected the new local combo-link contrast and focus styling; COMBO-10 local browser check shows dark underlined labels and a visible keyboard focus ring. folio-19 cache key is applied to 35 HTML pages.
- Rechecked public COMBO-10 read-only: component references are absent and its estimate includes an unconfirmed RM1 processing fee (RM9,031). Local estimate omits the unconfirmed fee (RM9,030). Production remains unchanged.
- Goal remains active. KHIND confirmation, live acceptance checks, runtime hover and reduced-motion checks, and explicit release approval are still open.

## 2026-10-22 - Combo responsive and live evidence

- Local COMBO-1 through COMBO-10 passed the 50-state responsive check at 1440/1024/768/390/360 px: no horizontal overflow, headings and reference links present, link targets visible, and supporting text at least 12 px. Temporary viewport override was reset.
- Local and public COMBO-10 loaded both appliance images (3059x4096 and 2238x4096) with no browser console errors. Public still has no component-reference links and displays RM9,031 including an unconfirmed RM1 fee; local shows 2 links and RM9,030.
- No deployment or push. The goal remains active pending KHIND/owner confirmation, runtime hover/reduced-motion verification, and deployed acceptance.

## 2026-10-22 - RF480 promotion and plan estimate correction (local)

- The official KHIND ChillMaster Lite page checked on 2026-10-22 lists Basic RM75/month and Premium RM95/month for 60 months, a 50% pre-order promotion for the first 3 months, and RM4,200 outright. It labels the product pre-order but states no offer expiry or supply date. The local catalogue now records the source-check date, 3-month term, 50% reduction, RM4,200 cash reference, and pre-order notice; the unsupported RM3,200 cash-promotion reference was removed.
- Product page, shared plan calculator, catalogue card, and guided picker now separate regular rates from the dated promotion scenario. The picker shows the scenario in Malay and English in the card, plan details, saved picks, and comparison. Eligibility, fees, stock timing, and offer expiry remain subject to confirmation.
- Local browser verified Basic RM37.50 for 3 months then RM75 for 57 months (RM4,387.50 estimate), and Premium RM47.50 then RM95 (RM5,557.50). Premium selection updated the WhatsApp draft; no message was sent. Browser console error list was empty.
- Validation: all 10 Node test files pass, including RF480 picker price assertions; syntax checks pass for script.js, storefront.js, and swipe-shop.js; git diff --check passes. Production was not changed. The earlier note that RF480 lacked a dated rate check is superseded locally, but KHIND must still confirm current campaign eligibility, expiry, pre-order supply date, benefits, fees, and final terms.
- Release gate remains closed. Deployed acceptance still fails on public combo-reference links, unconfirmed RM1 fees, and the deployed RF480 plan-benefit mismatch; no push, deployment, WhatsApp message, or application submission occurred.

## 2026-10-22 - Deployed keyboard and language recheck

- Re-ran the local Node suite: 10 test files passed, 0 failed. `node --check` passed for `script.js`, `storefront.js`, and `swipe-shop.js`; `git diff --check` passed.
- Read-only deployed `/pilih-c/` keyboard check: selected the first budget band, ArrowLeft skipped SI6029BP, Undo restored it, and keyboard activation opened Details. Escape closed the details sheet. Switching to English inside the sheet preserved the current product and open sheet, but the product name, description, benefits, and stock notice remained Malay. The deployed picker still reports 13 products, not the required 23.
- Read-only deployed RF480 check: Basic and Premium selections update the visible monthly amount, estimate, and WhatsApp draft to the selected regular rate and term. With Basic selected, the benefit section still lists Premium-only services. Public page shows a six-month promotion and RM4,276 estimate; the locally verified KHIND page records a three-month 50% pre-order scenario, RM4,387.50 for Basic, and requires confirmation of rounding, expiry, eligibility, fees, and supply date. No WhatsApp message was sent.
- Read-only deployed RF480 source-link styling remains white text on a transparent background over cream (computed text `rgb(255,255,255)`, body `rgb(244,240,228)`). The local source computes dark green text on cream; keyboard Tab focus on the local official link showed its 3px green outline. Deployed RF480 image loaded at 3335×5000; its tab had no console warnings or errors.
- Captured live homepage, catalogue, picker, and RF480 product screenshots during review. Existing local combo pages now show official component references and a caveat that those links do not confirm the combo terms; the deployed COMBO-10 still lacks those references.
- No production changes, push, WhatsApp message, or application submission. Release gate remains closed. Reduced-motion styles exist in local CSS, but runtime emulation is unavailable in the browser capability set; live hover/focus styling and deployed acceptance remain open. Goal remains active.

Last updated: 2026-10-22

## Latest goal checkpoint — 2026-10-22

- Re-ran the existing Node suite from the project root: 10 test files passed, 0 failed. `node --check` passed for `script.js`, `storefront.js`, and `swipe-shop.js`; `git diff --check` passed. This verifies the current local source and deterministic interaction tests, not deployed acceptance.
- Read-only deployed RF480 check: the public page still labels the promotion as 6 months, displays RM4,276 and an RM1 fee, and its plan-benefit copy includes Premium-only services while the enquiry prefill identifies Basic. This remains inconsistent with the local dated three-month promotion scenario and plan-specific benefits.
- Read-only deployed COMBO-10 check: public estimate remains RM9,031 with RM1 fee; component reference links for WM150A and RFS600A are absent. Both appliance images loaded in the browser accessibility tree.
- Read-only deployed `/pilih/` check: the live accessibility tree reports `0 / 13` products viewed on its initial card, while the current local catalogue and regression test contain 23 offers. This fails the all-23-offers picker requirement on the deployed version.
- Read-only deployed `/catalogue/` check: the page reports 23 choices and exposes links for all ten combo cards. Direct `?category=bundle` navigation reports 10 results. The catalogue still advertises a six-month promotion through 31 December 2026 for eligible products; this general campaign copy does not resolve model-specific eligibility or the RF480 mismatch.
- Read-only deployed WM1248 detail check: the page loads with a descriptive image label and shows a 48-month term, RM3,826 estimate, and a warning that its term differs from public KHIND information. This is an explicit unresolved commercial-data risk, not a passed price check.
- Read-only deployed FAQ check: question controls appear as collapsed buttons in the accessibility tree. Their activation was not tested in this browser pass.
- Verified production reference: GitHub Pages deployment run [#40](https://github.com/Akkie1104/khind-rto/actions/runs/39405599024) completed successfully for commit `c94cd93ee607bde3be8182d9371d17a729b21c6d`; storefront validation run [#60](https://github.com/Akkie1104/khind-rto/actions/runs/39405599587) also completed successfully on that commit. These runs deploy the current public version, not the local corrective work. GitHub reported a non-blocking Node.js 20 deprecation warning for an action.
- No WhatsApp link was opened, no message was sent, and no application submitted. No production change or push. Release approval remains closed; deployed acceptance is not passed.
- Browser-level hover and reduced-motion emulation, commercial-term confirmations, deployed route/interaction checks, and deployment reference remain outstanding. Keep the goal active.
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

## 2026-10-22 - Local combo card and comparison checkpoint

- The local picker still exposes 23 offers. COMBO-1 shows both component images side by side, a 48-month RM150/month rate marked for KHIND confirmation, and a RM7,200 regular-rate estimate before promotion.
- Fixed the narrow-card crowding by stacking the estimate and Details control at widths up to 430 CSS px. Bumped the shared chooser stylesheet reference to `swipe-shop.css?v=10`; the script reference is `swipe-shop.js?v=20261022-5`.
- In the exact-width local iframe fixture, COMBO-1 was checked at 320, 360, 390, and 430 CSS px. Each page's scroll width matched its viewport; each card's scroll width matched its client width; both component images loaded with descriptive alt text; the estimate ended above the Details control with no overlap. Earlier combo checks at 1440, 1024, 768, 390, and 360 remain applicable because this change only targets widths up to 430.
- Local comparison for COMBO-1 and DHP90 displayed the same selected rates, terms, and estimates as their cards. The WhatsApp prefill opened in an unsent browser tab and contained only those product names plus a request to confirm terms; no message was sent.
- All 10 existing Node test files passed after updating stale cache-version expectations. `node --check` passed for `script.js`, `storefront.js`, and `swipe-shop.js`; `git diff --check` passed.
- Production remains unchanged. Deployed picker coverage, RF480 commercial/benefit mismatch, live official-link contrast, missing combo component links, privacy copy, and deployed visual/accessibility checks remain open. No push, deployment, WhatsApp message, or application submission was made; the release gate and goal remain active.

## 2026-10-22 - Fresh deployed acceptance checkpoint

- Read-only sweep of all 23 live product routes: every route rendered a heading, a price panel, loaded product image(s) with nonempty alt text, and no page-level horizontal overflow at the browser's current viewport. All 13 individual-product pages had a `Foto & spesifikasi rasmi` link. All 10 combo pages still lacked component-reference links.
- Live `/pilih-c/` after choosing the RM115-RM135 band still reported only 13 offers. Switching to English translated controls and labels but left the active model name and specifications in Malay.
- Live RF480 remains inconsistent: Basic is selected, but its benefit section includes Premium-only services. The page shows a six-month promotion, RM4,276 Basic estimate and RM1 fee; the Premium selection produces RM5,416. The local source's dated KHIND reference is a three-month pre-order scenario; eligibility, expiry, supply date, fee treatment, benefits, and billed rounding still need confirmation.
- All live individual product-reference links use white text on a transparent background over cream. Keyboard focus on the RF480 link showed a 3px solid green outline, but the unfocused text remains low contrast. Hover behavior was not verified with the available browser controls.
- Live COMBO-10 still shows RM9,031 including an unconfirmed RM1 fee and no WM150A/RFS600A component links. Live `/mohon/` still asks for location and monthly budget and places those fields in the WhatsApp draft.
- Live catalogue checks: 23 base offers, 10 combo results from the category filter, and 3 results under the RM80 monthly-rate cap. A no-match search displayed `0 pilihan sepadan` without an empty-state explanation or clear-filters action. Catalogue-to-WM1248 navigation and the breadcrumb return both worked. The first FAQ disclosure expanded successfully.
- The local catalogue counterpart passed the same no-results case with both search and the RM80 filter active: it showed an empty-state explanation and one `Kosongkan carian dan penapis` action, which restored all 23 offers and cleared both controls.
- A browser-policy check blocked a `data:` URL fixture for loading the deployed picker at 360/390px because only HTTP and HTTPS URLs are allowed. No workaround was attempted; deployed mobile-width visual acceptance remains unverified in this browser session.
- Deployed acceptance remains incomplete: hover, reduced-motion runtime, required live viewport matrix, and screenshots for all required page types are not verified. The live deployment reference was not established during this checkpoint. No production change, push, WhatsApp message, or application submission was made; release gate and goal remain active.
