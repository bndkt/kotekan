import { boolFromEnv } from "../../lib/boolFromEnv";
import { numberFromEnv } from "../../lib/numberFromEnv";
import { server } from "../../server";

const development = Bun.env.NODE_ENV === "development";

const ssrServer = await server({
	mode: "ssr",
	hostname: Bun.env.SSR_HOSTNAME,
	port: numberFromEnv("SSR_PORT"),
	jsxServer: {
		hostname: Bun.env.SSR_JSX_SERVER_HOSTNAME,
		port: numberFromEnv("SSR_JSX_SERVER_PORT"),
		socket: Bun.env.SSR_JSX_SERVER_SOCKET,
	},
	mdxEnabled: boolFromEnv("MDX_ENABLED"),
	development,
});

console.log(
	`🥁 Kotekan SSR server listening at http://${ssrServer.hostname}:${ssrServer.port}`,
);
