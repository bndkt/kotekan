import type { ClientComponentsMap, ClientEntryPoints, StylexRules } from ".";
import { babelPlugin } from "../plugins/babel";
import { mdxPlugin } from "../plugins/mdx";
import { rscPlugin } from "../plugins/rsc";

interface BuildServerComponentsProps {
	entrypoints: string[];
	stylexRules: StylexRules;
	clientEntryPoints: ClientEntryPoints;
	clientComponentsMap: ClientComponentsMap;
	mdxEnabled: boolean;
	development: boolean;
}

export const buildServerComponents = async ({
	entrypoints,
	stylexRules,
	clientEntryPoints,
	clientComponentsMap,
	mdxEnabled,
	development,
}: BuildServerComponentsProps) => {
	const plugins = [
		rscPlugin({ clientEntryPoints, clientComponentsMap, development }),
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
		publicPath: "/_build/",
		plugins,
		define: {
			"process.env.PROJECT_ROOT": JSON.stringify(process.cwd()),
		},
		conditions: ["react-server"],
	});
};
