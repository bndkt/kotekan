import { resolveSync, type BunPlugin } from "bun";

import { babelPlugin } from "../../plugins/babel";
import { rscPlugin } from "../../plugins/rsc";
import type { ClientEntryPoints } from "./bundleServer";

const appFilePath = resolveSync("./../../client/App", import.meta.dir);
const hydrateFilePath = resolveSync("./../../client/hydrate", import.meta.dir);
const renderFilePath = resolveSync("./../../client/render", import.meta.dir);

type BundleProps = {
	location: string;
	mode: "render" | "hydrate";
	clientEntryPoints: ClientEntryPoints;
	development?: boolean;
};

export const bundleClient = async (props: BundleProps) => {
	const { development } = props;

	const entrypoint = props.mode === "render" ? renderFilePath : hydrateFilePath;

	const plugins: BunPlugin[] = [
		// babelPlugin({
		// 	development,
		// }),
	];

	const build = await Bun.build({
		entrypoints: [entrypoint, ...props.clientEntryPoints],
		// root: process.cwd(),
		target: "browser",
		// splitting: true,
		sourcemap: development ? "inline" : "none",
		minify: development ? false : true,
		// naming: "[name]-[hash].[ext]",
		// outdir: hydrate ? "./build" : undefined,
		external: ["react", "react-dom"],
		define: {
			"process.env.RENDER": JSON.stringify(props.mode === "hydrate"),
			"process.env.LOCATION": JSON.stringify(props.location),
		},
		plugins,
	});

	if (!build.success || build.outputs.length === 0) {
		console.error("Logs:", build.logs);
		throw new Error("Build failed or no outputs");
	}

	return { buildOutputs: build.outputs };
};
