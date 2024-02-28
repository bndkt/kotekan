import { resolveSync } from "bun";
import { createBuildFile } from "./createBuildFile";

const appFilePath = resolveSync("./../../client/App.tsx", import.meta.dir);
const hydrateFilePath = resolveSync("./../../client/hydrate", import.meta.dir);
const renderFilePath = resolveSync("./../../client/render", import.meta.dir);

type BuildProps = {
	location: string;
	target: "server" | "client";
	mode: "render" | "hydrate";
	development?: boolean;
};

const build = async (props: BuildProps) => {
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

	return await Bun.build({
		entrypoints: [entrypoint],
		// root: process.cwd(),
		target,
		sourcemap,
		minify,
		// naming: "[name]-[hash].[ext]",
		// outdir: hydrate ? "./build" : undefined,
		external,
		define: {
			"process.env.RENDER": JSON.stringify(props.mode === "hydrate"),
			"process.env.LOCATION": JSON.stringify(props.location),
		},
	});
};

export const buildRoute = async ({
	name,
	location,
	buildPath,
	serverRenderingEnabled,
	development,
}: {
	name: string;
	location: string;
	buildPath: string;
	serverRenderingEnabled: boolean;
	development?: boolean;
}) => {
	const serverBuild = await build({
		location,
		target: "server",
		mode: serverRenderingEnabled ? "hydrate" : "render",
		development,
	});

	if (!serverBuild.success || serverBuild.outputs.length === 0) {
		throw new Error("Failed to build app or no outputs");
	}

	const serverBuildArtifact = serverBuild.outputs[0];

	const { filePath: serverBuildFilePath } = await createBuildFile({
		name,
		buildPath,
		buildArtifact: serverBuildArtifact,
	});

	const bootstrapBuild = await build({
		location,
		target: "client",
		mode: serverRenderingEnabled ? "hydrate" : "render",
		development,
	});

	if (!bootstrapBuild.success || bootstrapBuild.outputs.length === 0) {
		throw new Error("Failed to build hydrate or no outputs");
	}

	const bootstrapBuildArtifact = bootstrapBuild.outputs[0];

	const { fileName: bootstrapBuildFileName } = await createBuildFile({
		name: `${name}-bootstrap`,
		buildPath,
		buildArtifact: bootstrapBuildArtifact,
	});

	return { serverBuildFilePath, bootstrapBuildFileName };
};
