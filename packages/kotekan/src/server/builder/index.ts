import type { Rule } from "@stylexjs/babel-plugin";

import {
	buildRouteComponents,
	type RouteComponentPaths,
} from "./buildRouteComponents";
import { buildBootstrapScripts } from "./buildBootstrapScripts";
import { buildClientComponents } from "./buildClientComponents";
import { buildStylesheet } from "./buildStylesheet";
import { buildRootComponent } from "./buildRootComponent";

export type StylexRules = Record<string, Rule[]>;

interface BuildProps {
	routes: Record<string, string>;
	buildPath: string;
	buildUrlSegment: string;
	mdxEnabled: boolean;
	development: boolean;
}

export interface BuildResult {
	clientComponentsMap: ClientComponentsMap;
	rootComponentFilePath: string;
	renderBootstrapFileName: string;
	hydrateBootstrapFileName: string;
	routeComponentPaths: RouteComponentPaths;
	stylesheetFileName?: string;
}

export type ClientEntryPoints = Set<string>;

export type ClientComponentsMap = Map<
	string,
	{
		id: string;
		name: string;
		chunks: string[];
		async: boolean;
	}
>;

export const builder = async ({
	routes,
	buildPath,
	buildUrlSegment,
	mdxEnabled,
	development,
}: BuildProps): Promise<BuildResult> => {
	const stylexRules: StylexRules = {};
	const clientEntryPoints: ClientEntryPoints = new Set();
	const clientComponentsMap: ClientComponentsMap = new Map();

	const rootComponentBuild = await buildRootComponent({
		buildPath,
		stylexRules,
		clientEntryPoints,
		clientComponentsMap,
		mdxEnabled,
		development,
	});

	const routeComponentsBuild = await buildRouteComponents({
		routes,
		buildPath,
		stylexRules,
		clientEntryPoints,
		clientComponentsMap,
		mdxEnabled,
		development,
	});

	const stylesheetBuild = await buildStylesheet({
		stylexRules,
		buildPath,
	});

	const bootstrapScriptsBuild = await buildBootstrapScripts({
		buildPath,
		development,
	});

	const clientComponentsBuild = buildClientComponents({
		entrypoints: Array.from(clientEntryPoints),
		buildPath,
		stylexRules,
		development,
	});

	console.log({ clientComponentsMap });

	return {
		clientComponentsMap,
		...rootComponentBuild,
		...bootstrapScriptsBuild,
		...routeComponentsBuild,
		...stylesheetBuild,
	};
};
