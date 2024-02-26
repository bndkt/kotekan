// Adapted from https://github.com/facebook/stylex/blob/main/packages/esbuild-plugin/src/index.js
import type { BunPlugin } from "bun";
import { transformAsync } from "@babel/core";
import typescriptSyntaxPlugin from "@babel/plugin-syntax-typescript";
import jsxSyntaxPlugin from "@babel/plugin-syntax-jsx";
import stylexBabelPlugin from "@stylexjs/babel-plugin";
import type { Rule } from "@stylexjs/babel-plugin";

interface PluginConfig {
	development?: boolean;
}

const STYLEX_PLUGIN_ONLOAD_FILTER = /\.(jsx|js|tsx|ts|mjs|cjs|mts|cts)$/;

export const stylexPlugin: (config: PluginConfig) => BunPlugin = (
	config = {},
) => {
	const stylexImports = ["@stylexjs/stylex"];

	return {
		name: "stylexPlugin",
		setup(builder) {
			console.log(builder.config, config);

			const stylexRules: Record<string, Rule[]> = {};

			// builder.onResolve(
			// 	{ filter: /node_modules\/underscore/ },
			// 	async (args) => {
			// 		return null;
			// 	},
			// );
			builder.onLoad(
				{
					filter: STYLEX_PLUGIN_ONLOAD_FILTER,
				},
				async (args) => {
					const currFilePath = args.path;
					const file = Bun.file(currFilePath);
					const inputCode = await file.text();

					if (
						!stylexImports.some((importName) => inputCode.includes(importName))
					) {
						// No transform needed if files doesn't import StyleX
						return;
					}

					config.development &&
						console.log("StyleX imports found in", currFilePath);

					const transformResult = await transformAsync(inputCode, {
						babelrc: false,
						filename: currFilePath,
						// presets: [],
						plugins: [
							[typescriptSyntaxPlugin, { isTSX: true }],
							jsxSyntaxPlugin,
							stylexBabelPlugin.withOptions({
								treeshakeCompensation: true,
								dev: config.development,
								runtimeInjection: true,
								importSources: [{ from: "react-strict-dom", as: "css " }],
							}),
						],
					});

					const loader = args.loader;

					if (transformResult === null) {
						console.warn("StyleX: transformAsync returned null");
						return { contents: inputCode, loader };
					}

					const { code, metadata } = transformResult;

					if (!code) {
						console.warn("StyleX: transformAsync returned no code");
						return { contents: inputCode, loader };
					}

					const typedMetadata = metadata as unknown as { stylex: Rule[] };
					if (
						typedMetadata.stylex !== null &&
						typedMetadata.stylex.length > 0
					) {
						stylexRules[args.path] = typedMetadata.stylex;
					}

					console.log("RESULT", stylexRules);

					return {
						contents: code,
						loader,
					};
				},
			);
		},
	};
};
