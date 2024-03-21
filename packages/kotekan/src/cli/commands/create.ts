import path from "node:path";
import type { ArgumentsCamelCase } from "yargs";

import { packageJson } from "../../template/packageJson";
import { tsconfigJson } from "../../template/tsconfigJson";

export const command = "create [name] [--minimal]";

export const describe = "Create a new Kotekan app";

export const builder = {
	name: {
		default: "kotekan-app",
	},
	minimal: {
		default: false,
	},
};

export const handler = async ({
	name,
	minimal,
}: ArgumentsCamelCase<{ name?: string; minimal: boolean }>) => {
	const templatePath = path.join(import.meta.dir, "..", "..", "template");
	const createPath = path.join(process.cwd(), name ?? "");

	const projectName = name ?? "kotekan-app";

	// package.json
	const packageJsonContent = await packageJson(projectName);
	Bun.write(
		path.join(createPath, "package.json"),
		JSON.stringify(packageJsonContent, null, 2),
	);

	if (!minimal) {
		// tsconfig.json
		const tsconfigJsonContent = tsconfigJson();
		Bun.write(
			path.join(createPath, "tsconfig.json"),
			JSON.stringify(tsconfigJsonContent, null, 2),
		);

		// README.md
		Bun.write(
			path.join(createPath, "README.md"),
			`# ${projectName}\n\nThis project is built on [Kotekan](https://kotekan.dev)\n`,
		);

		// Dockerfile
		const dockerfileTemplate = Bun.file(path.join(templatePath, "Dockerfile"));
		Bun.write(path.join(createPath, "Dockerfile"), dockerfileTemplate);
	}

	// .gitignore
	const gitignoreTemplate = Bun.file(path.join(templatePath, "_gitignore"));
	Bun.write(path.join(createPath, ".gitignore"), gitignoreTemplate);

	// Copy files in src
	const srcTemplateFiles = [
		"Root.tsx",
		"routes/index.tsx",
		"components/ServerTime.tsx",
		"components/Counter.tsx",
	];

	if (!minimal) {
		srcTemplateFiles.push("styles.css");
	}

	for (const file of srcTemplateFiles) {
		const fileContent = Bun.file(path.join(templatePath, "src", file));
		Bun.write(path.join(createPath, "src", file), fileContent);
	}
};
