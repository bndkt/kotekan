import { boolFromEnv } from "../../lib/boolFromEnv";
import { numberFromEnv } from "../../lib/numberFromEnv";
import { server } from "../../server";

const development = Bun.env.NODE_ENV === "development";

console.log("Bun.env.NODE_ENV", Bun.env.NODE_ENV);

console.log("🥁 Kotekan JSX server", {
	mode: "jsx",
	hostname: Bun.env.JSX_HOSTNAME,
	port: numberFromEnv("JSX_PORT"),
	socket: Bun.env.JSX_SOCKET,
	mdxEnabled: boolFromEnv("MDX_ENABLED"),
	development,
});

const jsxServer = await server({
	mode: "jsx",
	hostname: Bun.env.JSX_HOSTNAME,
	port: numberFromEnv("JSX_PORT"),
	socket: Bun.env.JSX_SOCKET,
	mdxEnabled: boolFromEnv("MDX_ENABLED"),
	development,
});

const listening = jsxServer.hostname
	? `at http://${jsxServer.hostname}:${jsxServer.port}`
	: "on a socket";

console.log(`🥁 Kotekan JSX server listening ${listening}`);
