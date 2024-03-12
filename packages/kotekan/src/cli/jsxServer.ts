#!/usr/bin/env bun --conditions react-server --preload ../../packages/kotekan/src/cli/preload-jsx.ts
import { server } from "../server";

const development = Bun.env.NODE_ENV === "development";
const hostname = Bun.env.JSX_HOSTNAME;
const envPort = Bun.env.JSX_PORT;
const socket = Bun.env.JSX_SOCKET;

const port = Number(envPort ?? 3001);

const jsxServer = await server({
	mode: "jsx",
	hostname,
	port,
	socket,
	mdxEnabled: true,
	development,
});

const listening = jsxServer.hostname
	? `at http://${jsxServer.hostname}:${jsxServer.port}`
	: "on a socket";

console.log(`🥁 Kotekan JSX server listening ${listening}`);
