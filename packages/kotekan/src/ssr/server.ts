import path from "node:path";

import { router as routerFn } from "./router";
import { build } from "./build";
import { fetch } from "./fetch";

interface ServerArgs {
	mode?: "csr" | "ssr" | "ssg";
	buildDir?: string;
	port?: number;
	development?: boolean;
}

export const ssrServer = async ({
	mode,
	buildDir,
	port,
	development,
}: ServerArgs = {}) => {
	mode ??= "ssr";
	port ??= 3000;
	buildDir ??= "./build";

	const buildPath = path.join(process.cwd(), buildDir);
	const hydrationEnabled = mode === "ssr";
	const serverRenderingEnabled = mode !== "csr";

	// Router
	const pagesDir = path.join(process.cwd(), "src", "pages");
	const router = routerFn(pagesDir);
	const { routes } = router;

	// Build
	const routeBuilds = await build({
		routes,
		buildPath,
		development,
		serverRenderingEnabled,
	});

	// Serve
	return Bun.serve({
		port,
		development,
		fetch: (request) =>
			fetch(request, {
				routeBuilds,
				router,
				buildPath,
				serverRenderingEnabled,
				hydrationEnabled,
			}),
	});
};
