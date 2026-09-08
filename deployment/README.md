# Render Free

Use two Free web services: `CRM_SERVICE=app` for the interface and `CRM_SERVICE=api` for the API.
The combined `all` profile is for local verification; memory measurements favor separate instances on Render.

- Runtime: Node, with `NODE_VERSION=22` and `BUN_VERSION=1.3.12`.
- Build: `bun install --frozen-lockfile && bun deployment/build.mjs`.
- Start: `node deployment/start.mjs`.
- Set compute explicitly to **Free** on both services.
- Set `APP_URL` to the interface HTTPS origin on both services.
- On the interface, set `API_URL` to the API HTTPS origin before building.
- Set `REQUIRE_RESEARCH_KEY=false`, `CRM_TELEMETRY_DISABLED=1`, and `NEXT_TELEMETRY_DISABLED=1`.
- Secrets: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
- API synchronization also requires `CRON_SECRET`; the interface does not need it.
- `ALLOWED_SIGN_IN` contains only the authorized email address.

The interface's existing `/api` proxy forwards to the API. Its browser client uses the interface origin.
The API builds OAuth callback URLs from APP_URL. Leave AUTH_COOKIE_DOMAIN unset.
The scripts resolve the Supabase certificate path for the host and retain certificate validation.
Apply database migrations and table access restrictions separately before publishing schema changes.

The API runs mailbox synchronization every five minutes while awake. Free services can sleep when inactive.
The two services share the workspace's free monthly hours. This is not an always-on background service.
The supervisor stops the child process on shutdown, and exits if a child fails.

The AI agent is not started by this profile. It requires model access, durable Workflow storage and a sandbox before activation.
Core contacts, companies, deals and mailbox integrations do not require an AI key.
Never upload `.env`, `.scratch`, or the local infrastructure notes to GitHub.

References: https://render.com/docs/free and https://render.com/docs/bun-version
