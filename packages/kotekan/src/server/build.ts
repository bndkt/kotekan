import path from "node:path";

export type BuildOutputs = Map<string, () => Response>;

export const build = async (development = false) => {
	const hydratePath = path.join(import.meta.dir, "..", "client", "hydrate.tsx");

	const buildOutputs: BuildOutputs = new Map();

	const build = await Bun.build({
		entrypoints: [hydratePath],
		target: "browser",
		// outdir: "./build",
		sourcemap: development ? "inline" : "none",
		minify: development ? true : false,
		// splitting: true,
		// publicPath: "/_kotekan/static/",
		naming: "[name]-[hash].[ext]",
	});

	if (!build.success) {
		console.error(build.logs);
	}

	for (const buildOutput of build.outputs) {
		buildOutputs.set(
			buildOutput.path.substring(2),
			() =>
				new Response(buildOutput.stream(), {
					headers: {
						"Content-Type": buildOutput.type,
					},
				}),
		);
	}

	return buildOutputs;
};
