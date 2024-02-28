import { buildRoute } from "./lib/buildRoute";

// import { ssrPlugin } from "../plugins/ssrPlugin";
// import { babelPlugin } from "../plugins/babelPlugin";

export type RouteBuilds = Map<
	string,
	{
		serverBuildFilePath: string;
		bootstrapBuildFileName: string;
	}
>;

interface BuildProps {
	routes: Record<string, string>;
	buildPath: string;
	serverRenderingEnabled: boolean;
	development?: boolean;
}

export const build = async ({
	routes,
	buildPath,
	serverRenderingEnabled,
	development,
}: BuildProps) => {
	const routeBuilds: RouteBuilds = new Map();

	for (const [key, val] of Object.entries(routes)) {
		const name = key === "/" ? "index" : key.substring(1);

		const { serverBuildFilePath, bootstrapBuildFileName } = await buildRoute({
			name,
			location: key,
			buildPath,
			serverRenderingEnabled,
			development,
		});

		routeBuilds.set(name, { serverBuildFilePath, bootstrapBuildFileName });
	}

	return routeBuilds;
};
