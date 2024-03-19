#!/usr/bin/env bun --hot
import path from "node:path";

const socket = "/tmp/kotekan.sock";

console.log("🚀 Running Kotekan in dev mode ...");

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
	"--hot",
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

const ssrServerCommand = [
	"bun",
	"--hot",
	"--preload",
	ssrPreloadPath,
	ssrServerPath,
];

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
