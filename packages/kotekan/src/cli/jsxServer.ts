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

console.log(`JSX server listening on ${jsxServer.port}`);
