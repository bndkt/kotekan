import path from "node:path";
import type { Rule } from "@stylexjs/babel-plugin";

import { bundleServer } from "./bundleServer";
import { bundleClient } from "./bundleClient";
import { createBuildFile } from "./createBuildFile";
import { stylexCss } from "./stylexCss";
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
	rscEnabled: boolean;
	development: boolean;
}

export const buildRoute = async ({
	name,
	location,
	buildPath,
	ssrEnabled,
	rscEnabled,
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
		name: `${name}-ssr`,
		buildPath,
		content: ssrBuild.buildOutputs[0],
	});

	// Server for CSR
	if (!ssrEnabled) {
		const csrBuild = await bundleServer({
			location,
			mode: "render",
			stylexRules,
			development,
		});
		const csrBuildFile = await createBuildFile({
			name: `${name}-csr`,
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
		name: `${name}-ssr`,
		buildPath,
		content: ssrBuild.buildOutputs[0],
	});

	// Client (for SSR/CSR/RSC)
	console.log("Client entry points", ssrBuild.clientEntryPoints);
	const clientBuild = await bundleClient({
		location,
		mode: ssrEnabled ? "hydrate" : "render",
		rscEnabled,
		stylexRules,
		clientEntryPoints: rscBuild.clientEntryPoints,
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

	const stylexCssFile = await stylexCss({ stylexRules, buildPath });

	// console.log({ bootstrapFileName, stylexCssFile });
	console.log({ clientComponentMap });

	return {
		ssrBuildFilePath,
		csrBuildFilePath,
		bootstrapFileName,
		stylexCssFileName: stylexCssFile?.fileName,
		clientComponentMap,
	};
};
