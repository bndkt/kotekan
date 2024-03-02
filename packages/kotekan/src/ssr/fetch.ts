import path from "node:path";
import { PassThrough } from "node:stream";
import { type FileSystemRouter } from "bun";
import { createElement } from "react";
import { isbot } from "isbot";
// @ts-expect-error Untyped import
import { renderToReadableStream } from "react-dom/server.browser"; // @todo
// @ts-expect-error Untyped import
import { renderToPipeableStream } from "react-server-dom-esm/server.node";
// @ts-expect-error Untyped import
import { createFromNodeStream } from "react-server-dom-esm/client.node";

import type { RouteBuilds } from "./build";
// import { createReadableStreamFromReadable } from "../lib/createReadableStreamFromReadable";

interface FetchProps {
	router: FileSystemRouter;
	routeBuilds: RouteBuilds;
	buildPath: string;
	buildUrlSegment: string;
	ssrEnabled?: boolean;
	hydrationEnabled?: boolean;
	development?: boolean;
}

export const fetch = async (
	request: Request,
	{
		router,
		routeBuilds,
		buildPath,
		buildUrlSegment,
		ssrEnabled,
		hydrationEnabled,
		development,
	}: FetchProps,
): Promise<Response> => {
	hydrationEnabled ??= true;
	const userAgent = request.headers.get("user-agent");
	const bot = isbot(userAgent); // @todo

	const url = new URL(request.url);
	const pathSegments = url.pathname.split("/").filter(Boolean);
	const searchParams = url.searchParams;

	// Health check
	if (url.pathname === "/up") {
		console.log("🥁 Health check");
		return new Response("OK", { status: 200 });
	}

	// Build files
	if (pathSegments[0] === buildUrlSegment) {
		const buildFilePath = path.join(buildPath, pathSegments[1]);
		development &&
			console.log("🥁 Requested build file:", path.basename(buildFilePath));
		const buildFile = Bun.file(buildFilePath);

		return new Response(buildFile);
	}

	// Router
	const match = router.match(request.url);
	if (match) {
		const routeName = match.name === "/" ? "index" : match.name.substring(1);
		const routeBuild = routeBuilds.get(routeName);

		if (!routeBuild) {
			development && console.log("🥁 Route build not found:", routeName);
			return new Response(null, { status: 500 });
		}

		// JSX for RSC
		const rscDocumentBuild = await import(routeBuild.rscBuildFilePath);
		const rscDocument = createElement(rscDocumentBuild.Document, {
			stylesheet: routeBuild.stylexCssUrl,
		});

		const { pipe } = await renderToPipeableStream(
			rscDocument,
			routeBuild.clientComponentMap,
		);

		const rscStream = pipe(new PassThrough());

		if (searchParams.has("jsx")) {
			return new Response(rscStream);
		}

		// const routeFile =
		// 	ssrEnabled || bot || !routeBuild.csrBuildFilePath
		// 		? routeBuild.ssrBuildFilePath
		// 		: routeBuild.csrBuildFilePath;
		// development && console.log("🥁 Route file:", path.basename(routeFile));

		// const documentFile = await import(routeFile);
		const Document = createFromNodeStream(rscStream, {
			stylesheet: routeBuild.stylexCssUrl,
		});

		// HTML
		const includeBootstrap = hydrationEnabled || !ssrEnabled;
		// const bootstrapFilePath = `${buildUrlSegment}/${routeBuild.bootstrapFileUrl}`;
		const stream = await renderToReadableStream(Document, {
			bootstrapModules: includeBootstrap ? [routeBuild.bootstrapFileUrl] : [],
			// bootstrapScriptContent: "alert('Hello SSR!')",
		});

		return new Response(stream, {
			headers: { "Content-Type": "text/html" },
		});
	}

	// Public files
	const publicFileName = path.join(process.cwd(), "public", url.pathname);
	const publicFile = Bun.file(publicFileName);
	return new Response(publicFile);
};
