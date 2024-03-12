import path from "node:path";

import { server } from "../server";

const socket = undefined; // "/tmp/kotekan.sock";

export const startCommand = async (development = false) => {
	const ssrServerPort = 3000;
	const jsxServerPort = 3001;

	Bun.spawn(
		[
			"bunx",
			"tailwindcss",
			development ? "-w" : "-m",
			"-i",
			"src/styles.css",
			"-o",
			"build/client/styles.css",
		],
		{
			stdout: "inherit",
		},
	);

	const jsxServerPath = path.join(import.meta.dir, "jsxServer.ts");
	const preloadPath = path.join(import.meta.dir, "preload.ts");
	console.log(
		[
			"bun",
			"--conditions",
			"react-server",
			"--preload",
			preloadPath,
			development ? "--hot" : "",
			jsxServerPath,
		].join(" "),
	);
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

	await server({
		mode: "ssr",
		hostname: Bun.env.HOSTNAME,
		port: ssrServerPort,
		socket,
		mdxEnabled: true,
		development,
	});

	console.log(`Kotekan running at http://localhost:${ssrServerPort}`);
};
