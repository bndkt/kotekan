import { buildRoute } from "./lib/buildRoute";

// import { ssrPlugin } from "../plugins/ssrPlugin";
// import { babelPlugin } from "../plugins/babelPlugin";

export type RouteBuilds = Map<
	string,
	{
		ssrBuildFilePath: string;
		csrBuildFilePath?: string;
		clientBuildFileName: string;
	}
>;

interface BuildProps {
	routes: Record<string, string>;
	buildPath: string;
	ssrEnabled: boolean;
	development?: boolean;
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

		const { ssrBuildFilePath, csrBuildFilePath, clientBuildFileName } =
			await buildRoute({
				name,
				location: key,
				buildPath,
				ssrEnabled,
				development,
			});

		routeBuilds.set(name, {
			ssrBuildFilePath,
			csrBuildFilePath,
			clientBuildFileName,
		});
	}

	return routeBuilds;
};
