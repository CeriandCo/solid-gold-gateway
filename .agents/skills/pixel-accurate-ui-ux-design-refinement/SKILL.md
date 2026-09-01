---
name: Pixel-Accurate UI/UX Design Refinement
description: Rebuilds or refines an existing interface to closely match an attached PNG while preserving the project architecture, design system, accessibility, interactions, and responsive behavior.
---

# Pixel-Accurate UI/UX Design Refinement

Use this skill when a user attaches a PNG design and asks to reproduce, rebuild, improve, refine, or align an existing interface with it.

## Core directive

Treat the attached PNG as the single source of truth for visual design. Reproduce it with high visual accuracy rather than redesigning or reinterpreting it. Preserve its hierarchy, palette, visual tone, proportions, and responsive intent. Do not add unrelated sections, decorative elements, or generic AI styling.

## Required workflow

### 1. Inspect the project

Before editing:

- Inspect the project structure and identify the relevant page, shared layout, global styles, design tokens, reusable components, and assets.
- Read every file that may need modification before changing it.
- Reuse existing components, assets, utilities, styles, and the installed component library whenever possible.
- Identify existing interaction and responsive patterns so the implementation remains consistent with the codebase.
- Limit the change set to files necessary for the requested visual match.

### 2. Analyze the PNG

Study the reference carefully and document an implementation plan that covers:

- Page structure and section order
- Container widths and content proportions
- Spacing, padding, margins, gaps, and alignment
- Typography: no more than two font families, including sizes, weights, line heights, and emphasis
- Exact palette, borders, shadows, radii, and surface treatments
- Icon style, size, stroke weight, and alignment
- Image selection, crop, aspect ratio, focal point, and responsive positioning
- Desktop, tablet, and mobile layout behavior
- Interactive components and all required states

Use visible evidence from the PNG. Do not invent details when the reference already establishes them.

### 3. Establish reusable tokens

- Use the project's existing design tokens first.
- Add or refine semantic tokens only when required to represent the reference accurately.
- Define reusable tokens for colors, typography, spacing, radii, and shadows.
- Do not scatter one-off visual values throughout page components.
- Use a maximum of two font families.
- Preserve existing light/dark theme behavior unless the reference or request explicitly changes it.

### 4. Implement faithfully

- Use semantic HTML and accessible UI patterns.
- Use mobile-first responsive styling.
- Prefer Flexbox for most layout structures; use CSS Grid when a true two-dimensional layout requires it.
- Match layout, proportions, spacing, alignment, typography, colors, borders, shadows, radii, icons, imagery, and responsive behavior as closely as possible.
- Preserve the original design hierarchy.
- Avoid oversized typography, excessive gradients, random rounded cards, unnecessary decoration, and unrequested content.
- Prevent horizontal overflow, clipping, overlap, broken wrapping, and layout shifts at every breakpoint.
- Keep fixed-format controls and media dimensionally stable with explicit aspect ratios, min/max constraints, or grid tracks.
- Use the project's existing design-system controls instead of duplicating buttons, inputs, accordions, menus, or other primitives.
- Never use emojis as icons. Keep icon sizing and stroke treatment consistent with the reference.
- Give meaningful images accurate alt text and decorative images empty alt text.

### 5. Make interactions complete

Ensure all visible interactions work, including:

- Buttons and links
- Forms and validation
- Accordions
- Navigation menus
- Carousels
- Hover, active, disabled, loading, success, and error states where applicable

Accessibility requirements:

- Full keyboard navigation
- Visible focus states
- Correct semantic controls
- Proper form labels and error associations
- Appropriate ARIA labels and expanded/current state attributes
- Sufficient color contrast
- Reduced-motion support for nonessential animation

Do not add states or workflows that are not relevant to the visible interface, but fully implement the states implied by the design and existing product behavior.

### 6. Verify and refine

Do not stop when the page merely compiles or functions.

- Test all relevant interactive elements.
- Inspect the final page visually at representative desktop and mobile widths; include tablet when the composition changes materially.
- Compare the rendered result directly with the attached PNG.
- Check section heights, container edges, image crops, baselines, line breaks, spacing rhythm, font metrics, borders, radii, and icon scale.
- Check for horizontal overflow, overlap, clipping, broken images, poor contrast, and inconsistent spacing.
- Make refinement passes until the implementation is polished and visually faithful.
- Confirm the current build has no errors before completion.

## Quality bar

A successful result should feel like the same design rendered responsively, not a loose interpretation. Functional correctness is necessary but insufficient: visual fidelity, accessibility, responsive behavior, and component consistency must all be verified.

## Completion response

Return a concise summary containing:

- Files changed
- Main UI/UX improvements
- Responsive and interaction verification performed
