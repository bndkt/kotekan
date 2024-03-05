import stylexBabelPlugin from "@stylexjs/babel-plugin";

export const stylexPlugin = ({ development }: { development: boolean }) => {
	return stylexBabelPlugin.withOptions({
		// https://stylexjs.com/docs/api/configuration/babel-plugin/
		dev: development,
		test: false,
		// runtimeInjection: development,
		// classNamePrefix
		// useRemForFontSize
		// styleResolution
		importSources: [{ from: "react-strict-dom", as: "css" }],
		genConditionalClasses: true,
		treeshakeCompensation: false,
		// unstable_moduleResolution
	});
};
