import path from "node:path";
import type { ArgumentsCamelCase, Argv } from "yargs";

export const command = "ssr [--development]";

export const describe = "Start a Kotekan SSR server";

interface Args {
	development?: boolean;
}

export const builder = (yargs: Argv) => {
	return yargs.option("development", {
		type: "boolean",
		default: false,
		alias: "d",
	});
};

export const handler = async ({ development }: ArgumentsCamelCase<Args>) => {
	if (development) {
		console.log("🚀 Running Kotekan in dev mode ...");
	}

	const ssrPreloadPath = path.join(
		import.meta.dir,
		"..",
		"scripts",
		"ssrPreload.ts",
	);
	const ssrServerPath = path.join(
		import.meta.dir,
		"..",
		"scripts",
		"ssrServer.ts",
	);
	const ssrServerCommand = [
		"bun",
		development ? "--hot" : "",
		"--preload",
		ssrPreloadPath,
		ssrServerPath,
	];

	Bun.spawn(ssrServerCommand, {
		stdout: "inherit",
		env: {
			...Bun.env,
		},
	});
};
