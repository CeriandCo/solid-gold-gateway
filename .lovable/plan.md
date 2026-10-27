# Privacy Policy read-only check (no changes made)

1. **OK** — Only `src/routes/privacy.tsx` renders /privacy (352 lines). Sections 1–17 are all present, from "1. Information We Collect" (line 77) to "17. Contact Us" (line 316). Every table-of-contents link points to a real section heading.

2. **Needs decision** — The date "Last updated: October 23, 2026" is typed directly into `privacy.tsx` line 51. It came in with the Section 1 rewrite, which used the date from the supplied policy text. The later chunks never changed it, so it is most likely the source policy's own date, not a stale value. Please confirm whether it should stay or become October 27, 2026. (Terms shows October 17, 2026 at `terms.tsx` line 51.)

3. Leftovers:
   - **OK** — No placeholders, TODOs, "[...]", lorem ipsum, SQOOT or getsqoot.com, and no empty or cut-off sections.
   - **Needs fix** — Cross-references disagree. Line 168 (3.5) says to opt out "as described in Section 8.4", but Section 8 has no 8.4. The opt-out section is 9.4, and line 286 correctly says "Section 9.4". You asked to keep "Section 8.4" word for word, so this is flagged rather than changed.
   - **Needs fix** — Line 269 refers to a "Do Not Sell or Share My Personal Information" link in the footer. That link does not exist in `src/components/site-chrome.tsx`.
   - **Note** — "10410 Corprate Dr" (line 318) is kept as written, as you asked. It looks like a typo for "Corporate".

4. Consistency:
   - **OK** — Company name: "Fortress Gold Inc. DBA TRUNK" on both Privacy (lines 318–319) and Terms (lines 52, 134–135).
   - **Needs fix** — Location: Privacy gives a Sugar Land mailing address (line 318), but Terms says "Headquarters: Houston, TX" (lines 134–135).
   - **Needs fix** — Email: Privacy uses compliance@trunk.gold, while Terms and the site use support@trunk.gold. This may be intentional for privacy requests.
   - **Note** — The footer shows only "© {year} TRUNK" (`site-chrome.tsx` line 425), with no legal name, address or email.

5. Links to /privacy:
   - **OK** — The footer link "Data Privacy Policy" goes to /privacy (`site-chrome.tsx` line 367).
   - **Note** — There is no cookie or consent banner on the site, so there is nothing to link from. The newsletter section has no privacy link.

6. **Needs fix** — Section 10 (lines 278–286) only says "Analytics: Understand website traffic and performance." It does not name Amplitude, Session Replay or Google Analytics 4. It also does not explain that Session Replay records page interactions with personal fields masked. Section 3 lists Google only as an advertising partner (line 168) and never mentions Amplitude.

No edits made. Say which items to fix (for example the date, the 8.4 reference, the footer opt-out link, the address and email, or the analytics wording), and provide approved legal wording where needed.
