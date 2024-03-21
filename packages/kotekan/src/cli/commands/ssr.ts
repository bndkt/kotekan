import path from "node:path";
import type { ArgumentsCamelCase } from "yargs";

export const command = "ssr [--development]";

export const describe = "Start a Kotekan SSR server";

export const builder = {
	development: {
		default: false,
	},
};

export const handler = async ({
	development,
}: ArgumentsCamelCase<{ development: boolean }>) => {
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
