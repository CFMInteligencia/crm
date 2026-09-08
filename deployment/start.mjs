import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { deployment, environment, internalApiUrl } from "./config.mjs";

const env = environment();
const service = env.CRM_SERVICE || "all";
if (!["all", "app", "api"].includes(service))
	throw new Error("Invalid CRM_SERVICE");
const children = [];
let stopping = false;
let syncing = false;
const shutdown = new AbortController();

function stop(code) {
	if (stopping) return;
	stopping = true;
	shutdown.abort();
	clearInterval(timer);
	for (const child of children) child.kill("SIGTERM");
	const timeout = setTimeout(() => {
		for (const child of children) child.kill("SIGKILL");
	}, deployment.shutdownTimeoutMs);
	timeout.unref();
	process.exitCode = code;
}

function start(command, args, directory, childEnv) {
	const child = spawn(command, args, {
		cwd: resolve(deployment.root, directory),
		env: childEnv,
		stdio: "inherit",
	});
	children.push(child);
	child.once("error", () => {
		console.error(`[deployment] Could not start ${directory}`);
		stop(1);
	});
	child.once("exit", (code) => {
		if (!stopping) stop(code || 1);
	});
}

async function sync() {
	if (service === "app" || syncing || stopping || !env.CRON_SECRET) return;
	syncing = true;
	try {
		const syncBase =
			service === "api"
				? `http://127.0.0.1:${env.PORT || deployment.apiPort}`
				: internalApiUrl;
		const response = await fetch(`${syncBase}/internal/sync/mailboxes`, {
			method: "POST",
			headers: { authorization: `Bearer ${env.CRON_SECRET}` },
			signal: AbortSignal.any([
				shutdown.signal,
				AbortSignal.timeout(deployment.syncTimeoutMs),
			]),
		});
		if (!response.ok)
			console.error(`[deployment] Mailbox sync returned ${response.status}`);
		await response.body?.cancel();
	} catch {
		console.error("[deployment] Mailbox sync could not complete");
	} finally {
		syncing = false;
	}
}

const timer = setInterval(() => {
	void sync();
}, deployment.syncIntervalMs);
timer.unref();

if (service !== "app")
	start("bun", ["--smol", "dist/main.js"], "apps/api", {
		...env,
		API_URL: env.APP_URL,
		PORT:
			service === "api"
				? env.PORT || String(deployment.apiPort)
				: String(deployment.apiPort),
	});
if (service !== "api")
	start(
		"node",
		[
			"node_modules/next/dist/bin/next",
			"start",
			"-p",
			env.PORT || String(deployment.webPort),
		],
		"apps/app",
		{
			...env,
			API_URL: env.APP_URL,
			NEXT_PUBLIC_API_URL: env.API_URL || internalApiUrl,
		},
	);

process.once("SIGTERM", () => stop(0));
process.once("SIGINT", () => stop(0));
