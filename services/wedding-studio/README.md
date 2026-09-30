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

JavaScript syntax checked. Owner read/insert and cross-user isolation verified with rollback-only SQL transactions. Invalid brief tokens return 404. Run browser checks for adding/editing/filtering, image upload, canvas movement, selected-only brief printing, mobile layout, and authentication before inviting real clients.
