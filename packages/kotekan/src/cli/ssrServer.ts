#!/usr/bin/env bun
import { server } from "../server";

const development = Bun.env.NODE_ENV === "development";
const envPort = Bun.env.PORT;
const socket = Bun.env.SOCKET;

const port = Number(envPort ?? 3000);

const jsxServer = await server({
	mode: "ssr",
	port,
	socket,
	mdxEnabled: true,
	development,
});

// console.log(`SSR server listening on ${jsxServer.port}`);
