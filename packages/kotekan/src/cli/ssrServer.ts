#!/usr/bin/env bun --preload ../../packages/kotekan/src/cli/ssrPreload.ts

import { boolFromEnv } from "../lib/boolFromEnv";
import { numberFromEnv } from "../lib/numberFromEnv";
import { server } from "../server";

const development = Bun.env.NODE_ENV === "development";

const ssrServer = await server({
	mode: "ssr",
	hostname: Bun.env.SSR_HOSTNAME,
	port: numberFromEnv("SSR_PORT"),
	jsxServer: {
		hostname: Bun.env.JSX_HOSTNAME,
		port: numberFromEnv("JSX_PORT"),
		socket: Bun.env.JSX_SOCKET,
	},
	mdxEnabled: boolFromEnv("MDX_ENABLED"),
	development,
});

console.log(
	`🥁 Kotekan SSR server listening at http://${ssrServer.hostname}:${ssrServer.port}`,
);
