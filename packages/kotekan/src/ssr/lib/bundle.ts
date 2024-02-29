import { resolveSync } from "bun";

import { babelPlugin } from "../../plugins/babel";

const appFilePath = resolveSync("./../../client/App", import.meta.dir);
const hydrateFilePath = resolveSync("./../../client/hydrate", import.meta.dir);
const renderFilePath = resolveSync("./../../client/render", import.meta.dir);

type BundleProps = {
	location: string;
	target: "server" | "client";
	mode: "render" | "hydrate";
	development?: boolean;
};

export const bundle = async (props: BundleProps) => {
	const entrypoint =
		props.target === "server"
			? appFilePath
			: props.mode === "render"
			  ? renderFilePath
			  : hydrateFilePath;
	const target = props.target === "server" ? "bun" : "browser";
	const external =
		props.target === "server" ? ["react", "react-dom"] : undefined;
	const sourcemap = props.development ? "inline" : "none";
	const minify = props.development ? false : true;

	const build = await Bun.build({
		entrypoints: [entrypoint],
		// root: process.cwd(),
		target,
		// splitting: true,
		sourcemap,
		minify,
		// naming: "[name]-[hash].[ext]",
		// outdir: hydrate ? "./build" : undefined,
		external,
		define: {
			"process.env.RENDER": JSON.stringify(props.mode === "hydrate"),
			"process.env.LOCATION": JSON.stringify(props.location),
		},
		plugins: [
			babelPlugin({
				development: props.development,
			}),
		],
	});

	if (!build.success || build.outputs.length === 0) {
		throw new Error("Build failed or no outputs");
	}

	return build.outputs[0];
};
