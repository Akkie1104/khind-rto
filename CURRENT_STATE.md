## Homepage edge alignment — 2026-10-20

- **VERIFIED published:** GitHub Pages `main` code commit [`d82e4425a2c38e656281e23f151b243c23411e9f`](https://github.com/Akkie1104/khind-rto/commit/d82e4425a2c38e656281e23f151b243c23411e9f); the custom-domain homepage loaded after deployment. The Pages deployment run #37 and storefront validation run #57 both succeeded.
- **Change:** the homepage FAQ now uses the full content width so its right edge aligns with the contact band and footer. The homepage Folio stylesheet reference is cache-busted at `folio-15`. No product, price, promotion, or customer-facing copy changed.
- **Responsive evidence:** the browser preview checked 320, 360, 390, 430, and 1532 CSS px. FAQ, contact band, and footer right edges matched at every width, and horizontal overflow was false.
- **Rollback position:** previous `main` commit [`1cca9e8e62cebe908ab52f56a94f985d4bfd1281`](https://github.com/Akkie1104/khind-rto/commit/1cca9e8e62cebe908ab52f56a94f985d4bfd1281).
- **Scope:** no staging environment was identified. This release includes only `khind-folio.css` and homepage `index.html`; unrelated local working-tree changes were not included.

# KHIND RTO deployment state

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
Overall status: Published on the customer domain; responsive and accessibility review continues.

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
