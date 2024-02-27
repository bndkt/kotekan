import path from "node:path";
import { renderToReadableStream } from "react-dom/server";
// import { default as Root } from "../macros/demo";

import { router } from "./router";
import type { BuildArtifacts } from "./build";
import { createElement } from "react";

export const fetch = async (
	request: Request,
	buildArtifacts: BuildArtifacts,
): Promise<Response> => {
	const pagesDir = path.join(process.cwd(), "src", "pages");
	const rootPath = path.join(process.cwd(), "src", "root.tsx");
	const buildDir = "_build";

	const url = new URL(request.url);

	// Favicon
	if (url.pathname === "/favicon.ico") {
		return new Response(null, { status: 404 });
	}

	// Build files
	const pathSegments = url.pathname.split("/").filter(Boolean);
	if (pathSegments[0] === buildDir) {
		const buildArtifact = buildArtifacts.get(pathSegments[1]);

		if (buildArtifact) {
			// const file = Bun.file(buildArtifact.path);
			// console.log(file);
			// if (await file.exists()) {
			// 	return new Response(file);
			// }
			return new Response(buildArtifact);
		}

		return new Response(null, { status: 404 });
	}

	// Router
	const r = router(pagesDir);
	const match = r.match(request.url);
	// console.log(match);
	// const content = match?.filePath
	// 	? await Bun.file(match.filePath).text()
	// 	: "Not found";
	if (!match) {
		return new Response(null, { status: 404 });
	}

	// Root component
	const rootBuildArtifact = buildArtifacts.get("root.js");
	if (!rootBuildArtifact) {
		throw new Error("Root build artifact not found");
	}
	const rootFilePath = path.join(
		process.cwd(),
		"build",
		rootBuildArtifact.path,
	);
	// const root1 = await import(rootPath);
	const root = await import(rootFilePath);
	const Root = createElement(root.default);

	// const hydrateFileName = buildArtifacts.keys().next().value;
	const hydrateFileName = "hydrate.js";
	const stream = await renderToReadableStream(Root, {
		bootstrapModules: [`${buildDir}/${hydrateFileName}`],
	});

	return new Response(stream, {
		headers: { "content-type": "text/html" },
	});
};
