# Stabilize the About page responsive card sections

## Goal
Fix the responsive reflow shown in the screenshot without changing the content or visual design.

## Changes
- Replace fixed section/card dimensions with fluid widths, automatic heights, and bounded minimum heights.
- Keep the ownership paths in a centered three-column grid on desktop.
- Switch the ownership paths to two columns at tablet widths, with the featured card spanning the available row without overlap.
- Switch to full-width single-column cards on mobile.
- Apply the same safe breakpoint logic to the adjacent “How it works” section so its label and text cannot clip.
- Remove content-clipping overflow rules and layout transitions while retaining small interactive hover movement.

## Validation
- Continuously resize through desktop, tablet, and mobile ranges.
- Capture and inspect screenshots at 1440, 1200, 1024, 900, 768, and 390 pixels.
- Confirm no body overflow, clipped content, overlapping cards, unstable spacing, or console errors.
