import path from "node:path";

const socket = "/tmp/kotekan.sock";

export const ssrCommand = async (development = false) => {
	const ssrServerPort = 3000;

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

	// console.log(ssrServerCommand.join(" "));

	const ssrServer = Bun.spawnSync(ssrServerCommand, {
		stdout: "inherit",
		env: {
			SSR_PORT: ssrServerPort.toString(),
			SSR_SOCKET: socket,
			...Bun.env,
		},
	});
};
