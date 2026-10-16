/* QA console only — never transmits or stores visitor events. */
(function () {
  "use strict";
  const core = window.KHIND_TELEMETRY;
  const $ = id => document.getElementById(id);
  const records = [];
  $("collector-status").textContent = core.enabled ?
    "Collector configuration is enabled on this build. The console itself never transmits." :
    "Collector disabled: events are validated locally and are not sent to any server.";
  function showEvent(event, label) {
    const result = core.validate(event);
    records.unshift({ event, result, label });
    if (records.length > 100) records.pop();
    $("live-count").textContent = records.length + " event(s) shown";
    const list = $("events");
    list.replaceChildren();
    for (const record of records) {
      const box = document.createElement("article");
      box.className = "event";
      const title = document.createElement("strong");
      title.className = record.result.valid ? "ok" : "bad";
      title.textContent = (record.result.valid ? "PASS " : "FAIL ") + (record.event?.event_name || "unknown");
      const detail = document.createElement("span");
      detail.textContent = record.label + " — " +
        (record.result.valid ? "schema accepted" : record.result.errors.join("; "));
      const text = document.createElement("pre");
      text.textContent = JSON.stringify(record.event, null, 2);
      box.append(title, detail, text);
      list.append(box);
    }
  }
  try {
    if (window.BroadcastChannel) {
      const channel = new BroadcastChannel("khind-swipes-qa-v1");
      channel.addEventListener("message", message => {
        if (message.data?.kind === "event") showEvent(message.data.event, "Live");
      });
    }
  } catch (_) { $("collector-status").textContent += " BroadcastChannel unavailable."; }
  $("clear-events").addEventListener("click", () => {
    records.length = 0;
    $("events").replaceChildren();
    $("live-count").textContent = "0 events";
  });
  $("sample-events").addEventListener("click", () => {
    for (const name of core.EVENTS) {
      const example = core.sample(name);
      if (example) showEvent(example, "Fixture");
    }
  });
  $("insert-sample").addEventListener("click", () => {
    $("payload-editor").value = JSON.stringify(core.sample("card_save_button"), null, 2);
  });
  $("insert-invalid").addEventListener("click", () => {
    $("payload-editor").value = JSON.stringify({
      ...core.sample("guide_open"), phone: "[BLOCKED FIELD]"
    }, null, 2);
  });
  $("validate-payload").addEventListener("click", () => {
    let input;
    try { input = JSON.parse($("payload-editor").value); }
    catch (_) { $("validation-result").textContent = "FAIL — Invalid JSON"; return; }
    const result = core.validate(input);
    $("validation-result").textContent = (result.valid ? "PASS" : "FAIL") + "\n" +
      (result.valid ? "Allowed schema; no unknown fields" : result.errors.join("\n"));
  });
})();