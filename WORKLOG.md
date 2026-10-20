# KHIND RTO worklog

## 2026-10-20 â€” Mobile catalogue navigation and asset refresh

- System/environment: KHIND RTO static storefront; GitHub Pages production target, no staging identified.
- Type: deployment.
- Performed by: Codex, with user approval to push to GitHub Pages.
- Change: improve the catalogue header navigation at 320 CSS pixels and provide mobile link hit areas; bump the shared folio stylesheet cache key to `folio-9` on all 35 referencing pages.
- Evidence/source: `Akkie1104/khind-rto`, deployed commit [`a2cdc6d0d4e6928e506ae4b45fd149a4ecbec747`](https://github.com/Akkie1104/khind-rto/commit/a2cdc6d0d4e6928e506ae4b45fd149a4ecbec747), based on `d948a062a730309fceb7e9550565f3d8f7da5c90`.
- Validation/environment: existing Node suite passed 10/10; `git diff --check` passed; 38 local routes and the `folio-9` stylesheet returned HTTP 200; local viewport fixture inspected at 320, 360, 390 and 430 CSS pixels.
- Production drift: no source-commit drift found before push; GitHub `main` matched the local base before deployment.
- Result: pushed to `main`; public catalogue served the updated `folio-9` stylesheet after cache-busted reload. MobileViewer rendered the catalogue at 360, 390, 430 and 450 CSS pixels. No pricing or commercial terms were changed.
- Follow-up: confirm product rates, promotion eligibility, plan terms, benefits, stock and regional availability with KHIND before promotion.

## 2026-10-20 â€” Local responsive contrast review

- System/environment: KHIND RTO storefront, local `projects/khind-rto` checkout; production remains GitHub Pages at `a2cdc6d0d4e6928e506ae4b45fd149a4ecbec747`.
- Type: local QA and uncommitted UI correction; no deployment performed.
- Finding: the shared header tagline retained the legacy `#f7ce2d` color on a warm-paper background. Changed it to the approved folio muted-ink token in `khind-folio.css` and advanced its stylesheet query key from `folio-9` to `folio-10` across 35 referencing pages.
- Validation: rendered WM1248 detail in the local exact-width fixture at 320, 360, 390 and 430 CSS pixels; visually confirmed the corrected tagline at 320, 360 and desktop width. Existing Node suite passed 10/10; `git diff --check` passed.
- Evidence limit: saved screenshots exist in the task visualization folder, but the 320px catalogue capture predates the deployed narrow-navigation reflow and needs refreshing. Emulated widths and MobileViewer are not physical-device or accessibility certification.
- Open work: complete the remaining page-by-page visual/keyboard review and refresh the catalogue screenshot. Keep current commercial claims flagged for KHIND confirmation; no product data or copy was changed.

## 2026-10-20 â€” Publish folio contrast fixes

- System/environment: KHIND RTO GitHub Pages production, `Akkie1104/khind-rto` `main`; no staging environment identified.
- Type: production deployment, explicitly approved by Akizen in this task.
- Change: set the shared logo tagline and chooser disclosure to the approved folio muted-ink color; advance all 35 folio stylesheet references to `folio-11`. Updated the workflow assertion to accept versioned folio cache keys.
- Commit: `42193868e2157fe919b2fdd8dfda004c3e04f95e`, based on deployed `5f757a6533458c5efed3d550330f37ee19dc4b3f`.
- Validation: existing Node regression suite, JavaScript syntax checks, and `git diff --check` passed. Storefront workflow run #45 and Pages deployment run #25 completed successfully. Public homepage and chooser loaded after the push.
- Rollback: revert `42193868e2157fe919b2fdd8dfda004c3e04f95e` to return to the prior deployed commit.
- Follow-up: refresh the stale 320px catalogue screenshot; continue route-by-route keyboard and runtime reduced-motion checks. Product rates, WM1248 promotion discrepancy, eligibility, plan terms, benefits, availability, and stock remain subject to KHIND confirmation.

### 2026-10-20 â€” Continued responsive and interaction review
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

### 2026-10-20 â€” Local FAQ contrast correction
- Rechecked the live FAQ and measured the expanded answer at 1.29:1 against the folio paper background. The legacy FAQ selector had higher specificity than the folio override.
- Corrected the local selector and advanced the shared folio stylesheet cache key to `folio-12` in 35 HTML pages. The local rendered answer now measures 7.20:1; keyboard Enter opens/closes the disclosure and focus remains visible.
- Existing suite: 10/10 passed. JavaScript syntax and `git diff --check` passed. Kept the change local; no push or deployment.
- Fresh live interaction checks returned one WM1248 search result and three items for the RM80 regular-rate budget filter. The local exact-width fixture rechecked chooser and WM1248 detail at 320, 360, 390, and 430 CSS px without horizontal page overflow.
- Remaining: full route keyboard/visual review, runtime reduced-motion emulation, saved WM1248 screenshot, and KHIND confirmation of time-sensitive commercial details.

## 2026-10-20 â€” FAQ contrast release

- System/environment: KHIND RTO GitHub Pages production, `Akkie1104/khind-rto` `main`; no staging identified.
- Type: production deployment, explicitly approved by Akizen in this task.
- Change: raised the FAQ answer selector specificity to override the legacy rule and advanced all 35 folio stylesheet references to `folio-12`. No commercial copy or product data changed.
- Source/release: base commit `2bf1d0ae2a8745d3fa05e8bf304deebf99956acf`; published commit `f7f28cca68685019456a0bda150b1d80f7429bcd`.
- Deployment checks: GitHub Actions storefront validation run #48 and Pages deployment run #28 completed successfully.
- Validation: existing Node suite passed 10/10; JavaScript syntax checks and `git diff --check` passed. Public FAQ loaded the new content; Enter expanded the answer and keyboard focus remained visible. Local route viewport review covered 320/360/390/430 CSS px. Promotions' initial 320px warning was a false positive from comparing `scrollWidth` against `clientWidth` with a 15px vertical scrollbar.
- Rollback: revert `f7f28cca68685019456a0bda150b1d80f7429bcd` to restore the prior deployment.
- Evidence limits/open work: MobileViewer daily preview quota prevented a fresh post-release preview; runtime reduced-motion emulation, broader route-by-route keyboard checks, saved WM1248 detail capture and KHIND confirmation of time-sensitive commercial claims remain open. GitHub status checks were unavailable through the connector at verification time.

## 2026-10-20 â€” Local route, responsive, and interaction review

- **Environment:** local preview at `http://127.0.0.1:8766/`; GitHub Pages production was inspected read-only. No site-source changes were made; review notes were updated locally. Nothing was deployed or published.
- **Live route evidence:** from the live catalogue inventory, all 23 product detail URLs loaded a title and primary heading. Home, catalogue, combos, promotions, RTO guide, FAQ, enquiry, privacy, and the three chooser routes also loaded their primary heading.
- **Responsive evidence:** local viewport fixture loaded all 11 main routes (including `/pilih/`, `/pilih-b/`, and `/pilih-c/`) and all 23 product detail routes at 320, 360, 390, and 430 CSS px. No document-level horizontal overflow was reported. Promotions reached exactly 320 px scroll width in the 320 px frame, equal to its viewport.
- **Interaction evidence:** catalogue search for WM1248 returned one result; the regular monthly-rate filter at RM80 returned three. FAQ toggled with Enter. Category-first chooser selection opened the product deck and details; Escape closed details. Swipe chooser Right Arrow saved and advanced, and Undo restored WM1248 with zero saved items.
- **Budget-band keyboard check:** Enter on the first band opened a 13-product deck; the initial SI6029BP card showed RM75/month for 24 months and a stock note.
- **Checks:** `node --test --test-reporter=dot tests/*.test.cjs` passed (10 dots); `node --check script.js`; `node --check swipe-shop.js`; `git diff --check`.
- **Reduced motion:** implementation rules are present in `retail-2026.css`, `swipe-shop.css`, and `swipe-shop.js`. Browser emulation was unavailable in the current session.
- **Visual review:** inspected the local desktop homepage, FAQ layout, and WM1248 detail at narrow widths. The browser screenshots were not exported to files; saving representative screenshots remains open.
- **Owner review:** all four folio design choices are approved. KHIND still needs to confirm volatile product rates, campaign eligibility, plan terms/benefits, and stock. No message or enquiry was sent.

## 2026-10-20 â€” Follow-up keyboard review

- Reviewed the local WM1248 detail page and `/pilih/` chooser in the browser. The brand link, â€œUtama,â€ chooser card, and â€œLihat butiranâ€ showed visible keyboard focus; Enter opened the details sheet.
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

## 2026-10-20 - Homepage FAQ and footer alignment

- Reproduced the user screenshot on the public homepage at desktop width. The FAQ block was centered within the page while the contact band began at the content rail, creating mismatched edges and a wide right-side paper gap.
- Aligned the FAQ section with the existing contact/footer content edge in khind-folio.css. Preserved FAQ copy, links, visual treatment, and controls. Bumped the folio stylesheet cache key on all 36 HTML routes so the updated stylesheet is served.
- Local browser preview confirmed the FAQ and contact band now share matching left and right edges. Existing suite: 10/10; JavaScript syntax checks passed. Exact-width mobile re-capture remains limited by the available browser viewport.
- User authorized a GitHub Pages push. Prepared the change on top of current remote main (`a1b89d4`) in an isolated worktree; original divergent checkout and all its uncommitted work remain untouched.

