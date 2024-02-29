import path from "node:path";

import { router as routerFn } from "./router";
import { build } from "./build";
import { fetch } from "./fetch";
import { metro } from "./metro";

interface ServerArgs {
	mode?: "csr" | "ssr" | "ssg";
	buildDir?: string;
	port?: number;
	development?: boolean;
}

export const rnServer = async ({
	buildDir,
	port,
	development,
}: ServerArgs = {}) => {
	port ??= 8081;
	buildDir ??= "./build";

	const buildPath = path.join(process.cwd(), buildDir);

	// Router
	// const pagesDir = path.join(process.cwd(), "src", "pages");
	// const router = routerFn(pagesDir);
	// const { routes } = router;

	// Build
	// const rnBuild = await build({
	// 	buildPath,
	// 	development,
	// });

	// Metro
	metro();

	// Serve
	return Bun.serve({
		port,
		development,
		fetch: (request) =>
			fetch(request, {
				// rnBuild,
				buildPath,
			}),
	});
};
