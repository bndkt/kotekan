import path from "node:path";
import stylexBabelPlugin, { type Rule } from "@stylexjs/babel-plugin";

import type { StylexRules } from "./buildRoute";

export const stylexCss = async ({
	stylexRules,
	buildPath,
}: { stylexRules: StylexRules; buildPath: string }) => {
	const rules: Array<Rule> = Object.values(stylexRules).flat();

	if (rules.length === 0) {
		return;
	}

	const collectedCSS = stylexBabelPlugin.processStylexRules(rules, false);
	const hash = Bun.hash(collectedCSS);
	// const fileName = `stylex-${hash}.css`;
	const fileName = "stylex.css";
	const filePath = path.join(buildPath, fileName);

	console.log("Build file:", fileName);

	const file = Bun.file(filePath);
	if (!(await file.exists())) {
		Bun.write(file, collectedCSS);
	}

	return { fileName, filePath };
};
