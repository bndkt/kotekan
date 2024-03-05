import path from "node:path";
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

	const projectRoot = path.join(process.cwd());
	const workspaceRoot = path.join(process.cwd(), "../../");
	console.log({ projectRoot, workspaceRoot });

	const rnDefaultConfig = getDefaultConfig(projectRoot);

	const config: MetroConfig = {
		resetCache: false,
		projectRoot,
		watchFolders: [workspaceRoot],
		resolver: {
			nodeModulesPaths: [
				path.resolve(projectRoot, "node_modules"),
				path.resolve(workspaceRoot, "node_modules"),
			],
			extraNodeModules: {
				modules: workspaceRoot,
			},
			useWatchman: true,
		},
		server: {
			port: 8081,
		},
		cacheStores: [],
	};
	const mergedConfig = mergeConfig(rnDefaultConfig, config);

	const metroBuildOptions: RunBuildOptions = {
		entry: "./index.ts",
		platform: "ios",
		dev: true,
		out: "dist",
	};

	const metroServerOptions: RunServerOptions = {
		watch: false,
		waitForBundler: false,
		onError: (error) => {
			console.error("Metro error", error);
		},
	};

	// Works
	// await runBuild(mergedConfig, metroBuildOptions);

	const serverInstance = await runServer(mergedConfig, {
		host: "localhost",
		secure: false,
		// secureCert: args.cert,
		// secureKey: args.key,
		unstable_extraMiddleware: [
			// communityMiddleware,
			// indexPageMiddleware,
			// middleware,
		],
		websocketEndpoints: {
			// ...communityWebsocketEndpoints,
			// ...websocketEndpoints,
		},
	});

	// const metroMiddleware = await createConnectMiddleware(
	// 	mergedConfig,
	// 	metroServerOptions,
	// );

	// const metroBundlerServer = await runMetro(mergedConfig, metroServerOptions);
	// const metroBundlerServer = await runServer(mergedConfig, metroServerOptions);
	// console.log({ metroBundlerServer });

	// return metroMiddleware;
};
