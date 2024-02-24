import { router } from "./router";

console.log(Bun.resolveSync("./src/pages/index.tsx", process.cwd()));
const r = router();

export const server = () =>
	Bun.serve({
		port: 3000,
		fetch(request) {
			const match = r.match(request.url);

			return new Response("Welcome to Kotekan!");
		},
	});
