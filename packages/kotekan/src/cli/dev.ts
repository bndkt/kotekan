#!/usr/bin/env bun --hot
import path from "node:path";

import { server } from "../server";

const socket = "/tmp/kotekan.sock";

const ssrServerPort = 3000;
const jsxServerPort = 3001;

console.log("🚀 Running Kotekan in development mode ...");

Bun.spawn(
	[
		"bunx",
		"tailwindcss",
		"-i",
		"src/styles.css",
		"-o",
		"build/client/styles.css",
		"-w",
	],
	{
		stdout: "inherit",
	},
);

const preloadPath = path.join(import.meta.dir, "preload.ts");
const jsxServerPath = path.join(import.meta.dir, "jsxServer.ts");

const jsxServer = Bun.spawn(
	[
		"bun",
		"--conditions",
		"react-server",
		"--preload",
		preloadPath,
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

const ssrServer = await server({
	mode: "ssr",
	port: ssrServerPort,
	socket,
	mdxEnabled: true,
	development: true,
});

console.log(
	`🥁 Kotekan SSR server listening at http://${ssrServer.hostname}:${ssrServer.port}`,
);
