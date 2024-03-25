import path from "node:path";
import { PassThrough } from "node:stream";
import { pathToFileURL } from "bun";
import type { FunctionComponent } from "react";
// @ts-expect-error Untyped import
import { renderToPipeableStream } from "@physis/react-server-dom-esm/server.node";

import type { JsxFetcherProps } from "./types";
import { createDocumentElement } from "./createDocumentElement";

export const jsxFetcher = async (
	request: Request,
	{ build, router, buildUrlSegment, stylexFilename }: JsxFetcherProps,
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
		// console.log("🥁 Matched route:", match);

		// Route component
		// const routeComponentFilePath = match.filePath;
		const routeBuildOutput = build.serverBuildOutputs.get(match.filePath);
		if (
			!routeBuildOutput ||
			!routeBuildOutput.artifact ||
			!("path" in routeBuildOutput.artifact)
		) {
			throw new Error(`🥁 Route component file not found: ${match.filePath}`);
		}

		const routeComponentFile = await import(routeBuildOutput.artifact.path);
		const RouteComponent = routeComponentFile.default as FunctionComponent;

		// JSX (for RSC)
		const JsxDocumentElement = createDocumentElement({
			build,
			RouteComponent,
			buildUrlSegment,
			stylexFilename,
		});

		// ESM
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
