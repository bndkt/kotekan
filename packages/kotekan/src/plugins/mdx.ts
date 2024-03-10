import type { BunPlugin } from "bun";
import { createFormatAwareProcessors } from "@mdx-js/mdx/internal-create-format-aware-processors";
import { extnamesToRegex } from "@mdx-js/mdx/internal-extnames-to-regex";
import type { CompileOptions } from "@mdx-js/mdx";

interface PluginConfig {
	options?: CompileOptions;
	development?: boolean;
}

export const mdxPlugin: (config: PluginConfig) => BunPlugin = (config) => {
	return {
		name: "mdxPlugin",
		setup(build) {
			const { extnames, process } = createFormatAwareProcessors({
				...config.options,
				development: config.development,
				jsx: false,
			});

			const filter = extnamesToRegex(extnames);

			build.onLoad({ filter }, async (args) => {
				const file = Bun.file(args.path);
				const input = await file.text();

				const vfile = await process(input);
				const contents = vfile.value;

				return {
					contents,
				};
			});
		},
	};
};
