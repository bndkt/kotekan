import path from "node:path";

export const ssrCommand = async (development = false) => {
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

	console.log("SSR server command", ssrServerCommand.join(" "));

	Bun.spawn(ssrServerCommand, {
		stdout: "inherit",
		env: {
			...Bun.env,
		},
	});
};
