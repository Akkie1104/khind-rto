/* Stable assignment only happens through this explicit experiment entry. */
(function () {
  "use strict";
  const target = window.KHIND_TELEMETRY?.enterExperiment?.();
  if (!target) {
    const status = document.getElementById("experiment-status");
    if (status) status.textContent = "Could not establish a stable anonymous assignment. Choose the standard guide below.";
    return;
  }
  // Preserve QA flag, but never forward arbitrary query strings.
  const debug = /(?:\?|&)debug=1(?:&|$)/.test(location.search);
  location.replace(".." + target + (debug ? "?debug=1" : ""));
})();