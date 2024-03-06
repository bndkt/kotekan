#!/usr/bin/env bun --hot --conditions react-server
import { server } from "../server";

const development = Bun.env.NODE_ENV === "development";
const envPort = Bun.env.PORT;

const port = Number(envPort ?? 3001);

const jsxServer = await server({
	mode: "jsx",
	port,
	mdxEnabled: false,
	development,
});

console.log(`JSX server listening on ${jsxServer.port}`);
