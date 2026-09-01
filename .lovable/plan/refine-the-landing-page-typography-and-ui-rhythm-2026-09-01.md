# Refine the landing page typography and UI rhythm

## Goal
Bring the existing SQOOT Pure landing page’s typography, hierarchy, and spacing into close alignment with the uploaded reference while preserving its content, section order, imagery, palette, interactions, and overall layout.

## Current findings
- The page already uses Cormorant Garamond for headings and has exactly one `h1`, but the global heading weight is currently 300 rather than the requested restrained 400–500 editorial range.
- Body and interface text currently use DM Sans; the requested system requires Inter for navigation, controls, labels, body copy, pricing, FAQ content, and footer text.
- The desktop hero currently renders at about 66px and the mobile hero at 44px, while the requested reference ranges call for a more deliberate 52–58px desktop and 36–42px mobile composition.
- Eyebrows, navigation, buttons, section headings, fee details, FAQ rows, and footer copy use several unrelated local values, so the hierarchy and spacing need normalization rather than a structural redesign.
- The current page has no horizontal viewport overflow at the audited desktop and mobile widths.

## Changes

### 1. Centralize the typography system
- Load Cormorant Garamond regular, medium, semibold, and italic faces plus Inter 400, 500, and 600 through the existing document-head font loading flow.
- Update the global sans token from DM Sans to Inter and define reusable editorial type utilities/tokens for eyebrows, display headings, section headings, body copy, UI labels, and small metadata.
- Keep heading letter spacing restrained, body line height comfortable, and uppercase label tracking pronounced but controlled.

### 2. Refine the header and hero
- Tune navigation and CTA type to compact Inter sizing and weight consistent with the reference.
- Set the hero eyebrow, headline, italic emphasis, description, CTA, helper note, and `$25` badge to the requested hierarchy.
- Adjust headline width and intentional line breaks only as needed to preserve the reference-like three-line composition across desktop, tablet, and mobile.
- Rebalance eyebrow-to-heading, heading-to-copy, copy-to-CTA, and CTA-to-helper spacing without changing the hero structure or image treatment.

### 3. Normalize section hierarchy
- Apply consistent eyebrow, heading, body, label, and metadata styles across the trust strip, “How it works,” comparison panel, fees, FAQ, early-access CTA, and footer.
- Replace oversized or overly strong local treatments with the reference’s smaller UI text and calm editorial serif hierarchy.
- Keep pricing and numerical information in Inter, with clear scale differences between primary values, units, and explanatory copy.
- Preserve selective gold emphasis and soften secondary copy with the existing muted semantic color.

### 4. Refine spacing and alignment
- Audit and tune section padding, text measure, heading/paragraph gaps, card padding, FAQ row height, navigation spacing, and footer rhythm.
- Keep the existing layout and component boundaries; make only small alignment or width adjustments required for visual fidelity.
- Preserve the established 2px control radius and 8px card radius except where the existing reference-matched composition already intentionally uses another shape.

### 5. Responsive and semantic pass
- Use explicit desktop, tablet, and mobile typography steps rather than proportional scaling.
- Check heading wrapping and text widths at representative wide desktop, tablet, and narrow mobile viewports.
- Retain one primary `h1`, correct heading order, semantic paragraphs and labels, readable contrast, keyboard focus behavior, and current interactive functionality.

## Technical details
- Update `src/routes/__root.tsx` for the exact Google Fonts families and weights.
- Update `src/styles.css` for the centralized Cormorant Garamond + Inter typography tokens and reusable utilities.
- Refine typography and spacing classes in `src/routes/index.tsx` without changing page copy, section order, assets, or behavior.
- Avoid duplicate components and broad one-off CSS overrides; continue using semantic color and radius tokens.

## Validation
- Verify font requests and computed font families/weights in the rendered page.
- Test the header menu, step carousel, FAQ accordion, and early-access form after styling changes.
- Compare desktop, tablet, and mobile screenshots against the reference, focusing on typeface, weight, size, line height, tracking, text measure, line breaks, alignment, and vertical rhythm.
- Run a final build/error check and confirm there is no clipping, overlap, or horizontal overflow.
