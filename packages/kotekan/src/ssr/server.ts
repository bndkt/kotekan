import path from "node:path";

import { router as routerFn } from "./router";
import { build } from "./build";
import { fetch } from "./fetch";

export type RenderMode = "csr" | "ssr" | "ssg";

interface ServerProps {
	mode?: RenderMode;
	buildDir?: string;
	port?: number;
	development?: boolean;
}

export const ssrServer = async (props: ServerProps = {}) => {
	// Defaults
	const mode = props.mode ?? "ssr";
	const port = props.port ?? 3000;
	const buildDir = props.buildDir ?? "./build";
	const development = props.development ?? false;

	// Paths
	const buildPath = path.join(process.cwd(), buildDir);
	const buildUrlSegment = "_build";

	// Router
	const pagesDir = path.join(process.cwd(), "src", "pages");
	const router = routerFn(pagesDir);
	const { routes } = router;

	// Build
	const routeBuilds = await build({
		mode,
		routes,
		buildPath,
		buildUrlSegment,
		development,
	});

	// Serve
	return Bun.serve({
		port,
		development,
		fetch: (request: Request) =>
			fetch(request, {
				mode,
				routeBuilds,
				router,
				buildPath,
				buildUrlSegment,
				development,
			}),
		error: (error) => {
			console.error(error);
			return new Response(null, { status: 404 });
		},
	});
};
