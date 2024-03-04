import { server as serverFn } from "../server";
// import { rnServer } from "../rn/server";

console.log("process.cwd", process.cwd());
console.log("import.meta.dir", import.meta.dir);

const development = Bun.env.NODE_ENV === "development";

const server = await serverFn({
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

console.log(`Listening on ${server.url} ${development ? "(dev)" : "(prod)"}`);
