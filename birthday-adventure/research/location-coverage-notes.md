# Houston area coverage audit — October 6, 2026

The previous selector accepted every national program and every Houston-metro listing for every suburb. It only changed Maps queries; it did not establish local store coverage.

`locations.js` now records positive evidence from official store directories or specific branch pages. Each row includes the checked date, source URL, and an address when checked directly. Unknown coverage stays unknown. A verified branch does **not** guarantee it honors a birthday promotion; visitors must still check the offer and participation.

Official directories checked: Sephora's complete store list; Nothing Bundt Cakes' Texas bakery list; Ulta's store directory. Specific pages checked: Chuy's Houston, Katy, Humble and Sugar Land; Chick-fil-A Houston and Woodlands Mall; Chili's Woodlands; Crumbl Woodlands; Velvet Taco The Heights and The Woodlands. Velvet Taco's sitemap also lists Sugar Land. Tacos A Go Go's official directory lists six Houston locations and does not list a Woodlands location.

Coverage is intentionally incomplete. The default view filters to verified branches in the selected area. Visitors can explicitly browse all researched programs, with unverified coverage marked clearly. These programs require the visitor to enter a checked branch before saving a new itinerary stop. Area changes never delete saved stops. Existing backups and account data retain their format.

The Woodlands Velvet Taco is at 9120 Gosling Road; its presence must not be removed based on an assumption. No neighboring municipality is silently grouped into a suburb.

Future reviewers should extend `locations.js` with sourced branch evidence and recheck closures. New database offers with an explicit city and address can be shown for that exact city; national records never imply universal coverage.
