#!/usr/bin/env bun --hot
import { ssrServer } from "../ssr/server";
// import { rnServer } from "../rn/server";

const development = Bun.env.NODE_ENV === "development";

// const ssr = await ssrServer({
// 	mode: "ssr",
// 	development,
// });

// const rn = await rnServer({
// 	port: 8081,
// 	development
// });

const ssr = Bun.serve({
	port: 3000,
	fetch(req) {
		return new Response("Bun!");
	},
});

console.log(
	`Listening on {rsc.url} (RSC) and ${ssr.url} (SSR) and {rn.url} (RN) ${
		development ? "(dev)" : "(prod)"
	}`,
);
