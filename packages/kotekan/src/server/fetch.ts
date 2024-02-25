import path from "node:path";
import { renderToReadableStream } from "react-dom/server";

import { router } from "./router";
import type { BuildOutputs } from "./build";

export const fetch = async (
	request: Request,
	buildOutputs: BuildOutputs,
): Promise<Response> => {
	const pagesDir = path.join(process.cwd(), "src", "pages");
	const rootPath = path.join(process.cwd(), "src", "root.tsx");
	const buildDir = "_build";

	const url = new URL(request.url);
	console.log(url.pathname);

	// Favicon
	if (url.pathname === "/favicon.ico") {
		return new Response(null, { status: 404 });
	}

	// Build files
	const pathSegments = url.pathname.split("/").filter(Boolean);
	console.log("pathSegments", pathSegments, buildOutputs.keys());
	if (pathSegments[0] === buildDir) {
		const buildOutput = buildOutputs.get(pathSegments[1]);

		if (buildOutput) {
			return buildOutput();
		}
	}

	const r = router(pagesDir);
	const match = r.match(request.url);
	// console.log(match);

	// const content = match?.filePath
	// 	? await Bun.file(match.filePath).text()
	// 	: "Not found";

	if (!match) {
		return new Response("Not found");
	}

	const root = await import(rootPath);

	const stream = await renderToReadableStream(root.default(), {
		bootstrapModules: [`${buildDir}/${buildOutputs.keys().next().value}`],
	});

	return new Response(stream, {
		headers: { "content-type": "text/html" },
	});
};
