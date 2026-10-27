# Amplitude install

- Loader: `src/lib/analytics/amplitude.ts`; called from `src/routes/__root.tsx` (useEffect on pathname, module flag prevents re-init).
- Excluded routes: `/^\/admin(\/|$)/` only. The brief's `/cms`, `/portal`, `/login`, `/auth`, `/reset` do not exist; `/partner` was not used because it would also exclude the public `/partners` and `/partner-terms` pages.
- `data-amp-mask`: partners form, home final-CTA waitlist form, early-access form, shared waitlist CTA form. `data-amp-block`: admin signed-in email.
- Consent: no cookie/analytics consent mechanism exists; Amplitude starts on load.
- CSP: none in project.
- `bunx tsgo --noEmit`: no output (pass). Vitest: failed at global DB setup (isolated DB startup), tests not executed.
- Browser (localhost): `/admin` loaded no amplitude.com requests; after navigating to `/`, requests to cdn.amplitude.com, api2.amplitude.com/2/httpapi, sr-client-cfg.amplitude.com.
- Not checked: replay masking in the Amplitude dashboard; build not run manually.
