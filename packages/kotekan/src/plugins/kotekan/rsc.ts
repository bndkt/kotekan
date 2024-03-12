import { pathToFileURL, type OnLoadArgs } from "bun";
// @ts-expect-error Untyped import
import { load } from "@physis/react-server-dom-esm/node-loader";

export const rsc = async (
	input: string,
	{
		args,
		clientComponentPaths,
	}: { args: OnLoadArgs; clientComponentPaths?: Set<string> },
) => {
	let contents = input;

	// Only transform if source contain either use client or use server
	if (
		contents.indexOf("use client") > 0 ||
		contents.indexOf("use server") > 0
	) {
		const buildPath = args.path.replace(".tsx", ".js");
		// .replace("src/components", "build/client/components");
		const url = new URL(pathToFileURL(buildPath)).href;

		// defaultLoad(url, context, defaultLoad)
		const defaultLoad = async (
			url: string,
			context: unknown,
			defaultLoad: unknown,
		) => {
			return {
				format: "module",
				source: contents,
			};
		};

		// load(url, context, defaultLoad)
		const transformed: { source: string } = await load(url, null, defaultLoad);

		if (transformed.source) {
			transformed.source = transformed.source.replaceAll(
				"react-server-dom-esm/server",
				"@physis/react-server-dom-esm/server",
			);

			contents = transformed.source;
		}

		// Check if this was a client component
		if (contents.includes("registerClientReference")) {
			clientComponentPaths?.add(args.path);
		}
	}

	return contents;
};
