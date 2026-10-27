# Booking system

## Availability

All timestamps are timestamptz. Working hours are local wall-clock times in the IANA studio time zone. PostgreSQL converts a requested local date plus each active rule into absolute timestamps and generates slots at the configured duration.

Slots must fit entirely inside working hours, meet notice and horizon limits, avoid blocked ranges, and avoid pending/confirmed appointment ranges. Intervals use [start,end), so adjacent appointments are allowed. The default zone is Asia/Kolkata; there are no seeded working hours.

## Transactional creation

create_appointment locks the singleton settings row, checks the idempotency key/hash, rechecks real availability, inserts a pending record and inserts a notification outbox row in one transaction. A partial GiST exclusion constraint prevents overlapping pending or confirmed records even if a caller bypasses the availability query.

Schedule rules and blocked-period mutations acquire the same mutex using statement triggers. Settings updates acquire their row lock directly. The status function shares that lock. Cancellation is terminal and frees the slot. Pending requests continue to block until staff resolve them.

The database-generated slot end is authoritative. Client-supplied status/end fields are rejected by the strict schema. No success is displayed before a database write returns successfully.

## Notifications

Optional Resend notifications are sent to the configured studio address, contain no customer details, and link operationally to the private admin workflow. Provider requests have a timeout and idempotency key. Failed or unconfigured notices remain in the outbox and can be retried from administration.

The outbox and appointment commit together. The app uses Next.js after() for the first delivery attempt. Staff retry is the recovery mechanism; there is no recurring background worker in this version. Delivery is not claimed merely because a booking was stored. Customer confirmations remain a manual studio responsibility.

## Spam and retention

Each public endpoint has a PostgreSQL-backed 15-minute counter. Availability permits 90 requests; booking and contact permit 10. Honeypots and strict schema validation reject basic spam. On Vercel, only its platform-provided forwarding header is used; other hosting must adapt trusted proxy identification. Local development intentionally shares one counter.

Identifiers are HMAC-hashed with a private secret. Before public launch, establish the studio's retention policy and scheduled cleanup for expired rate-limit rows, cancelled appointments, old enquiries and delivered notifications. Supabase Auth also supplies its provider-side login rate controls.

## Database test

Run the opt-in database suite only against a disposable Supabase project with this migration applied. Set TEST_SUPABASE_URL, TEST_SUPABASE_SERVICE_ROLE_KEY and TEST_DATABASE_IS_DISPOSABLE=true in the shell, then npm run test:database. These are test-process variables, never app variables.

It checks real slot creation, concurrent contention, idempotent replay, status transitions, cancellation release and blocked intervals. It makes temporary settings changes and cleans up test-created records. Never point it at a live studio database. Missing test credentials produce a skipped suite, not a passing persistence claim.
