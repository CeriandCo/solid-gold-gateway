# About Us ownership path order

Changed only the order in `src/routes/about-us.tsx`: Fractional Gold, Coins & Bars, Vaulted Gold. Each block retains its original icon, copy, and attributes. No styling or layout changes. Nothing published.

## Browser verification

Real browser visits to `/about-us` at 375, 768, and 1440 pixels confirmed the requested order. Raw measured results:

```json
[
  {
    "width": 375,
    "order": [
      "Fractional Gold",
      "Coins & Bars",
      "Vaulted Gold"
    ],
    "blocks": [
      {
        "x": 40,
        "y": 634.597412109375,
        "width": 89,
        "height": 538.4375
      },
      {
        "x": 143,
        "y": 634.597412109375,
        "width": 89,
        "height": 538.4375
      },
      {
        "x": 246,
        "y": 634.597412109375,
        "width": 89,
        "height": 538.4375
      }
    ]
  },
  {
    "width": 768,
    "order": [
      "Fractional Gold",
      "Coins & Bars",
      "Vaulted Gold"
    ],
    "blocks": [
      {
        "x": 24,
        "y": 670.316162109375,
        "width": 353,
        "height": 236.578125
      },
      {
        "x": 391,
        "y": 670.316162109375,
        "width": 353,
        "height": 236.578125
      },
      {
        "x": 24,
        "y": 920.894287109375,
        "width": 353,
        "height": 217.078125
      }
    ]
  },
  {
    "width": 1440,
    "order": [
      "Fractional Gold",
      "Coins & Bars",
      "Vaulted Gold"
    ],
    "blocks": [
      {
        "x": 92,
        "y": 760.95703125,
        "width": 403.3125,
        "height": 279.125
      },
      {
        "x": 518.34375,
        "y": 760.95703125,
        "width": 403.3125,
        "height": 279.125
      },
      {
        "x": 944.6875,
        "y": 760.95703125,
        "width": 403.3125,
        "height": 279.125
      }
    ]
  }
]
```

Screenshots inspected at 375 and 1440. Existing 375px layout keeps three narrow columns and has overflowing heading/body text; not changed because this request is order-only.

## Checks actually run

Latest automatic preview result:
```text
=== build 2026-10-19T01:56:56Z ===
build OK
```

`bun run test` failed before test execution during isolated database setup:
```text
Error: Command failed: bash /dev-server/scripts/test-db/up.sh
Object.setup src/test/global-setup.ts:17:5
error: script "test" exited with code 1
```

Manual typecheck and build not run (platform instructions prohibit them). No click-driven controls changed.
