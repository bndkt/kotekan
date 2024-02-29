import path from "node:path";
import { resolveSync, type BunPlugin } from "bun";

import type { ClientEntryPoints } from "../../ssr/lib/bundleServer";

interface PluginConfig {
	clientEntryPoints: ClientEntryPoints;
	development?: boolean;
}

const PLUGIN_FILTER = /\.(jsx|js|tsx|ts|mjs|cjs|mts|cts)$/;

export const rscPlugin: (config: PluginConfig) => BunPlugin = (config) => {
	const development = config.development ?? false;

	return {
		name: "rscPlugin",
		setup(builder) {
			// console.log(builder.config, config);

			builder.onResolve({ filter: PLUGIN_FILTER }, async (args) => {
				// Exclude node_modules (at least for now)
				if (args.importer.includes("node_modules/")) return;

				// Check for file extensions
				// if (!PLUGIN_FILTER.test(args.importer)) return;

				console.log(args);

				const importPath = resolveSync(args.path, path.dirname(args.importer));
				console.log(importPath);
				const file = Bun.file(importPath);
				const inputCode = await file.text();

				if (
					inputCode.startsWith(`"use client"`) ||
					inputCode.startsWith(`'use client'`)
				) {
					config.clientEntryPoints.add(importPath);

					const path = importPath.replace(/\.tsx?$/, ".client.js");

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
