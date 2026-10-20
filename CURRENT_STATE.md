# KHIND RTO deployment state

Last updated: 2026-10-20  
Last verified: 2026-10-20  
Overall status: Published and verified on the customer domain.

- Production: `https://khindrto.akizen.my/` via GitHub Pages from `Akkie1104/khind-rto`, branch `main`, repository root; deployed commit `a2cdc6d0d4e6928e506ae4b45fd149a4ecbec747`.
- Staging: None identified; current review scope is production-only after deployment.
- Source repository/location: `projects/khind-rto`, remote `https://github.com/Akkie1104/khind-rto.git`.
- Base source commit: `d948a062a730309fceb7e9550565f3d8f7da5c90` (matched GitHub `main` before this change).
- Change: narrow-screen catalogue navigation fix and `khind-folio.css` cache-key update to `folio-9` across 35 HTML pages.
- Validation: existing Node suite 10/10 passed; `git diff --check` passed; 38 local routes and the `folio-9` stylesheet returned HTTP 200; local viewport fixture inspected at 320, 360, 390 and 430 CSS pixels. The public catalogue loaded from the customer domain with `folio-9`; MobileViewer rendered it at 360, 390, 430 and 450 CSS pixels.
- Rollback position: prior `main` commit above; revert the deployment commit if needed.
- Risks/unknowns: MobileViewer is an external preview, not a physical-device or accessibility certification. Confirm product rates, promotion eligibility, plan terms, benefits, stock and regional availability with KHIND before promotion.
- Commercial copy: no offer or pricing copy changed in this deployment.

## Deployment follow-up — 2026-10-20

- **VERIFIED deployed:** GitHub Pages `main` at `42193868e2157fe919b2fdd8dfda004c3e04f95e`. The shared folio stylesheet uses muted ink for the logo tagline and chooser disclosure; 35 pages now reference `folio-11`.
- **Validation:** existing Node regression suite and JavaScript syntax checks pass; `git diff --check` passes. GitHub Actions storefront run #45 and Pages deployment run #25 completed successfully. Public homepage and category-first chooser load on `https://khindrto.akizen.my/`; local keyboard review confirmed language switching and FAQ accordion operation.
- **Workflow maintenance:** updated the folio design assertion in `.github/workflows/verify.yml` to accept the current cache-key version instead of requiring the obsolete `folio-6`.
- **Rollback position:** prior deployed source commit `5f757a6533458c5efed3d550330f37ee19dc4b3f`; revert the release commit if needed.
- **Evidence limits/open work:** refresh the stale 320px catalogue screenshot and continue full-route keyboard/reduced-motion review. MobileViewer and browser emulation are not physical-device or accessibility certification.
- **Still unresolved:** KHIND must confirm the WM1248 promotion/plan discrepancy and all time-sensitive price, eligibility, benefits, plan-term, and stock claims before promotion.
