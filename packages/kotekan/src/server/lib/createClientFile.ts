import path from "node:path";
import type { BuildArtifact } from "bun";
import { parse } from "es-module-lexer";

import { createBuildFile } from "./createBuildFile";
import type { ClientComponentMap } from "./buildRoute";

type CreateClientFileProps = {
	buildOutput: BuildArtifact;
	buildPath: string;
	clientComponentMap: ClientComponentMap;
};

export const createClientFile = async ({
	buildOutput,
	buildPath,
	clientComponentMap,
}: CreateClientFileProps) => {
	let content = await buildOutput.text();
	// console.log(content);

	const [, exports] = parse(content);

	const name = `${path.basename(buildOutput.path, ".js")}-client-${
		buildOutput.hash
		// "hash"
	}`.toLowerCase();
	console.log({ name });

	const name2 = `./components/${path.basename(buildOutput.path, ".js")}`;
	console.log({ name2 });

	console.log(
		"🥁 Client build output",
		buildOutput.path,
		"with exports",
		exports.map((exp) => exp.n).join(", "),
	);

	for (const exp of exports) {
		const key = Bun.hash(buildOutput.path + exp).toString();

		clientComponentMap.set(key, {
			id: `/_build/${name}`,
			name: exp.n,
			chunks: [],
			async: true,
		});

		const addContent = `
				${exp.ln}.$$typeof = Symbol.for('react.client.reference');
				${exp.ln}.$$id = ${JSON.stringify(key)};
			`;
		console.log({ addContent });
		content += addContent;
	}

	// console.log("buildArtifact", buildArtifact.path, buildArtifact.name);
	const buildFile = await createBuildFile({
		name,
		buildPath,
		content,
	});

	return buildFile;
};
