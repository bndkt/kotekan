import path from "node:path";
import stylexBabelPlugin, { type Rule } from "@stylexjs/babel-plugin";

import type { StylexRules } from ".";

interface CreateStylesheetProps {
	stylexRules: StylexRules;
	buildPath: string;
}

export const createStylesheet = async ({
	stylexRules,
	buildPath,
}: CreateStylesheetProps) => {
	const rulesArray: Array<Rule> = Object.values(stylexRules).flat();

	if (rulesArray.length === 0) {
		return null;
	}

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
