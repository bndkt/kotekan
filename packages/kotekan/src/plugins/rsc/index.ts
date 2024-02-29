import path from "node:path";
import { resolveSync, type BunPlugin } from "bun";

interface PluginConfig {
	development?: boolean;
}

const PLUGIN_FILTER = /\.(jsx|js|tsx|ts|mjs|cjs|mts|cts)$/;

export const rscPlugin: (config: PluginConfig) => BunPlugin = (config = {}) => {
	const development = config.development ?? false;

	return {
		name: "rscPlugin",
		setup(builder) {
			// console.log(builder.config, config);

			const clientEntryPoints = new Set<string>();

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

				if (inputCode.startsWith(`"use client";`)) {
					clientEntryPoints.add(importPath);

					return {
						path: args.path.replace(/\.tsx?$/, ".client.tsx"),
						external: true,
					};
				}

				return null;

				console.log("rsc path", args);

				return {
					path: args.path,
					// namespace: "rsc",
					// external: true,
				};
			});
			// builder.onLoad(
			// 	{
			// 		filter: PLUGIN_ONLOAD_FILTER,
			// 	},
			// 	async (args) => {
			// 		const file = Bun.file(args.path);
			// 		const inputCode = await file.text();

			// 		// if (
			// 		// 	!stylexImports.some((importName) => inputCode.includes(importName))
			// 		// ) {
			// 		// 	// No transform needed if files doesn't import StyleX
			// 		// 	return;
			// 		// }

			// 		if (args.path.includes("node_modules/")) return;

			// 		const loader = args.loader;

			// 		return {
			// 			contents: inputCode,
			// 			loader,
			// 		};
			// 	},
			// );
		},
	};
};
