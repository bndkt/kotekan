import path from "node:path";
import { resolveSync, type FileSystemRouter } from "bun";
import { createElement } from "react";
import { renderToReadableStream } from "react-dom/server";

import type { RouteBuilds } from "./build";

export const fetch = async (
	request: Request,
	{
		router,
		routeBuilds,
	}: {
		router: FileSystemRouter;
		routeBuilds: RouteBuilds;
	},
): Promise<Response> => {
	// const rootPath = path.join(process.cwd(), "src", "root.tsx");
	const buildPathname = "_build";
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

		// const buildFilePath = path.join(process.cwd(), "build", buildFileName);
		console.log("Requested route:", routeBuild.appBuildFilePath);

		const appFile = await import(routeBuild.appBuildFilePath);

		const App = createElement(appFile.App);
		console.log("appFile", App);

		const stream = await renderToReadableStream(App, {
			bootstrapModules: [`${buildPathname}/${routeBuild.hydrateBuildFileName}`],
		});

		return new Response(stream, {
			headers: { "content-type": "text/html" },
		});
	}

	// Build files
	if (pathSegments[0] === buildPathname) {
		console.log(pathSegments[1]);
		const buildFilePath = path.join(`${process.cwd()}/build`, pathSegments[1]);
		console.log("Requestedf build file:", buildFilePath);
		const buildFile = Bun.file(buildFilePath);

		if (await buildFile.exists()) {
			return new Response(buildFile);
		}

		return new Response(null, { status: 404 });
	}

	return new Response(null, { status: 404 });
};
