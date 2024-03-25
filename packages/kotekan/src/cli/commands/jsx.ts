import path from "node:path";
import type { ArgumentsCamelCase, Argv } from "yargs";

export const command = "jsx [--development]";

export const describe = "Start a Kotekan JSX server";

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

	// const jsxPreloadPath = path.join(
	// 	import.meta.dir,
	// 	"..",
	// 	"scripts",
	// 	"jsxPreload.ts",
	// );
	const jsxServerPath = path.join(
		import.meta.dir,
		"..",
		"scripts",
		"jsxServer.ts",
	);
	const jsxServerCommand = [
		"bun",
		"--conditions",
		"react-server",
		// "--preload",
		// jsxPreloadPath,
		jsxServerPath,
	];

	Bun.spawn(jsxServerCommand, {
		stdout: "inherit",
		env: {
			...Bun.env,
		},
	});
};
