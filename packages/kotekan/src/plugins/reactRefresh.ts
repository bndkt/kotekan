import type { BunPlugin } from "bun";
import { transformAsync } from "@babel/core";
import typescriptSyntaxPlugin from "@babel/plugin-syntax-typescript";
import jsxSyntaxPlugin from "@babel/plugin-syntax-jsx";
import reactRefreshBabelPlugin from "react-refresh/babel";

interface PluginConfig {
	development?: boolean;
}

const STYLEX_PLUGIN_ONLOAD_FILTER = /\.(jsx|js|tsx|ts|mjs|cjs|mts|cts)$/;

export const reactRefreshPlugin: (config: PluginConfig) => BunPlugin = (
	config = {},
) => {
	return {
		name: "stylexPlugin",
		setup(builder) {
			builder.onLoad(
				{
					filter: STYLEX_PLUGIN_ONLOAD_FILTER,
				},
				async (args) => {
					const currFilePath = args.path;

					if (currFilePath.includes("node_modules/")) return;

					const file = Bun.file(currFilePath);
					const inputCode = await file.text();

					const transformResult = await transformAsync(inputCode, {
						babelrc: false,
						filename: currFilePath,
						// presets: [],
						plugins: [
							[typescriptSyntaxPlugin, { isTSX: true }],
							jsxSyntaxPlugin,
							[reactRefreshBabelPlugin, { skipEnvCheck: true }],
						],
						exclude: "node_modules/**",
					});

					const loader = args.loader;

					if (transformResult === null) {
						console.warn("StyleX: transformAsync returned null");
						return { contents: inputCode, loader };
					}

					if (!transformResult.code) {
						console.warn("StyleX: transformAsync returned no code");
						return { contents: inputCode, loader };
					}

					return {
						contents: transformResult.code,
						loader,
					};
				},
			);
		},
	};
};
