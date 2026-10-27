# Architecture

## Decisions

The requested stack is retained: Next.js App Router on Vercel, with PostgreSQL and Auth in Supabase. No CMS or alternative hosting runtime was introduced. Server components handle content; client boundaries are limited to navigation, animation, galleries, players and forms.

Public route files compose feature components and metadata. Content is typed and centralized. Shared visual tokens live in globals.css; the Tailwind Turbopack loader processes its theme. Cormorant Garamond and Manrope are fetched at build time and served by Next.js.

The homepage uses a full-height photographic opening, offset story spreads, quiet service rows, a cinematic transition and a consultation close. Ivory, charcoal and sparse champagne accents follow the supplied direction. Sample images are clearly identified; absent authentic content is omitted.

## Trust boundaries

Browsers never receive the service-role key. Server-only imports protect privileged modules. Public inputs are Zod-validated, body-limited and rate-limited. Mutating public APIs enforce the configured application origin.

Staff routes and each staff mutation independently check Supabase's verified user and server-owned app_metadata.role. The proxy refreshes sessions; it is not the authorization boundary. Next.js Server Actions provide origin checks for staff mutations. No appointment data is exposed through public endpoints.

RLS and explicit revocations prevent browser-role business-table access. Service-role operations occur only after the appropriate application checks. This intentionally avoids duplicating admin policy logic in both browser and database access paths.

## API contracts

- GET /api/availability?date=YYYY-MM-DD: timezone and start_at/end_at slots; no customer records. The month=YYYY-MM variant returns dated slots for the calendar and disables unavailable days.
- POST /api/appointments: validated BookingInput; 201 only after persistence. A replay of the same idempotency key and payload returns the same persisted result. 409 means stale slot or changed replay.
- POST /api/contact: validated contact input; 201 after durable storage.
- Failures return a safe error string, with 400/403/413/415/422/429/503 as appropriate.

All availability responses are uncached. No in-memory rate limiter or fabricated fallback slots are used. Missing integration configuration fails closed.

## Operational tradeoffs

One settings row is a deliberate low-volume scheduling mutex. It serializes schedule changes and appointment creation, appropriate for a consultation studio. The exclusion constraint independently protects overlapping slots. Database operations are short; email delivery runs after the response and uses a durable outbox.

No external calendar synchronization is included. Appointment status changes do not automatically email customers; staff communicate confirmation directly. Contact messages are reviewed in the admin area. Retention and cleanup schedules require studio policy before launch.
