import { buildRoute, type ClientComponentMap } from "./lib/buildRoute";

export type RouteBuilds = Map<
	string,
	{
		ssrBuildFilePath: string;
		rscBuildFilePath: string;
		bootstrapFileName: string;
		csrBuildFilePath?: string;
		stylexCssFileName?: string;
		clientComponentMap: ClientComponentMap;
	}
>;

interface BuildProps {
	routes: Record<string, string>;
	buildPath: string;
	ssrEnabled: boolean;
	development: boolean;
}

export const build = async ({
	routes,
	buildPath,
	ssrEnabled,
	development,
}: BuildProps) => {
	const routeBuilds: RouteBuilds = new Map();

	for (const [key, val] of Object.entries(routes)) {
		const name = key === "/" ? "index" : key.substring(1);

		const routeBuild = await buildRoute({
			name,
			location: key,
			buildPath,
			ssrEnabled,
			development,
		});

		routeBuilds.set(name, routeBuild);
	}

	return routeBuilds;
};
