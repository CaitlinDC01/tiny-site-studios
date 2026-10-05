# Birthday Adventure

Public planner: `/birthday-adventure/`
Private review screen: `/birthday-adventure/admin/`

Buildless HTML/CSS/JavaScript, hosted with the existing Tiny Site Studios repository on GitHub Pages and Vercel. There are no server dependencies or build changes.

## Behavior

- Personalizes name, birthday month/day/year, city, Houston neighborhood, categories, and purchase preference.
- Stores plans and claims on the current device; supports JSON backup/restore and calendar export.
- Only confirmed short signup offers enter the itinerary. Unknown signup timing requires an actual reward plus user-confirmed dates.
- Checks reward windows, late signup, and Chick-fil-A Sunday closure.
- Claim totals use user-entered item value and qualifying spend, not invented estimates.
- Neighborhood runs are groupings, not distance or travel-time estimates.
- Community submissions, business submissions, and corrections persist in Supabase's private `birthday_submissions` queue.
- Contact email is required for business submissions, optional otherwise, and never published.
- Reviewer authenticates with the existing owner account (Caitlin's Gmail). RLS restricts private queue reads, changes, and publishing to the owner.
- Approved listings in `birthday_offers` feed the public catalog. Unknown/custom windows cannot be approved into automatic scheduling. Listings can be edited or paused.
- Correction reports are reviewed separately and never published as offers.

## Limits

Houston pilot with nine researched program entries, including candidates requiring confirmation. National chains require choosing a participating branch. No geocoding, computed route optimization, business-hours lookup, account sync, or paid placement. Some merchant signup cutoffs aren't published; candidates are not guarantees.

Starter catalog terms were checked October 4, 2026 against the linked merchant pages. Supply and participation may vary. Store-address links should be checked before travel.

## Verification

JavaScript syntax checks passed. Planner tests cover month boundaries, birthday windows, Sunday closure, city matching, skip/claim totals, late signup, and leap day. Database tests verified anonymous pending submissions are allowed while private reads, self-approval, and publishing are denied; test records were rolled back.

## Expanded discovery and optional account (October 2026)

- The dated 47-program audit is the editorial backup. The generated `catalog.js` adds 35 current conditional candidates to the nine launch entries; three outdated or unsupported claims stay out. Run `python3 research/build-catalog.py` after reviewing a CSV change.
- Explore presents 44 offers, including candidates with missing terms. Unknown windows do not get guessed dates. Only confirmed offers and rewards explicitly confirmed by a visitor enter the itinerary. Merchant signup links and official sources appear separately.
- Visitor plans remain usable without an account on the same browser. Optional one-time email-link accounts use the existing Supabase Auth project and a private `birthday_plans` table. RLS allows only the authenticated user to read/write that user's plan. When both device and account plans exist, the visitor chooses which to keep. Signout clears the device copy after successful sync.
- The itinerary email button sends a one-time message through the existing Tiny Site Studios transactional email service. The address is not added to marketing or saved to the Birthday Adventure database. Sending is rate limited; failed delivery keeps the visitor on the form with a backup/print option.
