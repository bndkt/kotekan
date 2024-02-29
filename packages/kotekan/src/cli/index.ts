#!/usr/bin/env bun
// --hot
// import { server } from "../server/server";
// import { rscServer } from "../rsc/server";
import { ssrServer } from "../ssr/server";
import { rnServer } from "../rn/server";

// const s = await server({ development: Bun.env.NODE_ENV === "development" });

// const rsc = await rscServer({
// 	development: Bun.env.NODE_ENV === "development",
// });

const ssr = await ssrServer({
	mode: "ssr",
	development: Bun.env.NODE_ENV === "development",
});

// const rn = await rnServer({
// 	port: 8081,
// 	development: Bun.env.NODE_ENV === "development",
// });

console.log(
	`Listening on {rsc.url} (RSC) and ${ssr.url} (SSR) and {rn.url} (RN)`,
);
