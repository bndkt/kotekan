import { resolveSync, type BunPlugin } from "bun";

import { babelPlugin } from "../../plugins/babel";
import { rscPlugin } from "../../plugins/rsc";
import type { StylexRules } from "./buildRoute";

const documentFilePath = resolveSync(
	"./../../client/Document.tsx",
	import.meta.dir,
);
const routerFilePath = resolveSync(
	"./../../client/Router.tsx",
	import.meta.dir,
);

type BundleServerProps = {
	location: string;
	mode: "rsc" | "render" | "hydrate";
	stylexRules?: StylexRules;
	development?: boolean;
};

export type ClientEntryPoints = Set<string>;

export const bundleServer = async ({
	location,
	mode,
	stylexRules,
	development,
}: BundleServerProps) => {
	const clientEntryPoints: ClientEntryPoints = new Set<string>();

	const plugins: BunPlugin[] = [
		babelPlugin({
			stylexRules,
			development,
		}),
	];

	if (mode === "rsc") {
		plugins.push(rscPlugin({ clientEntryPoints, development }));
	}

	const entrypoint = mode === "rsc" ? routerFilePath : documentFilePath;

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
			"process.env.HYDRATE": JSON.stringify(mode === "hydrate"),
		},
		plugins,
	});

	if (!build.success || build.outputs.length === 0) {
		console.error("Logs:", build.logs);
		throw new Error("Build failed or no outputs");
	}

	return { buildOutputs: build.outputs, clientEntryPoints };
};
