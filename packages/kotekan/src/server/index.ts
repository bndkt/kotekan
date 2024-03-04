import path from "node:path";

import { router as routerFn } from "./router";
import { builder } from "./builder";
import { fetcher } from "./fetcher";

export type RenderingStrategies = "csr" | "ssr" | "ssg";

interface ServerProps {
	mode?: RenderingStrategies;
	buildDir?: string;
	port?: number;
	development?: boolean;
}

export const server = async (props: ServerProps = {}) => {
	// Defaults
	const mode = props.mode ?? "ssr";
	const port = props.port ?? 3000;
	const buildDir = props.buildDir ?? "./build";
	const development = props.development ?? false;
	const mdxEnabled = true;

	// Paths
	const buildPath = path.join(process.cwd(), buildDir);
	const buildUrlSegment = "_build";

	// Router
	const dir = path.join(process.cwd(), "src", "pages");
	const router = routerFn({ dir, mdxEnabled });
	const { routes } = router;
	console.log("🥁 Routes", routes);

	// Build
	const build = await builder({
		routes,
		buildPath,
		buildUrlSegment,
		mdxEnabled,
		development,
	});

	// Serve
	return Bun.serve({
		port,
		development,
		fetch: (request: Request) =>
			fetcher(request, {
				mode,
				build,
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
