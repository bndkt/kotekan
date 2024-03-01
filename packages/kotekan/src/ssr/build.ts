import { buildRoute } from "./lib/buildRoute";

export type RouteBuilds = Map<
	string,
	{
		ssrBuildFilePath: string;
		bootstrapFileName: string;
		csrBuildFilePath?: string;
		stylexCssFileName?: string;
	}
>;

interface BuildProps {
	routes: Record<string, string>;
	buildPath: string;
	ssrEnabled: boolean;
	rscEnabled: boolean;
	development: boolean;
}

export const build = async ({
	routes,
	buildPath,
	ssrEnabled,
	rscEnabled,
	development,
}: BuildProps) => {
	const routeBuilds: RouteBuilds = new Map();

	for (const [key, val] of Object.entries(routes)) {
		const name = key === "/" ? "index" : key.substring(1);

		const routBuild = await buildRoute({
			name,
			location: key,
			buildPath,
			ssrEnabled,
			rscEnabled,
			development,
		});

		routeBuilds.set(name, routBuild);
	}

	return routeBuilds;
};
