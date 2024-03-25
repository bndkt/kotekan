import path from "node:path";
import { resolveSync, type BuildConfig } from "bun";
import type { Rule } from "@stylexjs/babel-plugin";

import type {
	BuildOutput,
	BuildOutputsMap,
	BuildResult,
	BuilderProps,
} from "./types";
import { mdxPlugin } from "../plugins/mdx";
import { kotekanPlugin } from "../plugins/kotekan";
import { stylex } from "./stylex";

export const builder = async ({
	routes,
	buildPath,
	development,
}: BuilderProps): Promise<BuildResult> => {
	const root = path.join(process.cwd(), "src");
	const clientComponentPaths = new Set<string>();
	const stylexRules: Record<string, Rule[]> = {};

	// Server build
	const serverBuildOutputs: BuildOutputsMap = new Map();
	const rootComponentPath = resolveSync("./Root", root);
	const routeComponentPaths = Object.values(routes);
	const serverBuild = await Bun.build({
		entrypoints: [rootComponentPath, ...routeComponentPaths],
		target: "bun",
		sourcemap: development ? "inline" : "none",
		minify: development ? false : true,
		outdir: buildPath ? `${buildPath}/server` : undefined,
		naming: "[dir]/[name].[ext]",
		conditions: "react-server",
		plugins: [
			kotekanPlugin({
				clientComponentPaths,
				development,
				server: true,
				stylexRules,
			}),
			mdxPlugin({ development }),
		],
	});

	for (const buildArtifact of serverBuild.outputs) {
		serverBuildOutputs.set(buildArtifact.path, {
			name: path.basename(buildArtifact.path),
			artifact: buildArtifact,
		});
	}

	// console.log(`🥁 Built ${serverBuild.outputs.length} server files`);

	// Client build
	const clientBuildOutputs: BuildOutputsMap = new Map();
	const clientDir = path.join(import.meta.dir, "..", "client");
	const renderScriptFilePath = resolveSync("./render", clientDir);
	const hydrateScriptFilePath = resolveSync("./hydrate", clientDir);

	// StyleX
	await stylex({
		clientBuildOutputs,
		stylexRules,
		buildPath,
	});

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
			"@physis/react-server-dom-esm",
		],
		plugins: [
			kotekanPlugin({ clientComponentPaths, development, stylexRules }),
			mdxPlugin({ development }),
		],
	};

	const clientComponentEintrypoints = Array.from(clientComponentPaths);
	if (clientComponentEintrypoints.length) {
		const clientComponentsBuild = await Bun.build({
			entrypoints: clientComponentEintrypoints,
			naming: "[dir]/[name].[ext]",
			root,
			...clientBuildConfig,
		});

		for (const buildArtifact of clientComponentsBuild.outputs) {
			clientBuildOutputs.set(buildArtifact.path, {
				name: path.basename(buildArtifact.path),
				artifact: buildArtifact,
			});
		}

		// console.log(`🥁 Built ${clientComponentsBuild.outputs.length} client component files`);
	}

	const clientScriptsBuild = await Bun.build({
		entrypoints: [renderScriptFilePath, hydrateScriptFilePath],
		naming: "[name].[ext]",
		...clientBuildConfig,
	});

	const renderScript: BuildOutput = {
		name: path.basename(clientScriptsBuild.outputs[0].path),
		artifact: clientScriptsBuild.outputs[0], // @todo stream()?
	};
	clientBuildOutputs.set(clientScriptsBuild.outputs[0].path, renderScript);

	const hydrateScript: BuildOutput = {
		name: path.basename(clientScriptsBuild.outputs[1].path),
		artifact: clientScriptsBuild.outputs[1], // @todo stream()?
	};
	clientBuildOutputs.set(clientScriptsBuild.outputs[1].path, hydrateScript);

	// console.log(`🥁 Built ${clientScriptsBuild.outputs.length} client script files`);

	return {
		serverBuildOutputs,
		clientBuildOutputs,
		renderScript,
		hydrateScript,
	};
};
