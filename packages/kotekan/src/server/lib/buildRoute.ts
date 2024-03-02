import path from "node:path";
import type { Rule } from "@stylexjs/babel-plugin";

import { bundleServer } from "./bundleServer";
import { bundleClient } from "./bundleClient";
import { createBuildFile } from "./createBuildFile";
import { createStylexCss } from "./createStylexCss";
import { createClientFile } from "./createClientFile";
import type { RenderMode } from "../server";

export type StylexRules = Record<string, Rule[]>;

export type ClientComponentMap = Map<
	string,
	{
		id: string;
		name: string;
		chunks: string[];
		async: boolean;
	}
>;

interface BuildRouteProps {
	name: string;
	location: string;
	mode: RenderMode;
	buildPath: string;
	buildUrlSegment: string;
	development: boolean;
}

export const buildRoute = async ({
	name,
	location,
	mode,
	buildPath,
	buildUrlSegment,
	development,
}: BuildRouteProps) => {
	let csrBuildFilePath: string | undefined;

	const stylexRules: StylexRules = {};

	// Server for SSR/SSG
	// const ssrBuild = await bundleServer({
	// 	location,
	// 	mode: "hydrate",
	// 	stylexRules,
	// 	development,
	// });
	// const { filePath: ssrBuildFilePath } = await createBuildFile({
	// 	name: `${name}-ssr-${ssrBuild.buildOutputs[0].hash}`,
	// 	buildPath,
	// 	content: ssrBuild.buildOutputs[0],
	// });

	// Server for CSR
	if (mode === "csr") {
		const csrBuild = await bundleServer({
			location,
			mode: "csr",
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
		mode: "ssr",
		stylexRules,
		development,
	});
	const { filePath: rscBuildFilePath } = await createBuildFile({
		name: `${name}-rsc-${rscBuild.buildOutputs[0].hash}`,
		buildPath,
		content: rscBuild.buildOutputs[0],
	});

	const stylexCss = await createStylexCss({ stylexRules, buildPath });
	const stylexCssUrl = stylexCss
		? `${buildUrlSegment}/${stylexCss.fileName}`
		: undefined;

	// Client
	console.log("Client entry points", rscBuild.clientEntryPoints);
	const clientBuild = await bundleClient({
		location,
		mode,
		// stylexRules,
		clientEntryPoints: rscBuild.clientEntryPoints,
		stylexCssUrl,
		development,
	});

	const clientComponentMap: ClientComponentMap = new Map();
	const [bootstrapOutput, ...restOutput] = clientBuild.buildOutputs;
	const { fileName: bootstrapFileName } = await createClientFile({
		buildOutput: bootstrapOutput,
		buildPath,
		clientComponentMap,
	});
	console.log("🥁 clientComponentMap", clientComponentMap);
	for (const buildOutput of restOutput) {
		await createClientFile({ buildOutput, buildPath, clientComponentMap });
	}
	const bootstrapFileUrl = `${buildUrlSegment}/${bootstrapFileName}`;

	return {
		rscBuildFilePath,
		csrBuildFilePath,
		bootstrapFileUrl,
		stylexCssUrl,
		clientComponentMap,
	};
};
