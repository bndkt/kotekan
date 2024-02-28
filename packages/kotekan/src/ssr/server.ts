import path from "node:path";

import { router as routerFn } from "./router";
import { build } from "./build";
import { fetch } from "./fetch";

interface ServerArgs {
	buildDir?: string;
	port?: number;
	development?: boolean;
}

export const ssrServer = async ({
	buildDir,
	port,
	development,
}: ServerArgs = {}) => {
	port ??= 3000;
	buildDir ??= "./build";

	const buildPath = path.join(process.cwd(), buildDir);

	// Router
	const pagesDir = path.join(process.cwd(), "src", "pages");
	const router = routerFn(pagesDir);
	const { routes } = router;

	// Build
	const routeBuilds = await build({ routes, buildPath, development });

	// Serve
	return Bun.serve({
		port,
		development,
		fetch: (request) => fetch(request, { routeBuilds, router }),
	});
};
