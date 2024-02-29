import { resolveSync } from "bun";
import { getDefaultConfig } from "@react-native/metro-config";

import { createBuildFile } from "./lib/createBuildFile";
import { reactNativePlugin } from "../plugins/reactNative";

interface BuildProps {
	// routes: Record<string, string>;
	buildPath: string;
	development?: boolean;
}

export const build = async ({
	// routes,
	buildPath,
	development,
}: BuildProps) => {
	const indexFilePath = resolveSync("./src/index.ts", process.cwd());
	console.log({ indexFilePath });
	console.log(getDefaultConfig("./"));

	return;

	const build = await Bun.build({
		entrypoints: [indexFilePath],
		// root: process.cwd(),
		target: "node",
		// splitting: true,
		sourcemap: development ? "inline" : "none",
		minify: development ? false : true,
		// naming: "[name]-[hash].[ext]",
		// outdir: hydrate ? "./build" : undefined,
		external: [],
		define: {
			"process.env.DEMO": JSON.stringify(true),
		},
		loader: {
			// ".js.flow": "js",
		},
		plugins: [reactNativePlugin({ development })],
	});

	if (!build.success || build.outputs.length === 0) {
		console.error("Logs:", build.logs);
		throw new Error("Build failed or no outputs");
	}

	await createBuildFile({
		name: "bundle",
		buildArtifact: build.outputs[0],
		buildPath,
	});

	// return rnBuild;
};
