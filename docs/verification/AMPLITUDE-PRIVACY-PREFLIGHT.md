# Amplitude privacy preflight

Date: October 27, 2026

## Result

The requested integration was not installed. The exact snippet enables automatic collection sitewide, but its defaults do not establish the requested guarantee that no personal, KYC, banking or payment information reaches Amplitude. Changing those defaults would depart from the instruction to use the exact snippet, so implementation needs clarification first.

No application files were changed. No custom tracking calls were added. Nothing was published.

## Evidence actually collected

Source inspection found the shared document head in `src/routes/__root.tsx`. The repository search for `Content-Security-Policy`, `contentSecurityPolicy` and `amplitude` under `src` and Vite configuration returned no matches. A deployed-header policy was not verified.

The official Amplitude Autocapture documentation was downloaded and its text extracted from https://amplitude.com/docs/data/autocapture. Raw extracted passages:

```text
Autocapture captures the text your website or app displays. For example, the content ( textContent ) of the element clicked and its children. Amplitude doesn't recommend using Autocapture's element interaction tracking on pages that may contain sensitive information.

Amplitude uses pattern matching to automatically mask any text content that looks like a credit card number, social security number, or email address.

Amplitude offers the following Autocapture protections if you choose to implement them. By default, Amplitude doesn't enable them.
```

The source audit identified an admin page displaying the signed-in email and partner application inputs for personal/business information. Automatic input masking is not a guarantee that every displayed name, business detail, URL or other sensitive datum is excluded. Session replay masking also cannot by itself establish the privacy of separate autocapture events.

## Pending decision

Authorize privacy-protective configuration beyond the literal snippet before installing it: review exclusion of sensitive pages, masking, and URL/event sanitization. No alternative configuration has been substituted silently.

## Checks not run

No analytics initialization, replay, event payload, route-navigation, hot-reload, responsive browser, typecheck, test or build verification was run, because application implementation was stopped at the privacy conflict. No database was queried or modified.