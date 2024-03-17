import path from "node:path";
import type { Server } from "bun";

import type { ServerProps } from "./types";
import { router as routerFn } from "./router";
import { builder } from "../builder";

export const server = async (props: ServerProps = {}): Promise<Server> => {
	// Defaults
	const mode = props.mode ?? "ssr";
	const hostname = props.hostname ?? "localhost";
	const port = props.port ?? 3000;
	const socket = props.socket;
	const buildDir = props.buildDir ?? "./build";
	const mdxEnabled = props.mdxEnabled ?? true;
	const development = props.development ?? false;

	// Paths
	const buildPath = path.join(process.cwd(), buildDir);
	const buildUrlSegment = "_build";

	// Router
	const dir = path.join(process.cwd(), "src", "routes");
	const router = routerFn({ dir, mdxEnabled });
	const { routes } = router;

	if (development) {
		Promise.all(
			Object.values(routes).map(async (route) => {
				import(route);
			}),
		);
	}

	// Build
	const build = await builder({
		routes,
		// buildPath,
		development,
	});

	const fetch = async (request: Request): Promise<Response> => {
		if (mode === "jsx") {
			const { jsxFetcher } = await import("../fetcher/jsxFetcher");
			return jsxFetcher(request, {
				mode,
				build,
				router,
				buildPath,
				buildUrlSegment,
				development,
			});
		}

		const { ssrFetcher } = await import("../fetcher/ssrFetcher");
		return ssrFetcher(request, {
			mode,
			build,
			router,
			buildPath,
			buildUrlSegment,
			jsxSocket: socket,
			development,
		});
	};

	// JSX server can optionally listen on unix socket
	const listenerConfig =
		mode === "jsx" && socket
			? {
					unix: socket,
			  }
			: { port, reusePort: true };

	return Bun.serve({
		...listenerConfig,
		development,
		fetch,
		error: (error) => {
			console.error(error);
			return new Response(null, { status: 404 });
		},
	});
};
