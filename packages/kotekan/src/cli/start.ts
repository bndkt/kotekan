#!/usr/bin/env bun
import path from "node:path";

const socket = "/tmp/kotekan.sock";

export const startCommand = async (development = false) => {
	const ssrServerPort = 3000;
	const jsxServerPort = 3001;

	if (development) {
		console.log("🚀 Running Kotekan in dev mode ...");
	}

	Bun.spawn(
		[
			"bunx",
			"tailwindcss",
			"-i",
			"src/styles.css",
			"-o",
			"build/client/styles.css",
			development ? "-w" : "-m",
		],
		{
			stdout: "inherit",
		},
	);

	const preloadPath = path.join(import.meta.dir, "preload.ts");
	const jsxServerPath = path.join(import.meta.dir, "jsxServer.ts");
	const ssrServerPath = path.join(import.meta.dir, "ssrServer.ts");

	const jsxServer = Bun.spawn(
		[
			"bun",
			"--conditions",
			"react-server",
			"--preload",
			preloadPath,
			development ? "--hot" : "",
			jsxServerPath,
		],
		{
			stdout: "inherit",
			env: {
				JSX_PORT: jsxServerPort.toString(),
				JSX_SOCKET: socket,
				...Bun.env,
			},
		},
	);

	const ssrServer = Bun.spawn(
		[
			"bun",
			// "--preload",
			// preloadPath,
			development ? "--hot" : "",
			ssrServerPath,
		],
		{
			stdout: "inherit",
			env: {
				SSR_PORT: ssrServerPort.toString(),
				SSR_SOCKET: socket,
				...Bun.env,
			},
		},
	);
};
