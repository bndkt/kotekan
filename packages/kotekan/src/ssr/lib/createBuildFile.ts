import path from "node:path";
import type { BuildArtifact } from "bun";

export const createBuildFile = async ({
	name,
	buildPath,
	content,
}: {
	name: string;
	buildPath: string;
	content: BuildArtifact | string;
}) => {
	const fileName = `${name}.js`;
	const filePath = path.join(buildPath, fileName);

	const file = Bun.file(filePath);
	if (!(await file.exists())) {
		await Bun.write(file, content);
	}

	return { fileName, filePath };
};
