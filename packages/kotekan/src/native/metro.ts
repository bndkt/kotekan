import path from "node:path";
import { $ } from "bun";
import { getDefaultConfig, mergeConfig } from "@react-native/metro-config";
import {
	type MetroConfig,
	type RunBuildOptions,
	type RunServerOptions,
	createConnectMiddleware,
	runBuild,
	runMetro,
	runServer,
} from "metro";

export const metro = async () => {
	console.log("Hello from metro");

	const projectRoot = path.join(process.cwd(), "build/mobile");
	// console.log({ projectRoot });
	const workspaceRoot = path.join(process.cwd(), "../../");

	const rnDefaultConfig = getDefaultConfig(projectRoot);

	const config: MetroConfig = {
		projectRoot,
		watchFolders: [workspaceRoot],
		reporter: {
			update(event) {
				console.log(event);
			},
		},
		resetCache: true,
		resolver: {
			enableGlobalPackages: true,
			nodeModulesPaths: [
				path.resolve(projectRoot, "../../node_modules"),
				path.resolve(workspaceRoot, "node_modules"),
			],
			useWatchman: true,
			// unstable_enablePackageExports: true,
		},
		transformer: {},
		server: {
			port: 8081,
		},
		watcher: {},
		cacheStores: [],
	};
	const mergedConfig = mergeConfig(rnDefaultConfig, config);
	// console.log({ mergedConfig });
	console.log(mergedConfig.watchFolders, projectRoot);

	const metroBuildOptions: RunBuildOptions = {
		entry: "./index.ts",
		platform: "ios",
		dev: true,
		out: "dist",
	};

	const metroServerOptions: RunServerOptions = {
		host: "localhost",
		secureServerOptions: {},
		onError: (error) => {
			console.error("Metro error", error);
		},
		onReady: (server) => {
			console.log("Metro ready", server);
		},
	};

	// Build
	// await runBuild(mergedConfig, metroBuildOptions);

	// const serverInstance = await runServer(mergedConfig, metroServerOptions);

	// const metroMiddleware = await createConnectMiddleware(
	// 	mergedConfig,
	// 	metroServerOptions,
	// );

	// const metroBundlerServer = await runMetro(
	// 	mergedConfig,
	// 	metroServerOptions,
	// ).then((server) => {
	// 	console.log("Metro server", server);
	// 	// server.processRequest();
	// });
	// const metroBundlerServer = await runMetro(mergedConfig, metroServerOptions);
	// const metroBundlerServer = await runServer(mergedConfig, metroServerOptions);
	// console.log({ metroBundlerServer });

	// RN Start
	await $`react-native start --config ./build/mobile/metro.config.cjs`.cwd(
		process.cwd(),
	);

	// Doctor
	// await $`bunx react-native doctor`;

	// Info
	// await $`bunx react-native info`;

	// await $`bunx metro serve --project-roots ./build/mobile`;

	// return metroMiddleware;
};
