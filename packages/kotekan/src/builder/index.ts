import path from "node:path";
import { resolveSync, type BuildConfig, type BuildArtifact } from "bun";

import { rscPlugin } from "../plugins/rsc";
import { mdxPlugin } from "../plugins/mdx";

interface BuilderProps {
	routes: Record<string, string>;
	buildPath?: string;
	development: boolean;
}

interface BuildOutput {
	name: string;
	// path?: string;
	artifact: BuildArtifact;
}

export interface BuildResult {
	// clientComponents: Record<string, BuildOutputFile>;
	renderScript: BuildOutput;
	hydrateScript: BuildOutput;
	clientBuildOutputs: Map<string, BuildOutput>;
}

export const builder = async ({
	routes,
	buildPath,
	development,
}: BuilderProps): Promise<BuildResult> => {
	const root = path.join(process.cwd(), "src");
	const clientComponentPaths = new Set<string>();

	// Server build
	const rootComponentPath = resolveSync("./Root", root);
	const routeComponentPaths = Object.values(routes);
	const serverBuild = await Bun.build({
		entrypoints: [rootComponentPath, ...routeComponentPaths],
		target: "bun",
		sourcemap: development ? "inline" : "none",
		minify: development ? false : true,
		outdir: `${buildPath}/server`,
		naming: "[dir]/[name].[ext]",
		plugins: [
			rscPlugin({ clientComponentPaths, development }),
			mdxPlugin({ development }),
		],
	});

	console.log(`🥁 Built ${serverBuild.outputs.length} server files`);

	// Client build
	const clientDir = path.join(import.meta.dir, "..", "client");
	const renderScriptFilePath = resolveSync("./render", clientDir);
	const hydrateScriptFilePath = resolveSync("./hydrate", clientDir);

	const clientBuildConfig: Partial<BuildConfig> = {
		target: "browser",
		sourcemap: development ? "inline" : "none",
		minify: development ? false : true,
		outdir: buildPath ? `${buildPath}/client` : undefined,
		external: [
			"react",
			"react-dom",
			"react-strict-dom",
			"react-server-dom-esm",
		],
	};

	const clientComponentsBuild = await Bun.build({
		entrypoints: Array.from(clientComponentPaths),
		naming: "[dir]/[name].[ext]",
		root,
		...clientBuildConfig,
	});

	const clientBuildOutputs: Map<string, BuildOutput> = new Map();
	for (const buildArtifact of clientComponentsBuild.outputs) {
		clientBuildOutputs.set(buildArtifact.path, {
			name: path.basename(buildArtifact.path),
			artifact: buildArtifact,
		});
	}

	console.log(
		`🥁 Built ${clientComponentsBuild.outputs.length} client component files`,
	);

	const clientScriptsBuild = await Bun.build({
		entrypoints: [renderScriptFilePath, hydrateScriptFilePath],
		naming: "[name].[ext]",
		...clientBuildConfig,
	});

	const renderScript: BuildOutput = {
		name: path.basename(clientScriptsBuild.outputs[0].path),
		artifact: clientScriptsBuild.outputs[0], // @todo stream()?
	};

	const hydrateScript: BuildOutput = {
		name: path.basename(clientScriptsBuild.outputs[1].path),
		artifact: clientScriptsBuild.outputs[1], // @todo stream()?
	};

	clientBuildOutputs.set(renderScript.artifact.path, renderScript);
	clientBuildOutputs.set(hydrateScript.artifact.path, hydrateScript);

	console.log(
		`🥁 Built ${clientScriptsBuild.outputs.length} client script files`,
	);

	return { renderScript, hydrateScript, clientBuildOutputs };
};
