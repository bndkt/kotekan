import path from "node:path";
import { resolveSync, type BunPlugin, pathToFileURL } from "bun";
import {
	resolve,
	load as reactLoad,
	getSource as getSourceImpl,
	transformSource as reactTransformSource,
	// @ts-expect-error Untyped import
} from "react-server-dom-esm/node-loader";

import type { ClientEntryPoints } from "../../builder";

interface PluginConfig {
	clientEntryPoints: ClientEntryPoints;
	development?: boolean;
}

const PLUGIN_FILTER = /\.(jsx|js|tsx|ts|mjs|cjs|mts|cts)$/;

export const rscPlugin: (config: PluginConfig) => BunPlugin = (config) => {
	return {
		name: "rscPlugin",
		setup(build) {
			// console.log(builder.config, config);

			build.onResolve({ filter: PLUGIN_FILTER }, async (args) => {
				// Exclude node_modules (at least for now)
				if (args.importer.includes("node_modules/")) return;

				const importPath = resolveSync(args.path, path.dirname(args.importer));
				// console.log("Import:", importPath);
				const file = Bun.file(importPath);
				const inputCode = await file.text();

				if (
					inputCode.startsWith(`"use client"`) ||
					inputCode.startsWith(`'use client'`)
				) {
					config.clientEntryPoints.add(importPath);
					// console.log("CLIENT COMPONENT detected", config.clientEntryPoints);
					// console.log(args.path, args.importer);

					const componentPath = resolveSync(
						args.path,
						path.dirname(args.importer),
					);
					// componentPath = componentPath.replace(".tsx", ".js");
					// componentPath = componentPath.replace("src/", "build/client/");
					// console.log({ componentPath });

					return {
						path: componentPath,
						external: false,
						namespace: "rsc",
					};
				}

				return null;
			});

			build.onLoad({ filter: /.*/, namespace: "rsc" }, async (args) => {
				const file = Bun.file(args.path);
				const source = await file.text();

				const defaultLoad = (
					url: string,
					context: unknown,
					defaultLoad: () => void,
				) => {
					return {
						format: "module",
						source,
					};
				};

				const path = args.path
					.replace(".tsx", ".js")
					.replace("src/components", "build/client/components");
				const url = new URL(pathToFileURL(path)).href;
				const context = "";
				const { source: contents } = await reactLoad(url, context, defaultLoad);

				return {
					loader: "tsx",
					contents,
					// contents: placeholderContent,
				};
			});
		},
	};
};
