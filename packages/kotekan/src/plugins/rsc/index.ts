import path from "node:path";
import { resolveSync, type BunPlugin } from "bun";

import type { ClientEntryPoints } from "../../ssr/lib/bundleServer";

interface PluginConfig {
	clientEntryPoints: ClientEntryPoints;
	development?: boolean;
}

const PLUGIN_FILTER = /\.(jsx|js|tsx|ts|mjs|cjs|mts|cts)$/;

export const rscPlugin: (config: PluginConfig) => BunPlugin = (config) => {
	// const clientManifestFilename = "react-client-manifest.json";
	// const ssrManifestFilename = "react-ssr-manifest.json";

	return {
		name: "rscPlugin",
		setup(builder) {
			// console.log(builder.config, config);

			builder.onResolve({ filter: PLUGIN_FILTER }, async (args) => {
				// Exclude node_modules (at least for now)
				if (args.importer.includes("node_modules/")) return;

				// Check for file extensions
				// if (!PLUGIN_FILTER.test(args.importer)) return;

				// console.log(args);

				const importPath = resolveSync(args.path, path.dirname(args.importer));
				console.log("Import:", importPath);
				const file = Bun.file(importPath);
				const inputCode = await file.text();

				if (
					inputCode.startsWith(`"use client"`) ||
					inputCode.startsWith(`'use client'`)
				) {
					config.clientEntryPoints.add(importPath);

					const path = args.path.replace(/\.tsx?$/, ".client.js");
					console.log("New path:", path);

					return {
						path,
						external: true,
					};
				}

				return null;
			});
		},
	};
};
