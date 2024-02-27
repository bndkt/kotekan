import path from "node:path";
import type { BuildArtifact } from "bun";
import { babelPlugin } from "../plugins/babelPlugin";

export type BuildArtifacts = Map<string, BuildArtifact>;

export const build = async (development = false) => {
	const buildArtifacts: BuildArtifacts = new Map();

	// Build root to disk
	const rootPath = path.join(process.cwd(), "src", "root.tsx");
	const rootBuild = await Bun.build({
		entrypoints: [rootPath],
		target: "bun",
		publicPath: "",
		// outdir: "./build",
		sourcemap: development ? "inline" : "none",
		minify: development ? true : false,
		// splitting: true,
		// publicPath: "/_kotekan/static/",
		naming: "[name]-[hash].[ext]",
		external: ["react", "react-dom"],
		plugins: [
			babelPlugin({
				development,
			}),
		],
	});

	if (!rootBuild.success) {
		console.error(rootBuild.logs);
	}

	const buildFilePath = path.join(
		process.cwd(),
		"build",
		rootBuild.outputs[0].path,
	);
	console.log(buildFilePath);
	const file = Bun.file(buildFilePath);
	if (!(await file.exists())) {
		Bun.write(file, rootBuild.outputs[0]);
	}
	buildArtifacts.set("root.js", rootBuild.outputs[0]);

	// Build hydrate
	const hydratePath = path.join(import.meta.dir, "..", "client", "hydrate.tsx");
	const hydrateBuild = await Bun.build({
		entrypoints: [hydratePath],
		target: "browser",
		sourcemap: development ? "inline" : "none",
		minify: development ? true : false,
		// splitting: true,
		// publicPath: "/_kotekan/static/",
		// naming: "[name]-[hash].[ext]",
		naming: "[name].[ext]",
		plugins: [
			babelPlugin({
				development,
			}),
		],
	});

	if (!hydrateBuild.success) {
		console.error(hydrateBuild.logs);
	}

	for (const buildOutput of hydrateBuild.outputs) {
		buildArtifacts.set(buildOutput.path.substring(2), buildOutput);
	}

	console.log("Building complete", buildArtifacts.keys());

	return buildArtifacts;
};
