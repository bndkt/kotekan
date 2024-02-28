import path from "node:path";
import { type FileSystemRouter } from "bun";
// @ts-expect-error Untyped import
import { renderToReadableStream } from "react-dom/server.browser"; // @todo
import { isbot } from "isbot";

import type { RouteBuilds } from "./build";
import { createElement } from "react";

interface FetchProps {
	router: FileSystemRouter;
	routeBuilds: RouteBuilds;
	buildPath: string;
	serverRenderingEnabled?: boolean;
	hydrationEnabled?: boolean;
}

export const fetch = async (
	request: Request,
	{
		router,
		routeBuilds,
		buildPath,
		serverRenderingEnabled,
		hydrationEnabled,
	}: FetchProps,
): Promise<Response> => {
	hydrationEnabled ??= true;
	const userAgent = request.headers.get("user-agent");
	const bot = isbot(userAgent); // @todo

	const buildUrlSegment = "_build";
	const url = new URL(request.url);
	const pathSegments = url.pathname.split("/").filter(Boolean);

	// Router
	const match = router.match(request.url);
	if (match) {
		const name = match.name === "/" ? "index" : match.name.substring(1);

		const routeBuild = routeBuilds.get(name);

		if (!routeBuild) {
			return new Response(null, { status: 500 });
		}

		console.log("Requested route:", routeBuild.serverBuildFilePath);

		const appFile = await import(routeBuild.serverBuildFilePath);
		const App = createElement(appFile.App);

		const bootstrapFilePath = `${buildUrlSegment}/${routeBuild.bootstrapBuildFileName}`;
		const stream = await renderToReadableStream(App, {
			bootstrapModules:
				hydrationEnabled || !serverRenderingEnabled
					? [bootstrapFilePath]
					: undefined,
		});

		return new Response(stream, {
			headers: { "Content-Type": "text/html" },
		});
	}

	// Build files
	if (pathSegments[0] === buildUrlSegment) {
		const buildFilePath = path.join(buildPath, pathSegments[1]);
		console.log("Requested build file:", buildFilePath);
		const buildFile = Bun.file(buildFilePath);

		if (await buildFile.exists()) {
			return new Response(buildFile);
		}

		return new Response(null, { status: 404 });
	}

	return new Response(null, { status: 404 });
};
