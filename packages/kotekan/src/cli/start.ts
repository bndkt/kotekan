import path from "node:path";

const socket = "/tmp/kotekan.sock";

export const startCommand = async (development = false) => {
	const ssrServerPort = 3000;
	const jsxServerPort = 3001;

	if (development) {
		console.log("🚀 Running Kotekan in dev mode ...");
	}

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

	const jsxPreloadPath = path.join(import.meta.dir, "jsxPreload.ts");
	const jsxServerPath = path.join(import.meta.dir, "jsxServer.ts");
	const ssrPreloadPath = path.join(import.meta.dir, "ssrPreload.ts");
	const ssrServerPath = path.join(import.meta.dir, "ssrServer.ts");

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
	});

	Bun.sleep(1000);

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
	});
};
