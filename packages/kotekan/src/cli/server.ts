import { server } from "../server";
// import { rnServer } from "../rn/server";

const development = Bun.env.NODE_ENV === "development";

const ssr = await server({
	mode: "ssr",
	development,
});

// const rn = await rnServer({
// 	port: 8081,
// 	development
// });

// const ssr = Bun.serve({
// 	port: 3000,
// 	fetch(req) {
// 		return new Response("Bun!");
// 	},
// });

console.log(`Listening on ${ssr.url} ${development ? "(dev)" : "(prod)"}`);
