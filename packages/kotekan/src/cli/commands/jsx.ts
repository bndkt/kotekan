import path from "node:path";

const socket = "/tmp/kotekan.sock";

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

	const jsxServer = Bun.spawnSync(jsxServerCommand, {
		stdout: "inherit",
		env: {
			...Bun.env,
		},
	});
};
