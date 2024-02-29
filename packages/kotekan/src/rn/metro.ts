import path from "node:path";
import { getDefaultConfig, mergeConfig } from "@react-native/metro-config";
import { runBuild, type MetroConfig, type RunBuildOptions } from "metro";

export const metro = () => {
	console.log("Hello from metro");

	const projectRoot = path.join(process.cwd());
	const workspaceRoot = path.join(process.cwd(), "../../");
	console.log({ projectRoot, workspaceRoot });

	const rnDefaultConfig = getDefaultConfig(projectRoot);

	const config: MetroConfig = {
		projectRoot,
		watchFolders: [workspaceRoot],
		resetCache: false,
		resolver: {
			nodeModulesPaths: [
				path.resolve(projectRoot, "node_modules"),
				path.resolve(workspaceRoot, "node_modules"),
			],
			extraNodeModules: {
				modules: workspaceRoot,
			},
			useWatchman: false,
			// unstable_enableSymlinks: true,
		},
	};
	const mergedConfig = mergeConfig(rnDefaultConfig, config);

	const metroBuildOptions: RunBuildOptions = {
		entry: "./src/index.ts",
	};
	// metroBundler.runMetro(mergedConfig, {});
	// metroBundler.buildGraph(mergedConfig, {
	// 	entries: ["./src/index.ts"],
	// });
	runBuild(mergedConfig, metroBuildOptions);
};
