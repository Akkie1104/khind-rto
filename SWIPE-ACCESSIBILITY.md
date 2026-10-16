# KHIND RTO swipe card — WCAG 2.2 AA accessibility audit and implementation checklist

**Scope:** Shared card engine (`swipe-shop.js` / `swipe-shop.css`) in the three live entry routes `/pilih/` (direct), `/pilih-b/` (category), and `/pilih-c/` (budget). This is an implementation audit, **not** a certification that the entire website conforms to WCAG 2.2 AA. A screen-reader, browser and zoom audit is still required.

## Implemented and automatically regression-tested

- [x] **2.1.1 Keyboard (A), 2.1.2 No Keyboard Trap (A):** Tab / Shift+Tab reach persistent Skip, Save, Undo, Details, Saved and other actions. On a focused product card, Left Arrow = Skip; Right Arrow = Save. Buttons remain operable using Enter/Space. Native modal `<dialog>` supports keyboard dismissal.
- [x] **2.5.1 Pointer Gestures (A), 2.5.7 Dragging Movements (AA):** Swipe is optional. Every swipe decision has an always-visible, labeled single-pointer button (✕ Langkau / ♥ Simpan); dragging, long-press, multi-touch and accelerometer/motion are never required. Only primary-pointer drag is recognized. Pointer cancellation cannot commit the action.
- [x] **2.5.8 Target Size (Minimum) (AA):** Primary actions exceed 44×44 CSS px; controls, links, native-dialog close buttons, Details, Undo, rescue choices and comparison links use at least 44 px target sizing where practical, with spacing. 44 px is an enhanced design target; WCAG 2.2 AA specifies at least 24×24 px or qualifying separation/exceptions.
- [x] **2.4.7 Focus Visible (AA):** High-contrast 3 px focus outline for links, buttons, focusable card, rescue title and deck-completion heading. Focus can be distinguished without relying on a color fill.
- [x] **2.4.3 Focus Order (A):** The focused card is replaced with an explicitly focused next card after keyboard arrow actions. Two-save prompt focuses its Compare action; background card becomes inert. Undo returns focus to the restored card. Rescue focuses its question; answering returns focus to the card. Completion moves focus to its heading.
- [x] **1.3.1 Info and Relationships (A), 4.1.2 Name/Role/Value (A):** Real buttons with visible text labels, semantic product article, titled native dialogs, meaningful image alt text, progressbar with `aria-valuetext`, and card keyboard help via `aria-describedby`.
- [x] **4.1.3 Status Messages (AA):** Persistent `role="status" aria-live="polite" aria-atomic="true"` announces Skip/Save, saved count, next product name, displayed regular monthly amount, duration and position; Undo, rescue resolution and full-deck completion also announce outcomes.
- [x] **1.4.1 Use of Color (A):** Skip uses an X pictogram **and “Langkau” text**; Save uses a heart pictogram **and “Simpan” text**. Drag overlays also display words; meaning is never conveyed only via red/green.
- [x] **2.3.3 Animation from Interactions (AAA advisory), 2.2.2 Pause/Stop/Hide (A as relevant):** Respect `prefers-reduced-motion:reduce`, disable transforms/transitions, and commit decisions synchronously when reduced motion is on. No auto-moving deck.
- [x] **1.4.10 Reflow (AA) implementation safeguard:** The card allows internal vertical scrolling if its content grows; short-height/high-zoom media query releases the full page to vertical scrolling instead of clipping the card and buttons.
- [x] **2.5.2 Pointer Cancellation (A):** A drag commits only on pointer release after crossing its threshold; moving/canceling before release doesn't select Skip/Save. Equivalent buttons activate on normal click.

## Manual audit still required before making a conformance claim

- [ ] **Keyboard walk-through on a real browser:** Complete all flows without a mouse. Test Tab, Shift+Tab, Left/Right on card, Enter/Space on buttons, Escape in native Details / Saved dialogs, Undo after completing deck, and focus after rescue and Compare.
- [ ] **Screen readers:** NVDA + Chrome/Firefox on Windows, VoiceOver + Safari on iOS, and TalkBack + Chrome on Android. Verify that polite updates are audible once, the product name and rate are understandable, dialog focus is contained/restored, and no hidden card/overlay is announced.
- [ ] **Focus not obscured (2.4.11 AA):** Tab through every action and compare carousel at 320 CSS px and at 200% / 400% browser zoom; focus ring must remain visible, including in the rescue and bottom-sheet dialogs.
- [ ] **Reflow (1.4.10 AA), text resize (1.4.4 AA), text spacing (1.4.12 AA):** Test 320 CSS px, 400% zoom and increased text spacing. Ensure no clipped text, horizontal page scrolling, inaccessible button or blocked input. Horizontal scrolling inside the deliberately scrollable Compare table is permitted when justified and usable.
- [ ] **Contrast (1.4.3 AA / 1.4.11 AA):** Measure actual computed foreground/background colors in all states with a contrast tool: normal text ≥4.5:1, large text ≥3:1, and meaningful UI boundaries/focus indicators ≥3:1; include overlays, disabled states when informational, product-image labels, low-light display settings, and alternative browsers.
- [ ] **Touch and motor accessibility:** Test 320–430 px phones and landscape, iOS Safari / Android Chrome, motor-control/switch input, Voice Control, physical keyboard on phone, scrolling inside card and dialog, and accidental contact during swipes.
- [ ] **Automated browser audit:** Run axe-core / Accessibility Insights or Lighthouse against all three deployed routes; remediate any flagged issues, including elements outside this card.

## Regression automation

CI runs:
```bash
node --check swipe-shop.js
node tests/swipe-shop.test.cjs
node tests/swipe-variant-b.test.cjs
node tests/swipe-variant-c.test.cjs
node tests/swipe-rescue.test.cjs
node tests/swipe-accessibility.test.cjs
```

The tests exercise source-generated cards and browser-like event semantics without a full rendering engine. They **cannot** establish real pixel dimensions, actual rendered contrast, or assistive-technology announcements. Use the manual audit above to close those gaps.
