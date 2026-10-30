# Google Ads rollout — AW-18390015739

The base tag is installed through `google-ads.js` on 53 public TSS HTML pages. Existing GA and GTM remain intact. Weddings' previous inline Ads config has been consolidated into this shared implementation. Christmas includes its own identical copy for standalone hosting, and its build copies that asset. Run `node scripts/check-google-ads.mjs` after editing either copy.

The addition disables ad personalization, configures once, reuses an existing Google tag loader, and adds no conversion actions or custom events. Embedded previews skip initialization to avoid duplicate Ads measurements. URLs with fragments or query keys other than standard campaign identifiers skip this addition to avoid sending private share values. This safeguard does not alter existing GA/GTM tags. Google may receive standard browser and visit information; this is not a claim that the site uses no cookies or tracking.

Excluded routes are recorded in `google-ads-scope.json`: admin pages, a birthday redirect, private Cruise26, and the separately branded GBL event route. Client-owned applications are not modified.

## Other TSS properties

Tiny Teacher Tools has a separate proposed branch with the same helper on 8 public pages. Its projection screen is excluded. No student names, saved lesson data, form content, microphone audio, or classroom interaction events are read by the new helper. Existing GTM configuration remains a separate responsibility.

Better Than Bingo and Teacher Launchpad run separate Next.js deployments. Their current Vercel deployments were identified, but a verified editable source repository has not been established. Do not replace current production with an older handoff or compiled deployment to install a tag. Other portfolio apps likewise require verified ownership and source before modification.

## Release verification

These changes are proposed in draft PRs, not published to production. Before release, inspect real browser requests and cookies using Tag Assistant, check the intended Ads account destination, and confirm that the existing GTM containers do not also initialize the same Ads destination. Source checks found no literal AW-18390015739 in the published GTM payloads on 2026-10-30, but this is not account-level verification. No conversion label was supplied, so no lead or purchase conversion was invented.
