import { buildRoute } from "./lib/buildRoute";

// import { ssrPlugin } from "../plugins/ssrPlugin";
// import { babelPlugin } from "../plugins/babelPlugin";

export type RouteBuilds = Map<
	string,
	{
		appBuildFilePath: string;
		hydrateBuildFileName: string;
	}
>;

export const build = async ({
	routes,
	buildPath,
	development,
}: {
	routes: Record<string, string>;
	buildPath: string;
	development?: boolean;
}) => {
	const routeBuilds: RouteBuilds = new Map();

	for (const [key, val] of Object.entries(routes)) {
		const name = key === "/" ? "index" : key.substring(1);

		const { appBuildFilePath, hydrateBuildFileName } = await buildRoute({
			name,
			location: key,
			buildPath,
			development,
		});

		routeBuilds.set(name, { appBuildFilePath, hydrateBuildFileName });
	}

	return routeBuilds;
};
