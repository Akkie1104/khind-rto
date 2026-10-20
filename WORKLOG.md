# KHIND RTO worklog

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
