import path from "node:path";

export const jsxCommand = async (development = false) => {
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

	console.log("JSX server command", jsxServerCommand.join(" "));

	Bun.spawnSync(jsxServerCommand, {
		stdout: "inherit",
		env: {
			...Bun.env,
		},
	});
};