# KHIND RTO deployment state

Last updated: 2026-10-20  
Last verified: 2026-10-20  
Overall status: Local source validation passed; GitHub Pages deployment pending.

- Production: `https://khindrto.akizen.my/` via GitHub Pages from `Akkie1104/khind-rto`, branch `main`, repository root.
- Staging: None identified; current review scope is production-only after deployment.
- Source repository/location: `projects/khind-rto`, remote `https://github.com/Akkie1104/khind-rto.git`.
- Base source commit: `d948a062a730309fceb7e9550565f3d8f7da5c90` (matched GitHub `main` before this change).
- Pending deployment: narrow-screen catalogue navigation fix and `khind-folio.css` cache-key update to `folio-9` across 35 HTML pages.
- Validation: existing Node suite 10/10 passed; `git diff --check` passed; 38 local routes and the `folio-9` stylesheet returned HTTP 200; local viewport fixture inspected at 320, 360, 390 and 430 CSS pixels.
- Rollback position: prior `main` commit above; revert the deployment commit if needed.
- Risks/unknowns: GitHub Pages completion and public production rendering remain unverified until after push. Confirm product rates, promotion eligibility, plan terms, benefits, stock and regional availability with KHIND before promotion.
- Commercial copy: no offer or pricing copy changed in this deployment.
