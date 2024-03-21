import path from "node:path";
import type { ArgumentsCamelCase } from "yargs";

export const command = "jsx [--development]";

export const describe = "Start a Kotekan JSX server";

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

	const jsxPreloadPath = path.join(
		import.meta.dir,
		"..",
		"scripts",
		"jsxPreload.ts",
	);
	const jsxServerPath = path.join(
		import.meta.dir,
		"..",
		"scripts",
		"jsxServer.ts",
	);
	const jsxServerCommand = [
		"bun",
		development ? "--hot" : "",
		"--conditions",
		"react-server",
		"--preload",
		jsxPreloadPath,
		jsxServerPath,
	];

	Bun.spawn(jsxServerCommand, {
		stdout: "inherit",
		env: {
			...Bun.env,
		},
	});
};
