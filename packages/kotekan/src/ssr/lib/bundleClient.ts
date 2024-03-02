import { resolveSync, type BunPlugin } from "bun";

import { babelPlugin } from "../../plugins/babel";
import type { ClientEntryPoints } from "./bundleServer";
import type { StylexRules } from "./buildRoute";

const hydrateFilePath = resolveSync("./../../client/hydrate", import.meta.dir);
const renderFilePath = resolveSync("./../../client/render", import.meta.dir);

type BundleProps = {
	location: string;
	mode: "render" | "hydrate";
	stylexRules?: StylexRules;
	clientEntryPoints: ClientEntryPoints;
	stylexCssUrl?: string;
	development: boolean;
};

export const bundleClient = async ({
	location,
	mode,
	stylexRules,
	clientEntryPoints,
	stylexCssUrl,
	development,
}: BundleProps) => {
	const entrypoint = mode === "render" ? renderFilePath : hydrateFilePath;

	const plugins: BunPlugin[] = [
		babelPlugin({
			stylexRules,
			development,
		}),
	];

	const build = await Bun.build({
		entrypoints: [entrypoint, ...clientEntryPoints],
		target: "browser",
		// splitting: true,
		sourcemap: "none", // development ? "inline" : "none",
		minify: development ? false : true,
		// naming: "[name]-[hash].[ext]",
		// outdir: hydrate ? "./build" : undefined,
		// external: [],
		define: {
			"process.env.LOCATION": JSON.stringify(location),
			"process.env.HYDRATE": JSON.stringify(mode === "hydrate"),
			"process.env.STYLESHEET": JSON.stringify(stylexCssUrl),
		},
		plugins,
	});

	if (!build.success || build.outputs.length === 0) {
		console.error("🥁 Build error:", build.logs);
		throw new Error("🥁 Build failed or no outputs");
	}

	return { buildOutputs: build.outputs };
};
