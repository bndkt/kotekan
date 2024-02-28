import { resolveSync } from "bun";
import { createBuildFile } from "./createBuildFile";

const appFilePath = resolveSync("./../../client/App.tsx", import.meta.dir);
const hydrateFilePath = resolveSync("./../../client/hydrate", import.meta.dir);

type BuildProps = {
	location: string;
	hydrate: boolean;
	development?: boolean;
};

const build = async ({ location, hydrate, development }: BuildProps) =>
	await Bun.build({
		entrypoints: [hydrate ? hydrateFilePath : appFilePath],
		// root: process.cwd(),
		target: hydrate ? "browser" : "bun",
		sourcemap: development ? "inline" : "none",
		minify: development ? false : true,
		// naming: "[name]-[hash].[ext]",
		// outdir: hydrate ? "./build" : undefined,
		external: hydrate ? undefined : ["react", "react-dom"],
		define: {
			"process.env.LOCATION": JSON.stringify(location),
		},
	});

export const buildRoute = async ({
	name,
	location,
	buildPath,
	development,
}: {
	name: string;
	location: string;
	buildPath: string;
	development?: boolean;
}) => {
	const appBuild = await build({
		location,
		hydrate: false,
		development,
	});

	if (!appBuild.success || appBuild.outputs.length === 0) {
		throw new Error("Failed to build app or no outputs");
	}

	const appBuildArtifact = appBuild.outputs[0];

	const { filePath: appBuildFilePath } = await createBuildFile({
		name,
		buildPath,
		buildArtifact: appBuildArtifact,
	});

	const hydrateBuild = await build({
		location,
		hydrate: true,
		development,
	});

	if (!hydrateBuild.success || hydrateBuild.outputs.length === 0) {
		throw new Error("Failed to build hydrate or no outputs");
	}

	const hydrateBuildArtifact = hydrateBuild.outputs[0];

	const { fileName: hydrateBuildFileName } = await createBuildFile({
		name: `${name}-hydrate`,
		buildPath,
		buildArtifact: hydrateBuildArtifact,
	});

	return { appBuildFilePath, hydrateBuildFileName };
};
