import path from "node:path";

import { build } from "./build";
import { metro } from "./metro";

interface ServerArgs {
	buildDir?: string;
	development?: boolean;
}

export const rnServer = async ({ buildDir, development }: ServerArgs = {}) => {
	buildDir ??= "./build";

	const buildPath = path.join(process.cwd(), buildDir);

	metro();

	// Build
	// const rnBuild = await build({
	// 	buildPath,
	// 	development,
	// });
};
