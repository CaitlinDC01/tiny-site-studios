# Tiny Site Studios transactional email service

This Next.js service sends requested, one-time messages. The Birthday Adventure endpoint is `POST /api/birthday-itinerary`, accepts up to 30 confirmed stops, rejects other browser origins, limits request size and send rate, and uses the configured Resend sender. It does not create a marketing contact or store the recipient in the birthday database. Production requires `RESEND_API_KEY`, `RESEND_EMAIL_DOMAIN`, and `RATE_LIMIT_SECRET` as server-only environment variables.
