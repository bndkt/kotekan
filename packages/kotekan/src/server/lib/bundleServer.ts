import { resolveSync, type BunPlugin } from "bun";

import { babelPlugin } from "../../plugins/babel";
import { rscPlugin } from "../../plugins/rsc";
import type { StylexRules } from "./buildRoute";
import type { RenderMode } from "..";
import type { Routes } from "../../client/Router";

const documentFilePath = resolveSync(
	"./../../client/Document.tsx",
	import.meta.dir,
);

type BundleServerProps = {
	location: string;
	mode: RenderMode;
	routes: Routes;
	stylexRules?: StylexRules;
	development?: boolean;
};

export type ClientEntryPoints = Set<string>;

export const bundleServer = async ({
	location,
	mode,
	routes,
	stylexRules,
	development,
}: BundleServerProps) => {
	const clientEntryPoints: ClientEntryPoints = new Set<string>();

	const plugins: BunPlugin[] = [
		rscPlugin({ clientEntryPoints, development }),
		babelPlugin({
			stylexRules,
			development,
		}),
	];

	// const entrypoint = mode === "csr" ? routerFilePath : documentFilePath;
	const entrypoint = documentFilePath;

	const build = await Bun.build({
		entrypoints: [entrypoint],
		// root: process.cwd(),
		target: "bun",
		// splitting: true,
		sourcemap: development ? "inline" : "none",
		minify: development ? false : true,
		// naming: "[name]-[hash].[ext]",
		// outdir: hydrate ? "./build" : undefined,
		external: ["react", "react-dom"],
		define: {
			"process.env.LOCATION": JSON.stringify(location),
			"process.env.HYDRATE": JSON.stringify(mode === "ssr"),
			"process.env.ROUTES": JSON.stringify(routes),
		},
		plugins,
	});

	if (!build.success || build.outputs.length === 0) {
		console.error("🥁 Build error:", build.logs);
		throw new Error("🥁 Build failed or no outputs");
	}

	return { buildOutputs: build.outputs, clientEntryPoints };
};
