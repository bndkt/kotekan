// Adapted from https://github.com/facebook/stylex/blob/main/packages/esbuild-plugin/src/index.js
import type { BunPlugin } from "bun";
import { transformAsync } from "@babel/core";
// @ts-expect-error Missing types
import typescriptSyntaxPlugin from "@babel/plugin-syntax-typescript";
// @ ts-expect-error Missing types
// import jsxSyntaxPlugin from "@babel/plugin-syntax-jsx";
import type { Rule } from "@stylexjs/babel-plugin";
// import reactRefreshBabelPlugin from "react-refresh/babel";
// @ts-expect-error Missing types
import rsdPlugin from "react-strict-dom/babel";

import { stylexPlugin } from "./stylex";
import type { StylexRules } from "../../builder";

interface PluginConfig {
	stylexRules?: StylexRules;
	development?: boolean;
}

const BABEL_PLUGIN_ONLOAD_FILTER = /\.(jsx|js|tsx|ts|mjs|cjs|mts|cts)$/;

export const babelPlugin: (config: PluginConfig) => BunPlugin = (config) => {
	const development = config.development ?? false;

	return {
		name: "babelPlugin",
		setup(build) {
			build.onLoad(
				{
					filter: BABEL_PLUGIN_ONLOAD_FILTER,
				},
				async (args) => {
					const currFilePath = args.path;
					const file = Bun.file(currFilePath);
					const inputCode = await file.text();

					if (
						currFilePath.includes("node_modules/") &&
						!currFilePath.includes("react-strict-dom") &&
						!currFilePath.includes("@stylexjs/stylex")
					)
						return;

					// console.log("💅 StyleX", args.path);

					const transformResult = await transformAsync(inputCode, {
						filename: currFilePath,
						plugins: [
							[typescriptSyntaxPlugin, { isTSX: true }],
							// jsxSyntaxPlugin,
							rsdPlugin,
							stylexPlugin({ development }),
							// [reactRefreshBabelPlugin, { skipEnvCheck: true }],
						],
						// exclude: "node_modules/**",
					});

					const loader = args.loader;

					if (transformResult === null) {
						console.warn("💅 StyleX: transformAsync returned null");
						return { contents: inputCode, loader };
					}

					const { code, metadata } = transformResult;

					if (!code) {
						console.warn("💅 StyleX: transformAsync returned null");
						return { contents: inputCode, loader };
					}

					if (config.stylexRules) {
						const typedMetadata = metadata as unknown as { stylex: Rule[] };
						if (
							typedMetadata.stylex !== null &&
							typedMetadata.stylex.length > 0
						) {
							config.stylexRules[args.path] = typedMetadata.stylex;
						}
					}

					return {
						contents: code,
						loader,
					};
				},
			);
		},
	};
};
