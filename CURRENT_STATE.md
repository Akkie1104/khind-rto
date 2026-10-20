# KHIND RTO deployment state

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
