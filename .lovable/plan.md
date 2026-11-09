# AURUM MELT opt-in

- Activate the exact approved MELT consent and replace only the subscribe button with a desktop-inline/mobile-stacked email form, required messages, and secondary community link.
- Keep the existing newsletter validation, rate limiting, consent version check, and atomic consent/preferences upsert.
- Add newsletter delivery fields and reuse the lead claim-before-send helper without changing waitlist/partner behavior. Preserve delivery status on resubmission; send `melt_subscribed` only on live hosts, fail-soft.
- Test approved consent, exact event payload, non-live suppression, repeat/concurrent delivery, and provider failure. Run newsletter and leads suites on the isolated stack; browser-check at 375/768/1440 without writing test data to the live database.
- Update the roadmap and requested verification report with raw results and any blocked checks. Do not publish.

## Technical details

Use the existing TanStack newsletter function and US Customer.io sender. Add only additive newsletter columns with defaults; existing rows default to non-production/skipped, with no bulk delivery. Extract the current delivery helper into a server-only shared module. The existing live-host helper includes `trunk.gold` and `www.trunk.gold`.