#!/usr/bin/env bun --hot
import path from "node:path";

import { router as routerFn } from "../server/router";

const socket = "/tmp/kotekan.sock";

console.log("🚀 Running Kotekan in dev mode ...");

// Import all routes for hot reloading
try {
	import(path.join(process.cwd(), "src", "Root.tsx"));
	const dir = path.join(process.cwd(), "src", "routes");
	const router = routerFn({ dir, mdxEnabled: true });
	const { routes } = router;
	for (const route of Object.values(routes)) {
		import(route);
	}
} catch (error) {}

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
const jsxPreloadPath = path.join(import.meta.dir, "scripts", "jsxPreload.ts");
const jsxServerPath = path.join(import.meta.dir, "scripts", "jsxServer.ts");

const jsxServerCommand = [
	"bun",
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
		JSX_SOCKET: socket,
		...Bun.env,
	},
	onExit: () => {
		ssrServer.kill();
	},
});

// SSR
const ssrPreloadPath = path.join(import.meta.dir, "scripts", "ssrPreload.ts");
const ssrServerPath = path.join(import.meta.dir, "scripts", "ssrServer.ts");

const ssrServerCommand = ["bun", "--preload", ssrPreloadPath, ssrServerPath];

// console.log(ssrServerCommand.join(" "));

const ssrServer = Bun.spawn(ssrServerCommand, {
	stdout: "inherit",
	env: {
		SSR_JSX_SERVER_SOCKET: socket,
		...Bun.env,
	},
	onExit: () => {
		jsxServer.kill();
	},
});
