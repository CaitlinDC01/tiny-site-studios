# Square checkout

`wedding-studio-checkout` handles Square-hosted one-time purchases. Live payments are off until account connection and a production test are complete.

## Secure setup

Set these in Supabase's Edge Function secrets, never in GitHub or the browser:

- `WS_SQUARE_ACCESS_TOKEN`: production token for the TSS Square application.
- `WS_SQUARE_LOCATION_ID`: TSS selling location.
- `WS_SQUARE_WEBHOOK_SIGNATURE_KEY`: signing key for this application's subscription.
- `WS_SQUARE_WEBHOOK_URL`: exact notification URL below.
- `WS_SQUARE_ENVIRONMENT`: `production` (default) or `sandbox`. Sandbox payments cannot grant production access.

Notification URL:
`https://ubovuhkvtwijtzofsobs.supabase.co/functions/v1/wedding-studio-checkout?action=webhook`

Subscribe to `payment.created` and `payment.updated`, API version `2026-09-16`. Token permissions for an OAuth connection: `ORDERS_READ`, `ORDERS_WRITE`, `PAYMENTS_READ`, `PAYMENTS_WRITE`; location selection also requires `MERCHANT_PROFILE_READ`. A developer personal access token has broader account access; use OAuth-scoped credentials where available.

The server creates one idempotent checkout per wedding owner. A database-only purchase reference ties the Square order to the account; buyer-controlled return URLs cannot grant access. Fulfillment retrieves payment and order from Square and requires COMPLETED, USD, the exact stored price, location and order reference. Signed webhooks validate the exact notification URL plus raw body using HMAC-SHA256. Duplicate notifications cannot extend access. Checkout records have RLS enabled with no client grants or policies intentionally: only service role reads/writes them.

Before enabling payments, test a real production purchase and confirm `paid_at`, `purchase_id` and the computed `paid_until`. Never enter card details on behalf of the owner. Update `wedding_studio_offer.payments_live` only after the test and configuration are verified. The $29 launch offer is manual; later set `price_cents=4900,introductory=false`. Already-created checkout links retain their quoted launch price.

The 14-day gate is held open during payment setup, avoiding a locked board without a working checkout. Paid editing is the later of purchase + 12 calendar months and wedding + 3 calendar months. Boards remain readable with original-attachment downloads and JSON export afterward. Refund and dispute handling is manual in this version; handle any access revocation deliberately.

Validation:
`deno test services/wedding-studio/checkout/validation.test.ts`
