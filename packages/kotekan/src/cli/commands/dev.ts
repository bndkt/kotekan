import path from "node:path";
import type { ArgumentsCamelCase, Argv } from "yargs";

export const command = "dev [--development]";

export const describe = "Start the Kotekan dev server";

interface Args {
	development?: boolean;
}

export const builder = (yargs: Argv) => {
	return yargs.option("development", {
		type: "boolean",
		default: true,
		alias: "d",
	});
};

const socket = "/tmp/kotekan.sock";

export const handler = async ({ development }: ArgumentsCamelCase<Args>) => {
	const jsxServerPort = 3001;

	if (development) {
		console.log("🚀 Running Kotekan in dev mode ...");
	}

	// Tailwind
	// Bun.spawn(
	// 	[
	// 		"bunx",
	// 		"tailwindcss",
	// 		"-i",
	// 		"src/styles.css",
	// 		"-o",
	// 		"build/client/styles.css",
	// 		development ? "-w" : "-m",
	// 	],
	// 	{
	// 		stdout: "inherit",
	// 	},
	// );

	// JSX
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

	// console.log(jsxServerCommand.join(" "));

	const jsxServer = Bun.spawn(jsxServerCommand, {
		stdout: "inherit",
		env: {
			JSX_PORT: jsxServerPort.toString(),
			JSX_SOCKET: socket,
			...Bun.env,
		},
		onExit: () => {
			ssrServer.kill();
		},
	});

	// SSR
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

	// console.log(ssrServerCommand.join(" "));

	const ssrServer = Bun.spawn(ssrServerCommand, {
		stdout: "inherit",
		env: {
			SSR_JSX_SERVER_SOCKET: socket,
			SSR_JSX_SERVER_PORT: jsxServerPort.toString(),
			...Bun.env,
		},
		onExit: () => {
			jsxServer.kill();
		},
	});
};
