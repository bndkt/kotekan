import { fetch } from "./fetch";

interface ServerArgs {
	development?: boolean;
	port?: number;
}

export const server = ({ development, port }: ServerArgs = {}) => {
	port ??= 3000;

	return Bun.serve({
		development,
		port,
		fetch,
	});
};
