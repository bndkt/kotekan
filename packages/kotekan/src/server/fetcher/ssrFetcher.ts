import path from "node:path";
import { type FileSystemRouter } from "bun";
import { isbot } from "isbot";
// @ts-expect-error Untyped import
import { renderToReadableStream as renderToHtmlStream } from "react-dom/server.edge"; // @todo
// @ ts-expect-error Untyped import
// import { renderToPipeableStream as renderToJsxStream } from "react-server-dom-esm/server.node"; // @todo
// import { renderToPipeableStream as renderToJsxStream } from "react-server-dom-esm/server.node"; // @todo
// import { renderToReadableStream as renderToJsxStream } from "react-server-dom-webpack/server.edge"; // @todo
// @ts-expect-error Untyped import
// import { createFromReadableStream as createFromJsxStream } from "react-server-dom-webpack/client.edge"; // @todo
import { createFromFetch } from "react-server-dom-webpack/client.edge"; // @todo

import type { BuildResult } from "../../builder";
import type { RenderingStrategies } from "..";
import { createDocumentElement } from "./createDocumentElement";

interface FetchProps {
	mode: RenderingStrategies;
	build: BuildResult;
	router: FileSystemRouter;
	buildPath: string;
	buildUrlSegment: string;
	jsxServer?: {
		hostname: string;
		port: string;
	};
	development?: boolean;
}

export const ssrFetcher = async (
	request: Request,
	{
		mode,
		build,
		router,
		buildPath,
		buildUrlSegment,
		jsxServer,
		development,
	}: FetchProps,
): Promise<Response> => {
	jsxServer ??= { hostname: "localhost", port: "3001" };

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

		return new Response(buildFile, {
			headers: {
				"Cache-Control": "public, max-age=3600, immutable",
			},
		});
	}

	const csr = (mode === "csr" && !bot) || searchParams.has("csr");
	const hydrate = !(searchParams.get("hydrate") === "false");

	// Router
	const match = router.match(request.url);
	if (match) {
		// Forward JSX requests to JSX server
		if (searchParams.has("jsx")) {
			const jsxUrl = url;
			url.hostname = jsxServer.hostname;
			url.port = jsxServer.port;

			const jsxStream = await fetch(jsxUrl);

			return new Response(await jsxStream.text(), {
				headers: {
					"Content-Type": "application/json; charset=utf-8",
					"Cache-Control": "no-cache",
				},
			});
		}

		// function createFromNodeStream(stream, moduleRootPath, moduleBaseURL)
		const clientComponentsPath = path.join(buildPath, "client", "components");
		const jsxStreamOptions = { ssrManifest: { moduleMap: {} } };
		const DocumentElement = csr
			? createDocumentElement({ build, buildUrlSegment })
			: createFromFetch(fetch("http://localhost:3001"), jsxStreamOptions);
		// : createFromJsxStream(jsxStream, buildPath, "./build/client/components");

		// build.clientComponentsMap,

		// HTML document stream
		const bootstrapModules = hydrate
			? csr
				? [`/${buildUrlSegment}/bootstrap/${build.renderBootstrapFileName}`]
				: [`/${buildUrlSegment}/bootstrap/${build.hydrateBootstrapFileName}`]
			: false;
		const stream = await renderToHtmlStream(DocumentElement, {
			bootstrapModules,
			// Set JSX for initial hydration
			// bootstrapScriptContent: `const jsx = ${JSON.stringify(jsxStream)}`,
		});

		return new Response(stream, {
			headers: {
				"Content-Type": "text/html; charset=utf-8",
				"Cache-Control": "no-cache",
			},
		});
	}

	// Public files
	const publicFileName = path.join(process.cwd(), "public", url.pathname);
	const publicFile = Bun.file(publicFileName);
	return new Response(publicFile);
};
