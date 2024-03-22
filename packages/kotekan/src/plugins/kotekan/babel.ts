import type { OnLoadArgs } from "bun";
import { transformAsync } from "@babel/core";
import stylexBabelPlugin, { type Rule } from "@stylexjs/babel-plugin";
// @ts-expect-error Missing types
import typescriptSyntaxPlugin from "@babel/plugin-syntax-typescript";
// @ts-expect-error Missing types
import jsxSyntaxPlugin from "@babel/plugin-syntax-jsx";
// @ts-expect-error Missing types
import rsdPlugin from "react-strict-dom/babel";

export const babel = async (
	input: string,
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
	let contents = input;

	const stylexImports = ["@stylexjs/stylex", "react-strict-dom"];

	const transformResult = await transformAsync(contents, {
		babelrc: false,
		filename: args.path,
		plugins: [
			[typescriptSyntaxPlugin, { isTSX: true }],
			jsxSyntaxPlugin,
			rsdPlugin,
			stylexBabelPlugin.withOptions({
				treeshakeCompensation: true,
				dev,
				importSources: [{ from: "react-strict-dom", as: "css" }],
			}),
		],
	});

	if (!transformResult) {
		return contents;
	}

	const { code, metadata } = transformResult;

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

	return contents;
};
