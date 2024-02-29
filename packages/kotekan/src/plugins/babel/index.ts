// Adapted from https://github.com/facebook/stylex/blob/main/packages/esbuild-plugin/src/index.js
import type { BunPlugin } from "bun";
import { transformAsync } from "@babel/core";
// @ts-expect-error Missing types
import typescriptSyntaxPlugin from "@babel/plugin-syntax-typescript";
// @ts-expect-error Missing types
import jsxSyntaxPlugin from "@babel/plugin-syntax-jsx";
import type { Rule } from "@stylexjs/babel-plugin";
import { stylexPlugin } from "./stylex";
// import reactRefreshBabelPlugin from "react-refresh/babel";

interface PluginConfig {
	development?: boolean;
}

const BABEL_PLUGIN_ONLOAD_FILTER = /\.(jsx|js|tsx|ts|mjs|cjs|mts|cts)$/;

export const babelPlugin: (config: PluginConfig) => BunPlugin = (
	config = {},
) => {
	// const stylexImports = ["@stylexjs/stylex", "react-strict-dom"];
	const development = config.development ?? false;

	return {
		name: "babelPlugin",
		setup(builder) {
			// console.log(builder.config, config);

			const stylexRules: Record<string, Rule[]> = {};

			// builder.onResolve(
			// 	{ filter: /node_modules\/underscore/ },
			// 	async (args) => {
			// 		return null;
			// 	},
			// );
			builder.onLoad(
				{
					filter: BABEL_PLUGIN_ONLOAD_FILTER,
				},
				async (args) => {
					const currFilePath = args.path;
					const file = Bun.file(currFilePath);
					const inputCode = await file.text();

					// if (
					// 	!stylexImports.some((importName) => inputCode.includes(importName))
					// ) {
					// 	// No transform needed if files doesn't import StyleX
					// 	return;
					// }

					if (
						currFilePath.includes("node_modules/") &&
						!currFilePath.includes("react-strict-dom")
					)
						return;

					const transformResult = await transformAsync(inputCode, {
						filename: currFilePath,
						plugins: [
							[typescriptSyntaxPlugin, { isTSX: true }],
							jsxSyntaxPlugin,
							stylexPlugin(development),
							// [reactRefreshBabelPlugin, { skipEnvCheck: true }],
						],
						exclude: "node_modules/**",
					});

					const loader = args.loader;

					if (transformResult === null) {
						console.warn("StyleX: transformAsync returned null");
						return { contents: inputCode, loader };
					}

					// const { code, metadata } = transformResult;
					const { code } = transformResult;

					if (!code) {
						console.warn("StyleX: transformAsync returned null");
						return { contents: inputCode, loader };
					}

					// const typedMetadata = metadata as unknown as { stylex: Rule[] };
					// if (
					// 	typedMetadata.stylex !== null &&
					// 	typedMetadata.stylex.length > 0
					// ) {
					// 	stylexRules[args.path] = typedMetadata.stylex;
					// }

					return {
						contents: code,
						loader,
					};
				},
			);
		},
	};
};
