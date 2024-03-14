import type { CompileOptions } from "@mdx-js/mdx";
// @ts-expect-error Untyped import
import { mdxAnnotations } from "mdx-annotations";

export const recmaPlugins: CompileOptions["recmaPlugins"] = [
	mdxAnnotations.recma,
];
