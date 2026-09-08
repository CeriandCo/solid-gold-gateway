# SQOOT Pure Design System

This document is the single source of truth for the visual language of the SQOOT Pure website. It is intended for both designers and future engineering/AI contributors working in this repository. All values below describe the current implementation; they are not aspirational. When building new pages or components, reference these tokens first before introducing new values.

---

## 1. Foundations

### Color Palette

Colors are defined as CSS custom properties in `src/styles.css` and registered as Tailwind v4 theme tokens in the `@theme inline` block. All colors use `oklch` in code; the hex equivalents below are derived from the comments in `src/styles.css`.

| Token | CSS variable | Value | Usage |
|-------|--------------|-------|-------|
| **Forest** | `--forest` | `oklch(0.185 0.028 162)` / `#05140D` | Darkest brand surface; primary header/footer background. |
| **Forest Deep** | `--forest-deep` | `oklch(0.243 0.035 160)` / `#0B2015` | Dark cards, overlays, and secondary dark surfaces. |
| **Charcoal** | `--charcoal` | `oklch(0.205 0.03 161)` / `#081A12` | Primary body text color (`--foreground`). |
| **Gold** | `--gold` | `oklch(0.743 0.117 89.5)` / `#C9A84C` | Primary accent; links, highlights, icons, labels, and focus rings (`--ring`). |
| **Gold Soft** | `--gold-soft` | `oklch(0.759 0.106 79)` / `#D7AA4E` | Gradient start for gold buttons and open-state accents. |
| **Gold Dark** | `--gold-dark` | `oklch(0.53 0.112 71)` | Gradient end/hover state for gold buttons. |
| **Warm White** | `--warm-white` | `oklch(0.966 0.004 67)` / `#F7F4F1` | Light text on dark backgrounds and primary light background (`--background`). |
| **Cream** | `--cream` | `oklch(0.966 0.004 67)` / `#F7F4F1` | Secondary light background (`--secondary`, `--muted`). |
| **Ivory** | `--ivory` | `oklch(0.955 0.013 82)` / `#F6F0E8` | Parchment/editorial section backgrounds. |
| **Beige** | `--beige` | `oklch(0.874 0.011 72)` / `#DED6CC` | Subtle borders, dividers, and input borders (`--border`, `--input`). |
| **Error** | `--error` | `oklch(0.62 0.17 28)` | Error states and validation messaging. |
| **Muted Foreground** | `--muted-foreground` | `oklch(0.44 0.008 155)` / `#444A45` | Secondary/meta text on light backgrounds. |
| **Card** | `--card` | `oklch(1 0 0)` / `#FFFFFF` | Card/panel background on light sections. |
| **Primary** | `--primary` | `var(--forest)` | Primary interactive color. |
| **Primary Foreground** | `--primary-foreground` | `oklch(0.968 0.005 70)` | Text on primary surfaces. |
| **Accent** | `--accent` | `var(--gold)` | Accent surface color. |
| **Accent Foreground** | `--accent-foreground` | `var(--forest-deep)` | Text on accent surfaces. |
| **Destructive** | `--destructive` | `oklch(0.53 0.17 27)` | Destructive actions. |

#### Semantic aliases
- `--background` → `--warm-white`
- `--foreground` → `--charcoal`
- `--border` / `--input` → `--beige`
- `--ring` → `--gold`
- `--secondary` / `--muted` → `--cream`
- `--secondary-foreground` → `--forest`

---

### Typography

The site loads three font families from Google Fonts in `src/routes/__root.tsx`, but only two are used as the primary design-system typefaces. DM Sans is loaded for legacy compatibility on the fractional-gold page only.

| Family | Token | Usage |
|--------|-------|-------|
| **Cormorant Garamond** | `--font-display` | All headings (`h1`, `h2`, `h3`), display titles, hero headlines, section titles, card titles, and price values. |
| **Inter** | `--font-sans` | Body copy, navigation, buttons, labels, captions, footer text, and all UI microcopy. |
| **DM Sans** | Scoped override on `.fractional-legacy` | Legacy fractional-gold page body only; do not use on new pages. |

#### Typeface weights loaded
- **Cormorant Garamond**: 400, 500, 600, 700 (roman and italic).
- **Inter**: 400, 500, 600, 700.
- **DM Sans**: 400, 500, 700 (legacy only).

#### Heading scale (as implemented in routes and utilities)

| Level | Utility / Location | Mobile | Tablet | Desktop | Notes |
|-------|-------------------|--------|--------|---------|-------|
| **H1 / Hero** | `hero-title` utility | `2.75rem` (44px) | `3.125rem` (50px) | `4.75rem` (76px) | Cormorant Garamond, weight 600, line-height ~0.98–1.0. |
| **H1 / Homepage** | `src/routes/index.tsx` | `2.25rem` (36px) | — | `4.5rem` (72px) | Homepage hero uses local sizing with explicit line breaks. |
| **H2 / Section** | `section-title` utility | `1.75rem` (28px) | `2rem` (32px) | `2.25rem` (36px) | Cormorant Garamond, weight 500. |
| **H2 / Step** | `step-title` utility | `1.875rem` (30px) | `2rem` (32px) | `2.75rem` (44px) | Used in process/carousel sections. |
| **H2 / Early-access** | `early-title` utility | `2rem` (32px) | — | `2.75rem` (44px) | Waitlist CTA headings. |
| **H3 / Card** | `card-title` utility | `1.75rem` (28px) | — | — | Cormorant Garamond, weight 500. |
| **Fees/FAQ title** | `fees-faq-title` utility | `1.5rem` (24px) | — | `1.75rem` (28px) | Uppercase, weight 600. |

Base heading styles in `@layer base`:
- `font-family: var(--font-display)`
- `font-weight: 500`
- `letter-spacing: -0.018em`
- `line-height: 1.08`

#### Body text sizes

| Token / Utility | Size | Line height | Weight | Usage |
|-----------------|------|-------------|--------|-------|
| `body-copy` | `0.9375rem` (15px) | `1.55` | 400 | Default long-form body paragraphs. |
| `compact-copy` | `0.875rem` (14px) | `1.5` | 400 | Tighter body copy, captions. |
| `hero-body` | `0.9375rem` → `1.0625rem` → `1.3125rem` | `1.75` → `1.8` → `2.3125rem` | 500 | Hero descriptions and lead copy. |
| `section-body` | `0.9375rem` → `1.1875rem` | `1.75` → `2.125rem` | 500 | Section descriptions and editorial body. |
| `eyebrow` | `0.75rem` (12px) | `1.2` | 700 | Small uppercase section labels; letter-spacing `0.13em`. |
| `ui-label` | `0.875rem` (14px) | `1.2` | 600 | Labels, nav links, button text. |
| `faq-question` | `0.875rem` → `1.125rem` | normal | 600 | Accordion question text. |
| `footer-nav` | `0.8125rem` → `1rem` | normal | 500 | Footer column links. |
| `footer-legal` | `0.6875rem` → `0.875rem` | `1.625rem` | 500 | Footer copyright/legal text. |

---

### Spacing & Radius

#### Radius tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `2px` | Small controls, inputs, and primary buttons. |
| `--radius-md` | `2px` | Same as small; kept in sync. |
| `--radius-lg` / `--radius-xl` / `--radius-2xl` / `--radius-3xl` / `--radius-4xl` | `8px` | Cards, panels, and larger containers. |
| `--radius` | `2px` | Default radius variable. |

**Rule of thumb:** buttons use `2px`; cards and panels use `8px`.

#### Layout width constants

Defined in `src/components/site-chrome.tsx`:

| Constant | Class | Max width | Padding | Usage |
|----------|-------|-----------|---------|-------|
| **WIDE** | `mx-auto w-full max-w-[1340px] px-5 sm:px-8 xl:px-0` | `1340px` | `20px` mobile / `32px` tablet / `0` at `xl` | Full-bleed sections that need the widest content boundary. |
| **STD** | `mx-auto w-full max-w-[1240px] px-5 sm:px-8 xl:px-0` | `1240px` | `20px` mobile / `32px` tablet / `0` at `xl` | Standard content width for most page sections. |

Additional layout notes from the implementation:
- The shared footer uses its own internal `max-width: 1200px` and `padding-inline: 1.5rem`.
- The homepage hero content is constrained to `max-w-[1200px]` with `max-w-[36rem]` for the copy column.
- Legal pages (`/terms`, `/privacy`) use `max-w-[760px]` for the prose column.
- Article pages (`/learn/*`) use `max-w-[720px]` for the article body.
