import path from "node:path";

import type { ClientEntryPoints, StylexRules } from ".";
import { babelPlugin } from "../../plugins/babel";
import { createBuildFile } from "./createBuildFile";
import { rscPlugin } from "../../plugins/rsc";
import { mdxPlugin } from "../../plugins/mdx";

interface BuildRouteComponentsProps {
	routes: Record<string, string>;
	buildPath: string;
	stylexRules: StylexRules;
	clientEntryPoints: ClientEntryPoints;
	development: boolean;
}

export type RouteComponentPaths = Map<string, string>;

export const buildRouteComponents = async ({
	routes,
	buildPath,
	stylexRules,
	clientEntryPoints,
	development,
}: BuildRouteComponentsProps) => {
	const routeComponentPaths: RouteComponentPaths = new Map();

	for (const [routeName, routePath] of Object.entries(routes)) {
		const build = await Bun.build({
			entrypoints: [routePath],
			// root: process.cwd(),
			target: "bun",
			splitting: true,
			sourcemap: development ? "inline" : "none",
			minify: development ? false : true,
			naming: "[name]-[hash].[ext]",
			// outdir: path.join(buildPath, "server", "pages"),
			external: ["react", "react-dom", "@stylexjs/stylex"],
			// define: {},
			publicPath: "/_build/",
			plugins: [
				mdxPlugin({ development }),
				rscPlugin({ clientEntryPoints, development }),
				babelPlugin({
					stylexRules,
					development,
				}),
			],
		});

		if (!build.success || build.outputs.length === 0) {
			console.error("🥁 Build error:", build.logs);
			throw new Error("🥁 Build failed or no outputs");
		}

		const name = routeName === "/" ? "index" : routeName.substring(1);
		const { filePath } = await createBuildFile({
			name: `${name}-${build.outputs[0].hash}`,
			buildPath: path.join(buildPath, "server", "routes"),
			content: build.outputs[0],
		});

		routeComponentPaths.set(routeName, filePath);
	}

	return { routeComponentPaths, clientEntryPoints };
};
