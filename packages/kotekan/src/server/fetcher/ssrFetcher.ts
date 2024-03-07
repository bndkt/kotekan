import path from "node:path";
import { pathToFileURL, type FileSystemRouter } from "bun";
import { isbot } from "isbot";
// @ts-expect-error Untyped import
import { renderToReadableStream as renderToHtmlStream } from "react-dom/server.edge"; // @todo
// @ts-expect-error Untyped import
import { createFromFetch } from "react-server-dom-esm/client.browser"; // @todo

import type { BuildResult } from "../../builder";
import type { RenderingStrategy } from "..";
import { createDocumentElement } from "./createDocumentElement";

interface FetchProps {
	mode: RenderingStrategy;
	build: BuildResult;
	router: FileSystemRouter;
	buildPath: string;
	buildUrlSegment: string;
	jsxServer?: {
		hostname: string;
		port: string;
	};
	jsxSocket?: string;
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
		jsxSocket,
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
				"Cache-Control": `public, max-age=${3600 * 24 * 365}, immutable`,
			},
		});
	}

	const csr = (mode === "csr" && !bot) || searchParams.has("csr");
	const hydrate = !(searchParams.get("hydrate") === "false");

	// Router
	const match = router.match(request.url);
	if (match) {
		// JSX Fetch
		const jsxUrl = url;
		url.hostname = jsxServer.hostname;
		url.port = jsxServer.port;
		const jsxFetch = fetch(jsxUrl, {
			unix: jsxSocket,
		});

		// Forward JSX requests to JSX server
		if (searchParams.has("jsx")) {
			const jsxResponse = await jsxFetch;
			return new Response(await jsxResponse.arrayBuffer(), {
				headers: {
					"Content-Type": "text/x-component; charset=utf-8",
					"Cache-Control": "no-cache",
				},
			});
		}

		// function createFromNodeStream(stream, moduleRootPath, moduleBaseURL)
		// const clientComponentsPath = path.join(buildPath, "client", "components");
		// const jsxStreamOptions = { ssrManifest: { moduleMap: {} } };
		const moduleBaseURL = new URL("./src", pathToFileURL(process.cwd())).href;
		console.log({ moduleBaseURL });
		const options = {};
		const DocumentElement = csr
			? createDocumentElement({ build, buildUrlSegment })
			: // createFromNodeStream(stream, moduleRootPath, moduleBaseURL, options)
			  createFromFetch(jsxFetch, moduleBaseURL, options); // @todo
		// : createFromJsxStream(jsxStream, buildPath, "./build/client/components");

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
	return new Response(publicFile, {
		headers: {
			"Content-Type": "text/html; charset=utf-8",
			"Cache-Control": `public, max-age=${3600}`,
		},
	});
};
