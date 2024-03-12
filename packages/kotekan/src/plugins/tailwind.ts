import type { BunPlugin } from "bun";
import { IO, Parsing, scanFiles } from "@tailwindcss/oxide";
import { compile, optimizeCss } from "tailwindcss";

interface TailwindPluginConfig {
	development?: boolean;
}

export const tailwindPlugin: (config: TailwindPluginConfig) => BunPlugin = (
	config,
) => {
	return {
		name: "tailwindPlugin",
		setup(build) {
			const filter = /\.css$/;

			build.onLoad({ filter }, async (args) => {
				const file = Bun.file(args.path);
				const source = await file.text();

				// const vfile = await process(source);
				// const contents = vfile.value;

				return {
					exports: {
						default: "styles.css",
					},
					loader: "object",
				};
			});
		},
	};
};
