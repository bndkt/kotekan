import { babelPlugin } from "../../plugins/babel";
import type { StylexRules } from ".";

interface BuildClientComponentsProps {
	entrypoints: string[];
	buildPath: string;
	stylexRules: StylexRules;
	development: boolean;
}

export const buildClientComponents = async ({
	entrypoints,
	buildPath,
	stylexRules,
	development,
}: BuildClientComponentsProps) => {
	const build = await Bun.build({
		entrypoints,
		target: "browser",
		// splitting: true,
		sourcemap: "none", // development ? "inline" : "none",
		minify: development ? false : true,
		// naming: "[name]-[hash].[ext]",
		outdir: `${buildPath}/client/components`,
		// external: [],
		define: {},
		plugins: [
			babelPlugin({
				stylexRules,
				development,
			}),
		],
	});

	if (!build.success || build.outputs.length === 0) {
		console.error("🥁 Build error:", build.logs);
		throw new Error("🥁 Build failed or no outputs");
	}
};
