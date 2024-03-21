import path from "node:path";
import type { ArgumentsCamelCase } from "yargs";

export const command = "start [--development]";

export const describe = "Start a Kotekan app";

export const builder = {
	development: {
		default: false,
	},
};

const socket = "/tmp/kotekan.sock";

export const handler = async ({
	development,
}: ArgumentsCamelCase<{ development: boolean }>) => {
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
	const ssrServerPort = 3000;
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
			SSR_PORT: ssrServerPort.toString(),
			SSR_SOCKET: socket,
			...Bun.env,
		},
		onExit: () => {
			jsxServer.kill();
		},
	});
};
