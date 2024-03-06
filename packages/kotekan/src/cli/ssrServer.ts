#!/usr/bin/env bun --hot
import { server } from "../server";

const development = Bun.env.NODE_ENV === "development";
const envPort = Bun.env.PORT;

const port = Number(envPort ?? 3000);

const jsxServer = await server({
	mode: "ssr",
	port,
	mdxEnabled: false,
	development,
});

console.log(`SSR server listening on ${jsxServer.port}`);
