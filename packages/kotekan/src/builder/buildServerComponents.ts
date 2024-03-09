import type { ClientComponentsMap, ClientEntryPoints, StylexRules } from ".";
import { babelPlugin } from "../plugins/babel";
import { mdxPlugin } from "../plugins/mdx";
import { rscPlugin } from "../plugins/rsc";

interface BuildServerComponentsProps {
	entrypoints: string[];
	stylexRules: StylexRules;
	clientEntryPoints: ClientEntryPoints;
	mdxEnabled: boolean;
	development: boolean;
}

export const buildServerComponents = async ({
	entrypoints,
	stylexRules,
	clientEntryPoints,
	mdxEnabled,
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
		publicPath: "/_build/",
		plugins,
		external: [
			"react",
			"react-dom",
			"react-server-dom-esm",
			"react-strict-dom",
		],
		define: {
			"process.env.PROJECT_ROOT": JSON.stringify(process.cwd()),
		},
		// @ts-expect-error Untyped, should be fixed with next stable Bun release // @todo
		conditions: ["react-server"],
	});
};
