# Deployment and release gates

1. Create a staging Supabase project and apply the migration.
2. Provision a staff user and assign app_metadata.role=admin through trusted Supabase administration.
3. Set all required environment variables in Vercel. Service-role and Resend keys must stay private. Set NEXT_PUBLIC_SITE_URL to the exact deployed origin and redeploy when it changes.
4. Configure studio hours, blocked dates, notice, horizon and time zone through the private admin area.
5. Configure and verify a Resend sender if email notices are required. Confirm failed notices remain retryable.
6. Replace all editorial samples, add the official logo, real films and approved studio content. Finalize the privacy policy and retention plan.
7. Run format:check, lint, typecheck, test, build and test:e2e. Run test:database against a separate disposable project.
8. Test a real staging request end to end: availability, pending persistence, confirmation, cancellation and slot release. Race two requests against one slot. Check anonymous data access denial, staff auth refresh and logout.
9. Review real desktop, tablet and mobile layouts, image crops, contrast, keyboard controls, motion preferences, film captions and Core Web Vitals. Automated viewport checks are not an accessibility certification.
10. Deploy to the production Vercel project only after staging gates and real studio content are approved.

The application must use a server deployment, not static export. No production deployment or Supabase project has been created by this implementation.

## Operations

Monitor safe server errors and Supabase health without logging customer payloads. Review pending requests regularly; they do not expire automatically. Review notification backlog when email service is unavailable. Establish retention cleanup with the studio; no destructive cleanup schedule is assumed.

Keep npm's lockfile committed. Use npm ci in CI, npm audit during dependency maintenance, and rerun the security and browser checks after dependency upgrades.
