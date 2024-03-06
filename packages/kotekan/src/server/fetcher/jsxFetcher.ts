import { type FileSystemRouter } from "bun";
import { type FunctionComponent } from "react";
// @ts-expect-error Untyped import
import { renderToReadableStream as renderToJsxStream } from "react-server-dom-webpack/server.edge"; // @todo

import type { BuildResult } from "../../builder";
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

export const jsxFetcher = async (
	request: Request,
	{ mode, build, router, buildPath, buildUrlSegment, development }: FetchProps,
): Promise<Response> => {
	const url = new URL(request.url);

	// Health check
	if (url.pathname === "/up") {
		console.log("🥁 Health check");
		return new Response("OK", { status: 200 });
	}

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

		const jsxStream = renderToJsxStream(JsxDocumentElement);

		return new Response(jsxStream, {
			headers: { "Content-Type": "application/json; charset=utf-8" },
		});
	}

	return new Response("Not found", { status: 404 });
};
