import path from "node:path";
import { resolveSync } from "bun";

import type { ClientComponentsMap, ClientEntryPoints, StylexRules } from ".";
import { createBuildFile } from "./createBuildFile";
import { buildServerComponents } from "./buildServerComponents";

interface BuildRootComponentProps {
	buildPath: string;
	stylexRules: StylexRules;
	clientEntryPoints: ClientEntryPoints;
	mdxEnabled: boolean;
	development: boolean;
}

export const buildRootComponent = async ({
	buildPath,
	stylexRules,
	clientEntryPoints,
	mdxEnabled,
	development,
}: BuildRootComponentProps) => {
	const rootComponentPath = resolveSync("./src/Root", process.cwd());
	const build = await buildServerComponents({
		entrypoints: [rootComponentPath],
		stylexRules,
		clientEntryPoints,
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
