// Adapted from https://github.com/facebook/stylex/blob/main/packages/esbuild-plugin/src/index.js
import type { BunPlugin } from "bun";
import { transformAsync } from "@babel/core";
// @ts-expect-error Missing types
import typescriptSyntaxPlugin from "@babel/plugin-syntax-typescript";
// @ ts-expect-error Missing types
// import jsxSyntaxPlugin from "@babel/plugin-syntax-jsx";

interface PluginConfig {
	development?: boolean;
}

const RESOLVE_FILTER =
	/\.\/Libraries\/StyleSheet\/PlatformColorValueTypes\/.*$/;

const ONLOAD_FILTER = /\.(jsx|js|tsx|ts|mjs|cjs|mts|cts)$/;

export const reactNativePlugin: (config: PluginConfig) => BunPlugin = (
	config = {},
) => {
	const development = config.development ?? false;

	return {
		name: "reactNativePlugin",
		setup(builder) {
			builder.onResolve({ filter: RESOLVE_FILTER }, async (args) => {
				console.log(args);
				// throw new Error("react-native imports are not supported");
				return null;
			});
			builder.onLoad(
				{
					filter: ONLOAD_FILTER,
				},
				async (args) => {
					const loader = args.loader;
					const currFilePath = args.path;
					const file = Bun.file(currFilePath);
					const inputCode = await file.text();

					const transformResult = await transformAsync(inputCode, {
						filename: currFilePath,
						presets: ["module:@react-native/babel-preset"],
						// plugins: [
						// 	[typescriptSyntaxPlugin, { isTSX: true }],
						// 	// jsxSyntaxPlugin,
						// 	// stylexPlugin({ development }),
						// 	// [reactRefreshBabelPlugin, { skipEnvCheck: true }],
						// ],
						// exclude: "node_modules/**",
					});

					if (!transformResult?.code) {
						console.warn("transformAsync returned null");
						return { contents: inputCode, loader };
					}

					return {
						contents: transformResult?.code,
						loader,
					};
				},
			);
		},
	};
};
