import { babelPlugin } from "../plugins/babel";
import type { ClientEntryPoints, StylexRules } from ".";

interface BuildClientComponentsProps {
	clientEntryPoints: ClientEntryPoints;
	buildPath: string;
	stylexRules: StylexRules;
	development: boolean;
}

export const buildClientComponents = async ({
	clientEntryPoints,
	buildPath,
	stylexRules,
	development,
}: BuildClientComponentsProps) => {
	const build = await Bun.build({
		entrypoints: Array.from(clientEntryPoints),
		target: "browser",
		sourcemap: development ? "inline" : "none",
		minify: development ? false : true,
		outdir: `${buildPath}/client/components`,
		naming: "[name].[ext]",
		external: [
			"react",
			"react-dom",
			"react-server-dom-esm",
			"react-strict-dom",
		],
		plugins: [
			babelPlugin({
				stylexRules,
				development,
			}),
		],
	});
};
