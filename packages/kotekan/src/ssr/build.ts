import { buildRoute, type ClientComponentMap } from "./lib/buildRoute";

export type RouteBuilds = Map<
	string,
	{
		ssrBuildFilePath: string;
		rscBuildFilePath: string;
		csrBuildFilePath?: string;
		bootstrapFileUrl: string;
		stylexCssUrl?: string;
		clientComponentMap: ClientComponentMap;
	}
>;

interface BuildProps {
	routes: Record<string, string>;
	ssrEnabled: boolean;
	buildPath: string;
	buildUrlSegment: string;
	development: boolean;
}

export const build = async ({
	routes,
	ssrEnabled,
	buildPath,
	buildUrlSegment,
	development,
}: BuildProps) => {
	const routeBuilds: RouteBuilds = new Map();

	for (const [key, val] of Object.entries(routes)) {
		const name = key === "/" ? "index" : key.substring(1);

		const routeBuild = await buildRoute({
			name,
			location: key,
			buildPath,
			buildUrlSegment,
			ssrEnabled,
			development,
		});

		routeBuilds.set(name, routeBuild);
	}

	return routeBuilds;
};
