# Birthday deal research audit — October 4, 2026

`deal-audit-2026-10-04.csv` is an editorial backup of **47 distinct programs** found through current first-party merchant pages. It is a research inventory, not a list of 47 guaranteed no-spend birthday stops. Each row records the merchant's own source, an enrollment destination, geographic scope, purchase and prior-activity caveats, a redemption window when published, and an editorial confidence label. The nine launch entries remain in this backup, so it can be used to reconcile future catalog edits.

## Publication rules

1. Separate `free with no purchase`, `free with a purchase or prior activity`, `discount/points`, and `unknown or variable`. Never count a points multiplier as a birthday freebie.
2. Show all researched, current offers in Explore with their requirements. Auto-schedule only when the item, window, city availability, and the visitor's eligibility are sufficiently known. Otherwise show **Sign up and confirm**; let a visitor add a reward they actually received with its real dates.
3. Keep an explicit merchant enrollment link on each signup-dependent deal card, alongside the official terms link. External merchant enrollment may have its own marketing and privacy terms.
4. Recheck the merchant's source before publishing a row and every 60–90 days afterward. Record `last_checked_at`, source URL, verification status, and a short factual change log. Pause expired, broken, withdrawn, or unverifiable offers. Community and business submissions use the same review gate.
5. A national brand does not prove a nearby participating branch. Verify Houston locations for the pilot and show national offerings as conditional in other cities until branch participation is checked. Avoid estimated value, a precise reward window, or a signup cutoff when the merchant does not publish one.

## Findings that affect the current app

- The launch catalog has nine entries; its $0-purchase filter and requirement for confirmed eligibility leave only a few itinerary stops. A larger discovery catalog should not pretend every reward is ready to redeem.
- Many older roundup claims are obsolete. Current Dunkin' Rewards advertises a birthday points multiplier, not the old free drink. Red Robin changed its former Birthday Burger program in June 2026; its current birthday treat is variable. Starbucks introduced tiers and differing redemption windows in 2026. Panera's free birthday You Pick Two is a higher-tier benefit. These should not be advertised as universally free items.
- Some real rewards require past activity: Auntie Anne's says one annual purchase; Grimaldi's requires a qualifying purchase, and birthday-month signup may defer its reward. Merchants can alter offers without notice.
- Local discovery is still thinner than national discovery. Houston/Texas-specific entries include Tacos A Go Go, Chuy's, Freebirds, Torchy's, Velvet Taco, and participating Menchie's locations. More independent Houston businesses need direct confirmation or reviewed submissions.

## Data and account design

The app currently uses `localStorage` under `birthday-adventure-v1`. It normally survives closing a tab or browser and a return in the **same browser profile**. It does not sync to another device; private browsing or clearing site data can erase it. The current JSON backup/restore can bridge that gap manually.

Recommended next release:

- Keep no-account use and JSON backup. Add **Email me a copy** as a one-time, explicit action with an address field, a delivery confirmation, and no marketing checkbox preselected. Sending needs a transactional email service and a server endpoint with abuse limits; do not place delivery keys in public JavaScript. Decide whether the email includes a PDF, a private restore link, or a JSON attachment before implementing retention and expiry.
- Offer an optional account for cross-device sync. Use email magic links through the existing authentication provider, a per-user plan table with row-level access control, and a clear **Save this device's plan to my account** migration step. Do not silently turn an email-to-me address into an account or subscribe anyone to marketing.
- Say prominently: **Birthday Adventure is free. Creating a plan does not sign you up for marketing or enroll you in any merchant rewards program.** Distinguish this from the merchant's separate signup terms. A visitor's email is optional unless they choose email delivery or an account. The current business submission form separately requires an email for review contact.

## Before public import

The CSV is intentionally broader than the itinerary. Revisit rows marked `Confirm details`, `Confirm eligibility`, `Variable reward`, or `Research hold`. Some official pages establish a birthday perk but do not specify item, cutoff, spend rule, or window. Preserve those unknowns in the published record; never default them to $0 or birthday-month validity. Validate each enrollment destination and active nearby location at import time. Keep the CSV as a dated, human-readable backup of what was checked.
