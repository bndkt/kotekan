import type { CompileOptions } from "@mdx-js/mdx";

import { remarkPlugins } from "./mdx/remark";
import { rehypePlugins } from "./mdx/rehype";
import { recmaPlugins } from "./mdx/recma";

export const options: CompileOptions = {
	remarkPlugins,
	rehypePlugins,
	recmaPlugins,
	providerImportSource: "@mdx-components",
};
