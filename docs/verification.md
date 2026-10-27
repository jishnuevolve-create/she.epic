# Verification record

Implementation checked on 27 October 2026 (Asia/Kolkata).

## Observed passes

- Production build: all public routes, static story pages, API handlers and admin routes compiled.
- Strict TypeScript and ESLint: passed.
- Unit and mocked service-boundary tests: 29 passed.
- Playwright desktop, tablet and mobile tests: 18 passed.
- Screenshots: desktop and mobile homepage reviewed after loading below-the-fold imagery and motion.
- Public pages checked for horizontal overflow.
- Native-dialog keyboard navigation, Escape, gallery filtering and mobile navigation checked.
- Booking review gate regression verified: Continue reaches review; submission requires the final request button.
- Missing backend configuration returns an error, never a simulated booking success.

Formatting verification also passed. The tablet navigation test was corrected to follow the 700px layout breakpoint rather than treating every touch device as a narrow mobile screen.

## External checks still required

The opt-in real Supabase test was skipped because test credentials were absent. PostgreSQL migration execution, concurrent booking exclusion in a running database, RLS denial, live Auth sessions, admin mutations and email delivery are not verified against external services.

Successful browser submission tests use route fixtures. API service tests mock the database boundary. Neither is evidence of real persistence.

Official logo, reference design image, authentic studio photographs, team/behind-the-scenes content, approved testimonials, film sources, contact details and privacy policy details were not supplied. Film playback with real studio media remains unverified.

No Vercel deployment occurred. No Core Web Vitals measurement or complete accessibility audit was performed. Keyboard/modal and responsive behavior checks do not constitute WCAG certification.

## Artifacts

Playwright writes screenshots and any failure traces under ignored test-results/. The build output is in ignored .next/. These can be regenerated from source using the documented commands.
