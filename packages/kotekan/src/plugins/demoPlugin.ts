import type { BunPlugin } from "bun";

interface PluginConfig {
	development?: boolean;
}

const PLUGIN_ONLOAD_FILTER = /\.(jsx|js|tsx|ts|mjs|cjs|mts|cts)$/;

export const demoPlugin: (config?: PluginConfig) => BunPlugin = (
	config = {},
) => {
	return {
		name: "demoPlugin",
		setup(builder) {
			builder.onLoad(
				{
					filter: PLUGIN_ONLOAD_FILTER,
				},
				async (args) => {
					const currFilePath = args.path;
					const file = Bun.file(currFilePath);
					const inputCode = await file.text();

					const loader = args.loader;
					const contents = inputCode.replaceAll(/kotekan/gi, "KOTEKAN");

					return {
						contents,
						loader,
					};
				},
			);
		},
	};
};
