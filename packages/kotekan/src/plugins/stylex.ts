// Adapted from https://github.com/facebook/stylex/blob/main/packages/esbuild-plugin/src/index.js
// import { transformAsync } from "@babel/core";
import type { BunPlugin } from "bun";
// import stylexBabelPlugin, { type Rule } from "@stylexjs/babel-plugin";
// @ ts-expect-error Missing types
// import typescriptSyntaxPlugin from "@babel/plugin-syntax-typescript";

interface StyleXPluginConfig {
	development?: boolean;
}

const STYLEX_PLUGIN_ONLOAD_FILTER = /\.(jsx|js|tsx|ts|mjs|cjs|mts|cts)$/;

export const stylexPlugin: (config: StyleXPluginConfig) => BunPlugin = ({
	development,
}) => {
	// const stylexImports = ["@stylexjs/stylex"];

	return {
		name: "stylexPlugin",
		setup(build) {
			// const stylexRules: Record<string, Rule[]> = {};

			build.onLoad({ filter: STYLEX_PLUGIN_ONLOAD_FILTER }, async (args) => {
				const file = Bun.file(args.path);
				const source = await file.text();

				return { contents: source };

				// if (!stylexImports.some((importName) => source.includes(importName))) {
				// 	// avoid transform if file doesn't have stylex imports
				// 	// esbuild proceeds to the next callback
				// 	return;
				// }

				// return { contents: source, loader: args.loader };

				// const transformResult = await transformAsync(source, {
				// 	babelrc: false,
				// 	filename: args.path,
				// 	// presets,
				// 	plugins: [
				// 		typescriptSyntaxPlugin,
				// 		stylexBabelPlugin.withOptions({
				// 			treeshakeCompensation: true,
				// 			// ...options,
				// 			dev: development,
				// 			importSources: [{ from: "react-strict-dom", as: "css" }],
				// 			// unstable_moduleResolution,
				// 		}),
				// 	],
				// });

				// if (transformResult === null) {
				// 	console.warn("StyleX: transformAsync returned null");

				// 	return { contents: source, loader: args.loader };
				// }

				// const { code, metadata } = transformResult;

				// if (!code) {
				// 	console.warn("StyleX: transformAsync returned null code");
				// 	return { contents: source, loader: args.loader };
				// }

				// // if (
				// // 	!development &&
				// // 	metadata.stylex !== null &&
				// // 	metadata.stylex.length > 0
				// // ) {
				// // 	stylexRules[args.path] = metadata.stylex;
				// // }

				// return {
				// 	contents: code,
				// 	loader: args.loader,
				// };
			});
		},
	};
};
