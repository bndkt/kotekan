import path from "node:path";
import { resolveSync } from "bun";

import { babelPlugin } from "../../plugins/babel";
import { createBuildFile } from "./createBuildFile";
import { rscPlugin } from "../../plugins/rsc";
import type { ClientEntryPoints, StylexRules } from ".";
import { mdxPlugin } from "../../plugins/mdx";
import { buildServerComponents } from "./buildServerComponents";

interface BuildRootComponentProps {
	buildPath: string;
	stylexRules: StylexRules;
	clientEntryPoints: ClientEntryPoints;
	development: boolean;
}

export const buildRootComponent = async ({
	buildPath,
	stylexRules,
	clientEntryPoints,
	development,
}: BuildRootComponentProps) => {
	const routePath = resolveSync("./src/root", process.cwd());
	const build = await buildServerComponents({
		entrypoints: [routePath],
		stylexRules,
		clientEntryPoints,
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
