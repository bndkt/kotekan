import { bundleServer } from "./bundleServer";
import { bundleClient } from "./bundleClient";
import { createBuildFile } from "./createBuildFile";

interface BuildRouteProps {
	name: string;
	location: string;
	buildPath: string;
	ssrEnabled: boolean;
	development?: boolean;
}

export const buildRoute = async ({
	name,
	location,
	buildPath,
	ssrEnabled,
	development,
}: BuildRouteProps) => {
	let csrBuildFilePath: string | undefined;

	// SSR/SSG
	const ssrBuild = await bundleServer({
		location,
		mode: "hydrate",
		development,
	});
	const { filePath: ssrBuildFilePath } = await createBuildFile({
		name: `${name}-ssr`,
		buildPath,
		buildArtifact: ssrBuild.buildOutputs[0],
	});

	// CSR
	if (!ssrEnabled) {
		const csrBuild = await bundleServer({
			location,
			mode: "render",
			development,
		});
		const csrBuildFile = await createBuildFile({
			name: `${name}-csr`,
			buildPath,
			buildArtifact: csrBuild.buildOutputs[0],
		});
		csrBuildFilePath = csrBuildFile.filePath;
	}

	// Client (for SSR/CSR/RSC)
	const clientBuild = await bundleClient({
		location,
		mode: ssrEnabled ? "hydrate" : "render",
		clientEntryPoints: ssrBuild.clientEntryPoints,
		development,
	});

	const { fileName: clientBuildFileName } = await createBuildFile({
		name: `${name}-client`,
		buildPath,
		buildArtifact: clientBuild.buildOutputs[0],
	});

	for (const buildArtifact of clientBuild.buildOutputs) {
		console.log("buildArtifact", buildArtifact.path, buildArtifact.name);
		const { fileName: clientBuildFileName } = await createBuildFile({
			name: `${name}-client`,
			buildPath,
			buildArtifact,
		});
	}

	return {
		ssrBuildFilePath,
		csrBuildFilePath,
		clientBuildFileName,
	};
};
