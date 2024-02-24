import path from "node:path";
import { renderToReadableStream } from "react-dom/server";

import { router } from "./router";

export const fetch = async (request: Request): Promise<Response> => {
	const pagesDir = path.join(process.cwd(), "src", "pages");
	const rootPath = path.join(process.cwd(), "src", "root.tsx");
	const hydratePath = path.join(import.meta.dir, "..", "client", "hydrate.tsx");

	console.log(request.url);

	const url = new URL(request.url);
	console.log(url.pathname);
	if (url.pathname === "/favicon.ico") {
		return new Response(null, { status: 404 });
	}

	if (url.pathname === "/root.js") {
		const rootBundle = await Bun.build({
			entrypoints: [hydratePath],
			target: "browser",
			// outdir: "./build",
			sourcemap: "inline",
			minify: false,
		});

		return new Response(rootBundle.outputs[0]);
	}

	const r = router(pagesDir);
	const match = r.match(request.url);
	console.log(match);

	// const content = match?.filePath
	// 	? await Bun.file(match.filePath).text()
	// 	: "Not found";

	if (!match) {
		return new Response("Not found");
	}

	// const rootBundle = await Bun.build({
	// 	entrypoints: [rootPath, match.filePath],
	// 	target: "browser",
	// 	// outdir: "./build",
	// 	sourcemap: "inline",
	// 	minify: false,
	// });

	// console.log(rootBundle);

	const root = await import(rootPath);

	const stream = await renderToReadableStream(root.default(), {
		bootstrapModules: ["/root.js"],
	});

	return new Response(stream, {
		headers: { "content-type": "text/html" },
	});
};
