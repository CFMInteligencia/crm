# Render Free

The web interface and API run in one Free web service. The Next.js server owns the public port.
Its existing `/api` proxy forwards requests to the API on port 3001. Google redirects to the public origin.
The supervisor stops both processes when either fails and runs mailbox synchronization every five minutes while awake.
Render can suspend the service when inactive; synchronization resumes after it wakes. This is not an always-on background service.

Use the Node runtime, Bun 1.3.12, Node 22, repository root, and the deployment branch.

- Build command: `bun install --frozen-lockfile && bun deployment/build.mjs`
- Start command: `bun deployment/start.mjs`
- Compute: **Free**, explicitly selected.
- Variables: `BUN_VERSION=1.3.12`, `NODE_VERSION=22`, `REQUIRE_RESEARCH_KEY=false`, `CRM_TELEMETRY_DISABLED=1`, `NEXT_TELEMETRY_DISABLED=1`.
- Secrets: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `CRON_SECRET`.
- Access: `ALLOWED_SIGN_IN` contains only the authorized user's email address.

Render supplies the public hostname; the scripts derive APP_URL and configure the separate internal and OAuth API origins.
The scripts set the Supabase CA path for the current host without disabling certificate validation.
Run database migrations separately against the dedicated database and apply the table restrictions before release.
Never include `.env`, `.scratch`, or the deployment notes with account details in uploaded source changes.

The AI agent is not started by this profile. Before enabling it, configure model access, durable Workflow storage and a sandbox.
Core contacts, companies, deals and mailbox integrations do not require an AI model key.

References: https://render.com/docs/free and https://render.com/docs/bun-version
