import path from "node:path";
import type { Rule } from "@stylexjs/babel-plugin";

import { bundleServer } from "./bundleServer";
import { bundleClient } from "./bundleClient";
import { createBuildFile } from "./createBuildFile";
import { createStylexCss } from "./createStylexCss";
import { createClientFile } from "./createClientFile";

export type StylexRules = Record<string, Rule[]>;

export type ClientComponentMap = Map<
	string,
	{
		id: string;
		name: string;
		async: boolean;
	}
>;

interface BuildRouteProps {
	name: string;
	location: string;
	buildPath: string;
	ssrEnabled: boolean;
	development: boolean;
}

export const buildRoute = async ({
	name,
	location,
	buildPath,
	ssrEnabled,
	development,
}: BuildRouteProps) => {
	let csrBuildFilePath: string | undefined;

	const stylexRules: StylexRules = {};

	// Server for SSR/SSG
	const ssrBuild = await bundleServer({
		location,
		mode: "hydrate",
		stylexRules,
		development,
	});
	const { filePath: ssrBuildFilePath } = await createBuildFile({
		name: `${name}-ssr-${ssrBuild.buildOutputs[0].hash}`,
		buildPath,
		content: ssrBuild.buildOutputs[0],
	});

	// Server for CSR
	if (!ssrEnabled) {
		const csrBuild = await bundleServer({
			location,
			mode: "render",
			// stylexRules,
			development,
		});
		const csrBuildFile = await createBuildFile({
			name: `${name}-csr-${csrBuild.buildOutputs[0].hash}`,
			buildPath,
			content: csrBuild.buildOutputs[0],
		});
		csrBuildFilePath = csrBuildFile.filePath;
	}

	// Server for RSC
	const rscBuild = await bundleServer({
		location,
		mode: "rsc",
		stylexRules,
		development,
	});
	const { filePath: rscBuildFilePath } = await createBuildFile({
		name: `${name}-rsc-${rscBuild.buildOutputs[0].hash}`,
		buildPath,
		content: rscBuild.buildOutputs[0],
	});

	const stylexCssFile = await createStylexCss({ stylexRules, buildPath });

	// Client (for SSR/CSR/RSC)
	console.log("Client entry points", ssrBuild.clientEntryPoints);
	const clientBuild = await bundleClient({
		location,
		mode: ssrEnabled ? "hydrate" : "render",
		// stylexRules,
		clientEntryPoints: rscBuild.clientEntryPoints,
		stylexCssFile: stylexCssFile?.fileName,
		development,
	});

	const clientComponentMap: ClientComponentMap = new Map();

	// const { fileName: bootstrapFileName } = await createBuildFile({
	// 	name: `${name}-client`,
	// 	buildPath,
	// 	buildArtifact: clientBuild.buildOutputs[0],
	// });

	const [bootstrapOutput, ...restOutput] = clientBuild.buildOutputs;
	const { fileName: bootstrapFileName } = await createClientFile({
		buildOutput: bootstrapOutput,
		buildPath,
		clientComponentMap,
	});
	for (const buildOutput of restOutput) {
		await createClientFile({ buildOutput, buildPath, clientComponentMap });
	}

	// // console.log("buildArtifact", buildArtifact.path, buildArtifact.name);
	// const { fileName: clientBuildFileName } = await createBuildFile({
	// 	name: `${name}-client`,
	// 	buildPath,
	// 	buildArtifact,
	// });

	// console.log({ bootstrapFileName, stylexCssFile });
	console.log({ clientComponentMap });

	return {
		ssrBuildFilePath,
		rscBuildFilePath,
		csrBuildFilePath,
		bootstrapFileName,
		stylexCssFileName: stylexCssFile?.fileName,
		clientComponentMap,
	};
};
