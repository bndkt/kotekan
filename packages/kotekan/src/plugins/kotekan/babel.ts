import type { OnLoadArgs } from "bun";
import { transformAsync } from "@babel/core";
import stylexBabelPlugin, { type Rule } from "@stylexjs/babel-plugin";
// @ts-expect-error Missing types
import typescriptSyntaxPlugin from "@babel/plugin-syntax-typescript";
// @ts-expect-error Missing types
import jsxSyntaxPlugin from "@babel/plugin-syntax-jsx";
// @ts-expect-error Missing types
import flowSyntaxPlugin from "@babel/plugin-syntax-flow";
// @ts-expect-error Missing types
import rsdPlugin from "react-strict-dom/babel";

export const babel = async (
	inputCode: string,
	{
		args,
		stylexRules,
		development: dev,
	}: {
		args: OnLoadArgs;
		stylexRules?: Record<string, Rule[]>;
		development?: boolean;
	},
) => {
	let contents = inputCode;

	const stylexImports = ["@stylexjs/stylex", "react-strict-dom"];

	if (!stylexImports.some((importName) => inputCode.includes(importName))) {
		return contents;
	}

	// if (args.path.includes("node_modules")) {
	// 	// return contents;
	// }

	// console.log("🥁 STYLEX PLUGIN ON LOAD", args.path);

	const transformResult = await transformAsync(contents, {
		babelrc: false,
		filename: args.path,
		plugins: [
			flowSyntaxPlugin,
			[typescriptSyntaxPlugin, { isTSX: true }],
			jsxSyntaxPlugin,
			rsdPlugin,
			stylexBabelPlugin.withOptions({
				treeshakeCompensation: true,
				runtimeInjection: false,
				dev,
				importSources: [{ from: "react-strict-dom", as: "css" }],
			}),
		],
	});

	if (!transformResult) {
		return contents;
	}

	const code = transformResult.code;
	const metadata = transformResult.metadata as unknown as { stylex: Rule[] }; // @todo

	if (
		// !dev &&
		stylexRules &&
		metadata.stylex !== null &&
		metadata.stylex.length > 0
	) {
		stylexRules[args.path] = metadata.stylex;
	}

	if (code) {
		contents = code;
	}

	if (args.path.includes("Counter")) {
		// console.log("StyleX", args.path, code);
	}

	return contents;
};
