import path from "node:path";
import { $ } from "bun";

import { getSpec } from "./getSpec";

export const xcodegen = async () => {
	const spec = getSpec();

	const specFilePath = path.join(
		process.cwd(),
		"build",
		"mobile",
		"ios",
		"project.json",
	);

	const file = Bun.file(specFilePath);
	await Bun.write(file, JSON.stringify(spec, null, 2));

	console.log("Generating Xcode project ...");

	const { stdout, stderr, exitCode } =
		await $`xcodegen generate --spec ${specFilePath} --quiet`.quiet();

	console.log(stdout);
	console.log(stderr);
	console.log(exitCode);

	console.log("Xcode project generated successfully!");

	return;
};
