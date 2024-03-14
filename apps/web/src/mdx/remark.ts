import type { CompileOptions } from "@mdx-js/mdx";
// @ts-expect-error Untyped import
import { mdxAnnotations } from "mdx-annotations";
import remarkGfm from "remark-gfm";

export const remarkPlugins: CompileOptions["remarkPlugins"] = [
	mdxAnnotations.remark,
	remarkGfm,
];
