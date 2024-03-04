import type { ClientEntryPoints, StylexRules } from ".";
import { babelPlugin } from "../../plugins/babel";
import { mdxPlugin } from "../../plugins/mdx";
import { rscPlugin } from "../../plugins/rsc";

interface BuildServerComponentsProps {
	entrypoints: string[];
	mdxEnabled: boolean;
	stylexRules: StylexRules;
	clientEntryPoints: ClientEntryPoints;
	development: boolean;
}

export const buildServerComponents = async ({
	entrypoints,
	mdxEnabled,
	stylexRules,
	clientEntryPoints,
	development,
}: BuildServerComponentsProps) => {
	const plugins = [
		rscPlugin({ clientEntryPoints, development }),
		babelPlugin({
			stylexRules,
			development,
		}),
	];

	mdxEnabled && plugins.push(mdxPlugin({ development }));

	return await Bun.build({
		entrypoints,
		target: "bun",
		splitting: true,
		sourcemap: development ? "inline" : "none",
		minify: development ? false : true,
		naming: "[name]-[hash].[ext]",
		external: ["react", "react-dom", "@stylexjs/stylex"], // @todo ["*"]?
		publicPath: "/_build/",
		plugins,
	});
};