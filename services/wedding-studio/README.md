# Wedding Studio v1

Static app: `/weddings/wedding-studio/`. No build step. Published with the existing Tiny Site Studios GitHub/Vercel workflow.

## Backend

Supabase project: `ubovuhkvtwijtzofsobs` (tiny-site-studios).
Applied migration: `20260930040725_wedding_studio_v1.sql` (tracked here as an immutable copy of the applied migration).
Private bucket: `wedding-studio`, 15 MiB per object. All tables and object policies restrict access by authenticated user ID. One board per account. Card updates are saved independently; concurrent edits to the same card use last-write-wins.

Edge function: `wedding-studio-brief`, source in `brief/index.ts`. JWT verification is deliberately off: GET uses the cryptographically random brief token as a scoped, read-only capability. Service role credentials remain exclusively in the function environment. The function loads a single unexpired snapshot, signs only paths beneath the snapshot owner's folder, and never exposes the owner's board. Links expire in 30 days and can be revoked by deleting the private brief row. Already-issued attachment links can last one hour after revocation.

The browser contains only the public publishable key. Supabase JS is version-pinned to 2.117.2. Its auth session uses a dedicated browser storage key. Actual board data and files live in Supabase, not browser storage. Example-board data is explicitly temporary and in memory.

## First-version boundaries

- One owner per board; no live multi-editor collaboration.
- Product, pin, and playlist URLs are saved links, not auto-imports or embedded players.
- One file per card. Raster images preview; other files are attachments.
- Share links contain selected snapshots; new private edits do not silently change published briefs.
- Brief print view supports browser Print / Save as PDF.
- Removing a card preserves its uploaded file so existing briefs do not break. Retention/garbage collection is a future operation; revocation is available now.
- Supabase Auth confirmation/reset redirects must permit the deployed URL to return directly to this page. Otherwise users can confirm their account through the existing TSS email flow and return to sign in.
- No analytics added to the private workspace.

## Verification

JavaScript syntax checked. Owner read/insert and cross-user isolation verified with rollback-only SQL transactions. Invalid brief tokens return 404. Cloud-browser checks passed for adding a note, canvas keyboard movement, and selected-only brief printing. Real brief-token retrieval and revocation were tested against the deployed edge function; cross-owner file paths are rejected. Signed-in account/upload and narrow mobile browser verification remain untested in this session. Test those before inviting real clients.

## Visual links and quick capture (September 30 update)

- `wedding_studio_items.preview` stores sanitized title, description, image URL,
  provider, resolved URL, and fetch time. Existing links are enriched on board
  load (up to 20 per load); Edit details has a refresh action. Failures keep the
  original link. Uploaded link covers use the existing private storage bucket.
- `wedding-studio-link-preview` requires a verified Supabase user JWT before
  fetching arbitrary URLs (`verify_jwt=false` because authentication is in the
  handler). One fixed public garden-demo URL is allowed for a sample preview.
  No service-role key is used. Requests carry no user cookies or credentials.
- URLs/redirects are restricted to HTTP(S) on standard ports, without userinfo.
  Every hop resolves to vetted public IPv4 addresses; connections are pinned to
  those addresses. `transport.ts` uses native Deno TCP + TLS with original-host
  certificate verification. This avoids the Edge runtime's Node HTTPS shim,
  which does not preserve separate SNI when requesting an IP address.
  Responses are bounded to 1 MiB; headers to 32 KiB; redirects to five hops;
  request budget is 10 seconds. Per-instance per-user throttle: 40/minute.
  This is a lightweight throttle, not a distributed quota. IPv6-only sites,
  private pages, bot-protected stores, and pages with no metadata use fallbacks.
- `intake.js` normalizes browser transfer data. File batches, URL lists, linked
  images (including pin thumbnails), screenshots, and plain text save directly.
  Each capture is capped at 30 entries, each file at 15 MiB. Editable fields and
  dialogs retain normal paste behavior. Failed uploads can be retried. Items
  awaiting sign-in are kept only in memory for this page session.
- Pinterest support is individual public link capture and previews, not OAuth,
  board import, or account sync. No Pinterest app credentials are configured.
- Social tags use the public branded JPEG, never private board contents. The
  original generated artwork was converted to JPEG without compositional edits.
  `favicon.svg`, `favicon.ico`, and `apple-touch-icon.png` provide app icons.

Checks:

```sh
node --check weddings/wedding-studio/studio.js
node --check weddings/wedding-studio/intake.js
node services/wedding-studio/tests/preview.test.mjs
# Install linkedom@0.18.12 in a temporary QA directory, then:
NODE_PATH=/path/to/qa/node_modules node services/wedding-studio/tests/intake.test.cjs
```

## Shared account signup

Wedding Studio shares the project’s Tiny Site Studios accounts. Supabase can return a successful, obfuscated signup response for an already-confirmed address without sending an email. The interface now uses conditional wording, explains the shared login, and offers sign-in and user-initiated confirmation resend. It does not expose account existence or bypass email verification.
