import path from "node:path";
import stylexBabelPlugin, { type Rule } from "@stylexjs/babel-plugin";

export const stylex = async ({
	stylexRules,
	buildPath,
}: { stylexRules: Record<string, Rule[]>; buildPath?: string }) => {
	const rules: Array<Rule> = Object.values(stylexRules).flat();

	if (rules.length === 0) {
		return;
	}

	const stylexCSS = stylexBabelPlugin.processStylexRules(rules, false);

	const stylexPath = buildPath
		? path.join(buildPath, "stylex.css")
		: "./stylex.css";

	if (buildPath) {
		const stylexFile = Bun.file(stylexPath);
		Bun.write(stylexFile, stylexCSS);
	}

	console.log({ stylexPath, stylexCSS });

	return { stylexPath, stylexCSS };
};
