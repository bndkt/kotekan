import path from "node:path";
import { resolveSync } from "bun";

import type { ClientComponentsMap, ClientEntryPoints, StylexRules } from ".";
import { createBuildFile } from "./createBuildFile";
import { buildServerComponents } from "./buildServerComponents";

interface BuildRootComponentProps {
	buildPath: string;
	stylexRules: StylexRules;
	clientEntryPoints: ClientEntryPoints;
	clientComponentsMap: ClientComponentsMap;
	mdxEnabled: boolean;
	development: boolean;
}

export const buildRootComponent = async ({
	buildPath,
	stylexRules,
	clientEntryPoints,
	clientComponentsMap,
	mdxEnabled,
	development,
}: BuildRootComponentProps) => {
	const routePath = resolveSync("./src/root", process.cwd());
	const build = await buildServerComponents({
		entrypoints: [routePath],
		stylexRules,
		clientEntryPoints,
		clientComponentsMap,
		mdxEnabled,
		development,
	});

	if (!build.success || build.outputs.length === 0) {
		console.error("🥁 Build error:", build.logs);
		throw new Error("🥁 Build failed or no outputs");
	}

	const { filePath: rootComponentFilePath } = await createBuildFile({
		name: `root-${build.outputs[0].hash}`,
		buildPath: path.join(buildPath, "server", "root"),
		content: build.outputs[0],
	});

	return { rootComponentFilePath, clientEntryPoints };
};
