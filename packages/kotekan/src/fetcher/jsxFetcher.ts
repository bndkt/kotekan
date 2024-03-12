import path from "node:path";
import { PassThrough } from "node:stream";
import { pathToFileURL, type FileSystemRouter } from "bun";
import type { FunctionComponent } from "react";
// @ts-expect-error Untyped import
import { renderToPipeableStream } from "@physis/react-server-dom-esm/server.node";

import type { RenderingStrategy } from "../server";
import type { BuildResult } from "../builder";
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
	{ mode, router, buildPath, buildUrlSegment, development }: FetchProps,
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
		const routeComponentFilePath = match.filePath; // build.routeComponentPaths.get(match.name);
		if (!routeComponentFilePath) {
			throw new Error(`🥁 Route component file not found: ${match.name}`);
		}
		const routeComponentFile = await import(routeComponentFilePath);
		const RouteComponent = routeComponentFile.default as FunctionComponent;

		// JSX (for RSC)
		const JsxDocumentElement = createDocumentElement({
			// build,
			buildUrlSegment,
			RouteComponent,
		});

		// ESM
		const moduleBasePath2 = pathToFileURL(
			path.join(process.cwd(), "build", "client", "components"),
		).href;
		const moduleBasePath = pathToFileURL(path.join(process.cwd(), "src")).href;
		const options = {
			onError: undefined,
			identifierPrefix: undefined,
			onPostpone: undefined,
			// environmentName: "Server",
		};
		// renderToPipeableStream(model, moduleBasePath, options)
		const { pipe } = await renderToPipeableStream(
			JsxDocumentElement,
			moduleBasePath,
			options,
		);
		const jsxStream = pipe(new PassThrough());

		// Send JSX
		return new Response(jsxStream, {
			headers: { "Content-Type": "text/x-component; charset=utf-8" },
		});
	}

	return new Response("Not found", { status: 404 });
};
