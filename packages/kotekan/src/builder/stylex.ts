import path from "node:path";
import stylexBabelPlugin, { type Rule } from "@stylexjs/babel-plugin";

import type { BuildOutputsMap } from "./types";

export const stylex = async ({
	clientBuildOutputs,
	stylexRules,
	buildPath,
}: {
	stylexRules: Record<string, Rule[]>;
	buildPath?: string;
	clientBuildOutputs: BuildOutputsMap;
}): Promise<void> => {
	const rules: Array<Rule> = Object.values(stylexRules).flat();

	if (rules.length === 0) {
		return;
	}

	const fileName = "./stylex.css";
	const stylexPath = buildPath
		? path.join(buildPath, "client", fileName)
		: fileName;

	const stylexCSS = stylexBabelPlugin.processStylexRules(rules, false);

	const artifact = Bun.file(stylexPath);

	if (buildPath) {
		// const artifact = Bun.file(stylexPath);
		Bun.write(artifact, stylexCSS);
	} else {
		// const artifact = Bun.file(stylexPath);
		artifact.writer().write(stylexCSS);
	}

	clientBuildOutputs.set(fileName, {
		name: fileName,
		artifact,
	});
};
