import path from "node:path";
import type { BunPlugin } from "bun";
import { createFormatAwareProcessors } from "@mdx-js/mdx/internal-create-format-aware-processors";
import { extnamesToRegex } from "@mdx-js/mdx/internal-extnames-to-regex";
import type { CompileOptions } from "@mdx-js/mdx";
// import rehypeShiki from "@shikijs/rehype";

interface MdxPluginConfig {
	options?: CompileOptions;
	development?: boolean;
}

let options: CompileOptions = {};

const mdxConfigExportFile = path.join(process.cwd(), "src", "mdx.config.ts");
try {
	const { options: importedOptions } = await import(mdxConfigExportFile);

	options = importedOptions;
} catch (error) {
	console.log(error);
}

export const mdxPlugin: (config: MdxPluginConfig) => BunPlugin = (config) => {
	return {
		name: "mdxPlugin",
		setup(build) {
			const { extnames, process } = createFormatAwareProcessors({
				...config.options,
				// rehypePlugins: [[rehypeShiki, { theme: "min-light" }]],
				// providerImportSource: "@mdx-js/react",
				...options,
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
