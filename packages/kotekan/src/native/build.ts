import { resolveSync } from "bun";
import { getDefaultConfig } from "@react-native/metro-config";

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
	// console.log(getDefaultConfig("./"));

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

	if (!build.success) {
		console.error(build.logs);
	}

	return;
};
