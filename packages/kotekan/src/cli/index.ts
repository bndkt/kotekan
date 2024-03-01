#!/usr/bin/env bun --hot
// import { server } from "../server/server";
// import { rscServer } from "../rsc/server";
import { ssrServer } from "../ssr/server";
import { rnServer } from "../rn/server";

const development = Bun.env.NODE_ENV === "development";

// const s = await server({ development: Bun.env.NODE_ENV === "development" });

// const rsc = await rscServer({
// 	development
// });

const ssr = await ssrServer({
	mode: "ssr",
	development,
});

// const rn = await rnServer({
// 	port: 8081,
// 	development
// });

console.log(
	`Listening on {rsc.url} (RSC) and {ssr.url} (SSR) and {rn.url} (RN) ${development}`,
);
