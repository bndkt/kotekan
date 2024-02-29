import path from "node:path";
import type { BuildArtifact } from "bun";

export const createBuildFile = async ({
	name,
	buildPath,
	buildArtifact,
}: {
	name: string;
	buildPath: string;
	buildArtifact: BuildArtifact;
}) => {
	const fileName = `${name}-${buildArtifact.hash}.js`;
	const filePath = path.join(buildPath, fileName);

	console.log("Build file:", fileName);

	const file = Bun.file(filePath);
	if (!(await file.exists())) {
		Bun.write(file, buildArtifact);
	}

	return { fileName, filePath };
};
