import { pathToFileURL, type FileSystemRouter } from "bun";
import { PassThrough } from "node:stream";
import { type FunctionComponent } from "react";
// @ts-expect-error Untyped import
import { renderToPipeableStream as renderToJsxStream } from "react-server-dom-esm/server.node"; // @todo

import type { BuildResult } from "../../builder";
import type { RenderingStrategy } from "..";
import { createDocumentElement } from "./createDocumentElement";

interface FetchProps {
	mode: RenderingStrategy;
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

		const moduleBasePath = new URL("./src", pathToFileURL(process.cwd())).href;
		console.log({ moduleBasePath });
		const { pipe } = await renderToJsxStream(
			JsxDocumentElement,
			moduleBasePath,
		);
		const jsxStream = pipe(new PassThrough()); // @todo: renderToJsxStream(JsxDocumentElement, {});

		// Send JSX
		return new Response(jsxStream, {
			headers: { "Content-Type": "text/x-component; charset=utf-8" },
		});
	}

	return new Response("Not found", { status: 404 });
};
