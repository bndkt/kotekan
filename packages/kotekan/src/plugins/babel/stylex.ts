import stylexBabelPlugin from "@stylexjs/babel-plugin";

export const stylexPlugin = (dev: boolean) => {
	return stylexBabelPlugin.withOptions({
		// https://stylexjs.com/docs/api/configuration/babel-plugin/
		dev,
		test: false,
		runtimeInjection: dev,
		// classNamePrefix
		// useRemForFontSize
		// styleResolution
		importSources: [{ from: "react-strict-dom", as: "css" }],
		genConditionalClasses: true,
		treeshakeCompensation: false,
		// unstable_moduleResolution
	});
};
