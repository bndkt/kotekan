import { server } from "../server";

const development = Bun.env.NODE_ENV === "development";
const hostname = Bun.env.SSR_HOSTNAME;
const envPort = Bun.env.SSR_PORT;
const socket = Bun.env.SSR_SOCKET;

const port = Number(envPort ?? 3000);

const jsxServer = await server({
	mode: "ssr",
	hostname,
	port,
	socket,
	mdxEnabled: true,
	development,
});

// console.log(`SSR server listening on ${jsxServer.port}`);
