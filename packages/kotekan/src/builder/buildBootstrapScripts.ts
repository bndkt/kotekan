import path from "node:path";
import { resolveSync } from "bun";

const renderFilePath = resolveSync("kotekan/client/render", import.meta.dir);
const hydrateFilePath = resolveSync("kotekan/client/hydrate", import.meta.dir);

interface BuildBootstrapScriptProps {
	buildPath: string;
	development: boolean;
}

export const buildBootstrapScripts = async ({
	buildPath,
	development,
}: BuildBootstrapScriptProps) => {
	const build = await Bun.build({
		entrypoints: [renderFilePath, hydrateFilePath],
		target: "browser",
		sourcemap: development ? "inline" : "none",
		minify: development ? false : true,
		external: ["react", "react-dom", "react-server-dom-esm"],
		outdir: path.join(buildPath, "client"),
		naming: "[name]-[hash].[ext]",
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
