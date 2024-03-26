#!/usr/bin/env -S bun --conditions react-server
import { boolFromEnv } from "../../lib/boolFromEnv";
import { numberFromEnv } from "../../lib/numberFromEnv";
import { server } from "../../server";

const development = process.env.NODE_ENV === "development";

const jsxServer = await server({
	mode: "jsx",
	hostname: process.env.JSX_HOSTNAME,
	port: numberFromEnv("JSX_PORT"),
	socket: process.env.JSX_SOCKET,
	mdxEnabled: boolFromEnv("MDX_ENABLED"),
	development,
});

const listening = process.env.JSX_SOCKET
	? "on a socket"
	: `at http://${jsxServer.hostname}:${jsxServer.port}`;

console.log(`🥁 Kotekan JSX server listening ${listening}`);
