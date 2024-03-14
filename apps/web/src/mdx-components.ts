import type { MDXComponents } from "mdx/types";
import * as mdxComponents from "@/components/mdx";

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		...components,
		...mdxComponents,
	};
}
