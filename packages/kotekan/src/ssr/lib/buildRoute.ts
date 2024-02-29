import { bundle } from "./bundle";
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
	const ssrBuildArtifact = await bundle({
		location,
		target: "server",
		mode: "hydrate",
		development,
	});
	const { filePath: ssrBuildFilePath } = await createBuildFile({
		name: `${name}-ssr`,
		buildPath,
		buildArtifact: ssrBuildArtifact,
	});

	// CSR
	if (!ssrEnabled) {
		const csrBuildArtifact = await bundle({
			location,
			target: "server",
			mode: "render",
			development,
		});
		const csrBuildFile = await createBuildFile({
			name: `${name}-csr`,
			buildPath,
			buildArtifact: csrBuildArtifact,
		});
		csrBuildFilePath = csrBuildFile.filePath;
	}

	// Boostrap (for either SSR or CSR)
	const bootstrapBuildArtifact = await bundle({
		location,
		target: "client",
		mode: ssrEnabled ? "hydrate" : "render",
		development,
	});

	const { fileName: bootstrapBuildFileName } = await createBuildFile({
		name: `${name}-bootstrap`,
		buildPath,
		buildArtifact: bootstrapBuildArtifact,
	});

	return {
		ssrBuildFilePath,
		csrBuildFilePath,
		bootstrapBuildFileName,
	};
};
