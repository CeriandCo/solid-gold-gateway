# Home hero copy restore (#hero)

Changed only `src/routes/index.tsx` hero strings: eyebrow, three-line headline, body, primary button label; removed trust line. No CSS change (`.home-hero-title span, em { display:block }` already present).

## Browser (raw, Playwright)
1280x720: lines [['Own gold',285],['the way it was',351],['meant to be.',418]], eyebrow 'GOLD, MADE PERSONAL', button 'Join the waitlist', trust line present: False, ctaBottom 680 < heroBottom 908, scrollWidth 1280.
390x844: lines [['Own gold',195],['the way it was',234],['meant to be.',273]], same text checks, ctaBottom 595 < heroBottom 1339, scrollWidth 390.

Button href `#cta` and arrow icon unchanged (code unchanged). Scroll-on-click not exercised in this run. Full gates (tsgo/test/build) not run in this task.
