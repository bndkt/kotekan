import { resolveSync, type BunPlugin } from "bun";

import { babelPlugin } from "../../plugins/babel";
import { rscPlugin } from "../../plugins/rsc";

const appFilePath = resolveSync("./../../client/App", import.meta.dir);

type BundleServerProps = {
	location: string;
	mode: "render" | "hydrate";
	development?: boolean;
};

export type ClientEntryPoints = Set<string>;

export const bundleServer = async (props: BundleServerProps) => {
	const { development } = props;

	const clientEntryPoints: ClientEntryPoints = new Set<string>();

	const plugins: BunPlugin[] = [
		// babelPlugin({
		// 	development,
		// }),
		rscPlugin({ clientEntryPoints, development }),
	];

	const build = await Bun.build({
		entrypoints: [appFilePath],
		// root: process.cwd(),
		target: "bun",
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

	return { buildOutputs: build.outputs, clientEntryPoints };
};
