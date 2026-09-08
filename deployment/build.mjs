import { spawnSync } from "node:child_process";
import { deployment, environment, internalApiUrl } from "./config.mjs";

const env = {
	...environment(),
	API_URL: process.env.API_URL || internalApiUrl,
};

for (const args of [
	["run", "--filter=@crm/db", "db:generate"],
	["run", "--filter=api", "build"],
	["run", "--filter=app", "build"],
]) {
	if (env.CRM_SERVICE === "api" && args.includes("--filter=app")) continue;
	if (env.CRM_SERVICE === "app" && args.includes("--filter=api")) continue;
	const result = spawnSync(process.execPath, args, {
		cwd: deployment.root,
		env,
		stdio: "inherit",
	});
	if (result.error) throw result.error;
	if (result.status !== 0) process.exit(result.status ?? 1);
}
