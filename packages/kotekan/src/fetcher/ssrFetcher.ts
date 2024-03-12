import path from "node:path";
import type { FileSystemRouter } from "bun";
import { isbot } from "isbot";
// @ts-expect-error Untyped import
import { renderToReadableStream } from "react-dom/server.edge";

import type { RenderingStrategy } from "../server";
import type { BuildResult } from "../builder";
import { createDocumentElement } from "./createDocumentElement";
import { createFromJsx } from "./createFromJsx";
import { createImportMap } from "./createImportMap";

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
	jsxServer ??= { hostname: "0.0.0.0", port: "3001" };

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
		// Modules
		if (pathSegments[1] === "modules") {
			console.log("🥁 Requested module:", pathSegments.slice(2).join("/"));
			const modulePath = pathSegments.slice(2).join("/");

			if (modulePath === "react-server-dom-esm/client") {
				console.log("🥁 Requested react-server-dom-esm/client");

				const libraryFile = Bun.file(
					path.join(
						import.meta.dir,
						"..",
						"vendor",
						searchParams.has("dev")
							? "react-server-dom-esm-client.browser.development.js"
							: "react-server-dom-esm-client.browser.production.min.js",
					),
				);
				return new Response(libraryFile, {
					headers: {
						"Cache-Control": `public, max-age=${3600 * 24 * 7}, immutable`,
						// "Cache-Control": "no-cache",
					},
				});
			}

			// const libraryFile = Bun.file(libraryPath);
			// return new Response(libraryFile, {
			// 	headers: {
			// 		"Cache-Control": `public, max-age=${3600 * 24 * 365}, immutable`,
			// 	},
			// });
		}

		// Serve client build file, either from memory or from file
		const filePath = [".", ...pathSegments.slice(1)].join("/");
		console.log("🥁 Requested file:", filePath);
		const clientBuildOutput = build.clientBuildOutputs.get(filePath);

		if (clientBuildOutput?.artifact) {
			return new Response(clientBuildOutput.artifact, {
				headers: {
					// "Cache-Control": `public, max-age=${3600 * 24 * 365}, immutable`,
					"Cache-Control": "no-cache",
				},
			});
		}

		const file = Bun.file(path.join(buildPath, "client", filePath));
		return new Response(file);
	}

	const csr = (mode === "csr" && !bot) || searchParams.has("csr");
	const hydrate = !(searchParams.get("hydrate") === "false");

	// Router
	const match = router.match(request.url);
	if (match) {
		// JSX Fetch
		const jsxUrl = url; // @todo
		url.hostname = jsxServer.hostname;
		url.port = jsxServer.port;
		const method = request.method;

		const jsxFetch = fetch(jsxUrl, {
			// @ts-expect-error Untyped, should be fixed with next stable Bun release // @todo
			unix: jsxSocket,
			method,
		});

		// Proxy JSX requests to JSX server
		if (searchParams.has("jsx")) {
			const jsxResponse = await jsxFetch;
			return new Response(jsxResponse.body, {
				headers: {
					"Content-Type": "text/x-component; charset=utf-8",
					"Cache-Control": "no-cache",
					// "X-Forwarded-Host": req.hostname,
					// "X-Forwarded-For": req.ips,
					// "X-Forwarded-Port": 3000,
					// "X-Forwarded-Proto": req.protocol,
				},
			});
		}

		// Create HTML document
		const DocumentElement = csr
			? createDocumentElement({ buildUrlSegment })
			: createFromJsx(jsxFetch);

		// HTML document stream
		const bootstrapModules = hydrate
			? csr
				? [`/${buildUrlSegment}/${build.renderScript.name}`]
				: [`/${buildUrlSegment}/${build.hydrateScript.name}`]
			: [];

		const importMap = createImportMap(development);
		const stream = await renderToReadableStream(DocumentElement, {
			importMap,
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
