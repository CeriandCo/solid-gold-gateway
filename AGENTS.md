<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Editor "Generate with AI" usage is logged in `aurum_ai_manual_runs`, not `aurum_ai_runs` — so manual generations never consume the scheduled Daily Note daily cap.
- The AURUM newsletter form uses the existing newsletter function and server-owned consent projection; preserve validation/rate limiting and do not reset Customer.io delivery state when consent is refreshed.
- Retired preview pages have no route modules or redirects; the shared not-found page handles their URLs to avoid retaining obsolete content.
- Trust Center audit cadence and dates use the tested vault-audit configuration to keep report labels consistent.
- Public lead forms (waitlist, partner) save first via src/lib/leads and send to Customer.io only from the live host, fail-soft and claim-once — so preview never emits events and a provider outage never loses a signup.
- Newsletter and lead Customer.io deliveries share the server-only claim-before-send helper so sent/in-flight records cannot be resent and provider failures never fail a stored signup.
- Marketing tag modules initialise from the root pathname effect with shared production-host/private-path gates; suppress internal marketing traffic because these tags lack GA4's internal classification.
