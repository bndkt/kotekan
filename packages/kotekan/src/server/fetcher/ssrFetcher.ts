import path from "node:path";
import { resolveSync, type FileSystemRouter } from "bun";
import { isbot } from "isbot";
// @ts-expect-error Untyped import
import { renderToReadableStream } from "react-dom/server.edge";

import type { BuildResult } from "../../builder";
import type { RenderingStrategy } from "..";
import { createDocumentElement } from "./createDocumentElement";
import { createFromEsm } from "./createFromEsm";
import { createFromWebpack } from "./createFromWebpack";

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
	rsdVariant?: "webpack" | "esm";
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
		rsdVariant,
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
		// Modules
		console.log({ pathSegments });
		if (pathSegments[1] === "modules") {
			console.log("🥁 Requested module:", pathSegments.slice(2).join("/"));
			const modulePath = pathSegments.slice(2).join("/");

			if (modulePath === "react-server-dom-esm/client") {
				console.log("🥁 Requested react-server-dom-esm/client");

				const libraryFile = Bun.file(
					path.join(
						path.dirname(
							resolveSync("react-server-dom-esm/client", process.cwd()),
						),
						"esm",
						development
							? "react-server-dom-esm-client.browser.development.js"
							: "react-server-dom-esm-client.browser.production.min.js",
					),
				);
				return new Response(libraryFile, {
					headers: {
						// "Cache-Control": `public, max-age=${3600 * 24 * 365}, immutable`,
						"Cache-Control": "no-cache",
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
				// "Cache-Control": `public, max-age=${3600 * 24 * 365}, immutable`,
				"Cache-Control": "no-cache",
			},
		});
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
			? createDocumentElement({ build, buildUrlSegment })
			: rsdVariant === "webpack"
			  ? createFromWebpack(jsxFetch)
			  : createFromEsm(jsxFetch);

		// HTML document stream
		const bootstrapModules = hydrate
			? csr
				? [`/${buildUrlSegment}/${build.renderBootstrapFileName}`]
				: [`/${buildUrlSegment}/${build.hydrateBootstrapFileName}`]
			: [];

		const stream = await renderToReadableStream(DocumentElement, {
			bootstrapModules,
			// Set JSX for initial hydration
			// bootstrapScriptContent: `const jsx = ${JSON.stringify(jsxStream)}`,
			importMap: {
				imports: {
					react: "https://esm.sh/react@experimental?pin=v135&dev",
					"react/jsx-runtime":
						"https://esm.sh/react@experimental/jsx-runtime?pin=v135&dev",
					"react/jsx-dev-runtime":
						"https://esm.sh/react@experimental/jsx-dev-runtime?pin=v135&dev",
					"react-dom": "https://esm.sh/react-dom@experimental?pin=v135&dev",
					"react-dom/client":
						"https://esm.sh/react-dom@experimental/client?pin=v135&dev",
					"react-server-dom-esm/client":
						"/_build/modules/react-server-dom-esm/client",
				},
				// imports: {
				// 	react: "/_build/modules/react",
				// 	"react/jsx-runtime": "/_build/modules/jsx-runtime",
				// 	"react/jsx-dev-runtime": "/_build/modules/jsx-dev-runtime",
				// 	"react-dom": "/_build/modules/react-dom",
				// 	"react-dom/client": "/_build/modules/react-dom/client",
				// 	"react-server-dom-esm/client":
				// 		"/_build/modules/react-server-dom-esm/client",
				// },
			},
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
