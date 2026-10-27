# She.Epics Photography

An editorial wedding photography website built with Next.js App Router, strict TypeScript, Tailwind CSS, Motion, React Hook Form, Zod, Supabase PostgreSQL and Supabase Auth. Prepared for Vercel deployment.

## Current state

The public pages, filterable sample portfolio, accessible photo lightbox, configurable film player, four-step appointment request UI, server endpoints, database migration, and protected studio administration are implemented.

This is **not yet a production launch**. The original logo and reference image were not attached. Sample Unsplash photography is explicitly labelled and is not represented as studio work. No testimonials, biographies, contact details, prices or films have been invented. Supabase, real administrator accounts, email delivery, official media, and production hosting require configuration and verification.

## Local development

Use Node.js 24 LTS and npm. Run:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

On PowerShell, use `Copy-Item .env.example .env.local`. Open http://localhost:3000. The public site renders without credentials; enquiry endpoints return an honest 503 until configured. Do not share secrets in source code or public environment variables.

## Commands

| Command               | Purpose                                                    |
| --------------------- | ---------------------------------------------------------- |
| npm run dev           | Development server                                         |
| npm run build         | Production compilation                                     |
| npm run start         | Serve the production build                                 |
| npm run typecheck     | Generate route types and check strict TypeScript           |
| npm run lint          | ESLint, including React rules                              |
| npm run format        | Format source                                              |
| npm run format:check  | Verify formatting                                          |
| npm run test          | Unit and mocked service-boundary tests                     |
| npm run test:e2e      | Desktop/mobile Playwright tests against a production build |
| npm run test:database | Opt-in tests against a disposable Supabase database        |

Before browser tests, run `npx playwright install chromium` and `npm run build`. Playwright starts and stops the server automatically. Its successful-submission scenarios intercept API responses **only within tests**; they do not prove real persistence. The database suite is separately gated and never defaults to production credentials.

## Architecture

- `src/app`: routes, metadata, API handlers and error boundaries.
- `src/components`: shared layout, UI controls, image, modal and motion primitives.
- `src/features/home`: homepage composition.
- `src/features/portfolio`: typed stories, filtering, galleries and video playback.
- `src/features/booking`: request schema, wizard, date display and server orchestration.
- `src/features/contact`: contact form and shared schema.
- `src/features/admin`: authenticated staff tools and server actions.
- `src/config`: editable studio content and services.
- `src/lib`: server-only auth, database, rate limiting and email integrations.
- `supabase/migrations`: versioned database schema and transactional booking functions.
- `tests`: unit, service-boundary, browser and opt-in database verification.

See [architecture](docs/architecture.md), [booking rules](docs/booking-system.md), [components](docs/components.md), and [deployment](docs/deployment.md).

## Environment

| Variable                             | Use                                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------ |
| NEXT_PUBLIC_SITE_URL                 | Exact application origin, including scheme; used for metadata and public API origin checks |
| NEXT_PUBLIC_SUPABASE_URL             | Supabase project URL                                                                       |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Public project key used only for Supabase Auth                                             |
| SUPABASE_SERVICE_ROLE_KEY            | Private backend database credential; never expose to browsers                              |
| RATE_LIMIT_SECRET                    | Private random secret, at least 32 bytes, for hashing rate-limit identifiers               |
| RESEND_API_KEY                       | Optional private Resend API key                                                            |
| EMAIL_FROM                           | Verified sender for optional notifications                                                 |
| STUDIO_NOTIFICATION_EMAIL            | Studio recipient for optional notifications                                                |

Availability, booking and contact require the database and rate-limit secret. Notifications are optional and never affect the truth of the persisted booking response.

## Supabase setup

1. Create a Supabase project for development.
2. Apply `supabase/migrations/202610270001_studio.sql` using the Supabase SQL editor, or link the project with the Supabase CLI and run `supabase db push`.
3. Set the environment variables above and restart the application.
4. Create staff users in Supabase Auth. Disable public sign-ups if this project serves only the studio.
5. With a trusted server-side Admin API, set each approved user's **app_metadata** to include `{"role":"admin"}`. Never use editable user metadata for authorization.
6. Sign in at `/admin/login`. Add working hours and review the default Asia/Kolkata time zone, 30-minute duration, 24-hour notice and 180-day horizon.
7. Make and review a test request. Confirm, cancel and verify slot release.

No working hours are seeded because business availability was not supplied. There will be no bookable slots until staff configure them. RLS is enabled with no browser policies. Anonymous and authenticated clients cannot read or mutate business tables or call privileged booking functions. Every staff action is authorized on the server.

## Booking and contact

The server validates payloads, enforces request origin, limits public requests through PostgreSQL, and creates a pending request transactionally. A PostgreSQL exclusion constraint rejects overlapping active appointment ranges. Schedule mutations share a lock with booking creation. Pending requests do not automatically expire.

Contact enquiries are stored and visible in the private admin area. Email notifications apply to appointment requests; contact messages do not currently trigger email. Cancellation releases a slot; cancelled appointments cannot be reopened.

## Content and official assets

Edit `src/config/site.ts` for contact links, the official logo path, hero image and studio description. Place the supplied logo under `public/images/brand/` and set its path; keep its proportions. The current text label is a temporary identifier, not a recreated official logo.

Replace sample stories in `src/features/portfolio/data/stories.ts` with approved projects. Use local images under `public/images/` or add the actual image host to `next.config.ts`. Provide accurate alt text and set `sample: false` only for approved work. Replace service photographs in `src/config/services.ts`. Remote samples require access to images.unsplash.com.

Films accept `{provider:"youtube",source:"VIDEO_ID"}`, `{provider:"vimeo",source:"NUMERIC_ID"}`, or `{provider:"local",source:"/videos/film.mp4"}`. Local videos go under `public/videos`. Players load only when opened. Add approved captions to local films before publication where speech or meaningful audio is present.

Testimonials render only when approved quotes are added to the centralized testimonials array. Instagram and WhatsApp links appear only when configured. Founder/team biography and behind-the-scenes photographs remain editorial inputs to supply, not fabricated content. The privacy page requires studio-specific legal and retention information before launch.

## Deployment

Deploy the repository as a Next.js project on Vercel. Add environment variables, set the canonical origin, apply migrations to the intended database, configure real availability, and run staging verification. Do not deploy a static export: API routes and protected administration require the server runtime. Full instructions and release gates are in [deployment.md](docs/deployment.md).

## Verification limits

Automated API/service tests use mocked data access. Browser fixtures exercise the UI without writing customer data. Live database race conditions, RLS, Auth refresh, provider delivery, real film playback and production hosting must be checked in a configured staging environment. See `docs/verification.md` for the observed run results.
