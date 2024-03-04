import path from "node:path";
import { PassThrough } from "node:stream";
import { type FileSystemRouter } from "bun";
import { type FunctionComponent } from "react";
import { isbot } from "isbot";
// @ts-expect-error Untyped import
import { renderToReadableStream as renderToHtmlStream } from "react-dom/server.bun"; // @todo
// @ts-expect-error Untyped import
import { renderToPipeableStream as renderToJsxStream } from "react-server-dom-esm/server.node"; // @todo
// import { renderToReadableStream as renderToJsxStream } from "react-server-dom-webpack/server.edge"; // @todo
// @ts-expect-error Untyped import
import { createFromNodeStream as createFromJsxStream } from "react-server-dom-esm/client.node"; // @todo

import type { BuildResult } from "../builder";
import type { RenderingStrategies } from "..";
import { createDocumentElement } from "./createDocumentElement";

interface FetchProps {
	mode: RenderingStrategies;
	build: BuildResult;
	router: FileSystemRouter;
	buildPath: string;
	buildUrlSegment: string;
	development?: boolean;
}

export const fetcher = async (
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
		// Route component
		const routeComponentFilePath = build.routeComponentPaths.get(match.name);
		if (!routeComponentFilePath) {
			throw new Error(`🥁 Route component file not found: ${match.name}`);
		}
		const routeComponentFile = await import(routeComponentFilePath);
		const RouteComponent = routeComponentFile.default as FunctionComponent;

		// JSX (for RSC)
		const JsxDocumentElement = createDocumentElement({
			build,
			buildUrlSegment,
			RouteComponent,
		});

		const { pipe } = await renderToJsxStream(
			JsxDocumentElement,
			{},
			// routeBuild.clientComponentMap,
		);

		const jsxStream = pipe(new PassThrough()); // @todo: renderToJsxStream(JsxDocumentElement, {});
		// const jsxStream = renderToJsxStream(JsxDocumentElement, {});

		if (searchParams.has("jsx")) {
			return new Response(jsxStream, {
				headers: { "Content-Type": "application/json; charset=utf-8" },
			});
		}

		const DocumentElement = csr
			? createDocumentElement({ build, buildUrlSegment })
			: createFromJsxStream(jsxStream);

		// HTML document stream
		const bootstrapModules = hydrate
			? csr
				? [`${buildUrlSegment}/bootstrap/${build.renderBootstrapFileName}`]
				: [`${buildUrlSegment}/bootstrap/${build.hydrateBootstrapFileName}`]
			: false;
		const stream = await renderToHtmlStream(DocumentElement, {
			bootstrapModules,
			// Set JSX for initial hydration
			// bootstrapScriptContent: `const jsx = ${JSON.stringify(jsxStream)}`,
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
