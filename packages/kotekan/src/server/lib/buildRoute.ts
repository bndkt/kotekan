import path from "node:path";
import type { Rule } from "@stylexjs/babel-plugin";

import { bundleServer } from "./bundleServer";
import { bundleClient } from "./bundleClient";
import { createBuildFile } from "./createBuildFile";
import { createStylexCss } from "./createStylexCss";
import { createClientFile } from "./createClientFile";
import type { RenderMode } from "..";
import type { Routes } from "../../client/Router";

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
	routes: Routes;
	development: boolean;
}

export const buildRoute = async ({
	name,
	location,
	mode,
	buildPath,
	buildUrlSegment,
	routes,
	development,
}: BuildRouteProps) => {
	let csrBuildFilePath: string | undefined;
	const clientBuildPath = path.join(buildPath, "client");
	const serverBuildPath = path.join(buildPath, "server", "routes");
	const stylexRules: StylexRules = {};

	// Server build for CSR (shell)
	if (mode === "csr") {
		const csrBuild = await bundleServer({
			location,
			mode: "csr",
			routes,
			// stylexRules,
			development,
		});
		const csrBuildFile = await createBuildFile({
			name: `${name}-csr-${csrBuild.buildOutputs[0].hash}`,
			buildPath: serverBuildPath,
			content: csrBuild.buildOutputs[0],
		});
		csrBuildFilePath = csrBuildFile.filePath;
	}

	// Server build for RSC
	const rscBuild = await bundleServer({
		location,
		mode: "ssr",
		routes,
		stylexRules,
		development,
	});
	const { filePath: rscBuildFilePath } = await createBuildFile({
		name: `${name}-rsc-${rscBuild.buildOutputs[0].hash}`,
		buildPath: serverBuildPath,
		content: rscBuild.buildOutputs[0],
	});

	const stylexCss = await createStylexCss({ stylexRules, buildPath });
	const stylexCssUrl = stylexCss
		? `/${buildUrlSegment}/${stylexCss.fileName}`
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
	const { fileName: bootstrapFileName } = await createBuildFile({
		name: `bootstrap-${mode}-${bootstrapOutput.hash}`,
		buildPath: clientBuildPath,
		content: bootstrapOutput,
	});
	console.log("🥁 clientComponentMap", clientComponentMap);
	for (const buildOutput of restOutput) {
		await createClientFile({
			buildOutput,
			buildPath: clientBuildPath,
			clientComponentMap,
		});
	}
	const bootstrapFileUrl = `/${buildUrlSegment}/${bootstrapFileName}`;

	return {
		rscBuildFilePath,
		csrBuildFilePath,
		bootstrapFileUrl,
		stylexCssUrl,
		clientComponentMap,
	};
};
