import path from "node:path";
import { babelPlugin } from "../../plugins/babel";
import { createBuildFile } from "./createBuildFile";

interface BuildPagesProps {
	routes: Record<string, string>;
	buildPath: string;
	development: boolean;
}

export const buildPages = async ({
	routes,
	buildPath,
	development,
}: BuildPagesProps) => {
	const pages: Record<string, string> = {};

	for (const [routeName, routePath] of Object.entries(routes)) {
		const build = await Bun.build({
			entrypoints: [routePath],
			// root: process.cwd(),
			target: "bun",
			// splitting: true,
			sourcemap: development ? "inline" : "none",
			minify: development ? false : true,
			naming: "[name]-[hash].[ext]",
			// outdir: path.join(buildPath, "server", "pages"),
			external: ["react", "react-dom"],
			// define: {},
			plugins: [
				babelPlugin({
					development,
				}),
			],
		});

		if (!build.success || build.outputs.length === 0) {
			console.error("🥁 Build error:", build.logs);
			throw new Error("🥁 Build failed or no outputs");
		}

		const { filePath } = await createBuildFile({
			name: `${path.basename(routePath)}-${build.outputs[0].hash}`,
			buildPath: path.join(buildPath, "server", "pages"),
			content: build.outputs[0],
		});

		pages[routeName] = filePath;
	}

	return pages;
};
