import type { Rule } from "@stylexjs/babel-plugin";

import type { RenderingStrategies } from "..";
import { buildDocumentComponent } from "./buildDocumentComponent";
import {
	buildRouteComponents,
	type RouteComponentPaths,
} from "./buildRouteComponents";
import { buildBootstrapScripts } from "./buildBootstrapScripts";
import { buildClientComponents } from "./buildClientComponents";
import { buildStylesheet } from "./buildStylesheet";

export type StylexRules = Record<string, Rule[]>;

interface BuildProps {
	mode: RenderingStrategies;
	routes: Record<string, string>;
	buildPath: string;
	buildUrlSegment: string;
	development: boolean;
}

export interface BuildResult {
	documentComponentFilePath: string;
	renderBootstrapFileName: string;
	hydrateBootstrapFileName: string;
	routeComponentPaths: RouteComponentPaths;
	stylesheetFileName: string;
}

type ClientEntryPoints = Set<string>;

export const builder = async ({
	mode,
	routes,
	buildPath,
	buildUrlSegment,
	development,
}: BuildProps): Promise<BuildResult> => {
	const stylexRules: StylexRules = {};
	const clientEntryPoints: ClientEntryPoints = new Set();

	const documentBuild = await buildDocumentComponent({
		routes,
		buildPath,
		stylexRules,
		clientEntryPoints,
		development,
	});

	const routeComponentsBuild = await buildRouteComponents({
		routes,
		buildPath,
		stylexRules,
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

	// const clientComponentsBuild = buildClientComponents({
	// 	entrypoints: Array.from(clientEntryPoints),
	// 	buildPath,
	// 	stylexRules,
	// 	development,
	// });

	return {
		...documentBuild,
		...bootstrapScriptsBuild,
		...routeComponentsBuild,
		...stylesheetBuild,
	};
};
