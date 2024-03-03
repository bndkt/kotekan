import path from "node:path";
import { PassThrough } from "node:stream";
import { type FileSystemRouter } from "bun";
import { createElement } from "react";
import { isbot } from "isbot";
// @ts-expect-error Untyped import
import { renderToReadableStream } from "react-dom/server.browser"; // @todo
// @ts-expect-error Untyped import
import { renderToPipeableStream } from "react-server-dom-esm/server.node"; // @todo
// @ts-expect-error Untyped import
import { createFromNodeStream } from "react-server-dom-esm/client.node"; // @todo

import type { BuildResult } from "./builder";
import type { RenderingStrategies } from ".";

interface FetchProps {
	mode: RenderingStrategies;
	build: BuildResult;
	router: FileSystemRouter;
	buildPath: string;
	buildUrlSegment: string;
	development?: boolean;
}

export const fetch = async (
	request: Request,
	{ mode, build, router, buildPath, buildUrlSegment, development }: FetchProps,
): Promise<Response> => {
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
		const buildFilePath = path.join(
			buildPath,
			"client",
			pathSegments.slice(1).join("/"),
		);
		development &&
			console.log("🥁 Requested build file:", path.basename(buildFilePath));
		const buildFile = Bun.file(buildFilePath);

		return new Response(buildFile);
	}

	const csr = (mode === "csr" && !bot) || searchParams.has("csr");
	const hydrate = !(searchParams.get("hydrate") === "false");

	// Router
	const match = router.match(request.url);
	if (match) {
		const documentFile = await import(build.documentComponentFilePath);
		const routeComponentFilePath = build.routeComponentPaths.get(match.name);

		if (!routeComponentFilePath) {
			throw new Error(`🥁 Route component file not found: ${match.name}`);
		}

		const routeComponentFile = await import(routeComponentFilePath);
		const RouteComponent = createElement(routeComponentFile.default);

		// JSX for RSC
		// const rscDocumentBuild = await import(routeBuild.rscBuildFilePath);
		const RscDocumentElement = createElement(documentFile.Document, {
			routeComponent: RouteComponent,
		});

		const { pipe } = await renderToPipeableStream(
			RscDocumentElement,
			{},
			// routeBuild.clientComponentMap,
		);

		const rscStream = pipe(new PassThrough());

		if (searchParams.has("jsx")) {
			return new Response(rscStream, {
				headers: { "Content-Type": "application/json; charset=utf-8" },
			});
		}

		const DocumentElement = csr
			? createElement(documentFile.Document)
			: createFromNodeStream(rscStream);

		// HTML document stream
		const bootstrapModules = hydrate
			? csr
				? [`${buildUrlSegment}/bootstrap/${build.renderBootstrapFileName}`]
				: [`${buildUrlSegment}/bootstrap/${build.hydrateBootstrapFileName}`]
			: false;
		const stream = await renderToReadableStream(DocumentElement, {
			bootstrapModules,
			// Set JSX for initial hydration
			// bootstrapScriptContent: `const jsx = ${JSON.stringify(RscDocument)}`,
		});

		return new Response(stream, {
			headers: { "Content-Type": "text/html; charset=utf-8" },
		});
	}

	// Public files
	const publicFileName = path.join(process.cwd(), "public", url.pathname);
	const publicFile = Bun.file(publicFileName);
	return new Response(publicFile);
};
