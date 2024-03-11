#!/usr/bin/env bun --conditions react-server --preload ../../packages/kotekan/src/cli/preload.ts
import { server } from "../server";

const development = Bun.env.NODE_ENV === "development";
const hostname = Bun.env.HOSTNAME;
const envPort = Bun.env.PORT;
const socket = Bun.env.SOCKET;

const port = Number(envPort ?? 3001);

const jsxServer = await server({
	mode: "jsx",
	hostname,
	port,
	socket,
	mdxEnabled: true,
	development,
});

console.log(`JSX server listening on ${jsxServer.port}`);
