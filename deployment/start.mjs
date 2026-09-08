import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { deployment, environment, internalApiUrl } from "./config.mjs";

const env = environment();
const children = [];
let stopping = false;
let syncing = false;

function stop(code) {
	if (stopping) return;
	stopping = true;
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
	if (syncing || stopping || !env.CRON_SECRET) return;
	syncing = true;
	try {
		const response = await fetch(`${internalApiUrl}/internal/sync/mailboxes`, {
			method: "POST",
			headers: { authorization: `Bearer ${env.CRON_SECRET}` },
			signal: AbortSignal.timeout(deployment.syncTimeoutMs),
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

start(process.execPath, ["dist/main.js"], "apps/api", {
	...env,
	API_URL: env.APP_URL,
	PORT: String(deployment.apiPort),
});
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
		NEXT_PUBLIC_API_URL: internalApiUrl,
	},
);

process.once("SIGTERM", () => stop(0));
process.once("SIGINT", () => stop(0));
