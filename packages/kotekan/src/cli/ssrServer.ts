#!/usr/bin/env bun --preload ../../packages/kotekan/src/cli/preload-ssr.ts
import { server } from "../server";

const development = Bun.env.NODE_ENV === "development";
const hostname = Bun.env.SSR_HOSTNAME;
const envPort = Bun.env.SSR_PORT;
const socket = Bun.env.SSR_SOCKET;

const port = Number(envPort ?? 3000);

const ssrServer = await server({
	mode: "ssr",
	hostname,
	port,
	socket,
	mdxEnabled: true,
	development,
});

console.log(
	`🥁 Kotekan SSR server listening at http://${ssrServer.hostname}:${ssrServer.port}`,
);
