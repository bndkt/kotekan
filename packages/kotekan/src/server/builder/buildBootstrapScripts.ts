import path from "node:path";
import { resolveSync } from "bun";

const renderFilePath = resolveSync("./../../client/render", import.meta.dir);
const hydrateFilePath = resolveSync("./../../client/hydrate", import.meta.dir);

interface BuildBootstrapScriptProps {
	stylexCssUrl: string;
	buildPath: string;
	development: boolean;
}

export const buildBootstrapScripts = async ({
	stylexCssUrl,
	buildPath,
	development,
}: BuildBootstrapScriptProps) => {
	const build = await Bun.build({
		entrypoints: [renderFilePath, hydrateFilePath],
		target: "browser",
		sourcemap: development ? "inline" : "none",
		minify: development ? false : true,
		outdir: path.join(buildPath, "client", "bootstrap"),
		naming: "[name]-[hash].[ext]",
		define: {
			// "process.env.LOCATION": JSON.stringify(""),
			// "process.env.HYDRATE": JSON.stringify(mode === "ssr"),
			// "process.env.STYLESHEET": JSON.stringify(stylexCssUrl),
		},
	});

	if (!build.success || build.outputs.length !== 2) {
		console.error("🥁 Build error:", build.logs);
		throw new Error("🥁 Build failed or no outputs");
	}

	const renderBootstrapFileName = path.basename(build.outputs[0].path);
	const hydrateBootstrapFileName = path.basename(build.outputs[1].path);

	const result = {
		renderBootstrapFileName,
		hydrateBootstrapFileName,
	};

	return result;
};
