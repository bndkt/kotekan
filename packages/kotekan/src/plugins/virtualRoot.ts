// Adapted from https://github.com/facebook/stylex/blob/main/packages/esbuild-plugin/src/index.js
import type { BunPlugin } from "bun";

interface PluginConfig {
	development?: boolean;
}

export const virtualRootPlugin: (config: PluginConfig) => BunPlugin = (
	config = {},
) => {
	return {
		name: "virtualRootPlugin",
		setup(builder) {
			builder.module("virtual-root", () => {
				return { contents: "onsole.log('hello world!')", loader: "js" };
			});
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
