import path from "node:path";
import stylexBabelPlugin, { type Rule } from "@stylexjs/babel-plugin";

import type { StylexRules } from ".";

interface BuildStylesheetProps {
	stylexRules: StylexRules;
	buildPath: string;
}

export const buildStylesheet = async ({
	stylexRules,
	buildPath,
}: BuildStylesheetProps) => {
	const rulesArray: Array<Rule> = Object.values(stylexRules).flat();

	const collectedCSS = stylexBabelPlugin.processStylexRules(rulesArray, false);
	const hash = Bun.hash(collectedCSS);
	const fileName = `stylex-${hash}.css`;
	const filePath = path.join(buildPath, "client", "styles", fileName);

	console.log("Build file:", fileName);

	const file = Bun.file(filePath);
	if (!(await file.exists())) {
		await Bun.write(file, collectedCSS);
	}

	return { stylesheetFileName: fileName };
};
