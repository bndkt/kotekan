import type { ClientEntryPoints, StylexRules } from ".";
import { babelPlugin } from "../../plugins/babel";
import { mdxPlugin } from "../../plugins/mdx";
import { rscPlugin } from "../../plugins/rsc";

interface BuildServerComponentsProps {
	entrypoints: string[];
	stylexRules: StylexRules;
	clientEntryPoints: ClientEntryPoints;
	development: boolean;
}

export const buildServerComponents = async ({
	entrypoints,
	stylexRules,
	clientEntryPoints,
	development,
}: BuildServerComponentsProps) => {
	return await Bun.build({
		entrypoints,
		target: "bun",
		splitting: true,
		sourcemap: development ? "inline" : "none",
		minify: development ? false : true,
		naming: "[name]-[hash].[ext]",
		external: ["react", "react-dom", "@stylexjs/stylex"],
		publicPath: "/_build/",
		plugins: [
			// mdxPlugin({ development }),
			rscPlugin({ clientEntryPoints, development }),
			babelPlugin({
				stylexRules,
				development,
			}),
		],
	});
};
