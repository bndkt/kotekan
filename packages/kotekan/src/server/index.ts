import path from "node:path";

import { router as routerFn } from "./router";
import { builder } from "../builder";

export type RenderingStrategy = "csr" | "ssr" | "jsx";

interface ServerProps {
	mode?: RenderingStrategy;
	buildDir?: string;
	port?: number;
	mdxEnabled?: boolean;
	development?: boolean;
}

export const server = async (props: ServerProps = {}) => {
	// Defaults
	const mode = props.mode ?? "ssr";
	const port = props.port ?? 3000;
	const buildDir = props.buildDir ?? "./build";
	const mdxEnabled = props.mdxEnabled ?? true;
	const development = props.development ?? false;

	// Paths
	const buildPath = path.join(process.cwd(), buildDir);
	const buildUrlSegment = "_build";

	// Router
	const dir = path.join(process.cwd(), "src", "pages");
	const router = routerFn({ dir, mdxEnabled });
	const { routes } = router;

	// Build
	const build = await builder({
		routes,
		buildPath,
		buildUrlSegment,
		mdxEnabled,
		development,
	});

	const fetch = async (request: Request) => {
		if (mode === "jsx") {
			const { jsxFetcher } = await import("./fetcher/jsxFetcher");
			return jsxFetcher(request, {
				mode,
				build,
				router,
				buildPath,
				buildUrlSegment,
				development,
			});
		}

		const { ssrFetcher } = await import("./fetcher/ssrFetcher");
		return ssrFetcher(request, {
			mode,
			build,
			router,
			buildPath,
			buildUrlSegment,
			development,
		});
	};

	return Bun.serve({
		port,
		development,
		fetch,
		error: (error) => {
			console.error(error);
			return new Response(null, { status: 404 });
		},
	});
};
