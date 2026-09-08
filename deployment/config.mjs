import { resolve } from "node:path";

export const deployment = {
	root: resolve(import.meta.dirname, ".."),
	apiPort: 3001,
	webPort: 10000,
	syncIntervalMs: 5 * 60 * 1000,
	syncTimeoutMs: 2 * 60 * 1000,
	shutdownTimeoutMs: 10000,
};

export const internalApiUrl = `http://127.0.0.1:${deployment.apiPort}`;

export function environment() {
	const env = { ...process.env };
	if (env.RENDER_EXTERNAL_HOSTNAME) {
		env.APP_URL = `https://${env.RENDER_EXTERNAL_HOSTNAME}`;
	}
	if (!env.APP_URL) throw new Error("APP_URL is required");
	if (!env.DATABASE_URL) throw new Error("DATABASE_URL is required");
	const database = new URL(env.DATABASE_URL);
	database.searchParams.set("sslmode", "verify-full");
	database.searchParams.set(
		"sslrootcert",
		resolve(deployment.root, "deployment/supabase-ca.crt"),
	);
	env.DATABASE_URL = database.toString();
	env.NODE_ENV = "production";
	env.CRM_TELEMETRY_DISABLED = "1";
	env.NEXT_TELEMETRY_DISABLED = "1";
	return env;
}
