<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## She.Epics development conventions

- Preserve the Next.js App Router, strict TypeScript, Tailwind, Supabase and Vercel stack.
- Read relevant bundled Next.js documentation before changing framework integrations.
- Keep route files focused on routing and composition. Put feature logic under src/features.
- Keep credentials and privileged database clients in server-only modules.
- Authorize every admin mutation with requireAdmin; trust app_metadata.role only.
- Database availability and overlap constraints are authoritative. Never simulate booking success.
- Pending and confirmed appointments block slots. Cancellation is terminal.
- Update schema through migrations; use a new migration after the initial schema is deployed.
- Do not invent studio details, testimonials, client stories, biographies, prices or achievements.
- Preserve official logo proportions once supplied. Samples must remain labelled.
- Use shared tokens and components; respect reduced motion and keyboard navigation.
- Use Unicode-safe UTF-8 writes on Windows. Preserve existing user changes.
- Run npm run format:check, lint, typecheck, test and build after meaningful changes.
- Run npm run test:e2e for interaction changes. Its fixtures do not prove database persistence.
- Run test:database only against an explicitly disposable Supabase project.
- Document new configuration and verified limits. Never claim a service or deployment works without evidence.
