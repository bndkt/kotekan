import path from "node:path";
import { resolveSync } from "bun";

import type { StylexRules } from ".";
import { rscPlugin } from "../../plugins/rsc";
import { babelPlugin } from "../../plugins/babel";

interface BuildDocumentsProps {
	routes: Record<string, string>;
	buildPath: string;
	stylexRules: StylexRules;
	clientEntryPoints: Set<string>;
	development: boolean;
}

const documentFilePath = resolveSync(
	"./../../client/Document.tsx",
	import.meta.dir,
);

export const buildDocumentComponent = async ({
	routes,
	buildPath,
	stylexRules,
	clientEntryPoints,
	development,
}: BuildDocumentsProps) => {
	const build = await Bun.build({
		entrypoints: [documentFilePath],
		target: "bun",
		sourcemap: development ? "inline" : "none",
		minify: development ? false : true,
		naming: "[name]-[hash].[ext]",
		outdir: path.join(buildPath, "server", "documents"),
		external: ["react", "react-dom"],
		publicPath: "http://localhost/_build/",
		define: {
			// "process.env.LOCATION": JSON.stringify(location),
			// "process.env.HYDRATE": JSON.stringify(mode === "ssr"),
			// "process.env.ROUTES": JSON.stringify(routes),
		},
		plugins: [
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

	const documentComponentFilePath = build.outputs[0].path;

	return { documentComponentFilePath };
};
