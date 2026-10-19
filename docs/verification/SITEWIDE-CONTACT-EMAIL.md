# Sitewide contact email — October 19, 2026

Updated the remaining two Terms contacts and one Privacy contact to clickable support@trunk.gold links. Existing Contact, homepage, pricing and Trust Center support addresses already used this address. No styles, clauses, dates, service credentials, sender configuration or database rows changed.

## Search
`rg` across src/routes, src/components and public for the former support, hello and compliance addresses returned no matches. Additional search across src, public, scripts and supabase excluding tests and SQL also returned no matches. Historical SQL and audit evidence were not rewritten; no claim is made about hosted email-provider settings.

## Browser verification — raw output
Terms, Privacy and Contact were tested at all three requested widths. Every mailto had the correct destination; clicking the first link preserved scrollY. Screenshots were inspected for mobile Terms and desktop Privacy.

```json
[
  {
    "route": "/terms",
    "title": "Terms of Use | TRUNK",
    "width": 375,
    "mailtos": 2,
    "documentWidth": 375,
    "scrollYBefore": 5636,
    "scrollYAfter": 5636
  },
  {
    "route": "/privacy",
    "title": "Privacy Policy | TRUNK",
    "width": 375,
    "mailtos": 1,
    "documentWidth": 375,
    "scrollYBefore": 2817,
    "scrollYAfter": 2817
  },
  {
    "route": "/contact",
    "title": "Get In Touch \u2014 TRUNK",
    "width": 375,
    "mailtos": 1,
    "documentWidth": 375,
    "scrollYBefore": 0,
    "scrollYAfter": 0
  },
  {
    "route": "/terms",
    "title": "Terms of Use | TRUNK",
    "width": 768,
    "mailtos": 2,
    "documentWidth": 768,
    "scrollYBefore": 3672,
    "scrollYAfter": 3672
  },
  {
    "route": "/privacy",
    "title": "Privacy Policy | TRUNK",
    "width": 768,
    "mailtos": 1,
    "documentWidth": 768,
    "scrollYBefore": 1697,
    "scrollYAfter": 1697
  },
  {
    "route": "/contact",
    "title": "Get In Touch \u2014 TRUNK",
    "width": 768,
    "mailtos": 1,
    "documentWidth": 768,
    "scrollYBefore": 0,
    "scrollYAfter": 0
  },
  {
    "route": "/terms",
    "title": "Terms of Use | TRUNK",
    "width": 1440,
    "mailtos": 2,
    "documentWidth": 1440,
    "scrollYBefore": 3765,
    "scrollYAfter": 3765
  },
  {
    "route": "/privacy",
    "title": "Privacy Policy | TRUNK",
    "width": 1440,
    "mailtos": 1,
    "documentWidth": 1440,
    "scrollYBefore": 1789,
    "scrollYAfter": 1789
  },
  {
    "route": "/contact",
    "title": "Get In Touch \u2014 TRUNK",
    "width": 1440,
    "mailtos": 1,
    "documentWidth": 1440,
    "scrollYBefore": 0,
    "scrollYAfter": 0
  }
]
```

## Test suite — raw output
`bun run test` exited 1 before test execution during isolated database startup. No live database tests were run.

```text
error: script "test" exited with code 1
```

## Preview signal — raw output
```text
=== build 2026-10-19T08:21:37Z ===
build OK
```
Manual typecheck and build were not run because the environment instructions reserve them for the automatic harness. Full test-suite verification remains blocked by isolated database startup. Nothing published.
