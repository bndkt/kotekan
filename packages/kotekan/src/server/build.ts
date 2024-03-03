import { buildRoute, type ClientComponentMap } from "./lib/buildRoute";
import type { RenderMode } from ".";
import { buildPages } from "./lib/buildPages";

export type RouteBuilds = Map<
	string,
	{
		rscBuildFilePath: string;
		csrBuildFilePath?: string;
		bootstrapFileUrl: string;
		stylexCssUrl?: string;
		clientComponentMap: ClientComponentMap;
	}
>;

interface BuildProps {
	mode: RenderMode;
	routes: Record<string, string>;
	buildPath: string;
	buildUrlSegment: string;
	development: boolean;
}

export const build = async ({
	mode,
	routes,
	buildPath,
	buildUrlSegment,
	development,
}: BuildProps) => {
	const routeBuilds: RouteBuilds = new Map();

	const pages = await buildPages({
		routes,
		buildPath,
		development,
	});

	for (const [key, val] of Object.entries(routes)) {
		const name = key === "/" ? "index" : key.substring(1);

		const routeBuild = await buildRoute({
			name,
			location: key,
			mode,
			buildPath,
			buildUrlSegment,
			routes: pages, // @todo
			development,
		});

		routeBuilds.set(name, routeBuild);
	}

	return routeBuilds;
};
