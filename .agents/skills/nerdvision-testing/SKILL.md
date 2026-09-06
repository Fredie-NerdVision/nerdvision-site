---
name: test-nerdvision-static-site
description: Run browser verification for the NerdVision single-page marketing site.
---

## Setup
- From the repository root, reuse an existing server on port 8080 or run `python3 -m http.server 8080`; no build or package installation is needed.
- Open `http://localhost:8080`. Test desktop around 1366px and mobile around 390px.
- Hard reload after source changes to avoid retaining cached CSS.

## Interaction checks
- Header navigation reaches Refresh, Ownership, Packages, Work and FAQ; mobile hamburger links close the menu.
- Comparison uses an invisible `.compare-range` across the entire frame. Drag with mouse held and capture intermediate positions, not just the released value.
- ACF inputs under `[data-acf-demo]` update the preview; capture `.demo-save` during its 600ms Saving→Saved interval.
- Package CTAs set the contact select. The form's empty `data-endpoint` intentionally uses demo mode: cyan confirmation is not evidence of email delivery.
- For reduced motion, verify `matchMedia('(prefers-reduced-motion: reduce)').matches` after enabling DevTools emulation. Some browser configurations clear drawer emulation when DevTools closes; CDP media emulation is an alternative. Reload after enabling so JavaScript also reads the preference.
- Check both footer Back to top and logo from a scrolled position.

## Devin Secrets Needed
None for local static-site verification.
