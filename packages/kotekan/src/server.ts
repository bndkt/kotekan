export const server = () =>
	Bun.serve({
		port: 3000,
		fetch(request) {
			return new Response("Welcome to Kotekan!");
		},
	});
