import path from "node:path";
import { resolveSync, type BunPlugin } from "bun";
// import { parse } from "es-module-lexer"; // @todo

import type { ClientEntryPoints } from "../../server/builder";
// import type { ClientComponentMap } from "../../server/lib/buildRoute";

interface PluginConfig {
	clientEntryPoints: ClientEntryPoints;
	// clientComponentMap: ClientComponentMap;
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
				console.log("Import:", importPath);
				const file = Bun.file(importPath);
				const inputCode = await file.text();

				if (
					inputCode.startsWith(`"use client"`) ||
					inputCode.startsWith(`'use client'`)
				) {
					config.clientEntryPoints.add(importPath);
					console.log("CLIENT COMPONENT detected", config.clientEntryPoints);

					const path = args.path.replace(/\.tsx?$/, ".client.js");
					console.log("New path:", path);

					return {
						path, //: `${path}`,
						external: false,
						namespace: "rsc",
					};
				}

				return null;
			});

			build.onLoad({ filter: /.*/, namespace: "rsc" }, async (args) => {
				// console.log(args);
				// const [, exports] = parse(args.path);

				return {
					// loader: "",
					contents: `
					export const Counter = () => {
return (<div>Counter</div>)
					}
					`,
				};
			});
		},
	};
};
