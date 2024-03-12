import { pathToFileURL, type BunPlugin } from "bun";
// @ts-expect-error Untyped import
import { load } from "@physis/react-server-dom-esm/node-loader";

interface RscPluginConfig {
	clientComponentPaths?: Set<string>;
	development?: boolean;
}

const RSC_PLUGIN_FILTER = /\.(ts|tsx)$/;

export const rscPlugin: (config: RscPluginConfig) => BunPlugin = (config) => {
	return {
		name: "rscPlugin",
		setup(build) {
			console.log("🥁 RSC PLUGIN SETUP");

			build.onLoad({ filter: RSC_PLUGIN_FILTER }, async (args) => {
				const source = await Bun.file(args.path).text();

				// console.log("🥁 RSC PLUGIN ON LOAD", args.path);

				// If source doesn't contain either use client or use server, return immediately
				if (
					source.indexOf("use client") === -1 &&
					source.indexOf("use server") === -1
				) {
					return {
						contents: source,
						loader: args.loader,
					};
				}

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
						source,
					};
				};

				// load(url, context, defaultLoad)
				const transformed: { source: string } = await load(
					url,
					null,
					defaultLoad,
				);

				if (transformed.source) {
					transformed.source = transformed.source.replaceAll(
						"react-server-dom-esm/server",
						"@physis/react-server-dom-esm/server",
					);
				}

				const contents = transformed.source ?? source;

				// Check if this was a client component
				if (contents.includes("registerClientReference")) {
					config.clientComponentPaths?.add(args.path);
				}

				if (contents)
					return {
						contents,
						loader: args.loader,
					};
			});
		},
	};
};
