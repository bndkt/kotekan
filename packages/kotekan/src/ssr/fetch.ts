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
}

export const fetch = async (
	request: Request,
	{ router, routeBuilds, buildPath, ssrEnabled, hydrationEnabled }: FetchProps,
): Promise<Response> => {
	hydrationEnabled ??= true;
	const userAgent = request.headers.get("user-agent");
	const bot = isbot(userAgent); // @todo
	// console.log("Bot?", bot, userAgent);

	const buildUrlSegment = "_build";
	const url = new URL(request.url);
	const pathSegments = url.pathname.split("/").filter(Boolean);
	const searchParams = url.searchParams;

	// Health check
	if (url.pathname === "/up") {
		return new Response("OK", { status: 200 });
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

	// Router
	const match = router.match(request.url);
	if (match) {
		const name = match.name === "/" ? "index" : match.name.substring(1);

		const routeBuild = routeBuilds.get(name);

		if (!routeBuild) {
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
		console.log("Requested route:", routeFile);

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

	return new Response(null, { status: 404 });
};
