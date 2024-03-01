import path from "node:path";
import { PassThrough } from "node:stream";
import { type FileSystemRouter } from "bun";
import { createElement } from "react";
// @ts-expect-error Untyped import
import { renderToReadableStream } from "react-dom/server.browser"; // @todo
// @ts-expect-error Untyped import
import { renderToPipeableStream } from "react-server-dom-esm/server.node";
import { isbot } from "isbot";

import type { RouteBuilds } from "./build";
import { createReadableStreamFromReadable } from "../lib/createReadableStreamFromReadable";

interface FetchProps {
	router: FileSystemRouter;
	routeBuilds: RouteBuilds;
	buildPath: string;
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
		ssrEnabled,
		hydrationEnabled,
		development,
	}: FetchProps,
): Promise<Response> => {
	hydrationEnabled ??= true;
	const userAgent = request.headers.get("user-agent");
	const bot = isbot(userAgent); // @todo

	const buildUrlSegment = "_build";
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

		const stylesheet = `${buildUrlSegment}/${routeBuild.stylexCssFileName}`;

		// JSX (for RSC)
		if (searchParams.has("jsx")) {
			// const rsrouteFile = routeBuild.rscBuildFilePath ?? "";
			const rscDocumentFile = await import(routeBuild.rscBuildFilePath);
			const rscDocument = createElement(rscDocumentFile.Document, {
				stylesheet,
			});

			const { pipe } = await renderToPipeableStream(
				rscDocument,
				routeBuild.clientComponentMap,
			);
			const rscStream = createReadableStreamFromReadable(
				pipe(new PassThrough()),
			);
			return new Response(rscStream);
		}

		const routeFile =
			ssrEnabled || bot || !routeBuild.csrBuildFilePath
				? routeBuild.ssrBuildFilePath
				: routeBuild.csrBuildFilePath;
		development && console.log("🥁 Route file:", path.basename(routeFile));

		const documentFile = await import(routeFile);
		const Document = createElement(documentFile.Document, { stylesheet });

		// HTML
		const includeBootstrap = hydrationEnabled || !ssrEnabled;
		const bootstrapFilePath = `${buildUrlSegment}/${routeBuild.bootstrapFileName}`;
		const stream = await renderToReadableStream(Document, {
			bootstrapModules: includeBootstrap ? [bootstrapFilePath] : undefined,
			// bootstrapScriptContent: "alert('Hello SSR!')",
		});

		return new Response(stream, {
			headers: { "Content-Type": "text/html" },
		});
	}

	const publicFileName = path.join(process.cwd(), "public", url.pathname);
	const publicFile = Bun.file(publicFileName);
	return new Response(publicFile);
};
