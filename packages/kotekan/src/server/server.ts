import { build } from "./build";
import { fetch } from "./fetch";

interface ServerArgs {
	development?: boolean;
	port?: number;
}

export const server = async ({ development, port }: ServerArgs = {}) => {
	port ??= 3000;

	const buildOutputs = await build(development);

	return Bun.serve({
		development,
		port,
		fetch: (request) => fetch(request, buildOutputs),
	});
};
