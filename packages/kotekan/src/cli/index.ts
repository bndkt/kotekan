#!/usr/bin/env bun --hot
// import { server } from "../server/server";
// import { rscServer } from "../rsc/server";
import { ssrServer } from "../ssr/server";

// const s = await server({ development: Bun.env.NODE_ENV === "development" });

// const rsc = await rscServer({
// 	development: Bun.env.NODE_ENV === "development",
// });

const ssr = await ssrServer({
	mode: "csr",
	development: Bun.env.NODE_ENV === "development",
});

console.log(`Listening on {rsc.url} (RSC) and ${ssr.url} (SSR)`);
