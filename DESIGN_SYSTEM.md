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
- **Cormorant Garamond**: roman 400, 500, 600, 700; italic 400, 500, 600 only (no italic 700 — bold italic falls back to synthetic/faux italic).
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

> **Article/legal page headings (one-off Tailwind classes):** Several newer route files (`learn.physical-gold-vs-gold-etf.tsx`, `learn.how-to-buy-gold-safely.tsx`, `learn.gifting-gold-guide.tsx`, `terms.tsx`, `privacy.tsx`) do not use the named utilities above. Instead they set H2 directly as `text-2xl sm:text-3xl font-display font-medium` (~24px → 30px) and H3 as `text-xl sm:text-2xl font-display font-medium` (~20px → 24px), both in `text-forest-deep`.

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

---

## 2. Components

Documented based on the actual implementation in `src/components/site-chrome.tsx`.

### Buttons

#### `GoldButton` (primary CTA)

Shared component exported from `src/components/site-chrome.tsx`. Renders as one of three elements depending on props:

| Prop | Rendered element | Use case |
|------|------------------|----------|
| `to` | `<Link>` from `@tanstack/react-router` | Internal navigation |
| `href` | `<a>` | External links or in-page anchors |
| `type` | `<button>` | Form submission / client actions |

**Base classes applied:**

```text
inline-flex items-center justify-center gap-2.5 rounded-[2px] bg-gradient-to-b from-gold-soft to-gold px-7 font-sans text-sm font-semibold leading-none tracking-[0.01em] text-[#0B2015] shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-px hover:from-gold hover:to-gold-dark hover:shadow-[0_4px_12px_rgba(0,0,0,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold
```

- **Radius:** `2px` (matches the global button radius token).
- **Gradient:** `from-gold-soft` → `to-gold` at rest; shifts to `from-gold` → `to-gold-dark` on hover.
- **Text:** `#0B2015` (deep forest) for maximum contrast on the gold surface.
- **Shadow:** subtle dark shadow that deepens on hover.
- **Motion:** `transition-all` with a `1px` upward translate (`-translate-y-px`) and gradient/shadow intensification on hover.
- **Focus:** `2px` gold outline with `2px` offset.
- **Font:** forced to `Inter, Arial, sans-serif` via inline style to prevent page-level overrides.

**Typical CTA sizing seen across pages:** `className="h-[54px] px-8"` (used on hero and waitlist CTAs).

#### Secondary / outline variant

Used inline on the homepage hero for the "See the Vault" action. It is **not** a separate shared component; it is a one-off `<a>` styled to contrast against the hero background.

**Exact classes:**

```text
rounded-[2px] border border-warm-white/45 bg-warm-white/5 px-8 py-3 text-sm font-semibold tracking-[0.01em] text-warm-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-px hover:border-gold hover:text-gold hover:shadow-[0_4px_12px_rgba(0,0,0,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold
```

- **Surface:** transparent with a warm-white tint (`bg-warm-white/5`) and a low-opacity warm-white border.
- **Hover:** border and text turn gold, shadow deepens, and the button lifts `1px`.
- **Sizing:** currently `px-8 py-3` on the homepage (not the fixed `54px` height used for primary CTAs elsewhere).

---

### Navigation (`SiteNav` / `SiteHeader`)

Single shared navigation component used across every page.

#### Header variants

| Variant | Background | Usage |
|---------|------------|-------|
| `overlay` | `bg-transparent` | Homepage hero only — sits directly over the hero image. |
| `solid` | `bg-forest-deep` | Every other page, rendered via `SiteHeader`. |

`SiteNav` accepts `variant?: "solid" | "overlay"` and defaults to `"solid"`. `SiteHeader` is a thin wrapper that renders `<SiteNav variant="solid" />` inside a `<header>` with `z-30`.

#### Responsive geometry steps

The nav row scales in three steps so it never overflows the artboard values:

| Range | Logo width | Min height | Nav gap | Horizontal padding | CTA padding |
|-------|------------|------------|---------|--------------------|-------------|
| `<1024px` (mobile) | `200px` → `230px` | `76px` | N/A (hamburger) | `px-5` / `sm:px-8` | N/A |
| `1024px–1279px` (compact) | `210px` (`lg:w-[210px]`) | `112px` | `20px` (`lg:gap-5`) | `lg:px-6` | `lg:px-4` |
| `1280px–1439px` (medium) | `250px` (`xl:w-[250px]`) | `112px` | `32px` (`xl:gap-8`) | `xl:px-10` | `xl:px-5` |
| `≥1440px` (full artboard) | `290px` (`min-[1440px]:w-[290px]`) | `112px` | `54px` (`min-[1440px]:gap-[54px]`) | `60px` (`min-[1440px]:px-[60px]`) | `min-[1440px]:px-6` |

Desktop nav links are `text-[13px]` at `lg`, `text-[14px]` at `xl`, font-sans, medium weight, warm-white/90 at rest.

#### Active-link treatment

Each nav link has a centered underline pseudo-element:

```text
after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-gold after:transition-[width] after:duration-300
```

- At rest the underline width is `0`.
- On the active route, `[&.active]:after:w-[46px]` expands it to `46px` and `[&.active]:text-gold` turns the link gold.
- Hover also turns the link text gold (`hover:text-gold`).

#### Mobile menu behavior

- **Toggle:** a hamburger button (`Menu` / `X` icons) appears below the `lg` breakpoint (`lg:hidden`).
- **Trigger:** clicking the toggle sets local `menuOpen` state; the menu expands/slides beneath the header bar.
- **Breakpoint switch:** desktop nav is `hidden lg:flex`; hamburger is `lg:hidden`. The switch happens at `1024px`.
- **Menu surface:** full-width panel with `bg-forest-deep`, a top border `border-warm-white/10`, and stacked items separated by `border-warm-white/10`.
- **Item styling:** `text-sm font-medium text-warm-white/85` with gold hover and active states matching desktop.
- **CTA in mobile menu:** rendered as an outline button (`border-gold/55 bg-transparent text-gold`) below the nav links.

#### "Get Early Access" button styling differences

| Variant | Classes | Appearance |
|---------|---------|------------|
| `overlay` (homepage) | `border border-gold bg-gradient-to-b from-gold-soft to-gold text-[#0B2015] shadow-[0_2px_10px_rgba(0,0,0,0.35)] hover:-translate-y-px hover:from-gold hover:to-gold-dark hover:shadow-[0_4px_14px_rgba(0,0,0,0.45)]` | Solid gold gradient with dark text and stronger shadow, to remain visible over the hero image. |
| `solid` (all other pages) | `border border-gold/55 bg-transparent text-gold hover:border-gold hover:bg-gold/10` | Outline style on the dark forest header; hover adds a subtle gold tint. |
| mobile menu | `border border-gold/55 bg-transparent px-5 text-sm font-medium text-gold` | Outline style, consistent with the solid variant. |

---

### Footer (`SiteFooter`)

Shared footer component exported from `src/components/site-chrome.tsx` and styled by a dedicated, unlayered `footer.site-footer` block in `src/styles.css` (lines ~665–806). The component itself renders only semantic class hooks (`site-footer__grid`, `site-footer__brand`, etc.); all typography, spacing, color, and layout are defined in the global stylesheet.

#### Layout and breakpoints

The footer grid is defined in CSS, not Tailwind utility classes:

| Breakpoint | Grid | Notes |
|------------|------|-------|
| `<640px` | Single column, stacked | Brand block + three nav columns stack vertically with `gap: 3rem`. |
| `≥640px` (`sm`) | `repeat(3, 1fr)` | Brand block spans all three columns (`grid-column: 1 / -1`). |
| `≥768px` (`md`) | `1.4fr 1fr 1fr 1fr` | Brand block returns to a normal cell; three link columns sit to its right. |

- **Container:** `max-width: 1200px`, centered, `padding-inline: 1.5rem`.
- **Outer padding:** `padding-block: 4rem`.
- **Background:** `var(--forest-deep)` (`#0B2015`).
- **Text color:** `var(--warm-white)`.
- **Font:** forced to `"Inter", Arial, sans-serif` at the block level.

#### Content blocks

1. **Brand / tagline column**
   - Logo image (`site-footer__logo`): `height: 3.5rem`, width auto.
   - Tagline (`site-footer__tagline`): `font-size: 0.75rem`, `line-height: 1.625`, `color: warm-white/55`, `max-width: 20rem`.

2. **Discover More** — internal product links (`/precious-metal`, `/fractional-gold`, `/gifting`, `/vault`, `/learn`).
3. **Company** — `/about-us`, `/trust-center`.
4. **Legal** — `/terms`, `/privacy`.

The link map is hard-coded in `footerColumns` in `src/components/site-chrome.tsx`.

#### Heading and link styles

- **Column headings (`site-footer__heading`):**
  - `font-family: "Inter", Arial, sans-serif`
  - `font-size: 0.6875rem`
  - `font-weight: 500`
  - `letter-spacing: 0.22em`
  - `text-transform: uppercase`
  - `color: var(--gold)`

- **Links (`site-footer__link`):**
  - `font-size: 0.75rem`
  - `font-weight: 400`
  - `line-height: 1.25`
  - `text-decoration: none`
  - `color: warm-white/65`
  - `transition: color 0.2s ease`
  - **Hover:** `color: var(--gold)`

#### Bottom bar

A separate flex row (`site-footer__bottom`) sits below the grid:

- **Top border:** `1px solid warm-white/10`.
- **Padding:** `1.5rem 1.5rem 0`.
- **Layout:** `flex-wrap`, `justify-content: space-between`, `align-items: center`, `gap: 1rem`.
- **Copyright (`site-footer__copy`):** `font-size: 0.75rem`, `color: warm-white/40`.
- **Social icons (`site-footer__social`):**
  - Instagram, LinkedIn, YouTube (Lucide icons).
  - `color: var(--gold)` at rest, `color: var(--warm-white)` on hover.
  - Icon size: `1.25rem × 1.25rem`.
  - Focus outline: `2px solid var(--gold)`, `3px` offset.

#### Why the footer uses a dedicated CSS block

The `footer.site-footer` rules live **outside** `@layer base` / `@layer components` and use explicit `font-family` declarations. This is intentional isolation: many route files use page-scoped selectors (e.g. `.trust-center-page a`, `.about-new p`, `.fractional-legacy`) that could otherwise override footer typography or link colors. The unlayered, higher-specificity `footer.site-footer .site-footer__*` selectors guarantee the footer looks identical on every page regardless of local route styles.

---

### Cards & Accordion

#### Homepage FAQ accordion (canonical accordion pattern)

Implemented in `src/routes/index.tsx` as a single-open accordion grid.

**Container:**

- Section background: `bg-forest` (dark forest).
- Accordion wrapper: `mx-auto max-w-[1000px] px-6`.
- Grid: `grid gap-4 md:grid-cols-2` (two columns on tablet/desktop, single column on mobile).

**Card states:**

| State | Background | Border | Question text | Icon |
|-------|------------|--------|---------------|------|
| **Closed** | `bg-warm-white/5` | `border-warm-white/25` | `text-warm-white` | `Plus` icon, `text-gold` |
| **Open** | `bg-gold-soft` | `border-gold` | `text-forest-deep` | `Minus` icon, `text-forest-deep` |

- **Border radius:** `rounded-lg` (8px, the global card radius token).
- **Padding:** `p-6`.
- **Transition:** `transition-colors` on the card surface.
- **Single-open behavior:** React state holds one open index (`open: number | null`); clicking the already-open card closes it (`setOpen(isOpen ? null : i)`).
- **Answer text (open):** `text-sm leading-relaxed text-forest-deep` with `mt-6` spacing from the question.
- **Icons:** `Plus` / `Minus` from `lucide-react`, `strokeWidth={1}`, `h-4 w-4`.

This pattern is the canonical accordion treatment for the site: closed cards sit slightly above a dark section background with a warm-white border; open cards invert to a gold-soft surface with forest-deep text.

#### Card surface treatments

The site uses two primary card/panel surfaces:

1. **Light card surface**
   - Token: `--card` → `oklch(1 0 0)` / `#FFFFFF`.
   - Used on light sections (parchment, cream, warm-white backgrounds).
   - Typically combined with `rounded-lg` (8px) for panels and larger containers.

2. **Dark card surface**
   - Token: `--forest-deep` (`#0B2015`).
   - Used for cards on dark sections (FAQ accordion closed state, Trust Center audit panels, Vault dark sections, etc.).
   - Often paired with `border-warm-white/25` or `border-gold` borders depending on state.

**Radius rule:** buttons use `2px`; cards, panels, and larger containers use `8px` (`rounded-lg` / `--radius-lg`).
